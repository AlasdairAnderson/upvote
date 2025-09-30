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
    mouseDelta: {x: null, y:null},
    voteStatus: "none"
  }) 

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , [redditAPIRequest]);

  const handelDragStart= (clientX, clientY, id) => {
    setActiveCard({
      ...activeCard,
      id: id,
      mouseStartingPosition: {x: clientX, y: clientY}
    });
    //console.log(`Mouse Down Event: ${activeCard.id}`);
  }

  const handelMouseDrag = (clientX, clientY, id) => {
    if(id === activeCard.id){
      const DeltaX = clientX - activeCard.mouseStartingPosition.x;
      const DeltaY = clientY - activeCard.mouseStartingPosition.y;
      setActiveCard({
        ...activeCard,
        mouseCurrentPosition: {x: clientX, y: clientY},
        mouseDelta: {x: DeltaX, y: DeltaY}
      })
      //console.log(`Drag Event: id:${activeCard.id}, x: ${activeCard.mouseDelta.x}, y:${activeCard.mouseDelta.y}`);   
    }
  }

  

  

  if(!cards || Object.values(cards).length === 0){
    return<div>Loading...</div>;
  } else {
    return(
    <ul className="card-stack">
      {Object.values(cards).map((card) => {
        return(
          <Card card={card} key={card.id} activeCard={activeCard} onMouseDragStart={handelDragStart} onMouseDrag={handelMouseDrag}/>
      )})}
    </ul>
  )
  }
}