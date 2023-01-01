import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../lib/firebase";

export const getImage = async (path) => {
  const starsRef = ref(storage, path);
  return await getDownloadURL(starsRef);
};
