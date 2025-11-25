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
    dispatch(updateActiveCard(Object.values(cards)[0]));
  }, [cards]);
  

  const handelDragStart= (event, clientX, clientY) => {
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    setCardPositioning({
      ...cardPoistioning,
      mouseStartingPosition: {x: clientX, y: clientY}
    });
    console.log(`Event: ${event.type}, x:${clientX}, y:${clientY}`);
  }

  const handelMouseDrag = (clientX, clientY) => {
    //console.log(`Event: DragStart, mousePosition: x:${clientX}, y:${clientY}; Delta: x:${cardPoistioning.mouseDelta.x}, y ${cardPoistioning.mouseDelta.y}`);
    const DeltaX = clientX - cardPoistioning.mouseStartingPosition.x;
    const DeltaY = clientY - cardPoistioning.mouseStartingPosition.y;
    setCardPositioning({
      ...cardPoistioning,
      mouseCurrentPosition: {x: clientX, y: clientY},
      mouseDelta: {x: DeltaX, y: DeltaY}
    });
  }

  const handleDragStop = () => {
    //console.log(`handleDragStop ${cardPoistioning.mouseDelta.x}`)
    setCardPositioning({
      mouseStartingPosition: {x: null, y:null},
      mouseCurrentPosition: {x: null, y:null},
      mouseDelta: {x: 0, y:0},
      voteStatus: "none"
    });
    console.log(`handleDragStop ${cardPoistioning.mouseDelta.x}`)
  }

  if(!cards || activeCard === undefined){
    return<div>Loading...</div>;
  } else {
    return(
    <ul className="card-stack">
      <Card card={activeCard} cardPoistioning={cardPoistioning} onMouseDragStart={handelDragStart} onMouseDrag={handelMouseDrag} onMouseDragStop={handleDragStop}/>
    </ul>
  )
  }
1}