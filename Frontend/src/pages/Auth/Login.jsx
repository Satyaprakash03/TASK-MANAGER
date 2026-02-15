import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid Email Address");
      return;
    }

    if (!password) {
      setError("Please enter the Password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/user/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message)
        setError(error.response.data.message);
      else setError("An error occurred. Please try again later.");
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center"
      >
        {/* ========== Heading (Main Text) ========== */}
        <motion.h3
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-semibold text-black"
        >
          Welcome Back
        </motion.h3>

        {/* ========== Heading (Sub Text) ========== */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-slate-600 mt-1 mb-6"
        >
          Please enter your details to Login.
        </motion.p>
        
        {/* ========== Login Form ========== */}
        <form onSubmit={handleLogin}>
          {/* ========== Email ========== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="john@example.com"
              type="text"
              label="Email Address"
            />
          </motion.div>

          {/* ========== Password ========== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
          >
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Min 8 characters"
              type="password"
              label="Password"
            />
          </motion.div>

          {/* ========== Error Shake ========== */}
          {error && (
            <motion.p
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: [0, -6, 6, -4, 4, 0], opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="text-red-500 text-xs pb-2.5"
            >
              {error}
            </motion.p>
          )}

          {/* ========== Button ========== */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320 }}
            type="submit"
            className="btn-primary w-full mt-2"
          >
            LOGIN
          </motion.button>

          {/* ========== Signup ========== */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[13px] text-slate-700 mt-4"
          >
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary underline hover:text-primary/80 transition"
              to="/signUp"
            >
              SignUp
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
