import React, { useContext, useState } from "react";
import Layout from "antd/es/layout";
import Button from "antd/es/button";
import { AppConfig } from "../context/AppConfig";
import Modal from "antd/es/modal/Modal";
import Input from "antd/es/input";
import Form from "antd/es/form";

const { Header, Content, Footer } = Layout;

export const PageLayout = ({ children }) => {
  const [addMemtoggle, setaddMemToggle] = useState(false);
  const [addingName, setaddingName] = useState("");
  const [addingRegNo, setAddignRegno] = useState("");

  const { mailerror, signInWithGoogle, adminStatus, addingLoad, addMember } =
    useContext(AppConfig);

  const toggleAddMem = () => {
    setaddMemToggle(!addMemtoggle);
  };

  const commitAddMember = () => {
    if (addingName && addingRegNo) {
      setaddMemToggle(false);
      addMember(addingName, addingRegNo);
    } else {
      alert("Enter valid name and regno !");
    }
  };

  return (
    <>
      <Layout className="flex flex-col min-h-screen bg-[#4334a7]">
        <Header className="!px-5 py-2 !bg-[#4334a7]/80 backdrop-blur-xl sticky top-0 w-full z-50 flex justify-between items-center">
          <img src="/assets/placexp.png" className="h-full rounded-md" />

          <div className="flex gap-2">
            <Button type="primary" onClick={toggleAddMem}>
              ADD MEMBERS
            </Button>

            {!mailerror && !adminStatus && (
              <button
                onClick={signInWithGoogle}
                className="bg-yellow-600 cursor-pointer font-mono text-black font-3xl p-3 rounded-3xl"
              >
                Admin login
              </button>
            )}
            {mailerror && <Button>Access Denied</Button>}
            {!mailerror && adminStatus && <Button danger>Logged In</Button>}
          </div>
        </Header>

        <Content className="p-5 flex flex-col">
          <div className="flex-1">{children}</div>
        </Content>

        <Footer>PlaceXP ©2023 Created by PlaceXP Team</Footer>
      </Layout>

      <Modal
        title={"Add Members"}
        centered
        closable={false}
        open={adminStatus && addMemtoggle && !addingLoad}
        onCancel={toggleAddMem}
        onOk={commitAddMember}
        okText="Add"
        okButtonProps={{ className: "text-black", type: "primary" }}
        cancelButtonProps={{ danger: true }}
      >
        <Form
          name="add-members"
          initialValues={{ remember: true }}
          onFinish={() => {}}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              type="text"
              value={addingName}
              onChange={(e) => setaddingName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Reg no"
            name="regno"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              type="text"
              value={addingRegNo}
              onChange={(e) => setAddignRegno(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
