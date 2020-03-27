let output;
let history;
let guessNumber = 0;
let winner = true;

$(document).ready(handleReady);

function handleReady() {
  console.log("jquery is loaded!");
  $("#js-form-guess").on("submit", submitGuess);
  $(".js-btn-newGame").hide();
  $(".js-btn-newGame").on("click", clearServer);
}

function submitGuess(event) {
  event.preventDefault();

  const guessArray = [
    {
      name: "scott",
      guess: parseInt($("#scott").val()),
    },
    {
      name: "jackson",
      guess: parseInt($("#jackson").val()),
    },
    {
      name: "rachael",
      guess: parseInt($("#rachael").val()),
    },
  ];

  clearInputs();

  postGuess(guessArray);
}

function postGuess(guessArray) {
  console.log(guessArray);
  $.ajax({
    type: "POST",
    url: "/guess",
    data: { guessArray: guessArray },
  })
    .then(response => {
      output = response;
      getGuessNum();
    })
    .catch(err => {
      console.warn("Whoops! Something went wrong in the post request!");
    });
}

function getGuessNum() {
  $.ajax({
    type: "GET",
    url: "/guessnumber",
  })
    .then(response => {
      guessNumber = response.total;
      getHistory();
    })
    .catch(err => {
      console.warn("Whoops! Something went wrong in the get request!");
    });
}

function getHistory() {
  $.ajax({
    type: "GET",
    url: "/history",
  })
    .then(response => {
      history = response;
      render();
    })
    .catch(err => {
      console.warn("Whoops! Something went wrong in the get request!");
    });
}

function clearInputs() {
  $("#scott").val("");
  $("#jackson").val("");
  $("#rachael").val("");
}

function render() {
  $(".js-container").empty();
  $(".js-container").append(`<h1>TOTAL GUESSES: ${guessNumber}</h1>`);
  for (let result of output) {
    $(".js-container").append(`
      <div>
        <h3>${result.name} guessed ${result.response}</h3>
      </div>
    `);

    if (result.response === "correct!!!") {
      winner = true;
    }
  }

  $(".js-history").empty();
  $(".js-history").append(`<h3>History</h3>`);
  for (let round of history) {
    for (let guess of round) {
      $(".js-history").append(`
        <div>
          <p>${guess.name} guessed ${guess.response} - ${guess.guess}</p>
        </div>
      `);
    }
  }

  if (winner) {
    winner = false;
    $(".js-btn-newGame").show();
  }
}

function clearServer() {
  $.ajax({
    type: "GET",
    url: "/clear",
  })
    .then(response => {
      clearRender();
    })
    .catch(err => {
      console.warn("Error clearing the game!");
    });
}

function clearRender() {
  $(".js-btn-newGame").hide();
  $(".js-container").empty();
  $(".js-history").empty();
}
