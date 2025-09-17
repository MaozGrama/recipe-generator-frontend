import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaUserPlus, FaLeaf } from "react-icons/fa";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { toast.error("יש להזין שם משתמש"); return; }
    try {
      await signup(email, password, username);
      toast.success("הרשמה בוצעה בהצלחה!");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "שגיאה בהרשמה";
      if (errorMessage.includes("Invalid email")) toast.error("כתובת האימייל אינה תקינה.");
      else if (errorMessage.includes("Weak password")) toast.error("הסיסמה חלשה מדי.");
      else if (errorMessage.includes("Email already exists")) toast.error("אימייל זה כבר קיים.");
      else toast.error("שגיאה בהרשמה.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-rose-100 font-poppins flex items-center justify-center" dir="rtl">
      <motion.div
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <FaLeaf className="mx-auto text-5xl text-4ECDC4 mb-4 animate-bounce" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mb-2">הרשמה</h1>
          <p className="text-neutral-500 font-light">צור חשבון חדש וצא לדרך!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-neutral-700 font-semibold mb-2">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-4ECDC4 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-semibold mb-2">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-4ECDC4 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-semibold mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-4ECDC4 transition-all"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-FF6B6B text-white font-bold p-3 rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            הירשם
          </motion.button>
        </form>
        <p className="mt-6 text-center text-neutral-600">
          כבר יש לך חשבון?{" "}
          <button onClick={() => navigate("/login")} className="text-4ECDC4 font-semibold hover:text-teal-600">התחבר כאן</button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;