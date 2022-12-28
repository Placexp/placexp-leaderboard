import React, { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
import { useAuthState } from "react-firebase-hooks/auth";
import useMessage from "antd/es/message/useMessage";
import { auth, db } from "../lib/firebase";

export const AppConfig = createContext();

export const AppProvider = ({ children }) => {
  const [messageApi, contextHolder] = useMessage();
  const [adminStatus, setadminstatus] = useState(false);
  const [data, setdata] = useState([]);
  const [addingLoad, setAddingLoad] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [fetchloading, setfetchloading] = useState(true);
  const [mailerror, setmailerror] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);

  const signOut = async () => {
    await signOut(auth);
    setadminstatus(false);
  };

  const signInWithGoogle = async () => {
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
    } catch (err) {
      alert(err.message);
    }
  };

  const addMember = async (name, regno) => {
    setAddingLoad(true);
    const q = query(collection(db, "members"), where("regno", "==", regno));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "members", regno.toString()), {
        name: name,
        regno: regno,
        points: 0,
      });

      messageApi.open({
        type: "success",
        content: "User added Successfully !",
      });

      setAddingLoad(false);
    } else {
      messageApi.open({
        type: "error",
        content: "User already exist !",
      });
    }
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

    onSnapshot(q, (querySnapshot) => {
      const members = [];
      querySnapshot.forEach((doc) => {
        members.push(doc.data());
      });

      setdata(members);

      setfetchloading(false);
    });
  }

  useEffect(() => {
    const getAdminData = async () => {
      const q = query(
        collection(db, "admins"),
        where("mail", "==", user.email)
      );
      const docs = await getDocs(q);
      console.log("wssddd", docs.docs.length);
      if (docs.docs.length === 0) {
        setmailerror(true);
        setadminstatus(false);
      } else {
        setAdminData(docs.docs.data);
        setadminstatus(true);
        setmailerror(false);
      }
    };

    fetchMembers();

    if (loading) {
      return;
    }
    if (user) {
      getAdminData();
    }
  }, [user, loading]);

  return (
    <AppConfig.Provider
      value={{
        adminStatus,
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
      }}
    >
      {children}
      {contextHolder}
    </AppConfig.Provider>
  );
};
