import {onMouseDown} from 'react';

export const Card = ({card}) => {
  const { upvotes, downvotes, num_comments, title, post_content, id } = card

  const contentType = (content) => {
    if (!content || !content.type) {
      return(<p>No content found</p>)
    }
    switch (content.type) {
      case 'image':
        return(<img className="content" src={content.content}></img>);
        break;
      case 'video':
        return (<video className="content" controls loop>
          <source src={content.content} type="video/mp4"/>
          Your browser does not support the video tag
        </video>);
        break;
      case 'text':
        return(<p className="content">{content.content}</p>);
        break;
      default:
        return(<p className="content">No content found</p>);
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


  return(
    <article className="contentCard">
      <section className="card-content">
        { contentType(post_content) }
        <div className="card-information">
          <h2>{title}</h2>
          <div className="card-information-footer">
            <div className="card-information-footer-info">
                <img src="/DownvoteIcon.svg" alt="Downvotes"/>
                <p>{roundStats(downvotes)}</p>
                <img src="/UpvoteIcon.svg" alt="Upvotes"/>
                <p>{roundStats(upvotes)}</p>
            </div>
            <div className="card-information-footer-info">
                <img src="/MessageIcon.svg" alt="Comments"/>
              <p>{roundStats(num_comments)}</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}