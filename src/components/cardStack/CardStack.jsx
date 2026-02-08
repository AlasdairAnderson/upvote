import { Card } from '@/components/card/Card'
import { selectCards, selectActiveCard, fetchCards, updateActiveCard } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { current } from '@reduxjs/toolkit';
import React, { act, useEffect, useState } from "react";

export const CardStack = ({ animation }) => {
  const cards  = useAppSelector(selectCards);
  const activeCard = useAppSelector(selectActiveCard);
  const [ lowNumberOfCards, setLowNumberOfCards ] = useState(false);
  const dispatch = useAppDispatch();
  const [ redditAPIRequest, setredditAPIRequest ] = useState({ requestType: 'popular', query: '' });
  const [ cardPoistioning, setCardPositioning ] = useState({
    mouseStartingPosition: {x: null, y:null},
    mouseCurrentPosition: {x: null, y:null},
    mouseDelta: {x: null, y:null},
    voteStatus: "none"
  });

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , [redditAPIRequest]);  

  useEffect(() => {
    dispatch(updateActiveCard(Object.values(cards)[0]));
    if(Object.values(cards).length < 3){
      setLowNumberOfCards(true);
    }
  }, [cards]);
  
  //If less than 3 cards are remaining within redux
  useEffect(() => {
    dispatch(fetchCards(redditAPIRequest));
    setLowNumberOfCards(false);
  },[lowNumberOfCards])

  const handelDragStart= (event, clientX, clientY) => {
    event.target.setPointerCapture(event.pointerId);
    setCardPositioning({
      ...cardPoistioning,
      mouseStartingPosition: {x: clientX, y: clientY}
    });
    console.log(`Event: ${event.type}, x:${clientX}, y:${clientY}`);
  }

  const handleDragStop = (event) => {
    event.target.releasePointerCapture(event.pointerId)
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
    <ul className="card-stack" key={activeCard.id}>
      <Card animation={animation} card={activeCard} cardPoistioning={cardPoistioning} onPointerDragStart={handelDragStart} onPointerDragStop={handleDragStop}/>
    </ul>
  )
  }
1}