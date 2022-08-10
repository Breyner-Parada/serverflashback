import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { config } from "../config/index.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ Message: "User doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ Message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      config.secretJWT,
      { expiresIn: "1h" }
    );
    res.status(200).json({ email: existingUser.email, password: existingUser.password, name: existingUser.name, id: existingUser._id, token });
  } catch (error) {
    res.status(500).json({ Message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Message: "User already exists." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ Message: "Password don't match." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      config.secretJWT,
      { expiresIn: "1h" }
    );
    res.status(200).json({ email: result.email, password: result.password, name: result.name, id: result._id, token });
  } catch (error) {
    res.status(500).json({ Message: "Something went wrong" });
  }
};
