import React from 'react';

function getTimeAgo(timestamp) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const difference = currentTime - timestamp;

  if (difference < 60) {
    return `${difference} seconds ago`;
  } else if (difference < 3600) {
    const minutesAgo = Math.floor(difference / 60);
    return `${minutesAgo} minutes ago`;
  } else if (difference < 86400) {
    const hoursAgo = Math.floor(difference / 3600);
    return `${hoursAgo} hours ago`;
  } else if (difference < 604800) {
    const daysAgo = Math.floor(difference / 86400);
    return `${daysAgo} days ago`;
  } else if (difference < 2592000) {
    const weeksAgo = Math.floor(difference / 604800);
    return `${weeksAgo} weeks ago`;
  } else if (difference < 31536000) {
    const monthsAgo = Math.floor(difference / 2592000);
    return `${monthsAgo} months ago`;
  } else {
    const yearsAgo = Math.floor(difference / 31536000);
    return `${yearsAgo} years ago`;
  }
}

const StoryCard = ({ story, handleClick }) => {
  return (
    <div>
      <div className="top-section">
        <div className="domain-line">
          {(story.url && story.url.length > 0) && (
            <a
              href={new URL(story.url).origin}
              target="_blank"
              rel="noopener noreferrer"
              className="domain"
            >
              {new URL(story.url).hostname}
            </a>)}
        </div>
        <div className="author-timestamp-line">
          <a
            href={`https://news.ycombinator.com/user?id=${story.by}`}
            className="author"
            target="_blank"
            rel="noopener noreferrer"
          >
            {story.by}
          </a>
          <span className="timestamp">
            {getTimeAgo(story.time)}
          </span>
        </div>
      </div>
      <h2 className="title" onClick={handleClick}>{story.title}</h2>
      <div className="bottom-section">
        <p className="score">{story.score} points</p>
        <p className="link" onClick={handleClick}>{story.descendants} comments</p>
      </div>
    </div>
  );
};


export default StoryCard;
