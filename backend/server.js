import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-pingo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(express.json());

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});

const User = mongoose.model("User", UserSchema);

//PIN SCHEMA
const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Pin = mongoose.model("Pin", PinSchema);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync();
    if (password.length < 2) {
      res.status(400).json({
        response: "Password must contain more than 2 characters",
        success: false,
      });
    } else {
      const newUser = await new User({
        username: username,
        password: bcrypt.hashSync(password, salt),
      }).save();
      res.status(201).json({
        response: {
          username: newUser.username,
          accessToken: newUser.accessToken,
          userId: newUser._id,
        },
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        username: user.username,
        accessToken: user.accessToken,
        userId: user._id,
      });
    } else {
      res.status(400).json({
        response: "username and password don't match",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    });
  }
});

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({ accessToken: accessToken });
    if (user) {
      next();
    } else {
      res.status(401).json({
        response: "You need to log in",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    });
  }
};

 const ThoughtSchema = new mongoose.Schema({
   message: String,
   hearths: {
     type: Number,
     default: 0,
   },
   createdAt: {
     type: Date,
     default: () => new Date(),
   },
 });
 const Thought = mongoose.model("Thought", ThoughtSchema);

 app.get("/thoughts", authenticateUser);

 app.get("/thoughts", async (req, res) => {
   const thoughts = await Thought.find({});
   res.status(200).json({ response: thoughts, success: true });
 });

 //create a pin
app.post("/api/pins", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
app.get("/api/pins", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
}); 

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
