import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './channels.css';
import Feed from '../Post/post';
 
const ChannelPage = ({ loginUsername }) => {
  const [channels, setChannels] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [showFeed, setShowFeed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get('http://localhost:4000/channels');
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const createChannel = async () => {
    try {
      await axios.post('http://localhost:4000/channels', { name: channelName });
      setChannelName('');
      fetchChannels();
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const deleteChannel = async (channelName) => {
    try {
      await axios.delete('http://localhost:4000/channels', { data: { name: channelName } });
      fetchChannels();
    } catch (error) {
      console.error(`Error deleting channel ${channelName}:`, error);
    }
  };

  const joinChannel = (channelId, name) => {
    setShowFeed(true);
    setSelectedChannelId(channelId);
    setChannelName(name);
  };


  return (
    <div className="channel-page">
      {!showFeed && !showSearch ? (
        <div className="channels-container">
          <h1 className='top'> 
            Welcome {loginUsername}
          </h1>


          <h1>Channels</h1>
          
          <ul>
            {channels.map((channel) => (
              <li key={channel.id}>
                {channel.name}
                <button onClick={() => joinChannel(channel.id, channel.name)}>Join</button>
                
                {loginUsername === 'admin' && (
                  <button onClick={() => deleteChannel(channel.name)}>Delete</button>
                )}

                
              </li>
            ))}
          </ul>
          <div className="create-channel">
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel name"
            />
            <button onClick={createChannel}>Create Channel</button>
          </div>
        </div>
      ) : (
        showFeed && (
          <>
            <Feed channelId={selectedChannelId} username= {loginUsername} channelName={channelName} />

          </>
        )
      )}
    </div>
  );
};

export default ChannelPage;
