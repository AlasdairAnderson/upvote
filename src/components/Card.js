

export const Card = () => {
    return(
    <div className="contentCard-background">
      <article className="contentCard">
        <header className="card-header">
          <h2 className="card-title">Article Title</h2>
          <img className="card-icon"src="/vercel.svg"/>
        </header>
        <section className="card-content">
          <p>Placeholder text for the content that will enventually make it into this location</p>
        </section>
        <section className="card-stats">
          <div className="stats">
            <img src="/UpvoteIcon.svg" alt="upvote icon"/>
            <progress id="upvote-progress" max="10000" value="5000"/>
          </div>
          <div className="stats">
            <img src="/DownvoteIconv2.png" alt="downvote icon"/>
            <progress id="downvote-progress" max="10000" value="2000"/>
          </div>
          <div className="stats">
            <img src="/MessageIcon.svg" alt="message icon"/>
            <progress id="message-progress" max="100" value="30"/>
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