import React, { useContext } from "react";
import { AppConfig } from "../../context/AppConfig";
import { LeaderBoard } from "../Leaderboard";
import PageLoader from "../Loader/PageLoader";

export const Main = () => {
  const { fetchloading } = useContext(AppConfig);

  return (
    <div className="w-screen min-h-screen">
      {fetchloading ? <PageLoader /> : <LeaderBoard />}
    </div>
  );
};
