import React, { useEffect, useRef, useState } from "react";
import { elementCenterIsInZone} from "@/lib/utils/dropzones";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addUpvote, addDownvote, deleteVotedCard, selectActiveCard } from "@/lib/features/cards/cardsSlice";

export const Card = ({ animation, card, cardPoistioning, onPointerDragStart, onPointerDrag, onPointerDragStop }) => {
  const { upvotes, downvotes, num_comments, title, post_content, id} = card
  const dispatch = useAppDispatch();
  const activeCard = useAppSelector(selectActiveCard);
  const elRef = useRef(null);
  const [ cardOffsetDistance, setCardOffsetDistance ] = useState('50%') ;

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

  const currentDistance = (clientX) => {
    if (cardPoistioning.mouseStartingPosition.x !== null){
      // update the offset distance of the card so that it moves along the offset-path alongside the users drag
      console.log(cardPoistioning.mouseStartingPosition);
      const DeltaX = clientX - cardPoistioning.mouseStartingPosition.x;
      console.log(DeltaX);
      // Calculate the percentage distance with 5+ (deltx/totalpathwidth * 100)
      const cardDistance = 50 + (DeltaX / 400 * 100);
      console.log(`cardDistance ${cardDistance}%`);
      setCardOffsetDistance(`${cardDistance}%`);
    } else {
      setCardOffsetDistance('50%');
    }
  }

  const handleOnDragStop = (event) => {
    const card = document.getElementById(id);
    if(!card) return;

    /*
    if(upvoteIntersect){
      dispatch(addUpvote(activeCard));
      dispatch(deleteVotedCard(activeCard));
    }
    if(downvoteIntersect){
      console.log(`downvoteIntersect: ${downvoteIntersect}`);
      dispatch(addDownvote(activeCard));
      dispatch(deleteVotedCard(activeCard));
    }*/
    onPointerDragStop(event);
  }

  return(
    <li id={id} data-testid="card" style={{offsetDistance: cardOffsetDistance}} onPointerDown={(event) => {onPointerDragStart(event, event.clientX, event.clientY)} } onPointerMove={(event) => {currentDistance(event.clientX)} } onPointerUp={(event) => {handleOnDragStop(event)}} className={`card-stack__item ${animation}`}>
        <section className="card">
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