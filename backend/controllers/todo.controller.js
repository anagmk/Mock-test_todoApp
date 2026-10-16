import Todo from "../models/todo.model.js";

export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user?.userId || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const newTodo = new Todo({
            userId,
            title,
            description
        });

        await newTodo.save();

        return res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTodos = async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const todos = await Todo.find({ userId });

        return res.status(200).json({ todos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();
        return res.status(200).json({ message: "Todo updated successfully", todo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.status(200).json({ message: "Todo deleted successfully" });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};