'use client'
import { CardStack } from '@/components/cardStack/CardStack';
import { Menu } from '@/components/Menu/Menu';
import React, { useState } from 'react';



export default function Home() {
  const [isAnimating, setIsAnimating] = useState("");
  const [redditAPIRequest, setRedditAPIRequest] = useState({ requestType: 'popular', query: '', newRequest: true });
  return (
    <main>
      <CardStack animation={isAnimating} redditAPIRequest={redditAPIRequest} setRedditAPIRequest={setRedditAPIRequest} />
      <Menu setAnimation={setIsAnimating} animation={isAnimating} setRedditAPIRequest={setRedditAPIRequest} />
    </main>
  );
}
