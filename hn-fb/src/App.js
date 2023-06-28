import React, { useEffect, useState } from 'react';
import StoryModal from './components/Modal';
import StoryCard from './components/StoryCard';
import './StoryCard.css'
import db from './firebase';
import { ref, get } from 'firebase/database';
import axios from 'axios';


function App() {
  const [stories, setStories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalIsOpen]);

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(ids => {
        return Promise.all(ids.map(id => {
          return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => response.json());
        }));
      })
      .then(stories => setStories(stories))
      .catch(error => console.error('Error:', error));
  }, []);

  const openModal = (story) => {
    setSelectedStory(story);
    setModalIsOpen(true);

    axios.post('http://127.0.0.1:5000/clicks', {
      title: story.title,
      url: story.url,
      user_id: 1  // you should replace this with the actual user ID
    });

    const fetchComments = async (ids) => {
      const comments = await Promise.all(ids.map(async (id) => {
        const commentRef = ref(db, `/v0/item/${id}`);
        const snapshot = await get(commentRef);
        const comment = snapshot.val();
        let children = [];
        if (comment.kids) {
          children = await fetchComments(comment.kids);
        }
        return {
          ...comment,
          children,
        };
      }));
      return comments;
    };

    fetchComments(story.kids)
      .then(setComments)
      .catch((error) => console.error('Error:', error));
  };

  const closeModal = () => {
    setSelectedStory(null);
    setModalIsOpen(false);
  };

  return (
    <div>
      {stories.map((story, index) => (
        <div key={index} className="card">
          <StoryCard story={story} handleClick={() => openModal(story)} />
        </div>
      ))}
      <StoryModal 
        comments={comments} 
        selectedStory={selectedStory} 
        cursor={cursor}
        setCursor={setCursor}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      />
    </div>
  );
}

export default App;
