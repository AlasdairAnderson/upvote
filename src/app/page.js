'use client'
import { CardStack } from '@/components/cardStack/CardStack';
import { Menu } from '@/components/Menu/Menu';
import React from 'react';



export default function Home() {
  
  return (
    <main>
      <div className='voting-sections'>
        <section className='downvote section'></section>
        <section className='novote section'>
          <svg viewBox='0 0 100 200' width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" id='vote-path'>
            <path d="M0,10 Q80,10 100,30 Q120,10 180,10 L200,10" stroke="black" fill="transparent"/>
          </svg>
          <CardStack/>
        </section>
        <section className='upvote section'></section>
      </div>
      <Menu/>
    </main>
  );
}
