

export const Card = ({card}) => {
  const { upvotes, downvotes, num_comments, totalvotes, title, post_content } = card

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
      default:
        return(<p className="content">No content found</p>);
    }
  }

  const StackedProgressBar = ({ segments }) => {
    return(<div className="progress-bar">
      {segments.map((segment, index) => {
        return(
        <div
          key={`${segment.percentage}${index}`} className="progress-segment"
          style={{
            width: `${segment.percentage}%`,
            backgroundColor: segment.color
          }}
          title={`${segment.lable}: ${segment.percentage}`}></div>);
      })}
    </div>);
  }

  return(
    <article className="contentCard">
      <section className="card-content">
        { contentType(post_content) }
      </section>
      <section className="card-information">
        <h2>{title}</h2>
        <div className="card-stats">
          <div className="stats">
            <img src="/UpvoteIcon.svg" alt="upvote icon"/>
            <StackedProgressBar segments={[{label:"upvote",percentage: Math.round(upvotes/totalvotes * 100), color: "#FF4500"},{lable:"downvote", percentage: Math.round(downvotes/totalvotes * 100), color: "#7193FE"}]} />
            <img src="/DownvoteIconv2.png" alt="downvote icon"/>
          </div>
          <div className="stats">
            <img src="/MessageIcon.svg" alt="message icon"/>
            <StackedProgressBar segments={[{label:"upvote",percentage: Math.round(num_comments/1500 * 100), color: "#fff"}]} />
          </div>
        </div>
      </section>
    </article>
  );
}