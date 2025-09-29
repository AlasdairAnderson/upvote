import { Card } from '@/components/card/Card'
import { selectCards, fetchCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import React, { useEffect, useState } from "react";

export const CardStack = () => {
  const cards  = useAppSelector(selectCards);
  const dispatch = useAppDispatch();
  const [ redditAPIRequest, setredditAPIRequest ] = useState({ requestType: 'popular', query: '' });
  const [ activeCard, setActiveCard ] = useState({id: null,
    mouseStartingPosition: {x: null, y:null},
    mouseCurrentPosition: {x: null, y:null},
    voteStatus: "none"
  }) 

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , [redditAPIRequest]);

  const handleMouseDown = (clientX, clientY, id) => {
    setActiveCard({
      ...activeCard,
      id: id,
      mouseStartingPosition: {x: clientX, y: clientY}
    });
    console.log(activeCard);
  }

  

  if(!cards || Object.values(cards).length === 0){
    return<div>Loading...</div>;
  } else {
    return(
    <ul className="card-stack">
      {Object.values(cards).map((card, index) => {
        return(
          <Card card={card} key={card.id} onMouseDown={handleMouseDown}/>
      )})}
    </ul>
  )
  }
}