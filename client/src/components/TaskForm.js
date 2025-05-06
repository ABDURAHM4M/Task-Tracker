// src/components/TaskForm.js
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import api from "../api";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Submitting task:", title);
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      const { data } = await api.post("/task/create", { title });
      console.log("✅ Task created:", data);
      onCreate(data);
      setTitle("");
    } catch (err) {
      console.error("❌ Error creating task:", err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "An error occurred creating the task"
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="New Task"
        fullWidth
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Add Task
      </Button>
    </Box>
  );
}
