import { Card } from '@/components/card/Card'
import { selectCards, selectActiveCard, fetchCards, updateActiveCard } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { current } from '@reduxjs/toolkit';
import React, { act, useEffect, useState } from "react";

export const CardStack = () => {
  const cards  = useAppSelector(selectCards);
  const activeCard = useAppSelector(selectActiveCard);
  const dispatch = useAppDispatch();
  const [ redditAPIRequest, setredditAPIRequest ] = useState({ requestType: 'popular', query: '' });
  const [ cardArray, setCardArray ] = useState([]);
  const [ cardPoistioning, setCardPositioning ] = useState({
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

  useEffect(() => {
    setCardArray(Object.values(cards));
  }, [cards])
  

  useEffect(() => {
    dispatch(updateActiveCard(cardArray[0]));
  }, [cardArray]);
  

  /*const handelDragStart= (event, clientX, clientY, id) => {
    event.dataTransfer.setDragImage(new Image(), 0, 0);
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
      });
      //console.log(`Drag Event: id:${activeCard.id}, x: ${activeCard.mouseDelta.x}, y:${activeCard.mouseDelta.y}`);   
    }
  }

  const handleDragStop = () => {
    console.log(`handleDragStop ${activeCard.mouseDelta.x}`)
    setActiveCard({
      id: null,
      mouseStartingPosition: {x: null, y:null},
      mouseCurrentPosition: {x: null, y:null},
      mouseDelta: {x: 0, y:0},
      voteStatus: "none"
    });
    console.log(`handleDragStop ${activeCard.mouseDelta.x}`)
  }*/

  if(!cards || activeCard === undefined){
    return<div>Loading...</div>;
  } else {
    return(
    <ul className="card-stack">
      <Card card={activeCard} /*activeCard={activeCard} onMouseDragStart={handelDragStart} onMouseDrag={handelMouseDrag} onMouseDragStop={handleDragStop}*//>
    </ul>
  )
  }
1}