import User from "../models/User.js";
import generateToken from "../config/generateToken.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const editUser = async (req, res) => {
  const { email, isAdmin, isSeller } = req.body;

  if (!req.userId) return res.staus(400).json({ message: "Unauthenticated" });

  const exist = await User.findOne({ email });
  if (!exist) return res.status(404).json({ message: "User not found" });

  const checkAdmin = await User.findById(req.userId);

  if (checkAdmin.isAdmin === false) {
    return res
      .status(403)
      .json({ message: "Only admins are allowed to perform this action" });
  }

  const editedUser = await User.findOneAndUpdate(
    { email: exist.email },
    { isAdmin, isSeller },
    { new: true }
  );

  res.status(200).json(editedUser);
};

export const getUser = async (req, res) => {
  const { email } = req.params;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const Signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(200).json({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isSeller: newUser.isSeller,
      token: generateToken(newUser._id, newUser.email),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const Signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (!exist) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const matchPassword = await exist.matchPassword(password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    res.status(200).json({
      firstName: exist.firstName,
      lastName: exist.lastName,
      email: exist.email,
      mobile: exist.mobile,
      address: exist.address,
      isAdmin: exist.isAdmin,
      isSeller: exist.isSeller,
      token: generateToken(exist._id, exist.email),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.userId;
    const user = req.body;

    if (!req.userId) return res.staus(400).json({ message: "Unauthenticated" });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "No user found" });

    const updateUser = await User.findByIdAndUpdate(id, user, { new: true });

    res.status(200).json({
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      email: updateUser.email,
      mobile: updateUser.mobile || "",
      address: updateUser.address || "",
      token: generateToken(updateUser._id, updateUser.email),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const changePassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (!exist) return res.status(404).json({ message: "User not found" });

    const matchPassword = await exist.matchPassword(password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: exist.email },
      { password: hash },
      { new: true }
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const genereteOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (!exist) {
      return res.status(404).json({ message: "User does not exist" });
    }

    req.app.locals.OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.status(200).json({ email, code: req.app.locals.OTP });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const verifyOTP = (req, res) => {
  const { code } = req.body;
  try {
    if (parseInt(code) === parseInt(req.app.locals.OTP)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;

      return res.status(200).json({
        message: "Verified Successfully",
        flag: req.app.locals.resetSession,
      });
    }

    return res.status(400).json({ message: "Invalid OTP code" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).json({ message: "Session expired" });
    }

    const exist = await User.findOne({ email });
    if (!exist) return res.status(404).json({ message: "User not found" });

    const hash = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email: exist.email },
      { password: hash },
      { new: true }
    );
    req.app.locals.resetSession = false;
    res.status(201).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};
