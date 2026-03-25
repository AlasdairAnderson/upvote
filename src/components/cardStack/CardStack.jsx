import { Card } from '@/components/card/Card'
import { selectCards, selectActiveCard, fetchCards, updateActiveCard, selectListingData, selectLoadingState, selectErrorState } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { current } from '@reduxjs/toolkit';
import React, { act, useEffect, useState } from "react";

export const CardStack = ({ animation, redditAPIRequest, setRedditAPIRequest }) => {
  const cards = useAppSelector(selectCards);
  const activeCard = useAppSelector(selectActiveCard);
  const listingData = useAppSelector(selectListingData);
  const loadingState = useAppSelector(selectLoadingState);
  const errorState = useAppSelector(selectErrorState);
  const [lowNumberOfCards, setLowNumberOfCards] = useState(false);
  const dispatch = useAppDispatch();
  const [cardPoistioning, setCardPositioning] = useState({
    mouseStartingPosition: { x: null, y: null },
    mouseCurrentPosition: { x: null, y: null },
    mouseDelta: { x: null, y: null },
    voteStatus: "none"
  });

  useEffect(() => {
    dispatch(updateActiveCard(Object.values(cards)[0]));
    if (Object.values(cards).length < 3) {
      setLowNumberOfCards(true);
    }
  }, [cards]);

  //If less than 3 cards are remaining within redux
  useEffect(() => {
    dispatch(fetchCards({ redditAPIRequest, listingData }));
    setLowNumberOfCards(false);
    setRedditAPIRequest({
      ...redditAPIRequest,
      newRequest: false
    })
  }, [lowNumberOfCards, redditAPIRequest.requestType, redditAPIRequest.query])

  const handelDragStart = (event, clientX, clientY) => {
    event.target.setPointerCapture(event.pointerId);
    setCardPositioning({
      ...cardPoistioning,
      mouseStartingPosition: { x: clientX, y: clientY }
    });
    //console.log(`Event: ${event.type}, x:${clientX}, y:${clientY}`);
  }

  const handleDragStop = (event) => {
    event.target.releasePointerCapture(event.pointerId)
    setCardPositioning({
      mouseStartingPosition: { x: null, y: null },
      mouseCurrentPosition: { x: null, y: null },
      mouseDelta: { x: 0, y: 0 },
      voteStatus: "none"
    });
  }

  // If no cards are found
  if (!cards || activeCard === undefined) {
    const cardErrorInfo = {
      id: '0000',
      upvotes: 0,
      downvotes: 0,
      num_comments: 0,
      title: 'An error has occured',
      post_content: {
        content: 'No posts could be found',
        type: 'error'
      }
    }
    return (
      <ul className="card-stack" >
        <Card animation={animation} card={cardErrorInfo} cardPoistioning={cardPoistioning} setRedditAPIRequest={setRedditAPIRequest} />
      </ul>
    );
  } else if (loadingState) {
    return <div>cards are loading</div>;
  } else if (errorState) {
    return <div>There is an error</div>;
  } else {
    return (
      <ul className="card-stack" key={activeCard.id}>
        <Card animation={animation} card={activeCard} cardPoistioning={cardPoistioning} onPointerDragStart={handelDragStart} onPointerDragStop={handleDragStop} />
      </ul>
    )
  }
  1
}