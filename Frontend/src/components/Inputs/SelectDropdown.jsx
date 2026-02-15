import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full text-sm text-black bg-white border border-slate-200 px-3 py-3 rounded-md mt-2 flex justify-between items-center shadow-sm"
      >
        <span className={`${!selectedLabel ? "text-gray-400" : ""}`}>
          {selectedLabel || placeholder}
        </span>

        <LuChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Smooth Animated Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 26,
              mass: 0.8,
            }}
            className="absolute left-0 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg z-20 overflow-hidden"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-150"
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectDropdown;