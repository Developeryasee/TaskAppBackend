const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();



// Create Task (required jwt token)

router.post("/", authMiddleware, async (req, res) => {

    try {
        const { title, description } = req.body;

        const userId = req.user.id; // Extract user ID from token

        if (!title) return res.status(400).json({ message: "Title is required" });

        // Create new task
        const newTask = new Task({ title, description, user: userId });
        await newTask.save();

        res.status(200).json({ message: "Task created", task: newTask })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from token
        
        const user = await User.findById(userId).select('-password');
        const tasks = await Task.find({ user: userId });

        res.status(200).json({ user, tasks: tasks.length > 0 ? tasks : [] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from token
        const taskId = req.params.id;

        const tasks = await Task.findOne({ user: userId, _id: taskId });
        if (!tasks) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from token
        const taskId = req.params.id;
        const { title, description } = req.body;

        const tasks = await Task.findOne({ user: userId, _id: taskId });
        if (!tasks) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (title) tasks.title = title;
        if (description) tasks.description = description;

        await tasks.save();

        res.status(200).json({ message: "Task updated successfully", tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params; 
      const userId = req.user.id;
      const task = await Task.findOne({ _id: id, user: userId });
  
      if (!task) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
  
      await Task.deleteOne({ _id: id }); 
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })  
module.exports = router;