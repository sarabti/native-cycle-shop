import "dotenv/config";
import express from "express";
import authRouter from "routes/auth";
import "src/db";
import { sendErrorRes } from "src/utils/helper";

const app = express();
app.use(express.static("src/public"));
app.use(express.json()); // read the data from all around the app
app.use(express.urlencoded({ extended: false })); // Read the data from the form

app.use("/auth", authRouter);

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.use((req, res) => {
  sendErrorRes(res, "Not Found!", 404);
});

app.get("/", (req, res) => {
  res.json({ message: "This is a GET message from server" });
});

app.listen(8000, () => {
  console.log("The app is running on http://localhost:8000");
});
