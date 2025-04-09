

export const Card = ({card}) => {
  const { upvotes, downvotes, num_comments, totalvotes, title, image, post_content } = card

  const contentType = (content) => {
    switch (content.type) {
      case 'image':
        return(<img src={content.content}></img>);
        break;
      case 'video':
        return (<video>
          <source src={content.content} type="video/mp4"/>
        </video>);
        break;
      case 'text':
        return(<p>{content.content}</p>);
      default:
        return(<p>No contnet found</p>);
    }
  }
  

  return(
    <div className="contentCard-background">
      <article className="contentCard">
        <header className="card-header">
          <h2 className="card-title">{title}</h2>
          <img className="card-icon"src="/vercel.svg"/>
        </header>
        <section className="card-content">
          { contentType(post_content) }
        </section>
        <section className="card-stats">
          <div className="stats">
            <img src="/UpvoteIcon.svg" alt="upvote icon"/>
            <progress id="upvote-progress" max={totalvotes} value={upvotes}/>
          </div>
          <div className="stats">
            <img src="/DownvoteIconv2.png" alt="downvote icon"/>
            <progress id="downvote-progress" max={totalvotes} value={downvotes}/>
          </div>
          <div className="stats">
            <img src="/MessageIcon.svg" alt="message icon"/>
            <progress id="message-progress" max="1500" value={num_comments}/>
          </div>
        </section>
        <section className="card-footer">
            <div className="card-badges">
                <img src="/Top.svg" alt="top article"/>
            </div>
            <img id="card-flip" src="/Repeat.svg" alt="flip card"/>
        </section>
      </article>
    </div>
    );

}