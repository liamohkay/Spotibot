import React, { useState, useEffect } from 'react';
import AddSubreddit from './AddSubreddit.jsx';
import RunBot from './RunBot.jsx';

const SubredditList = ({ token, selected, data, setData }) => {
  const [subreddits, setSubreddits] = useState(data[selected].subreddits);
  const [clicked, setClick] = useState(true);

  // Updates displayed subreddits for currently selected playlist
  useEffect(() => {
    setSubreddits(data[selected].subreddits);
  }, [selected, clicked]);

  return (
    <div id="subreddit-list-container">
      <ul>
        { subreddits.map(sub => <li key={sub}>{sub}</li>) }
      </ul>

      <RunBot
        token={token}
        playlistID={data[selected].id}
        subreddits={subreddits}
      />

      <AddSubreddit
        selected={selected}
        data={data}
        setData={setData}
        setClick={setClick}
      />

    </div>
  );
}

export default SubredditList;