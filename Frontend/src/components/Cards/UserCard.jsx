import React from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const UserCard = ({ userInfo, index }) => {
  const cardVariant = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.85,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };
  return (
    <motion.div
      className="user-card p-3 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.015]"
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 12,
        mass: 0.6,
        delay: index * 0.07,
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={userInfo?.profileImageUrl}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-2 border-white object-cover"
        />
        <div>
          <p className="text-sm font-medium">{userInfo?.name}</p>
          <p className="text-xs text-gray-600">{userInfo?.email}</p>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </motion.div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-orange-600 border border-orange-200";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-red-100 text-red-600 border border-red-200";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
    >
      <span className="text-[12px] font-semibold">{count}</span> <br />
      {label}
    </div>
  );
};