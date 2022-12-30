import React, { useContext, useState } from "react";
import Layout from "antd/es/layout";
import Button from "antd/es/button";
import { AppConfig } from "../context/AppConfig";
import Modal from "antd/es/modal/Modal";
import Input from "antd/es/input";
import Form from "antd/es/form";
import {
  LoginOutlined,
  LogoutOutlined,
  LoadingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { FileUpload } from "./elements/FileUpload";

const { Header } = Layout;

export const Navbar = () => {
  const [addMemtoggle, setaddMemToggle] = useState(false);
  const [addingName, setaddingName] = useState("");
  const [addingRegNo, setAddignRegno] = useState("");
  const [addingProfileImage, setAddingProfileImage] = useState("");
  const {
    mailerror,
    signInWithGoogle,
    signOut,
    adminStatus,
    addingLoad,
    addMember,
    isLoggingIn,
  } = useContext(AppConfig);

  const toggleAddMem = () => {
    setaddMemToggle(!addMemtoggle);
  };

  const commitAddMember = () => {
    if (addingName && addingRegNo && addingProfileImage) {
      setaddMemToggle(false);
      addMember(addingName, addingRegNo, addingProfileImage);
    } else {
      alert("Enter valid name and regno !");
    }
  };

  return (
    <>
      <Header className="!px-5 py-2 !bg-[#4334a7]/70 backdrop-blur-xl sticky top-0 w-full z-50 flex justify-between items-center">
        <img src="/assets/placexp.png" className="h-full rounded-md" />

        <div className="flex gap-2">
          {adminStatus && (
            <Button
              type="primary"
              className="flex items-center"
              icon={<UserAddOutlined className="text-lg sm:text-base" />}
              onClick={toggleAddMem}
            >
              <span className="!hidden sm:!block">ADD MEMBERS</span>
            </Button>
          )}

          {!mailerror && !adminStatus && (
            <Button
              onClick={signInWithGoogle}
              className="bg-green-500 hover:!text-black flex items-center"
              icon={
                isLoggingIn ? (
                  <LoadingOutlined className="text-lg sm:text-base" />
                ) : (
                  <LoginOutlined className="text-lg sm:text-base" />
                )
              }
            >
              <span className="!hidden sm:!block">Admin login</span>
            </Button>
          )}

          {mailerror && <Button>Access Denied</Button>}

          {!mailerror && adminStatus && (
            <Button
              danger
              onClick={signOut}
              className="flex items-center"
              icon={<LogoutOutlined className="text-lg sm:text-base" />}
            >
              <span className="!hidden sm:!block">Logout</span>
            </Button>
          )}
        </div>
      </Header>

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
          className="flex flex-col"
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

          <FileUpload onChange={(file) => setAddingProfileImage(file[0])} />
        </Form>
      </Modal>
    </>
  );
};
