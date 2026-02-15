import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your Full Name");
      return;
    }

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
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
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
        className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center"
      >
        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-semibold text-black"
        >
          Create an Account
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-slate-600 mt-1 mb-6"
        >
          Join us today by entering your details below.
        </motion.p>

        <form onSubmit={handleSignUp}>
          {/* Profile Photo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 180 }}
          >
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </motion.div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              <Input
                key="name"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                placeholder="John Doe"
                type="text"
                label="Full Name"
              />,
              <Input
                key="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="john@example.com"
                type="text"
                label="Email Address"
              />,
              <Input
                key="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Min 8 characters"
                type="password"
                label="Password"
              />,
              <Input
                key="token"
                value={adminInviteToken}
                onChange={({ target }) => setAdminInviteToken(target.value)}
                placeholder="6 Digit Code"
                type="text"
                label="Admin Invite Token"
              />,
            ].map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                {field}
              </motion.div>
            ))}
          </div>

          {/* Error Shake */}
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

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320 }}
            type="submit"
            className="btn-primary w-full mt-2"
          >
            CREATE ACCOUNT
          </motion.button>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-[13px] text-slate-700 mt-4"
          >
            Already have an account?{" "}
            <Link
              className="font-medium text-primary underline hover:text-primary/80 transition"
              to="/login"
            >
              Login
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default SignUp;
