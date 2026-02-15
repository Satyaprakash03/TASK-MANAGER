import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <motion.div
        className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1], 
        }}
      >
        <h2 className="text-4xl font-medium text-black font-cookie">
          Task Manager
        </h2>

        {children}
      </motion.div>

      <motion.div
        className="hidden md:flex w-[40vw] h-screen items-center justify-center 
             bg-blue-50 bg-[url('/bg-img.jpg')] bg-cover bg-no-repeat 
             bg-center overflow-hidden p-8"
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      ></motion.div>
    </div>
  );
};

export default AuthLayout;