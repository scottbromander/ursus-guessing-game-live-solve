const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

let correctAnswer = randomNumber(1, 25);
let numOfGuesses = 0;
let history = [];

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({ extended: true }));

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static("server/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// GET & POST Routes go here

app.post("/guess", (req, res) => {
  const guesses = req.body.guessArray;
  console.log(guesses);
  for (let personsGuess of guesses) {
    if (personsGuess.guess == correctAnswer) {
      personsGuess.response = `correct!!!`;
    } else if (personsGuess.guess >= correctAnswer) {
      personsGuess.response = `too high.`;
    } else {
      personsGuess.response = `too low.`;
    }
  }
  numOfGuesses++;
  history.push(guesses);
  res.send(guesses);
});

app.get("/guessnumber", (req, res) => {
  res.send({ total: numOfGuesses });
});

app.get("/history", (req, res) => {
  res.send(history);
});

app.get("/clear", (req, res) => {
  history = [];
  numOfGuesses = 0;
  correctAnswer = randomNumber(1, 25);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

function randomNumber(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}
