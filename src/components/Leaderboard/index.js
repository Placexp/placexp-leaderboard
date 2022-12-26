import React, { useContext, useState } from "react";
import { LeaderboardCard } from "./LeaderboardCard";
import { AppConfig } from "../../context/AppConfig";
import { Loader } from "../Loader";

export const LeaderBoard = () => {
  const [addMemtoggle, setaddMemToggle] = useState(false);
  const {
    adminStatus,
    removeSuuccess,
    data,
    addingLoad,
    addPointSuucess,
    removePointSuuccess,
    mailerror,
    signInWithGoogle,
    userexisterror,
    addSuucess,
    addMember,
  } = useContext(AppConfig);
  const [addingName, setaddingName] = useState("");
  const [addingRegNo, setAddignRegno] = useState("");

  const commitAddMember = () => {
    if (addingName && addingRegNo) {
      setaddMemToggle(false);
      addMember(addingName, addingRegNo);
    } else {
      alert("Enter valid name and regno !");
    }
  };

  const toggleAddMem = () => {
    setaddMemToggle(!addMemtoggle);
  };
  return (
    <>
      <div className="h-16 bg-[rgba(35,26,102,0.7)] w-full z-50 relative flex items-center justify-between">
        <img src="/assets/placexp.png" className="h-full" />

        <div>
          {!mailerror && !adminStatus && (
            <button
              onClick={signInWithGoogle}
              className="bg-yellow-600 cursor-pointer font-mono text-black font-3xl p-3 rounded-3xl m-3"
            >
              Admin login
            </button>
          )}
          {mailerror && (
            <button className="bg-red-600  font-mono cursor-not-allowed text-black font-3xl p-3 rounded-3xl m-3 z-50 relative ">
              Access Denied
            </button>
          )}
          {!mailerror && adminStatus && (
            <button className="bg-neutral-600  font-mono cursor-not-allowed text-black font-3xl p-3 rounded-3xl m-3 z-50 relative ">
              Logged In
            </button>
          )}
        </div>
      </div>

      {adminStatus && !addMemtoggle && !addingLoad && (
        <button
          className="bg-neutral-700 text-gray-200 p-2 mb-1 w-50 relative"
          onClick={toggleAddMem}
        >
          {" "}
          ADD MEMBERS +{" "}
        </button>
      )}

      {adminStatus && addingLoad && <Loader />}
      {adminStatus && addMemtoggle && !addingLoad && (
        <div className="bg-neutral-900 text-white font-semibold text-xl">
          <div className=" w-50 relative"> Name:- </div>
          <input
            className=" w-50 relative text-black"
            type="text"
            value={addingName}
            onChange={(e) => setaddingName(e.target.value)}
          />
          <div className=" w-50 relative"> RegNo:- </div>
          <input
            className=" w-50 relative text-black"
            type="text"
            value={addingRegNo}
            onChange={(e) => setAddignRegno(e.target.value)}
          />
          <div className=" w-50 relative"> </div>{" "}
          <div>
            {" "}
            <button
              onClick={commitAddMember}
              className="bg-green-700 text-black p-1 w-50 relative"
            >
              ADD
            </button>{" "}
            <button
              className="bg-red-700 text-black p-1 w-50 relative"
              onClick={toggleAddMem}
            >
              CANCEL
            </button>{" "}
          </div>{" "}
        </div>
      )}
      {adminStatus && !addingLoad && userexisterror && (
        <div className="text-red-700 font-semibold font-mono">
          User already exist !
        </div>
      )}
      {adminStatus && !addingLoad && addSuucess && (
        <div className="text-green-700 font-semibold font-mono">
          User added Successfully !
        </div>
      )}
      {adminStatus && removeSuuccess && (
        <div className="bg-green-700  text-black font-medium">
          Member successfully removed !
        </div>
      )}
      {adminStatus && addPointSuucess && (
        <div className="bg-green-700  text-black font-medium">
          Points successfully added !
        </div>
      )}
      {adminStatus && removePointSuuccess && (
        <div className="bg-green-700  text-black font-medium">
          Points removed successfully !
        </div>
      )}
      <div className="w-screen">
        {data.length &&
          data.map((item, k) => {
            return (
              <div key={k}>
                <LeaderboardCard
                  points={item.points}
                  name={item.name}
                  regno={item.regno}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};
