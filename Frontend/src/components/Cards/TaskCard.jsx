import React from "react";
import Progress from "../Progress";
import moment from "moment";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-orange-600 border border-orange-200";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-red-100 text-red-600 border border-yellow-200";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600 border border-red-200";
      case "Medium":
        return "bg-yellow-100 text-orange-600 border border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border border-green-200";
    }
  };
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-300 border border-gray-400/50 cursor-pointer"
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[12px] font-semibold ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status}
        </div>
        <div
          className={`text-[12px] font-semibold ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {priority} Priority
        </div>
      </div>
      <div
        className={`px-4 border-l-[3px] ${status === "In Progress" ? "border-yellow-500" : status === "Completed" ? "border-green-500" : "border-red-500"}`}
      >
        <p className="text-sm font-semibold text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-xs font-medium text-gray-600 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>
        <p className="text-[13px] text-gray-900/80 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount}/{todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-600"> Start Date </label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("DD MMM YYYY")}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-600"> Due Date </label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("DD MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary" />{" "}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;