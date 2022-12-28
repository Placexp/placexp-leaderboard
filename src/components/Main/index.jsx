import React, { useContext } from "react";
import { AppConfig } from "../../context/AppConfig";
import { PageLayout } from "../../layouts/PageLayout";
import { LeaderBoard } from "../Leaderboard";
import PageLoader from "../Loader/PageLoader";

export const Main = () => {
  const { fetchloading } = useContext(AppConfig);

  if (fetchloading) return <PageLoader />;
  return (
    <PageLayout>
      <LeaderBoard />
    </PageLayout>
  );
};
