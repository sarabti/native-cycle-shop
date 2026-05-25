import express, { RequestHandler } from "express";
import authRouter from "routes/auth";
import "src/db";

const app = express();
app.use(express.json()); // read the data from all around the app
app.use(express.urlencoded({ extended: false })); // Read the data from the form

app.use("/auth", authRouter);

app.listen(8000, () => {
  console.log("The app is running on http://localhost:8000");
});

app.get("/", (req, res) => {
  res.json({ message: "This is a GET message from server" });
});
