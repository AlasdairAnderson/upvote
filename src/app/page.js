'use client'
import { Card } from "@/components/Card";
import { selectCards, fetchCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import { useEffect, useState } from "react";


export default function Home() {
  const cards  = useAppSelector(selectCards);
  const dispatch = useAppDispatch();
  const [ redditAPIRequest, setredditAPIRequest ] = useState({ requestType: 'popular', query: '' });
  const [ testCard, setTestCard ] = useState(Object.values(cards))

  useEffect(() => {
    // Fetch cards
    dispatch(fetchCards(redditAPIRequest));
  }
  , []);

  return (
    <div className="card-stack">
      {Object.values(cards).map((card) => {
        return(<Card key={card.id} card={card}/>)
      })}
        
    </div>
  );
}
