import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import moment from "moment";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const pageVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 22, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.32, ease: "easeOut" },
    },
  };

  const defaultTaskState = {
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  };

  const [taskData, setTaskData] = useState(defaultTaskState);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData(defaultTaskState);
  };

  // ================= CREATE TASK =================
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully!");
      clearData();
    } catch (err) {
      console.error("Error Creating Task:", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE TASK =================
  const updateTask = async () => {
    setLoading(true);
    try {
      const prevChecklist = currentTask?.todoChecklist || [];

      const todolist = taskData.todoChecklist.map((item) => {
        const matched = prevChecklist.find((t) => t.text === item);
        return {
          text: item,
          completed: matched ? matched.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully!");
      clearData();
    } catch (err) {
      console.error("Error Updating Task:", err);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    setError("");

    if (!taskData.title.trim()) return setError("Title is required.");
    if (!taskData.description.trim())
      return setError("Description is required.");
    if (!taskData.dueDate) return setError("Due Date is required.");
    if (!taskData.assignedTo.length)
      return setError("Task not assigned to any member.");
    if (!taskData.todoChecklist.length)
      return setError("Add at least one TODO task.");

    taskId ? updateTask() : createTask();
  };

  // ================= GET TASK BY ID =================
  const getTaskDetailsById = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId),
      );

      if (!data) return;

      setCurrentTask(data);

      setTaskData({
        title: data.title || "",
        description: data.description || "",
        priority: data.priority || "Low",
        dueDate: data.dueDate ? moment(data.dueDate).format("YYYY-MM-DD") : "",
        assignedTo: data.assignedTo?.map((u) => u._id) || [],
        todoChecklist: data.todoChecklist?.map((t) => t.text) || [],
        attachments: data.attachments || [],
      });
    } catch (err) {
      console.error("Error fetching task:", err);
      toast.error("Failed to load task");
    }
  };

  // ================= DELETE =================
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task Deleted Successfully!");
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    } finally {
      setOpenDeleteAlert(false);
    }
  };

  useEffect(() => {
    if (taskId) getTaskDetailsById();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <motion.div
        className="mt-5"
        variants={pageVariant}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <motion.div className="form-card col-span-3" variants={cardVariant}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 /> Delete
                </button>
              )}
            </div>

            {/* Title */}
            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700">
                Task Title
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Add a Title for your Task."
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mt-3">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                className="form-input"
                placeholder="Add a Description for your Task."
                value={taskData.description}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            {/* Priority + Date + Users */}
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-sm font-medium text-slate-700">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(v) => handleValueChange("priority", v)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-sm font-medium text-slate-700">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-sm font-medium text-slate-700">
                  Assigned To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(v) => handleValueChange("assignedTo", v)}
                />
              </div>
            </div>

            {/* TODO */}
            <div className="mt-3">
              <label className="text-sm font-medium text-slate-700">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(v) => handleValueChange("todoChecklist", v)}
              />
            </div>

            {/* Attachments */}
            <div className="mt-3">
              <label className="text-sm font-medium text-slate-700">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(v) => handleValueChange("attachments", v)}
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-4">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="add-btn"
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
