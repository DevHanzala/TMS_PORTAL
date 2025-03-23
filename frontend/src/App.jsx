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
import ExEmployeePage from "./Pages/exEmployeePage";
import { useAuthStore } from "./Store/authStore";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAuthPage = location.pathname === "/";

  return (
    <>
      {!isAuthPage && user && <Navbar />}
      {children}
      {!isAuthPage && user && <Footer />}
    </>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role } = useAuthStore();

  if (!user) {
    return <AuthPage />;
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
          {!user && <Route path="/" element={<AuthPage />} />}
          {!user && <Route path="*" element={<AuthPage />} />}

          {user && (
            <>
              <Route path="/view" element={<ViewDataPage />} />

              {role?.toLowerCase() === "employee" && (
                <>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/" element={<AuthPage />} />
                  <Route path="*" element={<ProfilePage />} />
                </>
              )}

              {(role?.toLowerCase() === "hr") && (
                <>
                  <Route
                    path="/uploadfile"
                    element={<ProtectedRoute allowedRoles={["hr"]}><UploadPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/register"
                    element={<ProtectedRoute allowedRoles={["hr"]}><RegisterUser /></ProtectedRoute>}
                  />
                  <Route
                    path="/users"
                    element={<ProtectedRoute allowedRoles={["hr"]}><AllRegisteredUsers /></ProtectedRoute>}
                  />
                  <Route
                    path="/registerusers"
                    element={<ProtectedRoute allowedRoles={["hr"]}><UserList /></ProtectedRoute>}
                  />
                  <Route path="/" element={<AuthPage />} />
                  <Route path="*" element={<AuthPage />} />
                </>
              )}

              {role?.toLowerCase() === "superadmin" && (
                <>
                  <Route path="/uploadfile" element={<UploadPage />} />
                  <Route path="/register" element={<RegisterUser />} />
                  <Route path="/users" element={<AllRegisteredUsers />} />
                  <Route path="/registerusers" element={<UserList />} />
                  <Route path="/ex-employees" element={<ExEmployeePage />} /> {/* Only Super Admin */}
                  <Route path="/" element={<ProfilePage />} />
                  <Route path="*" element={<ProfilePage />} />
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