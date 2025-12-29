import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bird, Mail, Lock, User, Heart, Stethoscope } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState("user"); // "user" or "therapist"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      // Login: Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("aurawell_users") || "[]");
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Set current user
        localStorage.setItem("aurawell_current_user", JSON.stringify(user));
        navigate(createPageUrl("Dashboard"));
      } else {
        setErrors({ email: "Invalid email or password" });
      }
    } else {
      // Sign up: Create new user
      const users = JSON.parse(localStorage.getItem("aurawell_users") || "[]");

      // Check if email already exists
      if (users.some((u) => u.email === formData.email)) {
        setErrors({ email: "Email already registered" });
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: accountType, // "user" or "therapist"
        verification_status: accountType === "therapist" ? "pending" : "verified",
        onboardingComplete: accountType === "user", // Regular users skip onboarding
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("aurawell_users", JSON.stringify(users));
      localStorage.setItem("aurawell_current_user", JSON.stringify(newUser));

      // Navigate based on account type
      if (accountType === "therapist") {
        // Redirect to therapist onboarding
        navigate(createPageUrl("TherapistOnboarding"));
      } else {
        navigate(createPageUrl("Dashboard"));
      }
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg"
          >
            <Bird className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">AuraWell</h1>
          <p className="text-gray-600">Your journey to wellness begins here</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => !isLogin && switchMode()}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  isLogin
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => isLogin && switchMode()}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  !isLogin
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <>
                    <motion.div
                      key="accountType"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAccountType("user")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            accountType === "user"
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" style={{ color: accountType === "user" ? "#5C4B99" : "#9CA3AF" }} />
                          <p className={`text-sm font-medium ${accountType === "user" ? "text-purple-700" : "text-gray-600"}`}>
                            User
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountType("therapist")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            accountType === "therapist"
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Stethoscope className="w-6 h-6 mx-auto mb-2" style={{ color: accountType === "therapist" ? "#5C4B99" : "#9CA3AF" }} />
                          <p className={`text-sm font-medium ${accountType === "therapist" ? "text-purple-700" : "text-gray-600"}`}>
                            Therapist
                          </p>
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="pl-10"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-white"
                style={{ backgroundColor: "#5C4B99" }}
              >
                {isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            {/* Footer Message */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={switchMode}
                  className="font-medium hover:underline"
                  style={{ color: "#5C4B99" }}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 flex items-center justify-center gap-2 text-gray-600"
        >
          <Heart className="w-4 h-4" style={{ color: "#5C4B99" }} />
          <p className="text-sm">Take the first step towards inner peace</p>
        </motion.div>
      </motion.div>
    </div>
  );
}