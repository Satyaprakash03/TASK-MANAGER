import React, { useContext, useEffect, useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import Infocard from "../../components/Cards/Infocard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#C1121F", "#F6AA1C", "#38B000"];

const pageVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const hoverLift = {
  whileHover: {
    y: -6,
    scale: 1.02,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data = {}) => {
    const taskDistribution = data.taskDistribution || {};
    const taskPriorityLevels = data.taskPriorityLevels || {};

    setPieChartData([
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In Progress", count: taskDistribution.InProgress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels.Medium || 0 },
      { priority: "High", count: taskPriorityLevels.High || 0 },
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA,
      );

      if (response?.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || {});
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <motion.div
        className="card my-5"
        variants={pageVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div className="col-span-3" variants={cardVariant}>
          <h2 className="text-xl md:text-3xl font-medium font-proza">
            {getGreeting()} &nbsp; {user?.name}
          </h2>
          <p className="text-xs mt-2 md:text-[13px]">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-10"
          variants={cardVariant}
        >
          <motion.div {...hoverLift}>
            <Infocard
              label="Total Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.All || 0,
              )}
              color="bg-primary"
            />
          </motion.div>

          <motion.div {...hoverLift}>
            <Infocard
              label="Pending Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Pending || 0,
              )}
              color="bg-[#C1121F]"
            />
          </motion.div>

          <motion.div {...hoverLift}>
            <Infocard
              label="In Progress Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.InProgress || 0,
              )}
              color="bg-[#F6AA1C]"
            />
          </motion.div>

          <motion.div {...hoverLift}>
            <Infocard
              label="Completed Tasks"
              value={addThousandsSeparator(
                dashboardData?.charts?.taskDistribution?.Completed || 0,
              )}
              color="bg-[#38B000]"
            />
          </motion.div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
          <motion.div className="card" variants={cardVariant} {...hoverLift}>
            <h5 className="font-medium">Task Distribution</h5>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </motion.div>

          <motion.div className="card" variants={cardVariant} {...hoverLift}>
            <h5 className="font-medium">Task Priority Level</h5>
            <CustomBarChart data={barChartData} />
          </motion.div>

          {/* Recent Tasks */}
          <motion.div className="md:col-span-2 card" variants={cardVariant}>
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium">Recent Tasks</h5>

              <motion.button
                className="card-btn"
                onClick={onSeeMore}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See All <LuArrowRight className="text-base" />
              </motion.button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
