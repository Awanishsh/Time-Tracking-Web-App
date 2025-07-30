
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Tasks from "./Tasks";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("User");
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUsername(decoded.username || "User");
    } catch (err) {
      console.error("Token decode failed", err);
      localStorage.removeItem("token");
      navigate("/");
    }

    loadData();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const loadData = async () => {
    try {
      const config = getAuthConfig();

      const projectRes = await axios.get("/api/v1/project", config);
      const fetchedProjects = projectRes.data;
      setProjects(fetchedProjects);

      const allTasks = [];
      for (const project of fetchedProjects) {
        const taskRes = await axios.get(`/api/v1/tasks/${project._id}`, config);
        allTasks.push(...taskRes.data);
      }
      setTasks(allTasks);
    } catch (err) {
      console.error("Load data failed:", err);
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    if (!newProject.name.trim()) {
      return alert("Project name is required");
    }

    try {
      const config = getAuthConfig();
      await axios.post("/api/v1/project", newProject, config);

      setNewProject({ name: "", description: "" });
      loadData(); 
    } catch (error) {
      console.error("Create project failed:", error.response?.data || error.message);
      alert("Could not create project. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Welcome, {username}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={projects.length} color="blue" />
        <StatCard title="Total Tasks" value={tasks.length} color="green" />
        <StatCard title="This Week (Future)" value="—" color="gray" />
      </div>

      {/* Create Project Form */}
      <form
        onSubmit={handleProjectSubmit}
        className="mt-10 bg-white p-6 rounded shadow-md max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
        <input
          type="text"
          required
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          placeholder="Project Name"
          className="block w-full p-2 mb-4 border rounded"
        />
        <textarea
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          placeholder="Project Description (optional)"
          className="block w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </form>
      
      {/* Navigation Buttons */}
      <div className="mt-10 flex gap-4 justify-center">
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          View Projects
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


function StatCard({ title, value, color }) {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    gray: "text-gray-500",
  }[color];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className={`text-3xl mt-2 ${colorClass}`}>{value}</p>
    </div>
  );
}
