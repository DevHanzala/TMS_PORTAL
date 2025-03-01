import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import UploadPage from "./Pages/UploadPage";
import ViewDataPage from "./Pages/ViewDataPage";
import RegisterUser from "./Pages/RegisterUser";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AllRegisteredUsers from "./Pages/Allusers";
import UserList from "./Pages/UserList";
import AuthPage from "./Pages/authPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./Store/authStore";

// Layout component to handle conditional rendering of Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const { user, role } = useAuthStore();
  const isAuthPage = location.pathname === "/";

  // Show Navbar and Footer only if not on AuthPage and user is logged in
  return (
    <>
      {!isAuthPage && user && <Navbar />}
      {children}
      {!isAuthPage && user && <Footer />}
    </>
  );
};

// Protected Route component for specific roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role } = useAuthStore();

  if (!user) {
    return <AuthPage />; // Redirect to AuthPage if not logged in
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <div>Access Denied: You do not have permission to view this page.</div>;
  }

  return children;
};

const App = () => {
  const { user, role } = useAuthStore();

  return (
    <Router>
      <Layout>
        <Routes>
          {/* If user is not logged in, show only AuthPage */}
          {!user && <Route path="/" element={<AuthPage />} />}
          {!user && <Route path="*" element={<AuthPage />} />}

          {/* If user is logged in */}
          {user && (
            <>
              {/* Employee can only access ProfilePage */}
              {role === "employee" && (
                <>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/" element={<AuthPage />} />
                  <Route path="*" element={<ProfilePage />} /> {/* Redirect all other paths */}
                </>
              )}

              {/* Employer or HR can access all pages except Profile */}
              {(role === "employer" || role === "HR") && (
                <>
                  <Route
                    path="/uploadfile"
                    element={<ProtectedRoute allowedRoles={["employer", "HR"]}><UploadPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/view"
                    element={<ProtectedRoute allowedRoles={["employer", "HR"]}><ViewDataPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/register"
                    element={<ProtectedRoute allowedRoles={["employer", "HR"]}><RegisterUser /></ProtectedRoute>}
                  />
                  <Route
                    path="/users"
                    element={<ProtectedRoute allowedRoles={["employer", "HR"]}><AllRegisteredUsers /></ProtectedRoute>}
                  />
                  <Route
                    path="/registerusers"
                    element={<ProtectedRoute allowedRoles={["employer", "HR"]}><UserList /></ProtectedRoute>}
                  />
                  <Route path="/" element={<AuthPage />} /> {/* Default route */}
                  <Route path="*" element={<AuthPage />} /> {/* Fallback route */}
                </>
              )}

              {/* Fallback for other roles (e.g., admin) */}
              {role !== "employee" && role !== "employer" && role !== "HR" && (
                <>
                  <Route path="/uploadfile" element={<UploadPage />} />
                  <Route path="/view" element={<ViewDataPage />} />
                  <Route path="/register" element={<RegisterUser />} />
                  <Route path="/users" element={<AllRegisteredUsers />} />
                  <Route path="/registerusers" element={<UserList />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/" element={<ProfilePage />} />
                </>
              )}
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;