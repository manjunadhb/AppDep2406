const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("user", userSchema);

app.post("/login", upload.none(), async (req, res) => {
  console.log(req.body);

  let dbUserData = await User.find().and({ email: req.body.email });

  console.log(dbUserData);

  if (dbUserData.length > 0) {
    let isPasswordValid = await bcrypt.compare(
      req.body.password,
      dbUserData[0].password
    );

    if (isPasswordValid == true) {
      let encryptedCred = jwt.sign(
        { email: req.body.email, password: req.body.password },
        "abracadabra"
      );

      let dataToClient = {
        firstName: dbUserData[0].firstName,
        lastName: dbUserData[0].lastName,
        age: dbUserData[0].age,
        email: dbUserData[0].email,
        mobileNo: dbUserData[0].mobileNo,
        profilePic: dbUserData[0].profilePic,
        token: encryptedCred,
      };

      res.json({ status: "success", data: dataToClient });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body);

  let decryptedCred = jwt.verify(req.body.token, "abracadabra");

  let dbUserData = await User.find().and({ email: decryptedCred.email });

  console.log(dbUserData);

  if (dbUserData.length > 0) {
    if (dbUserData[0].password == decryptedCred.password) {
      let dataToClient = {
        firstName: dbUserData[0].firstName,
        lastName: dbUserData[0].lastName,
        age: dbUserData[0].age,
        email: dbUserData[0].email,
        mobileNo: dbUserData[0].mobileNo,
        profilePic: dbUserData[0].profilePic,
      };

      res.json({ status: "success", data: dataToClient });
    } else {
      res.json({ status: "failure", msg: "Invalid Password." });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }
});

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  console.log(req.files);

  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    await User.insertMany([newUser]);

    res.json({ status: "success", msg: "User created successfully." });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to create user." });
  }
});

app.patch("/updateProfile", upload.single("profilePic"), async (req, res) => {
  try {
    if (req.body.firstName.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { firstName: req.body.firstName }
      );
    }

    if (req.body.lastName.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { lastName: req.body.lastName }
      );
    }

    if (req.body.age > 0) {
      await User.updateMany({ email: req.body.email }, { age: req.body.age });
    }

    if (req.body.password.length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { password: req.body.password }
      );
    }

    if (req.body.mobileNo.trim().length > 0) {
      await User.updateMany(
        { email: req.body.email },
        { mobileNo: req.body.mobileNo }
      );
    }

    if (req.file && req.file.path) {
      await User.updateMany(
        { email: req.body.email },
        { profilePic: req.file.path }
      );
    }

    res.json({ status: "success", msg: "Profile updated successfully." });
  } catch (err) {
    res.json({
      status: "failure",
      msg: "Something went wrong. Please try again after sometime.",
    });
  }
});

app.delete("/deleteProfile", async (req, res) => {
  let delResult = await User.deleteMany({ email: req.query.email });

  console.log(delResult);

  if (delResult.deletedCount > 0) {
    res.json({ status: "success", msg: "User deleted successfully." });
  } else {
    res.json({ status: "failure", msg: "Unable to delete account." });
  }
});

app.listen(process.env.port, () => {
  console.log(`Listening to port ${process.env.port}`);
});

let connectToMDB = async () => {
  try {
    // mongoose.connect(
    //   "mongodb+srv://manjunadhb:manjunadhb@batch2406cluster.iwonu.mongodb.net/Players?retryWrites=true&w=majority&appName=Batch2406Cluster"
    // );

    mongoose.connect(process.env.mdbURL);

    console.log("Successfully connected to MDB");
  } catch (err) {
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();
