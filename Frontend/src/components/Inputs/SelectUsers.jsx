import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";

const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // ================= FETCH USERS =================
  const getAllUsers = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (Array.isArray(data)) {
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Error Fetching Users:", err);
    }
  };

  // ================= TOGGLE USER =================
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // ================= ASSIGN =================
  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  // ================= OPEN MODAL =================
  const openModal = () => {
    setTempSelectedUsers(selectedUsers || []);
    setIsModalOpen(true);
  };

  // ================= AVATARS =================
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl)
    .filter(Boolean);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="space-y-4 mt-2">
      {/* Add Members Button */}
      {selectedUserAvatars.length === 0 ? (
        <button className="card-btn" onClick={openModal}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      ) : (
        <div className="cursor-pointer" onClick={openModal}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      {/* ================= MODAL ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => {
            const avatar =
              user.profileImageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name,
              )}&background=random`;

            return (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 border-b border-gray-200"
              >
                <img
                  src={avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-[13px] text-gray-500">{user.email}</p>
                </div>

                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-[12px] font-medium text-gray-700 hover:text-red-500 bg-gray-50 hover:bg-red-100 px-4 py-1.5 rounded-lg border border-gray-200/50 cursor-pointer transition-all duration-300"
          >
            CANCEL
          </button>

          <button onClick={handleAssign} className="card-btn">
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;