// Libraries + dependencies
import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import useText from '../hooks/useText.js';
import { useSpotify } from '../contexts/SpotifyContext.js';

// const modalStyle = {
//   content : {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)'
//   }
// };

const AddPlaylist = (props) => {
  // const { token, userID, data, setData, setSelected, setLoaded } = props;
  const { token, SpotifyAPI } = useSpotify();
  const [isOpen, setIsOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useText({ name: '', description: '' });

  // // Saves playlist to spotify + returns ID for persistence
  // const handleSave = (e) => {
  //   e.preventDefault();

  //   SpotifyAPI.createPlaylist(userID, newPlaylist)
  //     .catch(err => alert(`🤖 Failed to create your playlist ${newPlaylist.name}`))
  //     .then(() => {
  //       SpotifyAPI.getUserPlaylists(userID)
  //         .catch(err => console.log(err))
  //         .then(resp => {
  //           // Map through playlist to find the one we just created
  //           resp.items.map(item => {
  //           if (
  //             item.name === newPlaylist.name &&
  //             item.description === newPlaylist.description
  //           ) {
  //               let newData = data;
  //               let playlistInfo = {
  //                 id: item.id,
  //                 subreddits: []
  //               };
  //               newData[newPlaylist.name] = playlistInfo;
  //               setData(newData);
  //               setLoaded(prev => !prev);

  //               // Save new data for persistence
  //               axios.post('/save', {
  //                 dir: '/Users/Liam/Desktop/Projects/MVP/spotibot.json',
  //                 data: newData
  //               })
  //                 .catch(err => console.log(err))
  //                 .then(alert(`🤖 Created your playlist ${newPlaylist.name}!`));
  //             }
  //         });
  //       })
  //     })
  //   setClicked(false);
  // }

  return (
    <>
      <button id="create-playlist-btn" onClick={() => setIsOpen(true)}>
        { !isOpen ? 'Add New Playlist' : 'Hide' }
      </button>
      <Modal
        id="create-playlist-modal"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
      >
        <button id="close-modal" type="button" onClick={() => setIsOpen(false)}>x</button>
        <div id="save-playlist-container">
          <h4>Enter A Playlist Name</h4>
          <input type="text" name="name" onChange={setNewPlaylist}></input>
          <h4>Enter A Description</h4>
          <textarea type="text" name="description" onChange={setNewPlaylist}></textarea>
        </div>
        <button id="save-playlist-btn">Save Playlist</button>
      </Modal>
    </>
  );
}

export default AddPlaylist;