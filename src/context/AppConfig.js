import React, { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as googleSignOut,
} from "firebase/auth";
import {
  query,
  getDocs,
  collection,
  where,
  deleteDoc,
  setDoc,
  orderBy,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import useMessage from "antd/es/message/useMessage";
import { auth, db, storage } from "../lib/firebase";

export const AppConfig = createContext();

export const AppProvider = ({ children }) => {
  const [messageApi, contextHolder] = useMessage();
  const [adminStatus, setadminstatus] = useState(false);
  const [data, setdata] = useState([]);
  const [addingLoad, setAddingLoad] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [fetchloading, setfetchloading] = useState(true);
  const [mailerror, setmailerror] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  const [user] = useAuthState(auth);

  const signOut = async () => {
    await googleSignOut(auth);
    setadminstatus(false);

    messageApi.open({
      type: "success",
      content: "Logged out successfully",
    });
  };

  const signInWithGoogle = async () => {
    setIsLoggingIn(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(
        collection(db, "admins"),
        where("mail", "==", user.email)
      );
      const docs = await getDocs(q);

      if (docs.docs.length === 0) {
        setadminstatus(false);
        setmailerror(true);
      } else {
        setAdminData(docs.docs.data);
        setadminstatus(true);
        setmailerror(false);
      }

      messageApi.open({
        type: "success",
        content: "Logged in successfully",
      });
    } catch (err) {
      messageApi.open({
        type: "error",
        content: err.message,
      });
    }

    setIsLoggingIn(false);
  };

  const addImage = async (regno, file) => {
    const fileName = `images/${regno}`;

    const storageRef = ref(storage, fileName);

    uploadBytesResumable(storageRef, file);

    return fileName;
  };

  const addMember = async (name, regno, file, onSuccess) => {
    setAddingLoad(true);
    const q = query(collection(db, "members"), where("regno", "==", regno));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      if (!name) {
        messageApi.open({
          type: "error",
          content: `Name field shouldn't be empty`,
        });

        return;
      }

      if (!regno) {
        messageApi.open({
          type: "error",
          content: `Regno field shouldn't be empty`,
        });

        return;
      }

      if (!file || file.length === 0) {
        messageApi.open({
          type: "error",
          content: "Add a profile image",
        });

        return;
      }
      const fileName = await addImage(regno, file);

      await setDoc(doc(db, "members", regno.toString()), {
        name,
        regno,
        imagePath: fileName,
        points: 0,
      });

      messageApi.open({
        type: "success",
        content: "User added Successfully !",
      });

      setAddingLoad(false);
      onSuccess?.();

      return;
    }

    messageApi.open({
      type: "error",
      content: "User already exist !",
    });
  };

  const removeMember = async (regno) => {
    await deleteDoc(doc(db, "members", regno.toString()));

    messageApi.open({
      type: "success",
      content: "Member successfully removed !",
    });
  };

  const addPoints = async (regno, exist, addVal) => {
    await setDoc(
      doc(db, "members", regno.toString()),
      {
        points: parseInt(exist) + parseInt(addVal),
      },
      { merge: true }
    );

    messageApi.open({
      type: "success",
      content: "Points successfully added !",
    });
  };

  const minusPoints = async (regno, exist, minVal) => {
    await setDoc(
      doc(db, "members", regno.toString()),
      {
        points: parseInt(exist) - parseInt(minVal),
      },
      { merge: true }
    );

    messageApi.open({
      type: "success",
      content: "Points removed successfully !",
    });
  };

  function fetchMembers() {
    const q = query(
      collection(db, "members".toString()),
      orderBy("points", "desc")
    );

    onSnapshot(q, async (querySnapshot) => {
      const members = [];
      querySnapshot.forEach(async (doc) => {
        const member = doc.data();

        members.push({ ...member });
      });

      console.log({ members });

      setdata(members);

      setfetchloading(false);
    });
  }

  const getAdminData = async () => {
    const q = query(collection(db, "admins"), where("mail", "==", user.email));
    const docs = await getDocs(q);

    if (docs.docs.length === 0) {
      setmailerror(true);
      setadminstatus(false);
    } else {
      setAdminData(docs.docs.data);
      setadminstatus(true);
      setmailerror(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    if (user) {
      getAdminData();
    }
  }, [user]);

  return (
    <AppConfig.Provider
      value={{
        adminStatus,
        signOut,
        signInWithGoogle,
        data,
        addingLoad,
        adminData,
        fetchloading,
        mailerror,
        addMember,
        removeMember,
        addPoints,
        minusPoints,
        isLoggingIn,
      }}
    >
      {children}
      {contextHolder}
    </AppConfig.Provider>
  );
};
