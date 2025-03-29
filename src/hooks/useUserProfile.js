import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { updateDocument, fetchDocument } from  "../services/firebaseFirestore";
import { uploadFile } from "../services/firebaseStorage";

export const useUserProfile = () => {
  const USERS_COLLECTION = "users";

  // 🔥 Update Motto
  const updateMotto = async (userId, motto) => {
    try {
      await updateDocument(USERS_COLLECTION, userId, { motto });
      console.log("✅ Motto updated!");
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to update motto:", error);
      return { success: false, error };
    }
  };


  const searchUserByEmail = async (email) => {
    try {
      const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const userDoc = querySnapshot.docs[0];
      console.log("✅ Found user by email:", userDoc.data());
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error("❌ Failed to search user by email:", error);
      return null;
    }
  };

  // 🔥 Update Avatar (upload new avatar and update Firestore)
  const updateAvatar = async (userId, file, oldAvatarUrl = null) => {
    try {
      const avatarUrl = await uploadFile(file, "avatars", oldAvatarUrl);
      await updateDocument(USERS_COLLECTION, userId, { photoURL: avatarUrl });
      console.log("✅ Avatar updated!");
      return { success: true, avatarUrl };
    } catch (error) {
      console.error("❌ Failed to update avatar:", error);
      return { success: false, error };
    }
  };

  // 🔥 Generic profile field updater
  const updateProfileField = async (userId, data) => {
    try {
      await updateDocument(USERS_COLLECTION, userId, data);
      console.log("✅ Profile updated!");
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      return { success: false, error };
    }
  };


  // 🔥 Fetch Avatar from Firestore user profile
  const fetchAvatar = async (userId) => {
    try {
      const userDoc = await fetchDocument(USERS_COLLECTION, userId);
      return userDoc?.photoURL || null;
    } catch (error) {
      console.error("❌ Failed to fetch avatar:", error);
      return null;
    }
  };

  // 🔥 Fetch Motto from Firestore user profile
  const fetchMotto = async (userId) => {
    try {
      const userDoc = await fetchDocument(USERS_COLLECTION, userId);
      return userDoc?.motto || "";
    } catch (error) {
      console.error("❌ Failed to fetch motto:", error);
      return "";
    }
  };

  // 🔥 Generic fetch for any profile field(s)
  const fetchProfileField = async (userId) => {
    try {
      console.log("USER ID", userId)
      const userDoc = await fetchDocument(USERS_COLLECTION, userId);
      console.log("✅ Fetched profile data:", userDoc);
      return userDoc || {};
    } catch (error) {
      console.error("❌ Failed to fetch profile field(s):", error);
      return {};
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const userDoc = await fetchDocument(USERS_COLLECTION, userId);
      console.log("✅ Fetched User:", userDoc);
      return userDoc || null;
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      return null;
    }
  };

  return {
    updateMotto,
    updateAvatar,
    updateProfileField,
    fetchAvatar,
    fetchMotto,
    fetchProfileField,
    fetchUserById,
    searchUserByEmail, 
  };
};