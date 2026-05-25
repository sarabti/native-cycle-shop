import { connect } from "mongoose";

const uri = "mongodb://localhost:27017/native-cycle-shop";

connect(uri)
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.log("db connecion error: ", err.message);
  });
