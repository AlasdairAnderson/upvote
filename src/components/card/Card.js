import React, { useEffect, useRef, useState } from "react";
import { elementCenterIsInZone} from "@/lib/utils/dropzones";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addUpvote, addDownvote, deleteVotedCard, selectActiveCard } from "@/lib/features/cards/cardsSlice";

export const Card = ({ card, cardPoistioning, onMouseDragStart, onMouseDrag, onMouseDragStop }) => {
  const { upvotes, downvotes, num_comments, title, post_content, id} = card
  const [transformPosition, setTransformPosition] = useState({x: 0, y:0})
  const dispatch = useAppDispatch();
  const activeCard = useAppSelector(selectActiveCard);
  const elRef = useRef(null);

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

  const handleOnDragStop = () => {
    const card = document.getElementById(id);
    if(!card) return;
    const upvoteZone = document.getElementsByClassName("upvote section");
    const downvoteZone = document.getElementsByClassName("downvote section");
    const downvoteIntersect = elementCenterIsInZone(card, downvoteZone[0]);
    const upvoteIntersect = elementCenterIsInZone(card, upvoteZone[0]);

    if(upvoteIntersect){
      //console.log(`upvoteIntersect: ${upvoteIntersect}`);
      dispatch(addUpvote(activeCard));
      dispatch(deleteVotedCard(activeCard));
    }
    if(downvoteIntersect){
      console.log(`downvoteIntersect: ${downvoteIntersect}`);
      dispatch(addDownvote(activeCard));
      dispatch(deleteVotedCard(activeCard));
    }
    
    onMouseDragStop();
    setTransformPosition({x:0, y: 0});
  }

  return(
    <li id={id} style={{transform: `translateX(${transformPosition.x}px) translateY(${transformPosition.y}px)`}} draggable="true" data-testid="card" onDragStart={(event) => onMouseDragStart(event, event.clientX, event.clientY)} onDrag={(event) => {onMouseDrag(event.clientX, event.clientY); setTransformPosition({x:cardPoistioning.mouseDelta.x, y: cardPoistioning.mouseDelta.y});}} onDragEnd={handleOnDragStop} className="card-stack__item">
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