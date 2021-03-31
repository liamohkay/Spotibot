import React, { useState, useEffect } from 'react';
import reddit from '../../../server/reddit.js';
import Spotify from 'spotify-web-api-js';
import DataFrame from 'dataframe-js';
const SpotifyAPI = new Spotify();

const RunBot = ({ token, playlistID, subreddits }) => {
  const [currentTracks, setCurrentTracks] = useState([]);
  const [tracksToAdd, setTracksToAdd] = useState([]);
  const [searching, setSearching] = useState(null);
  const [render, setRender] = useState(true);
  SpotifyAPI.setAccessToken(token);

  // useEffect(() => {
  //   SpotifyAPI.getPlaylistTracks(playlistID)
  //     .catch(err => console.log(err))
  //     .then(resp => setCurrentTracks(resp))
  // })

  const handleAdd = (e) => {
    e.preventDefault();
    if (tracksToAdd.length === 0) alert('Press "Run SpotiBot" first!');
    if (tracksToAdd.length > 0) {
      SpotifyAPI.addTracksToPlaylist(playlistID, tracksToAdd)
        .catch(err => console.log(err))
        .then(() => alert(`Done! Added ${tracksToAdd.length} songs <3!`))
    }
  }

  const handleRun = (e) => {
    e.preventDefault();

    subreddits.map((sub, subIndex) => {
      reddit.getTopPosts(sub, subPosts => {
        subPosts.map((post, postIndex) => {

          // Search by song title then check against artist name
          SpotifyAPI.searchTracks(post.track, { limit: 50 })
            .catch(err => console.log(err))
            .then(resp => {
              let trackResults = resp.tracks.items;

              // If there is a match & track i snot already in playlist, add to playlist
              trackResults.map(track => {
                if (track.artists[0].name.toLowerCase() === post.artist.toLowerCase()) {
                  if (currentTracks.indexOf(track.id) === -1) {
                    setTracksToAdd(prev => [...prev, track.id]);
                  }
                }
              });
            })
            .then(() => {
              setSearching(`${post.artist} - ${post.track}`);
              setRender(prev => !prev);
            })
            .then(() => {
              if (postIndex === subPosts.length - 1) {
                setSearching(null);
                setRender(prev => !prev);
              }
            })
        });
      });
    });
  }

  return (
    <div>
      { tracksToAdd.length }
      { !searching ? null : <div>Searching for: { searching }</div> }
      <button id="run-bot" onClick={handleRun}>Run SpotiBot</button>
      <button id="add-songs" onClick={handleAdd}>Add Songs</button>
    </div>
  );
}

export default RunBot;