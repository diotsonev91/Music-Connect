import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/firebaseConfig";
import useMutation from "./useMutation";


const fetchArtistsFromTracks = async () => {
  const snapshot = await getDocs(collection(db, "tracks"));
  const usersMap = new Map();

  snapshot.forEach((doc) => {
    const track = doc.data();
    const { author } = track;
    if (author?.uid) {
      usersMap.set(author.uid, author);
    }
  });

  return Array.from(usersMap.values());
};

export default function useArtists() {
  const { mutate, data: artists, isLoading, error } = useMutation(fetchArtistsFromTracks);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!triggered) {
      mutate();
      setTriggered(true);
    }
  }, [mutate, triggered]);

  console.log("fetched artists: ",artists)
  return { artists: artists || [], isLoading, error };
}
