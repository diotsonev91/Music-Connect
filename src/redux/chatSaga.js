import { call, put, takeEvery, take } from 'redux-saga/effects';
import { collection, addDoc, getDocs, getDoc, query, where, updateDoc, deleteDoc,   doc, arrayUnion, orderBy, onSnapshot } from 'firebase/firestore';
import { eventChannel } from 'redux-saga';
import { db } from "../services/firebaseConfig";
import { 
  fetchMessages, 
  setMessagesForChat, 
  sendMessage, 
  setError, 
  fetchChats, 
  setChats,
  setMessagesAsRead,
  createOrGetPrivateChat,
  deleteChat,
  removeChat,
} from './chatSlice';
import { serverTimestamp } from 'firebase/firestore';

// 🔥 Fetch all chats where user is participant ! 
function* fetchChatsSaga(action) {
  try {
    const { userId } = action.payload;
    console.log("🔥 Listening for chats for user:", userId);

    const q = query(collection(db, "chats"), where("participants", "array-contains", userId));
    const channel = yield call(createFirebaseChannel, q);

    while (true) {
      const snapshot = yield take(channel);
      const chats = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis?.() || null, // 👈 fix is here
        };
      });
      yield put(setChats(chats));
    }
  } catch (err) {
    yield put(setError(err.message));
  }
}
// 🔥 Real-time Messages Fetch
function* fetchMessagesSaga(action) {
  try {
    const chatId = action.payload;
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp"));
    const channel = yield call(createFirebaseChannel, q);

    while (true) {
      const snapshot = yield take(channel);
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : null
        };
      });
      yield put(setMessagesForChat({ chatId, messages: msgs }));
    }
  } catch (err) {
    yield put(setError(err.message));
  }
}

// 🔥 Real-time Channel Creator
function createFirebaseChannel(query) {
  return eventChannel((emit) => {
    const unsubscribe = onSnapshot(query, (snapshot) => emit(snapshot));
    return () => unsubscribe();
  });
}

// 🔥 Send Message with proper readBy init
function* sendMessageSaga(action) {
  try {
    const { chatId, text, senderId, image } = action.payload;

    const messageData = {
      text: text || "",
      senderId,
      timestamp: serverTimestamp(),
      readBy: []
    };

    if (image) {
      messageData.image = image;
    }

    // ✅ Add the new message
    yield call(addDoc, collection(db, `chats/${chatId}/messages`), messageData);

    // ✅ Update lastMessage in the chat document
    const chatRef = doc(db, "chats", chatId);
    yield call(updateDoc, chatRef, {
      lastMessage: text || "📷 Image sent" 
    });

  } catch (err) {
    yield put(setError(err.message));
  }
}


// 🔥 Mark messages as read saga
function* setMessagesAsReadSaga(action) {
  try {
    const { chatId, messageIds, userId } = action.payload;

    const updates = messageIds.map(function* (msgId) {
      const msgRef = doc(db, `chats/${chatId}/messages`, msgId);
      const msgSnap = yield call(getDoc, msgRef);

      if (!msgSnap.exists()) return;

      const msgData = msgSnap.data();
      const readByArray = Array.isArray(msgData.readBy) ? msgData.readBy : [];

      if (!readByArray.includes(userId)) {
        yield call(updateDoc, msgRef, {
          readBy: arrayUnion(userId)
        });
      }
    });

    yield* updates;
  } catch (err) {
    console.error('❌ Error in setMessagesAsReadSaga:', err);
    yield put(setError(err.message));
  }
}


function* createOrGetPrivateChatSaga(action) {
  try {
    const { userId, targetUser } = action.payload;

    if (!userId || !targetUser?.id) {
      console.warn("Missing userId or targetUser in action");
      return;
    }

    // ✅ 1. Check if chat already exists
    const q = query(collection(db, "chats"), where("participants", "array-contains", userId));
    const querySnapshot = yield call(getDocs, q);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (
        data.participants.includes(targetUser.id) &&
        data.participants.length === 2
      ) {
        console.log("✅ Chat already exists");
        yield put(fetchChats({ userId }));
        return;
      }
    }

    // ✅ 2. Create new chat
    const newChatRef = yield call(addDoc, collection(db, "chats"), {
      participants: [userId, targetUser.id],
      name: targetUser.displayName || targetUser.email || "Unnamed User",
      lastMessage: "",
      createdAt: serverTimestamp(),
    });

    console.log("✅ Created new chat with ID:", newChatRef.id);

    // ✅ 3. Refresh chat list
    yield put(fetchChats({ userId }));
  } catch (err) {
    console.error("❌ Failed to create/get chat:", err);
    yield put(setError(err.message));
  }
}

function* deleteChatSaga(action) {
  const { chatId, userId } = action.payload;
  try {
    // Step 1: Delete messages in the subcollection
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const messagesSnapshot = yield call(getDocs, messagesRef);
    for (const docSnap of messagesSnapshot.docs) {
      yield call(deleteDoc, doc(messagesRef, docSnap.id));
    }

    // Step 2: Delete the chat document
    yield call(deleteDoc, doc(db, "chats", chatId));
    yield put(removeChat(chatId));
    // Step 3: Refresh chat list
    yield put(fetchChats({ userId }));
  } catch (error) {
    console.error("❌ Failed to delete chat:", error);
    yield put(setError("Failed to delete chat."));
  }
}


// 🔥 Main watcher
export default function* chatSaga() {
  yield takeEvery(fetchChats.type, fetchChatsSaga);
  yield takeEvery(fetchMessages.type, fetchMessagesSaga);
  yield takeEvery(sendMessage.type, sendMessageSaga);
  yield takeEvery(setMessagesAsRead.type, setMessagesAsReadSaga);
  yield takeEvery(createOrGetPrivateChat.type, createOrGetPrivateChatSaga);
  yield takeEvery(deleteChat.type, deleteChatSaga); 
}
