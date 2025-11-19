import React, { useEffect, useState } from "react";

export const Card = ({ card, cardPoistioning, onMouseDragStart, onMouseDrag, onMouseDragStop }) => {
  const { upvotes, downvotes, num_comments, title, post_content} = card
  const [transformPosition, setTransformPosition] = useState({x: 0, y:0})

  const contentType = (content) => {
    if (!content || !content.type) {
      return(<p>No content found</p>)
    }
    switch (content.type) {
      case 'image':
        return(<img data-testid={'image'} className="card__content" src={content.content}></img>);
        break;
      case 'video':
        return (<video data-testid={'video'} className="card__content" controls loop>
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
    onMouseDragStop(); 
    setTransformPosition({x:0, y: 0});
  }

  return(
    <li style={{transform: `translateX(${transformPosition.x}px) translateY(${transformPosition.y}px)`}} draggable="true" data-testid="card" onDragStart={(event) => onMouseDragStart(event, event.clientX, event.clientY)} onDrag={(event) => {onMouseDrag(event.clientX, event.clientY); setTransformPosition({x:cardPoistioning.mouseDelta.x, y: cardPoistioning.mouseDelta.y});}} onDragEnd={handleOnDragStop} className="card-stack__item">
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