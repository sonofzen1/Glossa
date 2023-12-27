//APKIKEY Glossa: 0DCXE51rNTWaFmzynBBwRJiHdffFpNEPjYi9ZKVVMWyR0Ozn5MUf2lXppSuY21lJ
//EndPoint https://us-east-2.aws.data.mongodb-api.com/app/data-bytyl/endpoint/data/v1
/*
curl --location --request POST 'https://us-east-2.aws.data.mongodb-api.com/app/data-bytyl/endpoint/data/v1/action/findOne' \
--header 'Content-Type: application/json' \
--header 'Access-Control-Request-Headers: *' \
--header 'api-key: 0DCXE51rNTWaFmzynBBwRJiHdffFpNEPjYi9ZKVVMWyR0Ozn5MUf2lXppSuY21lJ' \
--data-raw '{
    "collection":"<COLLECTION_NAME>",
    "database":"<DATABASE_NAME>",
    "dataSource":"RealmDemo",
    "projection": {"_id": 1}
}'

*/
const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");

const deckButton = document.getElementById("save-deck-btn");
const titleOfDeck = document.getElementById("name");
const addDeckForm = document.getElementById("add-deck-form");
const addDeck = document.getElementById("add-deck-container");
const closeDeckBtn = document.getElementById("close-deck-btn");
const goBack = document.getElementById("back-btn");
const study = document.getElementById("study-btn");
const listCard2 = document.getElementById("card-display");
const studyDeck = document.getElementById("study-card");

const studyButtons = document.getElementById("btn-con");

goBack.classList.add("hide");
study.classList.add("hide");

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");

const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");

const checkMark = document.getElementById("check-mark");
const exMark = document.getElementById("dontKnow");

const mediaButton = document.getElementById("add-media-container");
const mediaWindow = document.getElementById("media");

const toggle = document.getElementById("switch");
const spanish = document.getElementById("LText");
const english = document.getElementById("EngText");
const englishTitle = document.getElementById("EngTitle");

let deckName = document.getElementById("deckNames");

let editBool = false;
let exSelected = false;

function Deck(title) {
  this.name = title;
  this.cards = new Array();

  this.add = function (card) {
    this.cards.push(card);
  };
}

function Card(name, translation) {
  this.word = name;
  this.definition = translation;
}

let masterArray = new Array();
    
    fetch("user.json")
    .then((response) => response.json())
    .then((data) => {
      data.Decks.forEach((element) => {
        let defaultDeck1 = new Deck(element.name);
        for (i in element.cards) {
          let card1 = new Card(element.cards[i].word, element.cards[i].definition);
          defaultDeck1.add(card1);
        }
        viewDecks(defaultDeck1);
        masterArray.push(defaultDeck1);

      });
      updateDecks();
    });

//Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
  buildDeckDropList();
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");

  //Hide Create flashcard Card
  closeBtn.addEventListener(
    "click",
    (hideQuestion = () => {
      container.classList.remove("hide");
      addQuestionCard.classList.add("hide");
      if (editBool) {
        editBool = false;
        submitQuestion();
      }
    })
  );

  //Submit Question
  cardButton.addEventListener(
    "click",
    (submitQuestion = () => {
      editBool = false;
      newCard = new Card(question.value, answer.value);
      tempQuestion = question.value.trim();
      tempAnswer = answer.value.trim();

      if (!tempQuestion || !tempAnswer || !deckName) {
        errorMessage.classList.remove("hide");
      } else {
        container.classList.remove("hide");
        errorMessage.classList.add("hide");

        addCard(newCard);
        question.value = "";
        answer.value = "";
        addQuestionCard.classList.add("hide");
      }
    })
  );
});
function buildDeckDropList() {
  let myString = '<select id ="deckNames" name="deckNames">';

  for (element in masterArray) {
    myString =
      myString +
      "<option value='" +
      masterArray[element].name +
      "'>" +
      masterArray[element].name +
      "</option>";
  }

  myString = myString + "</select>";
  document.getElementById("deckDropList").innerHTML = myString;
  deckName = document.getElementById("deckNames");
}

function updateDecks() {

  let newString = '{"Decks": [';
  for (element in masterArray) {
      newString = newString + `\n{\n"name": "${masterArray[element].name}",\n"cards": [`;
      for(i in masterArray[element].cards)
      {
          newString =
            newString +
            `\n{"word": "${masterArray[element].cards[i].word}", \n"definition": "${masterArray[element].cards[i].definition}"}`;
          
          if(i != masterArray[element].cards.length-1)
          {
            newString = newString + ",";
          }
      }
      newString = newString + ']}'
      if (element != masterArray.length - 1) {
        newString = newString + ',';
      }
  }
  newString = newString + "\n]\n}";
  const newParse = JSON.parse(newString);

  fetch(
    "https://data.mongodb-api.com/app/data-bytyl/endpoint/data/v1/action/updateOne",
    {
      method: "POST", // or 'PUT' if appropriate
      headers: {
        mode: "cors",
        credentials: "include",
        apiKey:
          "0DCXE51rNTWaFmzynBBwRJiHdffFpNEPjYi9ZKVVMWyR0Ozn5MUf2lXppSuY21lJ",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: newParse,
    }
  )
    .then((response) => response.json())
    .then((updatedData) => {
      console.log("JSON data updated successfully!", updatedData);
    })
    .catch((error) => {
      console.error("Error updating JSON data:", error);
    });
}

//Add deck when user clicks 'Add Deck' button
addDeck.addEventListener("click", () => {
  container.classList.add("hide");
  titleOfDeck.value = "";
  addDeckForm.classList.remove("hide");
});

closeDeckBtn.addEventListener(
  "click",
  (hideDeckForm = () => {
    addDeckForm.classList.add("hide");
    container.classList.remove("hide");
    if (editBool) {
      editBool = false;
      submitDeck();
    }
  })
);

//Submit Deck
deckButton.addEventListener(
  "click",
  (submitDeck = () => {
    editBool = false;
    newDeck = new Deck(titleOfDeck.value);
    tempDeck = titleOfDeck.value.trim();

    if (!tempDeck) {
      errorMessage.classList.remove("hide");
    } else {
      container.classList.remove("hide");
      errorMessage.classList.add("hide");

      masterArray.push(newDeck);
      viewDecks(newDeck);
      titleOfDeck.value = "";
      addDeckForm.classList.add("hide");
    }
  })
);

// media button
mediaButton.addEventListener("click", () => {
  container.classList.add("hide");
  mediaWindow.classList.remove("hide");
  goBack.classList.remove("hide");

  goBack.addEventListener("click", () => {
    mediaWindow.classList.add("hide");
    container.classList.remove("hide");
    goBack.classList.add("hide");
  });
});

// for translation toggle
toggle.addEventListener("click", () => {
  if (toggle.checked) {
    english.classList.remove("hide");
    englishTitle.classList.remove("hide");
  } else {
    english.classList.add("hide");
    englishTitle.classList.add("hide");
  }
});

function addCard(newCard) {
  for (i in masterArray) {
    if (masterArray[i].name === deckName.value) masterArray[i].add(newCard);
  }
  updateDecks();
}

function viewDecks(deck) {
  var listCard = document.getElementsByClassName("card-list-container");
  var div = document.createElement("div");
  div.classList.add("deckDisplay");
  div.innerHTML += `
    <p class="deck-div">${deck.name}</p>`;

  let showCards = document.createElement("a");
  showCards.setAttribute("href", "#");
  showCards.setAttribute("class", "show-hide-btn");
  showCards.innerHTML = "Show";
  showCards.addEventListener("click", () => {
    container.classList.add("hide");
    displayCards(deck);
  });
  div.appendChild(showCards);

  listCard[0].appendChild(div);
}

function viewDecks(deck) {
  var listCard = document.getElementsByClassName("card-list-container");
  var div = document.createElement("div");
  div.classList.add("deckDisplay");
  div.innerHTML += `
  <p class="deck-div">${deck.name}</p>`;

  let showCards = document.createElement("a");
  showCards.setAttribute("href", "#");
  showCards.setAttribute("class", "show-hide-btn");
  showCards.innerHTML = "Show";
  showCards.addEventListener("click", () => {
    container.classList.add("hide");

    goBack.classList.remove("hide");
    if (deck.cards.length > 0) study.classList.remove("hide");

    for (i in deck.cards) {
      displayCards(deck);
    }
  });
  div.appendChild(showCards);

  if (deck.cards.length === 0) {
    goBack.onclick = () => {
      listCard2.classList.add("hide");
      container.classList.remove("hide");
      goBack.classList.add("hide");
    };
  }

  listCard[0].appendChild(div);
}

function displayCards(deck) {
  listCard2.classList.remove("hide");
  var listCard = document.getElementsByClassName("card-display-container");

  let buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");

  var div = document.createElement("div");
  div.classList.add("deckDisplay2");
  div.innerHTML += `
  <p class="deck-div">${deck.cards[i].word}</p>`;
  // Answer
  var displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div");
  displayAnswer.innerText = deck.cards[i].definition;
  // Display the card
  div.appendChild(displayAnswer);
  // Add delete button
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  deleteButton.onclick = () => {
    modifyElement(deleteButton, deck);
  };
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);

  listCard[0].appendChild(div);

  const modifyElement = (element, aDeck) => {
    let parentDiv = element.parentElement.parentElement;
    parentDiv.remove();

    let parentName = parentDiv.querySelector(".deck-div").innerText;

    let removeThis = null;
    for (let i = 0; i < aDeck.cards.length; i++) {
      if (aDeck.cards[i].word === parentName) removeThis = i;
    }
    aDeck.cards.splice(removeThis, 1);
    updateDecks();
  };

  goBack.onclick = () => {
    console.log("test");
    listCard2.classList.add("hide");
    container.classList.remove("hide");
    goBack.classList.add("hide");
    listCard[0].innerHTML = "";
  };

  study.onclick = () => {
    if (deck.cards.length === 0) return;
    console.log(deck.cards);
    listCard2.classList.add("hide");
    studyDeck.classList.remove("hide");
    studyBool = true;

    studyButtons.classList.remove("hide");

    studyCards(deck);

    var studyCard = document.getElementsByClassName("study-card-container");

    checkMark.onclick = () => {
      console.log("checkSelected");
      let element = deck.cards[0];
      deck.cards.shift();
      deck.cards.push(element);
      studyCard[0].innerHTML = "";
      studyCards(deck);
    };

    exMark.onclick = () => {
      console.log("exSelected");
      if (deck.cards.length > 2) {
        let insertionIndex = (deck.cards.length - 1) / 2;
        insertionIndex = Math.floor(insertionIndex);

        let element = deck.cards[0];
        deck.cards.shift();
        deck.cards.splice(insertionIndex, 0, element);

        studyCard[0].innerHTML = "";
        studyCards(deck);
      } else {
        let element = deck.cards[0];
        deck.cards.shift();
        deck.cards.push(element);
        studyCard[0].innerHTML = "";
        studyCards(deck);
      }
    };

    goBack.addEventListener("click", () => {
      studyButtons.classList.add("hide");
      studyCard[0].innerHTML = "";

      studyDeck.classList.add("hide");

      container.classList.remove("hide");
      goBack.classList.add("hide");
    });
  };
}

function hideWindow(window) {
  window.classList.add(hide);
}

//Study function
function studyCards(deck) {
  var studyCard = document.getElementsByClassName("study-card-container");
  studyCard[0].innerHTML = "";
  var div = document.createElement("div");
  div.classList.add("deckCardDisplay");
  div.innerHTML += `
      <p class="deck-div">${deck.cards[0].word}</p>`;
  // Answer
  var displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div");
  displayAnswer.innerText = deck.cards[0].definition;

  div.appendChild(displayAnswer);

  displayAnswer.classList.add("hide");

  //Link to show/hide answer
  var link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", () => {
    displayAnswer.classList.toggle("hide");
  });
  div.appendChild(link);

  studyCard[0].appendChild(div);

  //studyBool = false;
}

// Translation feature
var control = document.importNode(
  document.querySelector("template").content,
  true
).childNodes[0];
document.getElementById("LText").onpointerup = () => {
  let selection = document.getSelection(),
    text = selection.toString();
  if (text !== "") {
    let rect = selection.getRangeAt(0).getBoundingClientRect();
    control.style.top = `calc(${rect.top}px - 48px)`;
    control.style.left = `calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`;
    control["text"] = text;
    document.body.appendChild(control);
  }
};

control.addEventListener("pointerdown", oncontroldown, true);

async function oncontroldown(event) {
  buildDeckDropList();
  container.classList.add("hide");
  question.value = this.text;
  answer.value = await translate(this.text);
  addQuestionCard.classList.remove("hide");

  closeBtn.addEventListener("click", () => {
    console.log("Test");
    addQuestionCard.classList.add("hide");
  });

  cardButton.addEventListener("click", () => {
    editBool = false;
    newCard = new Card(question.value, answer.value);
    tempQuestion = question.value.trim();
    tempAnswer = answer.value.trim();

    if (!tempQuestion || !tempAnswer || !deckName) {
      errorMessage.classList.remove("hide");
    } else {
      errorMessage.classList.add("hide");

      addCard(newCard);
      question.value = "";
      answer.value = "";
      addQuestionCard.classList.add("hide");
    }
  });

  async function translate(inputText) {
    console.log(inputText);
    const API_KEY = "AIzaSyB0QOTZdGNH7_3WtPoYios1OX_L37tsfC0";
    var startStupid = '{ q: ["';
    var morStupid = startStupid + inputText + '"], target: "en" }';
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=AIzaSyB0QOTZdGNH7_3WtPoYios1OX_L37tsfC0`,
      {
        method: "POST",
        body: morStupid, // string or object
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const myJson = await response.json();
    return myJson.data.translations[0].translatedText;
  }

  this.remove();
  document.getSelection().removeAllRanges();
  event.stopPropagation();
}

document.onpointerdown = () => {
  let control = document.querySelector("#control");
  if (control !== null) {
    control.remove();
    document.getSelection().removeAllRanges();
  }
};
