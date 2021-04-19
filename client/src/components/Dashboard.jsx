// Libraries + dependencies
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useSpotify } from '../contexts/SpotifyContext.js';
// import SpotiBotData from '../../../spotibot.json';

import PrivateRoute from './PrivateRoute.jsx';

// Sidebar components
import Playlists from './Playlists.jsx';
import AddPlaylist from './AddPlaylist.jsx';
import ProfileInfo from './ProfileInfo.jsx';
// Main app components
import Subreddits from './Subreddits.jsx';

const Dashboard = () => {
  const { token } = useSpotify();
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState();

  return (
    <>
      {/* App after Spotify authorization */}
        { !token ? null : (
          <div id="app-container">
            <div id="sidebar-container">
              <ProfileInfo />
              <div id="sidebar-playlists">
                <h2>Your SpotiBot Playlists</h2>
                <Playlists />
                {/* <AddPlaylist
                  token={token}
                  userID={user.id}
                  data={data}
                  setData={setData}
                  setSelected={setSelected}
                  setLoaded={setLoaded}
                /> */}
              </div>
            </div>
            {/* { JSON.stringify(data) === '{}' ? <h1>You have no playlists<br/>Create one in the sidebar</h1> : (
            <div id="main-container">
              <Subreddits
                token={token}
                selected={selected}
                data={data}
                setData={setData}
              />
            </div>
            ) } */}

          </div>
        ) }

    </>
  );
}

export default Dashboard;