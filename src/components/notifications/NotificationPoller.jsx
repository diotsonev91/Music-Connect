import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/notificationSlice";
import { db } from "../../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { fetchCollection } from "../../services/firebaseFirestore";

const NotificationPoller = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const pollingInterval = useRef(null);


  const isUserInChat = (chatId) => {
    const currentPath = window.location.pathname;
    return currentPath === `/chat/${chatId}`;
  };

  useEffect(() => {
    if (!user?.uid) return;

    const pollNotifications = async () => {
      try {
        console.log("🔄 Starting notification poll...");
        const now = Date.now(); 

        // ✅ BLOG COMMENTS CHECK - keep lastCheck logic here if you want
        const blogsQuery = query(collection(db, "blogs"), where("author.uid", "==", user.uid));
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogs = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const blog of blogs) {
          const comments = await fetchCollection(`blogs/${blog.id}/comments`);
          comments.forEach((comment) => {
            dispatch(addNotification({
              id: `${blog.id}-${comment.createdAt}`,
              type: "blog",
              text: `${comment.author?.displayName || "Някой"} коментира блога ти: ${blog.title}`,
              read: false,
              data: { blogId: blog.id },
              timestamp: comment.createdAt?.toDate ? comment.createdAt.toDate().getTime() : Date.now()
            }));
          });
        }

        // ✅ TRACK LIKES CHECK
        const tracksQuery = query(collection(db, "tracks"), where("author.uid", "==", user.uid));
        const tracksSnapshot = await getDocs(tracksQuery);
        const tracks = tracksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const track of tracks) {
          const likes = await fetchCollection(`tracks/${track.id}/likes`);
          likes.forEach((like) => {
            dispatch(addNotification({
              id: `${track.id}-${like.userId}`,
              type: "track",
              text: `${like.displayName || "Някой"} хареса твоя трак: ${track.trackName}`,
              read: false,
              data: { trackId: track.id },
              timestamp: now
            }));
          });
        }

        // ✅ CHAT MESSAGES CHECK (🚀 Only trigger if NOT my message)
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
        const chatsSnapshot = await getDocs(chatsQuery);
        const chats = chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        for (const chat of chats) {
          const messages = await fetchCollection(`chats/${chat.id}/messages`);
          const newMessages = messages.filter(
            (msg) =>
              msg.senderId !== user.uid &&
              !(msg.readBy || []).includes(user.uid) && 
              !isUserInChat(chat.id)
          );
        
          if (newMessages.length > 0) {
            const notificationText = newMessages.length === 1
              ? `Имаш ново съобщение в чат "${chat.name || "Чат"}"`
              : `Имаш ${newMessages.length} нови съобщения в чат "${chat.name || "Чат"}"`;
        
            // ✅ ID only by chatId so it REPLACES old one
            dispatch(addNotification({
              id: `chat-${chat.id}`, // ✅ Static per chat
              type: "chat",
              text: notificationText,
              read: false,
              data: { chatId: chat.id },
              timestamp: newMessages[0]?.timestamp?.toMillis?.() || Date.now()
            }));
          }
        }


      } catch (err) {
        console.error("❌ Грешка при нотификациите:", err);
      }
    };

    pollingInterval.current = setInterval(pollNotifications, 30000);
    pollNotifications(); // Run once on mount

    return () => clearInterval(pollingInterval.current);
  }, [user, dispatch]);

  return null; // ✅ Important for React
};

export default NotificationPoller;
