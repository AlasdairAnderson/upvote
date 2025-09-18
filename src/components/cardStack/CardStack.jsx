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

  const handleMouseDown = (clientX, clientY, id) => {
    setActiveCard({
      id: id,
      mouseStartingPosition: {x: clientX, y: clientY}
    });
    console.log(activeCard);
  }

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , [redditAPIRequest]);
  return(
    <ul className="card-stack">
        {Object.values(cards).map((card, index) => {
          return(
            <Card card={card} key={card.id} onMouseDown={handleMouseDown}/>
        )})}
      </ul>
  )
}