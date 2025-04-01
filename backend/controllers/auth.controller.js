const { generateTokenAndSetCookie } = require("../lib/utils/generateToken.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const signup = async (req, res) => {
  // implement signup logic here
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already taken",
      });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already taken",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });

      //   return res.status(201).json({
      //     message: "User created successfully",
      //   });
    } else {
      return res.status(400).json({
        error: "Failed to create user",
      });
    }
  } catch (error) {
    console.log("Error in sign up Controller", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  // implement login logic here
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); // for the error not to crash atleast to compare with a empty string.
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }
    await User.findByIdAndUpdate(user._id, { online: true });
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });

    // return res.status(200).json({
    //   message: "User logged in successfully",
    // });
  } catch (error) {
    console.log("Error in login  Controller", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  // implement logout logic here
  try {
    const user = await User.findById(req.user._id).select("-password");

    await User.findByIdAndUpdate(req.user._id, { online: false });
    res.cookie("jwt", "", { maxAge: 0 });
    // res.clearCookie("jwt");   // this and above both do the same for clearing cookie.
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout  Controller", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe  Controller", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Save token to user record with expiry time (e.g., 1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // 4. Send email with the reset token (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or any other email provider
      auth: {
        user: "DivyeshKakadiyainventyv@gmail.com",
        pass: "blga nulx zkvk ibkw",
      },
      logger: true, // Enable logging
      debug: true, // Enable debugging output
    });

    const resetURL =
      process.env.NODE_ENV === "production"
        ? `${process.env.LIVE_URL}/reset_password?token=${resetToken}`
        : `http://localhost:5173/reset_password?token=${resetToken}`;

        console.log("-------> ,", resetURL);

    const mailOptions = {
      from: "DivyeshKakadiyainventyv@gmail.com", // Ensure this matches your email in the transporter config
      to: user.email,
      subject: "Password Reset Link",
      text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // 5. Return success response
    res.json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("Error in forgotPassword function:", error); // Log the full error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Find user by the reset token
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // 2. Update user's password and clear reset token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword; // Ensure to hash the password!
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  signup,
  forgotPassword,
  resetPassword,
};
