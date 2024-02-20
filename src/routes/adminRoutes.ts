import { Router } from "express";
import { User } from "../models/User";
import adminMiddleware from "../middleware/adminMiddleware";

const adminRouter = Router();

// Securing admin endpoints using admin middleware
adminRouter.use(adminMiddleware);

// Delete a user by ID (Admin only)

/*
  Method: DELETE
  Endpoint: /users/{id}
  Returns: 204
  Error Return: Code 500 (Server Error)
*/

adminRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

// Get all users (Admin only)

/*
  Method: GET
  Endpoint: /users
  Returns: 200, users list
  Error Return: Code 500 (Server Error)
*/

adminRouter.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude sensitive information
    });
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

// Update user details by ID (Admin only)

/*
  Method: PUT
  Endpoint: /users/{id}
  Returns: 200
  Error Return: Code 500 (Server Error)
*/

adminRouter.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, fullName, superuser } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.fullName = fullName ?? user.fullName;
    user.superuser = superuser ?? user.superuser;

    await user.save();
    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

export default adminRouter;
