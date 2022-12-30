import React, { useContext, useState } from "react";
import { LeaderboardCard } from "./LeaderboardCard";
import { AppConfig } from "../../context/AppConfig";
import { motion } from "framer-motion";
import AutoComplete from "antd/es/auto-complete";
import Spin from "antd/es/spin";

export const LeaderBoard = () => {
  const { data, fetchloading } = useContext(AppConfig);
  const [searchQuery, setSearchQuery] = useState("");

  const options = data.map((e) => ({ value: e.name }));

  const [membersName, setMembersName] = useState([
    { value: "All" },
    ...options,
  ]);

  const onSelect = (data) => {
    setSearchQuery(data);
  };

  const onSearch = (data) => {
    const filteredMembers = options.filter(({ value }) =>
      value.toLowerCase().includes(data.toLowerCase())
    );
    setMembersName(filteredMembers);
  };

  if (fetchloading) return <Spin className="mt-10" size="large" />;

  const filteredMembers = data.filter(({ name }) =>
    searchQuery === "All"
      ? name
      : name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-5">
      <AutoComplete
        options={membersName}
        onSelect={onSelect}
        onSearch={onSearch}
        onClear={() => setSearchQuery("All")}
        placeholder="Search members here"
        allowClear
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredMembers.map((item, k) => (
          <motion.div
            key={item.regno}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <LeaderboardCard {...item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
