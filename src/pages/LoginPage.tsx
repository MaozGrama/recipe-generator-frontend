import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("התחברות בוצעה בהצלחה!");
      navigate("/dashboard");
    } catch (err: any) {
      const serverError = err.response?.data?.error || err.message;
      let toastMessage = "שגיאה בהתחברות";
      if (serverError.includes("Invalid email") || serverError.includes("User not found")) toastMessage = "כתובת האימייל אינה תקינה או לא קיימת.";
      else if (serverError.includes("Invalid password")) toastMessage = "הסיסמה שגויה.";
      else if (serverError.includes("Invalid credentials")) toastMessage = "שם המשתמש או הסיסמה שגויים.";
      toast.error(toastMessage);
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mb-2">ברוכים הבאים</h1>
          <p className="text-neutral-500 font-light">התחבר כדי לגלות מתכונים מדהימים.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center rounded-xl border border-neutral-300 overflow-hidden focus-within:ring-2 focus-within:ring-4ECDC4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow p-3 bg-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-custom-indigo text-neutral-600 px-4 py-3 hover:bg-neutral-300 transition-colors"

              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-FF6B6B text-white font-bold p-3 rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg"
            style={{ backgroundColor: '#EF4444' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            התחבר
          </motion.button>
        </form>
        <p className="mt-6 text-center text-neutral-600">
          אין לך חשבון?{" "}
          <button onClick={() => navigate("/signup")} className="text-4ECDC4 font-semibold hover:text-teal-600">הירשם כאן</button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;