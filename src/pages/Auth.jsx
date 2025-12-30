import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bird, Mail, Lock, User, Heart, Stethoscope } from "lucide-react";
import { createPageUrl } from "@/utils";
import api from "@/api/client";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState("regular"); // "regular" or "therapist"
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
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

    if (!isLogin) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.fullName.trim()) {
        newErrors.fullName = "Name is required";
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await api.login({
          email: formData.email,
          password: formData.password,
        });

        if (response.success && response.user) {
          // Store user data
          localStorage.setItem("aurawell_current_user", JSON.stringify(response.user));

          toast.success("Welcome back!");
          navigate(createPageUrl("Dashboard"));
        }
      } else {
        // Sign up
        const response = await api.signup({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullName: formData.fullName,
          userType: accountType,
        });

        if (response.success && response.user) {
          // Store user data
          localStorage.setItem("aurawell_current_user", JSON.stringify(response.user));

          toast.success("Account created successfully!");

          // Navigate based on account type
          if (accountType === "therapist") {
            navigate(createPageUrl("TherapistOnboarding"));
          } else {
            navigate(createPageUrl("Dashboard"));
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);

      if (error.message.includes("already exists")) {
        setErrors({ email: "Email or username already registered" });
      } else if (error.message.includes("Invalid credentials")) {
        setErrors({ email: "Invalid email or password" });
      } else {
        toast.error(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", fullName: "", email: "", password: "" });
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
                          onClick={() => setAccountType("regular")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            accountType === "regular"
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" style={{ color: accountType === "regular" ? "#5C4B99" : "#9CA3AF" }} />
                          <p className={`text-sm font-medium ${accountType === "regular" ? "text-purple-700" : "text-gray-600"}`}>
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
                      key="username"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          name="username"
                          type="text"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                      )}
                    </motion.div>

                    <motion.div
                      key="fullName"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          name="fullName"
                          type="text"
                          placeholder="Your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </motion.div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            {/* Quick Test Login */}
            {isLogin && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-2">Quick test login:</p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, email: "user@test.com", password: "password123" });
                  }}
                  className="text-xs text-purple-600 hover:text-purple-700 w-full text-center"
                >
                  Use test account (user@test.com / password123)
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
