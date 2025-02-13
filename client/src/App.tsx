import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { gapi } from 'gapi-script';
import { useEffect } from "react";
import Login from "./pages/Login";



const App = () => {
  const gci = "517464061253-d8u4o5dv4na2ibe4ia0a2tvh64rfbr5t.apps.googleusercontent.com";
  const igapi = () => {
    gapi.client.init({
      clientId: gci,
      scope: "",
    });
  }

  useEffect(() => {
    gapi.load("client:auth2", igapi);
  })

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
