import React from "react";
import Layout from "antd/es/layout";
import { Navbar } from "../components/Navbar";

const { Content, Footer } = Layout;

export const PageLayout = ({ children }) => {
  return (
    <Layout className="flex flex-col min-h-screen bg-indigo-400">
      <Navbar />

      <Content className="p-2 sm:p-5 flex flex-col">{children}</Content>

      <Footer className="!bg-indigo-600 !text-white">
        <h1 className="font-semibold text-base">
          PlaceXP ©2023 Created by PlaceXP Team
        </h1>
      </Footer>
    </Layout>
  );
};
