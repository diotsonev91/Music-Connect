import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../services/firebaseConfig";
import { useUserProfile } from './useUserProfile';
import { useAuth } from '../contexts/AuthContext';

export const useChatActions = () => {
  const { user } = useAuth();
  const { searchUserByEmail } = useUserProfile();

  // 🔎 Check if a private chat already exists between two users
  const findExistingPrivateChat = async (targetUserId) => {
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      // Check if it's exactly a private chat with both users and only them
      if (data.participants.includes(targetUserId) && data.participants.length === 2) {
        return { id: doc.id, ...data };
      }
    }
    return null;
  };

  // 🔥 Create or return existing chat
  const createOrGetPrivateChat = async (email) => {
    try {
      if (!email.trim()) return { success: false, message: "Email is empty" };

      const targetUser = await searchUserByEmail(email);
      if (!targetUser) return { success: false, message: "User not found" };

      const existingChat = await findExistingPrivateChat(targetUser.id);
      if (existingChat) {
        return { success: true, message: "Chat already exists", chat: existingChat };
      }

      // ✅ Create the chat
      const newChatRef = await addDoc(collection(db, "chats"), {
        participants: [user.uid, targetUser.id],
        name: targetUser.name || targetUser.email,
        lastMessage: ""
      });

      return { success: true, message: "Chat created successfully!", chat: { id: newChatRef.id, participants: [user.uid, targetUser.id], name: targetUser.name || targetUser.email } };
    } catch (error) {
      console.error("❌ Failed to create/get chat:", error);
      return { success: false, message: "Failed to create/get chat" };
    }
  };

  return { createOrGetPrivateChat };
};
