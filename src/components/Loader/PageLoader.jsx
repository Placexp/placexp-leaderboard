import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="bg-[#4334a7] h-screen w-full grid place-content-center overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ["0%", "0%", "50%", "50%", "0%"],
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0,
        }}
        className="bg-white w-20 h-20"
      />
    </div>
  );
};

export default PageLoader;
