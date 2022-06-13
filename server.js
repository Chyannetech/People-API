// Dependencies
const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

//Initialize the Express App
const app = express();

// Configure App Settings
require("dotenv").config();

// Destructuring
const { PORT = 4000, MONGODB_URL } = process.env;

// Connect to MongoDB
mongoose.connect(MONGODB_URL);

// Mongo Status Listeners
mongoose.connection
  .on("connected", () => console.log("Connected to MongoDB"))
  .on("error", (err) => console.log("Error with MongoDB: " + err.message));

// Set up Model
const PeopleSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    title: String,
  },
  { timestamps: true }
);

const People = mongoose.model("People", PeopleSchema);

// Mount Middleware
app.use(cors()); // Access-Control-Allow '*'
app.use(morgan("dev"));
app.use(express.json);
// This creates req.body from incoming JSON request bodies
// app.use(express.urlencoded({ extended: false}))
// This also creates req.body but only when express is serving HTMP

// Mount Routes
app.get("/", (req, res) => {
  res.send("Hello and welcome to the people app");
});

// Index
app.get("/people", async (req, res) => {
  try {
    const people = await People.find({});
    res.send(people);
  } catch (error) {
    console.log("err", error);
    res.send({ error: "something went wrong - check console" });
  }
});

// Create
app.post('/people', async (req, res) => {
    try {
        const person = await People.create(req.body)
    } catch (error) {
        res.send(person);
        console.log('error:', error);
        res.send({error: 'something went wrong, check console'});
    }
})

// Update

// Delete

// Tell Express to Listen
app.listen(PORT, () => {
  console.log(`Express is listening on port: ${PORT}`);
});
