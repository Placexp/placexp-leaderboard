import Card from "antd/es/card/Card";
import React, { useContext, useState } from "react";
import {
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";

import { AppConfig } from "../../context/AppConfig";

import Popconfirm from "antd/es/popconfirm";
import Tooltip from "antd/es/tooltip";
import Statistic from "antd/es/statistic";
import InputNumber from "antd/es/input-number";
import Modal from "antd/es/modal/Modal";
import useMessage from "antd/es/message/useMessage";
import { motion } from "framer-motion";

export const LeaderboardCard = (props) => {
  const [messageApi, contextHolder] = useMessage();

  const [addingPointLoad, setAddingPointLoad] = useState(false);
  const [removePointloading, setremovePointloading] = useState(false);
  const { removeMember, adminStatus, addPoints, minusPoints } =
    useContext(AppConfig);
  const [removetoggel, setremovetoggle] = useState(false);
  const [addptToggle, setAddPtToggle] = useState(false);

  const [minPtToggle, setMinPtToggle] = useState(false);
  const [addPt, setaddpt] = useState(0);
  const [minPt, setMinPt] = useState(0);

  const actions = [
    <Popconfirm
      placement="top"
      title="Are you sure you want to remove ?"
      onConfirm={commitRemoval}
      onCancel={toggleRemove}
      okText="Yes"
      cancelText="Cancel"
      okButtonProps={{ className: "text-black" }}
      cancelButtonProps={{ danger: true }}
    >
      <Tooltip placement="bottom" title="Delete">
        <DeleteTwoTone
          onClick={toggleRemove}
          style={{ fontSize: "18px" }}
          key="Delete"
        />
      </Tooltip>
    </Popconfirm>,
    <Tooltip placement="bottom" title="Reduce points">
      <MinusCircleTwoTone
        style={{ fontSize: "18px" }}
        onClick={toggleMinPt}
        key="Reduce points"
      />
    </Tooltip>,
    <Tooltip placement="bottom" title="Add points">
      <PlusCircleTwoTone
        style={{ fontSize: "18px" }}
        onClick={toggleAddPt}
        key="Add points"
      />
    </Tooltip>,
  ];

  function toggleMinPt() {
    setMinPtToggle(!minPtToggle);
    setremovetoggle(false);
    setAddPtToggle(false);
  }

  function toggleAddPt() {
    setMinPtToggle(false);
    setAddPtToggle(!addptToggle);
    setremovetoggle(false);
  }

  function toggleRemove() {
    setMinPtToggle(false);
    setremovetoggle(!removetoggel);
    setAddPtToggle(false);
  }

  async function commitAddPt() {
    setAddingPointLoad(true);
    if (addPt > 0) {
      await addPoints(props.regno, props.points, addPt);
      setAddPtToggle(false);
    } else {
      messageApi.open({
        type: "error",
        content: "Enter a number greater than 0!",
      });
    }

    setAddingPointLoad(false);
  }

  async function commitMinPt() {
    setremovePointloading(true);

    console.log({ points: props.points - addPt });

    if (props.points - addPt < 0) {
      messageApi.open({
        type: "warning",
        content: `Enter a number greater than 0 and less than ${props.points}`,
      });

      return;
    }

    if (minPt > 0) {
      await minusPoints(props.regno, props.points, minPt);
      setMinPtToggle(false);
    } else {
      messageApi.open({
        type: "error",
        content: "Enter a number greater than 0!",
      });
    }

    setremovePointloading(false);
  }

  async function commitRemoval() {
    await removeMember(props.regno);
    setremovetoggle(false);
  }

  const isAddPointsOpen = adminStatus && addptToggle && !addingPointLoad;
  const isReducePointsOpen = adminStatus && minPtToggle && !removePointloading;

  return (
    <>
      <Card
        className="flex flex-col"
        cover={
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-60 object-fill"
            alt="example"
            src="https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
          />
        }
        actions={adminStatus ? actions : []}
      >
        <motion.div
          initial={{ x: -10 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="grid"
        >
          <h1 className="text-3xl font-bold">{props.name}</h1>
          <h2 className="text-xl font-medium uppercase text-gray-400">
            {props.regno}
          </h2>
        </motion.div>

        <motion.div
          initial={{ x: 10 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="mt-5 w-full flex text-right justify-end"
        >
          <Statistic className="text-xs" value={props.points} suffix="Points" />
        </motion.div>
      </Card>

      <Modal
        title={isAddPointsOpen ? "Add Points" : "Reduce Points"}
        centered
        closable={false}
        open={isAddPointsOpen || isReducePointsOpen}
        onCancel={isAddPointsOpen ? toggleAddPt : toggleMinPt}
        onOk={isAddPointsOpen ? commitAddPt : commitMinPt}
        okText={isAddPointsOpen ? "Add" : "Reduce"}
        okButtonProps={{ className: "text-black", type: "primary" }}
        cancelButtonProps={{ danger: true }}
      >
        <InputNumber
          className="w-full text-lg p-2"
          min={0}
          max={100}
          value={isAddPointsOpen ? addPt : minPt}
          onChange={(e) => {
            if (isAddPointsOpen) setaddpt(e);
            else setMinPt(e);
          }}
        />
      </Modal>

      {contextHolder}
    </>
  );
};
