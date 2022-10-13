import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
//import "./Deck.css";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";



function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);

  
  useEffect(() => {
    const getData = async () => {
      let res = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(res.data);
    }
    getData();
  }, [setDeck]);
  
  // useEffect(() => {
  //   const getCard = async () => {
  //     let { deck_id } = deck;
   
  //     try {
  //       let res = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
  //       //console.log(`${res.data.cards[0].value} of ${res.data.cards[0].suit}`);

  //       const card = res.data.cards[0]
  //       setDrawn(d => [
  //         ...d,
  //         {
  //           id: card.code,
  //           name: card.suit + " " + card.value,
  //           image: card.image
  //         }
  //       ])

  //     } catch (err) {
  //       console.log(err);
  //     }
      
  //   }
  //   getCard();
  // }, [deck])

  const getCard = async () => {
    let { deck_id } = deck;
    try {
      let res = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
      console.log(res.data.remaining)

      if (res.data.remaining === 0) {
        throw new Error("No more cards");
      }

      const card = res.data.cards[0]
      setDrawn(d => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image
        }
      ]);

      console.log(card.suit)
    } catch (err) {
      console.log(err)
    }
  }

  // console.log(drawn);
  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      <button onClick={getCard}>Draw a Card!</button>
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;
