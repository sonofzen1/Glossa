async function getSnotrag() {
  fetch("user.json")
    .then((response) => response.json())
    .then((data) => {
      data.Decks.forEach((element) => {
        let defaultDeck1 = new Deck(element.name);
        for (i in element.cards) {
          let card1 = new Card(
            element.cards[i].word,
            element.cards[i].definition
          );
          defaultDeck1.add(card1);
        }
        viewDecks(defaultDeck1);
        masterArray.push(defaultDeck1);
      });
      snotrag = JSON.stringify(data);
      console.log("snotrag:" + snotrag);
      return snotrag;
    });
}
