import React, { useState, useMemo } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const shouldAnimate = useMemo(() => {
    if (window.__NAVBAR_ANIMATED) return false;

    const navEntries = performance.getEntriesByType("navigation");
    const isPageLoad =
      navEntries.length === 0 ||
      navEntries[0].type === "navigate" ||
      navEntries[0].type === "reload";

    if (isPageLoad) {
      window.__NAVBAR_ANIMATED = true;
      return true;
    }

    return false;
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.div
        initial={shouldAnimate ? { y: -60, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex gap-5 bg-white/90 backdrop-blur-md shadow-md shadow-gray-200 border-b border-gray-300/60 py-4 px-7 sticky top-0 z-40"
      >
        {/* Menu Button */}
        <motion.button
          className="block lg:hidden text-black"
          onClick={() => setOpenSideMenu(!openSideMenu)}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {openSideMenu ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <HiOutlineX className="text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <HiOutlineMenu className="text-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Title */}
        <motion.h2
          className="text-4xl font-medium text-black tracking-wide font-cookie"
          initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          Task Manager
        </motion.h2>
      </motion.div>

      {/* Overlay + Side Menu */}
      <AnimatePresence>
        {openSideMenu && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenSideMenu(false)}
            />

            {/* Side Menu */}
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="fixed top-[61px] left-0 bg-white shadow-xl z-40 lg:hidden"
            >
              <SideMenu activeMenu={activeMenu} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;