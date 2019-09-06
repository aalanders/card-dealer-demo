import React, { Component } from 'react';
import axios from "axios";
import Card from "./Card"
import './Deck.css';

const API_BASE_URL = "https://deckofcardsapi.com/api/deck"

class Deck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: null, //entire response which will have id and card 
      drawn: []
    }

    this.getCard = this.getCard.bind(this);
  }

  async componentDidMount() {
    try {
      const deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      this.setState({ deck: deck.data });
    } catch (error) {
      console.error(error, "Error in didMount");
    }
  }

  async getCard(){
    // use deckId to do another call to API with deck and set state of card
    // need to check if cards are left in the deck 
    try {
      const deck_id = this.state.deck.deck_id;
      let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
      let cardResponse = await axios.get(cardUrl);
      if(!cardResponse.data.success){
        throw new Error("No card remaining!");
      }
      let card = cardResponse.data.cards[0];
      console.log(card, "card");
      this.setState(state => ({ 
        drawn: [
          ...state.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }));
    } catch (error) {
      alert(error);
    }
  }

  render() {
    const cards = this.state.drawn.map(card => (
      <Card key={card.id} name={card.name} image={card.image} />
    ));
    console.log(cards, "cards")
    return (
      <div>
        <h1 className="Deck-title">Card Dealer</h1>
        <h2 className="Deck-subtitle">A Demo Made with React</h2>
        <button onClick={this.getCard}>Deal Me A Card</button>
        <div className="Deck-cardArea">
          {cards}
        </div>
      </div>
    );
  }
}

export default Deck;