import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-orange-600 border border-orange-200";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-red-100 text-red-600 border border-yellow-200";
    }
  };

  // Fetch Task
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id),
      );

      if (response?.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    if (!task || !Array.isArray(task.todoChecklist)) return;

    const previousChecklist = task.todoChecklist;

    const updatedChecklist = previousChecklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item,
    );

    setTask((prev) => ({
      ...prev,
      todoChecklist: updatedChecklist,
    }));

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist: updatedChecklist },
      );

      console.log("Checklist API Response:", response.data);

      if (response?.data?.updatedTask) {
        setTask(response.data.updatedTask);
      }
    } catch (error) {
      console.error("Checklist update failed:", error);

      setTask((prev) => ({
        ...prev,
        todoChecklist: previousChecklist,
      }));
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) getTaskDetailsByID();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task ? (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <motion.div
              className="form-card col-span-3"
              initial={{ scale: 0.92, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 12,
                mass: 0.8,
              }}
            >
              {/* Title + Status */}
              <div className="flex items-center justify-between">
                <h2 className="text-md md:text-lg font-medium">
                  {task?.title}
                </h2>

                <div
                  className={`text-[11px] md:text-[12px] font-medium ${getStatusTagColor(
                    task?.status,
                  )} px-4 py-0.5`}
                >
                  {task?.status}
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              {/* Priority / Due / Assigned */}
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("DD MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-sm font-medium text-slate-600">
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((u) => u?.profileImageUrl) || []
                    }
                    maxVisible={7}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="mt-3">
                <label className="text-sm font-medium text-slate-600">
                  Todo Checklist
                </label>

                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {/* Attachments */}
              {task?.attachments?.length > 0 && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-slate-600">
                    Attachments
                  </label>

                  {task.attachments.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-500">Loading task...</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

/* ---------- Components ---------- */

const InfoBox = ({ label, value }) => (
  <>
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
      {value || "N/A"}
    </p>
  </>
);

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <label className="flex items-center gap-3 p-2 cursor-pointer select-none group relative">
      {/* Hidden Native Checkbox */}
      <input
        type="checkbox"
        checked={!!isChecked}
        onChange={onChange}
        className="hidden"
      />

      {/* Ripple Effect */}
      <motion.span
        className="absolute left-2 top-2 w-5 h-5 rounded-full bg-primary/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={isChecked ? { scale: 2.2, opacity: 0 } : {}}
        transition={{ duration: 0.4 }}
      />

      {/* Premium Checkbox */}
      <motion.div
        whileTap={{ scale: 0.85 }}
        animate={{
          scale: isChecked ? 1.1 : 1,
          backgroundColor: isChecked ? "#6366f1" : "#ffffff",
          borderColor: isChecked ? "#6366f1" : "#d1d5db",
          boxShadow: isChecked
            ? "0 0 8px rgba(99,102,241,0.6)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative w-5 h-5 rounded-md border-2 flex items-center justify-center"
      >
        {/* Tick Draw Animation */}
        <motion.svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.polyline
            points="20 6 9 17 4 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isChecked ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>

      {/* Animated Text */}
      <motion.span
        animate={{
          color: isChecked ? "#9ca3af" : "#111827",
        }}
        transition={{ duration: 0.2 }}
        className="text-[13px] relative"
      >
        {text}

        {/* Strike-through animation */}
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isChecked ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 top-1/2 h-[1.5px] w-full bg-gray-400 origin-left"
        />
      </motion.span>
    </label>
  );
};

const Attachment = ({ link, index, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between bg-gray-100 border border-gray-200 px-3 py-2 rounded-md mb-2 cursor-pointer hover:bg-gray-200 transition"
  >
    <div className="flex items-center gap-3 flex-1">
      <span className="text-xs text-gray-500 font-semibold">
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-xs text-black break-all">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-gray-600" />
  </div>
);
