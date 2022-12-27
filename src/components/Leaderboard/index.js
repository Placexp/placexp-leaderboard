import React, { useContext } from "react";
import { LeaderboardCard } from "./LeaderboardCard";
import { AppConfig } from "../../context/AppConfig";

export const LeaderBoard = () => {
  const { data } = useContext(AppConfig);

  return (
    <div className="grid gap-5  sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {data.length &&
        data.map((item, k) => <LeaderboardCard key={k} {...item} />)}
    </div>
  );
};
