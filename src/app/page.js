'use client'
import { Card } from "@/components/Card";
import { selectCards, fetchCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import React, { useEffect, useState } from "react";



export default function Home() {
  const cards  = useAppSelector(selectCards);
  const dispatch = useAppDispatch();
  const [ redditAPIRequest, setredditAPIRequest ] = useState({ requestType: 'popular', query: '' });

  

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , [redditAPIRequest]);

  return (
    <main>
      <ul className="card-stack">
        {Object.values(cards).map((card, index) => {
          return(
            <Card card={card} key={card.id} onMouseDown={handleClick}/>
        )})}
      </ul>
      <menu>
        <li><button><img id="categories" src="/widgetsIcon.svg" alt="categories"/></button></li>
        <li><button onClick={() => swipe('left')}><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet"/>downvote</button></li>
        <li><button onClick={() => swipe('right')}><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content"/>upvote</button></li>
        <li><img id="user" src="/Arnold.jpg" alt="user icon"/></li>
      </menu>
    </main>
  );
}
