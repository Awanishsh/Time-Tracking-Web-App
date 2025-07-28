import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

export default function Tasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  const loadTasks = async () => {
    const res = await axios.get(`/tasks/${projectId}`);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!form.name.trim()) {
      alert('Task name is required');
      return;
    }

    await axios.post('/tasks', { ...form, projectId });
    setForm({ name: '', description: '' });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Task Name"
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
          onClick={addTask}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Task List</h3>
        <ul className="divide-y divide-gray-200">
          {tasks.map((t) => (
            <li key={t._id} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-gray-500">{t.description}</p>
              </div>
              <button
                onClick={() => deleteTask(t._id)}
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
