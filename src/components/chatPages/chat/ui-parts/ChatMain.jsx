import React from 'react';
import styles from './ChatMain.module.css';
import Message from './Message';
const ChatMain = ({ selectedChat, image  }) => (
    <main className={styles.chatMain}>
      {selectedChat ? (
        <>
        <p>Chat content for {selectedChat.name}</p>
        <Message 
        text="Hey! How are you?  What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." 
        isSender={false} 
        timeSent="10:30 AM" 
        image="/sample-image.jpg" 
        avatar=""
      />
      <Message 
        text="I'm good! How about you? What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." 
        isSender={true} 
        image="/sample-image.jpg" 
        timeSent="10:31 AM"
      />
      <Message 
        text="Great! Let's meet up later." 
        isSender={false} 
        timeSent="10:35 AM" 
        avatar=""
      />
        </>
      ) : (
        <p className={styles.pStyle}>Please select a chat.</p>
      )}
    </main>
  );

export default ChatMain; 