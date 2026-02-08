import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addUpvote, addDownvote, deleteVotedCard, selectActiveCard } from "@/lib/features/cards/cardsSlice";

export const Card = ({ animation, card, cardPoistioning, onPointerDragStart, onPointerDragStop }) => {
  const { upvotes, downvotes, num_comments, title, post_content, id} = card
  const dispatch = useAppDispatch();
  const activeCard = useAppSelector(selectActiveCard);
  const [ cardOffsetDistance, setCardOffsetDistance ] = useState('50%') ;
  const [ cardOffsetRotation, setCardOffsetRotation ] = useState('0deg');
  const [ cardOpacity, setCardOpacity ] = useState(1);

  const contentType = (content) => {
    if (!content || !content.type) {
      return(<p>No content found</p>)
    }
    switch (content.type) {
      case 'image':
        return(<img data-testid={'image'} className="card__content" src={content.content}></img>);
        break;
      case 'video':
        return (<video data-testid={'video'} className="card__content" controls loop autoPlay={true}>
          <source src={content.content} type="video/mp4"/>
          Your browser does not support the video tag
        </video>);
        break;
      case 'text':
        return(<p data-testid={'text'} className="card__content">{content.content}</p>);
        break;
      default:
        return(<p data-testid={'no content'} className="card__content">Content Type Not Supported</p>);
    }
  }

  const roundStats = (stat) => {
    if (stat < 1000) {
      return stat;
    } else {
      const roundedStat = Math.round(stat/1000);
      return `${roundedStat}K`;
    }
  }

  const currentOffset = (clientX) => {
    if (cardPoistioning.mouseStartingPosition.x !== null){
      // update the offset distance of the card so that it moves along the offset-path alongside the users drag
      const DeltaX = clientX - cardPoistioning.mouseStartingPosition.x;
      // Calculate the percentage distance with 50+ (deltx/totalpathwidth * 100)
      const cardDistance = 50 + (DeltaX / 400 * 100);
      setCardOffsetDistance(`${cardDistance}%`);
      // Calculate the rotation
      const cardRoation = (cardDistance / 2) - 25;
      if(cardRoation < 20 && cardRoation > -20 ){
        setCardOffsetRotation(`${cardRoation}deg`);
      }
      // Calcualte card opacity
      let currentOpacity = (cardDistance / 50);
      // Count down from 1 to 0 if past the mid point
      if(cardDistance > 50){
        currentOpacity = 1 - (currentOpacity - 1);
      }
      if(currentOpacity >= 0){
        setCardOpacity(currentOpacity);
      }
    }
  }

  const handleOnDragStop = (event) => {
    const card = document.getElementById(id);
    const currentDistance = cardOffsetDistance.substring(0, cardOffsetDistance.length - 1);
    console.log(cardOffsetDistance);
    console.log(`currentDistance ${currentDistance}`);
    if(!card) return;
    if(currentDistance >= 75){
      console.log('addUpvote');
      dispatch(addUpvote(activeCard));
      dispatch(deleteVotedCard(activeCard));
      setCardOpacity(0);
    } else if(currentDistance <= 25){
      console.log('addDownvote')
      dispatch(addDownvote(activeCard));
      dispatch(deleteVotedCard(activeCard));
    } else {
      onPointerDragStop(event);
      setCardOffsetDistance('50%');
      setCardOffsetRotation('0deg');
      setCardOpacity(1);
    }
    // Reset Card
    onPointerDragStop(event);
    setCardOffsetDistance('50%');
    setCardOffsetRotation('0deg');
  }

  return(
    <li id={id} data-testid="card" style={{offsetDistance: cardOffsetDistance, offsetRotate: cardOffsetRotation}} onPointerDown={(event) => {onPointerDragStart(event, event.clientX, event.clientY)} } onPointerMove={(event) => {currentOffset(event.clientX);}} onPointerUp={(event) => {handleOnDragStop(event)}} onTouchStart={(event) => {onPointerDragStart(event, event.touches[0].clientX, event.touches[0].clientY)}} onTouchMove={(event) => {currentOffset(event.touches[0].clientX);}} onTouchEnd={(event) => {handleOnDragStop(event)}} className={`card-stack__item ${animation}`}>
        <section className="card" style={{opacity: cardOpacity}}>
          { contentType(post_content) }
          <div className="card__information">
            <h2>{title}</h2>
            <div className="card__information__footer">
              <div className="card__information__footer__info">
                  <img src="/DownvoteIcon.svg" alt="Downvotes"/>
                  <p>{roundStats(downvotes)}</p>
                  <img src="/UpvoteIcon.svg" alt="Upvotes"/>
                  <p>{roundStats(upvotes)}</p>
              </div>
              <div className="card__information__footer__info">
                  <img src="/MessageIcon.svg" alt="Comments"/>
                <p>{roundStats(num_comments)}</p>
              </div>
            </div>
          </div>
        </section>
    </li>
    
  );
}