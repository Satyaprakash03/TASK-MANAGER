import React, { useContext, useMemo } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import CharAvatar from "../Cards/CharAvatar";

const containerVariant = {
  hidden: { opacity: 0, x: -25 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.32,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const sideMenuData =
    user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;

  const shouldAnimate = useMemo(() => {
    if (window.__SIDEMENU_ANIMATED) return false;

    const navEntries = performance.getEntriesByType("navigation");
    const isPageLoad =
      navEntries.length === 0 ||
      navEntries[0].type === "navigate" ||
      navEntries[0].type === "reload";

    if (isPageLoad) {
      window.__SIDEMENU_ANIMATED = true; // prevent repeat during SPA navigation
      return true;
    }

    return false;
  }, []);

  const handleClick = (route) => {
    if (route === "logout") {
      localStorage.clear();
      clearUser();
      navigate("/login");
      return;
    }
    navigate(route);
  };

  return (
    <motion.div
      variants={shouldAnimate ? containerVariant : {}}
      initial={shouldAnimate ? "hidden" : false}
      animate="visible"
      className="w-64 h-[calc(100vh-61px)] bg-white shadow-md border-r border-gray-300/60 sticky top-[61px] z-20"
    >
      {/* Profile Section */}
      <motion.div
        variants={shouldAnimate ? itemVariant : {}}
        className="flex flex-col items-center justify-center mb-6 pt-5"
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="rounded-full shadow"
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover bg-slate-200"
            />
          ) : (
            <CharAvatar
              fullName={user?.name || "U"}
              width="w-20"
              height="h-20"
              style="text-2xl"
            />
          )}
        </motion.div>

        {user?.role === "admin" && (
          <motion.div
            initial={shouldAnimate ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
            className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-2"
          >
            Admin
          </motion.div>
        )}

        <h5 className="text-gray-900 font-semibold mt-3">
          {user?.name || "User"}
        </h5>
        <p className="text-[12px] text-gray-600">{user?.email || ""}</p>
      </motion.div>

      {/* Menu Items */}
      <div className="px-2">
        {sideMenuData.map((item) => {
          const isActive = activeMenu === item.label;

          return (
            <motion.button
              key={item.label}
              variants={shouldAnimate ? itemVariant : {}}
              whileHover={{ x: 6, scale: 1.015 }}
              whileTap={{ scale: 0.96 }}
              className={`w-full flex items-center gap-4 text-[15px] font-medium py-3 px-5 mb-1 rounded-lg transition ${
                isActive
                  ? "text-primary bg-blue-50 border-l-4 border-primary shadow-sm"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon
                className={`text-xl ${
                  isActive ? "text-primary" : "text-gray-600"
                }`}
              />
              {item.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SideMenu;