import React, { useContext } from "react";
import { LeaderboardCard } from "./LeaderboardCard";
import { AppConfig } from "../../context/AppConfig";
import { motion } from "framer-motion";

export const LeaderBoard = () => {
  const { data } = useContext(AppConfig);

  return (
    <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {data.map((item, k) => (
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <LeaderboardCard key={k} {...item} />
        </motion.div>
      ))}
    </motion.div>
  );
};
