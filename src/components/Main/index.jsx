import React from "react";
import { PageLayout } from "../../layouts/PageLayout";
import { LeaderBoard } from "../Leaderboard";

export const Main = () => {
  return <PageLayout children={<LeaderBoard />} />;
};
