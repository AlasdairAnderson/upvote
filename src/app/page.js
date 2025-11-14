'use client'
import { CardStack } from '@/components/cardStack/CardStack';
import React from 'react';



export default function Home() {
  
  return (
    <main>
      <div className='voting-sections'>
        <section className='downvote section'></section>
        <section className='novote section'>
          <CardStack/>
        </section>
        <section className='upvote section'></section>
      </div>
    </main>
  );
}
