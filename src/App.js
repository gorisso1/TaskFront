import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartPage from "./pages/StartPage";
import SpotPage from "./pages/SpotPage";
import TaskPage from "./pages/TaskPage";
import CommentPage from "./pages/CommentPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminTaskPage from "./pages/AdminTaskPage";
import AdminTaskListPage from "./pages/AdminTaskListPage";
import ReportPage from "./pages/ReportPage";
import AdminTaskTypePage from "./pages/AdminTaskTypePage";
import AdminTaskOther from "./pages/AdminTaskOther";
import AdminNowPage from "./pages/AdminNowPage";
import AdminEmployee from "./pages/AdminEmployee";
import Plots from "./pages/Plots";
import NotTask from "./pages/notTask";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("authenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  return element;
};

function App() {
  
    return (
      <div className="name">
      
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/spot/:id" element={<SpotPage />} />   
          <Route path="/task/:id/:employeeId" element={<TaskPage />} />  
          <Route path="/comment/:id/:employeeId/:taskId" element={<CommentPage />} />  
          <Route path="/admin-page" element={<ProtectedRoute element={<AdminPage />}/>} /> 
          <Route path="/admin-task-type" element={<ProtectedRoute element={<AdminTaskTypePage/>}/>} />
          <Route path="/admin-task/:type" element={<ProtectedRoute element={<AdminTaskPage/>}/>} />
          <Route path="/admin-task/other" element={<ProtectedRoute element={<AdminTaskOther/>}/>} />
          <Route path="/admin-task-list" element={<ProtectedRoute element={<AdminTaskListPage/>}/>} />
          <Route path="/admin-now-task-list" element={<ProtectedRoute element={<AdminNowPage/>}/>} />
          <Route path="/admin-employee" element={<ProtectedRoute element={<Plots/>}/>} />
          <Route path="/admin-employee/:id" element={<ProtectedRoute element={<AdminEmployee/>}/>} />
          <Route path="/report" element={<ProtectedRoute element={<ReportPage/>}/>} />
          <Route path="/notTask" element={<ProtectedRoute element={<NotTask/>}/>} />

        </Routes>


      </Router>
      </div>
    );
}

export default App;