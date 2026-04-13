import { Navigate, Route, Routes } from "react-router-dom";
import AuthLanding from "./pages/AuthLanding";
import ProtectedRoute from "./components/ProtectedRoute";
import MainDashboard from "./pages/MainDashboard";
import TravelHistory from "./pages/TravelHistory";
import ProfilePage from "./pages/ProfilePage";

const App = () => (
  <Routes>
    <Route path="/" element={<AuthLanding />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/history"
      element={
        <ProtectedRoute>
          <TravelHistory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
