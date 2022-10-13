import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";



function Deck() {
  const [ deck, setDeck ] = useState(null);
  const [ drawn, setDrawn ] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);
  
  useEffect(() => {
    const getData = async () => {
      let res = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(res.data);
    }
    getData();
  }, [setDeck]);
  

  useEffect(() => {
    const getCard = async () => {
      let { deck_id } = deck;
      try {
        let res = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
        console.log(res.data.remaining)

        if (res.data.remaining === 0) {
          setAutoDraw(false);
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
      } catch (err) {
        alert(err)
      }
    }
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };

  }, [ autoDraw, setAutoDraw, deck ]) 

  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  }

  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));

  return (
    <div className="Deck">
      <button onClick={toggleAutoDraw}>{autoDraw ? 'Stop' : 'Keep' } Drawing!</button>
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;
