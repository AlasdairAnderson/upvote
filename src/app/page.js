'use client'
import { Card } from "@/components/Card";
import { selectCards, fetchCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { current } from "@reduxjs/toolkit";


export default function Home() {
  const cards  = useAppSelector(selectCards);
  const dispatch = useAppDispatch();
  const [ redditAPIRequest, setredditAPIRequest ] = useState({ requestType: 'popular', query: '' });
  const [ currentCardIndex, setCurrentCardIndex ] = useState(cards.length - 1);
  const [ lastDirection, setLastDirection ] = useState(null);

  // used for out of frame closure
  const currentCardIndexRef = useRef(currentCardIndex);


  const childRefs = useMemo(() => Array(cards.length).
    fill(0)
    .map((i) => React.createRef())
  );

  const updateCurrentIndex = (val) => {
    setCurrentCardIndex(val);
    currentCardIndexRef.current = val;
  }

  const canSwipe = currentCardIndex >= 0;

  // set last direction and decrease current card index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentCardIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentCardIndexRef.current >= idx && childRefs[idx].current.restoreCard()
  }

  const swipe = async (dir) => {
    if (canSwipe && currentCardIndex < cards.length) {
      await childRefs[currentCardIndex].current.swipe(dir)// Swipe the card
    }
  }

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , []);

  return (
    <main>
      <div className="card-stack">
        {Object.values(cards).map((card, index) => {
          return(
          <SwipeCard
            ref={childRefs[index]}
            className='swipe'
            key={card.id}
            onSwipe={(dir) => swiped(dir, card.id, index)}
            onCardLeftScreen={() => outOfFrame(card.id, index)}
          >
            <Card card={card} key={card.id}/>
          </SwipeCard>)
        })}
      </div>
      <menu>
        <li><button><img id="categories" src="/widgetsIcon.svg" alt="categories"/></button></li>
        <li><button onClick={() => swipe('left')}><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet"/>downvote</button></li>
        <li><button onClick={() => swipe('right')}><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content"/>upvote</button></li>
        <li><img id="user" src="/Arnold.jpg" alt="user icon"/></li>
      </menu>
    </main>
  );
}
