'use client'
import { CardStack } from '@/components/cardStack/CardStack';
import { Menu } from '@/components/Menu/Menu';
import React, { useState } from 'react';



export default function Home() {
  const [ isAnimating, setIsAnimating ] = useState("");

  return (
    <main>
      <CardStack animation={isAnimating}/>
      <Menu setAnimation={setIsAnimating} animation={isAnimating}/>
    </main>
  );
}
