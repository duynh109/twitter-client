import axios from 'axios';
import { useEffect, useState } from 'react';
import socket from './socket';
import InfiniteScroll from 'react-infinite-scroll-component';

const profile = JSON.parse(localStorage.getItem('profile'));
const usernames = [
  {
    name: 'user1',
    value: 'user668aaca3aa1459fc2691ea07',
  },
  {
    name: 'user2',
    value: 'user668aacc857a38862269fb1a2',
  },
];
const LIMIT = 10;
const PAGE = 1;

export default function Chat() {
  const [value, setValue] = useState('');
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [pagination, setPagination] = useState({
    page: PAGE,
    total_page: 0,
  });

  const getProfile = (username) => {
    axios
      .get(`/users/${username}`, {
        baseURL: import.meta.env.VITE_API_URL,
      })
      .then((res) => {
        setReceiver(res.data.result._id);
        alert(`Now you can chat with ${res.data.result.name}`);
      });
  };

  // Kết nối socket với sever và nhận tin nhắn
  useEffect(() => {
    socket.auth = {
      _id: profile._id,
    };
    socket.connect();

    socket.on('receive_message', (data) => {
      const { payload } = data;
      setConversations((conversations) => [...conversations, payload]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Gọi API get conversation khi nhấn vào 1 user
  useEffect(() => {
    if (receiver) {
      axios
        .get(`/conversations/receivers/${receiver}`, {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          params: {
            limit: LIMIT,
            page: PAGE,
          },
        })
        .then((res) => {
          const { conversations, page, total_page } = res.data.result;
          setConversations(conversations);
          setPagination({
            page,
            total_page,
          });
        });
    }
  }, [receiver]);

  const fetchMoreConversations = () => {
    if (receiver && pagination.page < pagination.total_page) {
      axios
        .get(`/conversations/receivers/${receiver}`, {
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          params: {
            limit: LIMIT,
            page: pagination.page + 1,
          },
        })
        .then((res) => {
          const { conversations, page, total_page } = res.data.result;
          setConversations((prev) => [...prev, ...conversations]);
          setPagination({
            page,
            total_page,
          });
        });
    }
  };

  const send = (e) => {
    e.preventDefault();
    setValue('');
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver,
    };
    socket.emit('send_message', {
      payload: conversation,
    });
    setConversations((conversations) => [
      {
        ...conversation,
        _id: new Date().getTime(),
      },
      ...conversations,
    ]);
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {usernames.map((username) => (
          <div key={username.name}>
            <button onClick={() => getProfile(username.value)}>{username.name}</button>
          </div>
        ))}
      </div>
      <div
        id="scrollableDiv"
        style={{
          height: 300,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
          dataLength={conversations.length}
          next={fetchMoreConversations}
          style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={pagination.page < pagination.total_page}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {conversations.map((conversation, index) => (
            <div key={index} className="message-container">
              <div className={'message ' + (conversation.sender_id === profile._id ? 'message-right' : '')}>{conversation.content}</div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      {/* <div className="chat"></div> */}
      <form onSubmit={send}>
        <input type="text" onChange={(e) => setValue(e.target.value)} value={value} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
