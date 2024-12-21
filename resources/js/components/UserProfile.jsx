import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FiSettings, FiUser } from "react-icons/fi";
import { Inertia } from "@inertiajs/inertia";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";

const UserProfile = ({ user }) => {
  const { currentColor, handleReset, currentMode, setMode } = useStateContext();
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleLogout = () => {
    setLoading(true); 
    Inertia.post("/logout", {}, {
      onSuccess: () => {
        window.location.href = "/login"; 
      },
      onError: (error) => {
        setLoading(false); 
      },
    });
  };

  const handleEditProfile = () => {
    Inertia.visit("/profile/edit"); 
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
          className="text-xl text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
          onClick={handleReset}
          aria-label="Close"
        >
          <MdOutlineCancel />
        </button>
      </div>

      {/* User Information */}
      <div className="flex gap-5 items-center border-b border-color pb-6">
        <img className="rounded-full h-24 w-24" src={user?.avatar || avatar} alt="User profile" />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">{user?.name || "Michael Roberts"}</p>
          <p className="text-gray-500 text-sm dark:text-gray-400">{user?.role || "Administrator"}</p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">{user?.email || "info@shop.com"}</p>
        </div>
      </div>

      {/* My Profile Section */}
      <div
        className="flex gap-5 p-4 hover:bg-light-gray cursor-pointer dark:hover:bg-[#42464D] border-b border-color"
        onClick={handleEditProfile}
        aria-label="Edit Profile"
      >
        <button
          type="button"
          className="text-xl rounded-lg p-3 hover:bg-light-gray"
          aria-label="Profile Icon"
        >
          <FiUser />
        </button>
        <div>
          <p className="font-semibold dark:text-gray-200">My Profile</p>
          <p className="text-gray-500 text-sm dark:text-gray-400">Account Setting</p>
        </div>
      </div>

      {/* Theme Settings Section */}
      <div className="p-4 border-b border-color">
        <div className="flex gap-5 items-center">
          <button
            type="button"
            className="text-xl rounded-lg p-3 hover:bg-light-gray"
            aria-label="Theme Settings Icon"
          >
            <FiSettings />
          </button>
          <div>
            <p className="font-semibold dark:text-gray-200 mb-2">Theme Settings</p>
            <div className="mt-4">
              <input
                type="radio"
                id="light"
                name="theme"
                value="Light"
                className="cursor-pointer"
                checked={currentMode === "Light"}
                onChange={(e) => setMode(e)}
                aria-label="Light Mode"
              />
              <label
                htmlFor="light"
                className="ml-2 text-md cursor-pointer dark:text-gray-200"
              >
                Light
              </label>
            </div>
            <div className="mt-4">
              <input
                type="radio"
                id="dark"
                name="theme"
                value="Dark"
                className="cursor-pointer"
                checked={currentMode === "Dark"}
                onChange={(e) => setMode(e)}
                aria-label="Dark Mode"
              />
              <label
                htmlFor="dark"
                className="ml-2 text-md cursor-pointer dark:text-gray-200"
              >
                Dark
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-5">
        <button
          type="button"
          className={`w-full py-2 rounded-md text-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ backgroundColor: currentColor }}
          onClick={handleLogout}
          disabled={loading} 
          aria-label="Logout"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
