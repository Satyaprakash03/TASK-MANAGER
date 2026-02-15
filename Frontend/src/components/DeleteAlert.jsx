import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-sm font-medium">{content}</p>

      <div className="flex justify-end mt-6 ">
        <motion.button
          type="button"
          className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onDelete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Delete
        </motion.button>
      </div>
    </div>
  );
};

export default DeleteAlert;