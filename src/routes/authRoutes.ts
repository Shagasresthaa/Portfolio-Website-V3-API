import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import * as dotenv from "dotenv";

const router = Router();
dotenv.config();

/*
  Method: POST
  Endpoint: /register
  Returns: User
  Error Return: Code 500 (Server Error)
*/

router.post("/register", async (req, res) => {
  const { username, password, email, fullName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      fullName,
    });

    const userResponse = { ...newUser.toJSON(), password: undefined };
    res.json({ user: userResponse });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

/*
  Method: POST
  Endpoint: /login
  Returns: JWT Token
  Error Return: Code 400 (User Not Found Error)
  Error Return: Code 404 (Invalid Credentials Error)
  Error Return: Code 500 (Server Error)
*/

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Include 'isAdmin' in the token based on the 'superuser' field (or similar)
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.superuser,
      },
      process.env.SC_KEYS as jwt.Secret,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
});

export default router;
