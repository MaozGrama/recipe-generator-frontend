import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserPantryInput from "../components/UserPantryInput";
import RecipeSuggestions from "../components/RecipeSuggestions";
import { motion } from "framer-motion";
import { FaUtensils, FaSignOutAlt, FaHeart, FaShoppingBasket, FaUserPlus, FaFire } from "react-icons/fa";

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

const generateRecipes = async (pantryItems: string[], filters: { vegan?: boolean; nonDairy?: boolean; kosher?: boolean }): Promise<Recipe[]> => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  try {
    const response = await axios.post<{ recipes: Recipe[] }>(`${apiUrl}/api/recipes`, { pantryItems, filters }, { headers: { "Content-Type": "application/json" } });
    return response.data.recipes;
  } catch (error) {
    throw new Error((error as Error).message || "Failed to generate recipes");
  }
};

const generateRandomRecipes = async (): Promise<Recipe[]> => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  try {
    const response = await axios.get<{ recipes: Recipe[] }>(`${apiUrl}/api/recipes/random?count=3`);
    return response.data.recipes;
  } catch (error) {
    throw new Error((error as Error).message || "Failed to generate random recipes");
  }
};

const PantryRecipePage: React.FC = () => {
  const { currentUser, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPantry = localStorage.getItem("pantryItems");
    if (savedPantry) {
      const parsedItems = JSON.parse(savedPantry);
      setPantryItems(parsedItems);
    }
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement && e.target.value.trim() && !pantryItems.includes(e.target.value.trim())) {
      const newItems = [...pantryItems, e.target.value.trim()];
      setPantryItems(newItems);
      localStorage.setItem("pantryItems", JSON.stringify(newItems));
      e.target.value = ""; // Clear input
    }
  };

  const handleRemoveItem = (item: string) => {
    const newItems = pantryItems.filter((i) => i !== item);
    setPantryItems(newItems);
    localStorage.setItem("pantryItems", JSON.stringify(newItems));
  };

  const handleGenerateRecipes = async (items: string[], filters: { vegan?: boolean; nonDairy?: boolean; kosher?: boolean }) => {
    if (items.length === 0) {
      toast.error("אנא הוסף לפחות מצרך אחד.");
      return;
    }
    setLoading(true);
    try {
      const generatedRecipes = await generateRecipes(items, filters);
      setRecipes(generatedRecipes);
    } catch (err: any) {
      toast.error(err.message || "שגיאה ביצירת המתכונים.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRandomRecipes = async () => {
    setLoading(true);
    try {
      const randomRecipes = await generateRandomRecipes();
      setRecipes(randomRecipes);
      setPantryItems([]);
      localStorage.removeItem("pantryItems");
    } catch (err: any) {
      toast.error(err.message || "שגיאה ביצירת המתכונים האקראיים.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!token) return;
    try {
      await logout();
      toast.success("התנתקת בהצלחה!");
      navigate("/");
    } catch (err) {
      toast.error("שגיאה בהתנתקות");
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
      <motion.div className="text-4xl text-indigo-200 font-bold animate-spin"><FaFire /></motion.div>
    </div>
  );

  return (
    <div className="w-full mx-auto px-2 sm:px-4 md:px-6 pt-16 sm:pt-20 pb-6" dir="rtl">
      <Toaster position="bottom-center" />
      <nav className="fixed w-full top-0 z-20 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="w-full mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 space-x-reverse mb-2 sm:mb-0">
            <FaFire className="text-emerald-700 text-xl sm:text-2xl" />
            <span className="font-extrabold text-xl sm:text-2xl text-emerald-700 tracking-tight">Recip.AI</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 space-x-reverse">
            {token ? (
              <>
                <motion.button
                  onClick={() => navigate("/shopping-list")}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-indigo-200 text-white hover:bg-emerald-300 transition-colors font-medium rounded-md sm:rounded-lg shadow-lg justify-center text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
                  style={{ backgroundColor: '#4B5EAA' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingBasket className="text-lg sm:text-xl" /> <span>רשימת קניות</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-indigo-400 text-white hover:bg-red-200 transition-colors font-medium rounded-md sm:rounded-lg shadow-lg justify-center text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
                  style={{ backgroundColor: '#10B981' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHeart className="text-lg sm:text-xl" /> <span>מועדפים</span>
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-red-200 text-white hover:bg-red-200 transition-colors font-medium rounded-md sm:rounded-lg shadow-lg justify-center text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
                  style={{ backgroundColor: '#EF4444' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt className="text-lg sm:text-xl" /> <span>התנתק</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-indigo-200 text-white hover:bg-emerald-400 transition-colors font-medium rounded-md sm:rounded-lg shadow-lg justify-center text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
                  style={{ backgroundColor: '#4B5EAA' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUtensils className="text-lg sm:text-xl" /> <span>התחבר</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-indigo-200 text-white hover:bg-emerald-400 transition-colors font-medium rounded-md sm:rounded-lg shadow-lg justify-center text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
                  style={{ backgroundColor: '#4B5EAA' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUserPlus className="text-lg sm:text-xl" /> <span>הירשם</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </nav>

      {currentUser && (
        <div className="text-center mb-4 sm:mb-8">
          <span className="bg-emerald-100/20 text-emerald-400 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold shadow-inner text-sm sm:text-base">
            <FaFire className="inline-block mr-1 sm:mr-2" /> מחובר כ- {currentUser.username}
          </span>
        </div>
      )}
      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-red-400 mb-4 sm:mb-6 tracking-wide text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        מחולל מתכונים <span className="text-emerald-300">🔥</span>
      </motion.h1>
      <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-xl sm:max-w-2xl mx-auto mb-4 sm:mb-6 font-light text-center">
        בחר מצרכים וקבל מתכונים מותאמים אישית!
      </p>

      <div className="grid grid-cols-1 gap-4 mt-4 sm:mt-6">
        <div className="text-center">
          <UserPantryInput
            setPantryItems={setPantryItems}
            onGenerateRecipes={handleGenerateRecipes}
            onGenerateRandomRecipes={handleGenerateRandomRecipes}
            loading={loading}
          />
        </div>
        <div className="text-center">
          <RecipeSuggestions pantryItems={pantryItems} recipes={recipes} loading={loading} token={token} />
        </div>
      </div>
    </div>
  );
};

export default PantryRecipePage;