const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
// db connection
mongoose
  .connect(
    `mongodb+srv://caiomelo:${process.env.DB_PASS}@mymongodb.7vbcm0k.mongodb.net/apidev`
  )
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));

app.use(express.json());

// db schema
const Schema = mongoose.Schema;
// define user Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email has to be unique"],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
      min: [6, "Password has to contain at least 6 characters"],
      max: [12, "Password max length is 12 characters"],
    },
  },
  { timestamps: true }
);
// Create User Model
const UserModel = mongoose.model("users", userSchema);

app.get("/", (req, res) => {
  res.send("Express vercel api response");
});

app.post("/createuser", (req, res) => {
  let user = req.body;
  UserModel.create(user)
    .then((info) => {
      console.log("User was created successfullly");
      res.send({ message: "User created successfully", data: info });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Error by creating user" });
    });
});
//  fetch all users
app.get("/users", (req, res) => {
  UserModel.find()
    .then((users) => {
      console.log("All Users were fetched successfully");
      res.send({ data: users, message: "All Users were fetched" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Error by fetching all users" });
    });
});
// fetch users by email
app.get("/usersbyemail", (req, res) => {
  const userEmail = req.body.email;

  UserModel.find({ email: userEmail })
    .then((user) => {
      console.log("User was found");
      res.send({ data: user, message: "User was found" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Error by fetching user by email" });
    });
});
// fetch user by Id
app.get("/user/:id", (req, res) => {
  let userId = req.params.id;
  UserModel.find({ _id: userId })
    .then((user) => {
      console.log("User was found");
      res.send({ data: user, message: "User was found" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Error by fetching user by Id" });
    });
});

// update user by id
app.put("/user/:id", (req, res) => {
  let userId = req.params.id;
  let updatedFields = req.body;

  UserModel.updateOne({ _id: userId }, { $set: updatedFields })
    .then((result) => {
      if (result.modifiedCount > 0) {
        console.log("User was updated");
        res.send({ message: "User was updated", result: result });
      } else {
        console.log("User not found or no changes made");
        res.send({
          message: "User not found or no changes made",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error by updating User" });
    });
});

// Delete user by id
app.delete("/user/:id", (req, res) => {
  let userId = req.params.id;

  UserModel.deleteOne({ _id: userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        console.log("User was deleted");
        res.send({ message: "User was deleted" });
      } else {
        console.log("User was not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Error by deleting User" });
    });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
