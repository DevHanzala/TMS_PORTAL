import React from "react";
import { useAuthStore } from "../Store/authStore"; // Adjust the path to your authStore

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Profile</h1>
      <p><strong>Name:</strong> {user.name || "N/A"}</p> {/* Adjust based on your user object structure */}
      <p><strong>Email:</strong> {user.email || "N/A"}</p>
      <p><strong>Role:</strong> {user.role || "N/A"}</p>
    </div>
  );
};

export default ProfilePage;