'use client'
import { CardStack } from '@/components/cardStack/CardStack';



export default function Home() {
  
  return (
    <main>
      <CardStack/>
      <menu>
        <li><button><img id="categories" src="/widgetsIcon.svg" alt="categories"/></button></li>
        <li><button onClick={() => swipe('left')}><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet"/>downvote</button></li>
        <li><button onClick={() => swipe('right')}><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content"/>upvote</button></li>
        <li><img id="user" src="/Arnold.jpg" alt="user icon"/></li>
      </menu>
    </main>
  );
}
