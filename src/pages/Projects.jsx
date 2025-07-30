import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

 function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  const loadProjects = async () => {
    const res = await axios.get('/project');
    setProjects(res.data);
  };

  const addProject = async () => {
    if (!form.name.trim()) {
      alert("Project name is required");
      return;
    }

    await axios.post('/project', form);
    setForm({ name: '', description: '' });
    loadProjects();
  };

  const deleteProject = async (id) => {
    await axios.delete(`/project/${id}`);
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          onClick={addProject}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Project List</h3>
        <ul className="divide-y divide-gray-200">
          {projects.map((p) => (
            <li key={p._id} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
              <button
                onClick={() => deleteProject(p._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projects
