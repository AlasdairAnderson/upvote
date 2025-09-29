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
      <menu>
        <li><a><img id="categories" src="/widgetsIcon.svg" alt="categories"/></a></li>
        <li><a><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet"/></a></li>
        <li><a><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content"/></a></li>
        <li><img id="user" src="/Arnold.jpg" alt="user icon"/></li>
      </menu>
    </main>
  );
}
