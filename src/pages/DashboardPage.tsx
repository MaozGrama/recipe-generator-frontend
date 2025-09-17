import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

const RecipeCardSkeleton = () => (
  <motion.div
    className="p-4 sm:p-6 bg-slate-100/70 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 animate-pulse" // NEW: Updated styling
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="h-5 sm:h-6 w-3/4 bg-slate-200 rounded-md mb-3 sm:mb-4"></div>
    <div className="h-3 sm:h-4 w-2/5 bg-slate-200 rounded-md mb-2 sm:mb-3"></div>
    <div className="space-y-2 mb-3 sm:mb-4">
      <div className="h-3 w-11/12 bg-slate-100 rounded-md"></div>
      <div className="h-3 w-full bg-slate-100 rounded-md"></div>
      <div className="h-3 w-4/5 bg-slate-100 rounded-md"></div>
    </div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error('יש להתחבר כדי לגשת לדף זה');
      navigate('/');
      return;
    }

    const fetchFavorites = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await axios.get(`${apiUrl}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(response.data.favorites || []);
      } catch (err) {
        toast.error('שגיאה בטעינת המועדפים');
        console.error('Fetch favorites error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  const handleDeleteFavorite = async (recipeTitle: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await axios.delete(`${apiUrl}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { title: recipeTitle } // Send title in request body
      });
      setFavorites(favorites.filter(fav => fav.title !== recipeTitle));
      toast.success('המתכון הוסר מהמועדפים');
    } catch (err) {
      toast.error('שגיאה בהסרת המועדף');
      console.error('Delete favorite error:', err);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gray-600 text-2xl"
        >
          טוען מועדפים...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-neutral-50 py-12" dir="rtl" // NEW: Soft background color
    >
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-neutral-800 mb-8 text-center sm:text-right">המועדפים שלך ⭐️</h1>
        {favorites.length === 0 ? (
          <div className="text-center p-8 border border-neutral-200 rounded-xl bg-white shadow-sm">
            <p className="text-neutral-600 text-lg">אין מתכונים מועדפים עדיין.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* NEW: Grid layout for better display */}
            <AnimatePresence>
              {favorites.map((recipe, index) => (
                <motion.li
                  key={recipe.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-100 flex flex-col items-start space-y-4" // NEW: Card styling
                >
                  <div className="w-full">
                    <h3 className="font-bold text-xl text-neutral-900 mb-2">{recipe.title}</h3>
                    <p className="text-sm text-neutral-600 mb-2">
                      <span className="font-semibold">מצרכים:</span> {recipe.ingredients.join(', ')}
                    </p>
                    <p className="text-sm text-neutral-600">
                      <span className="font-semibold">הוראות:</span> {recipe.instructions.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFavorite(recipe.title)}
                    className="w-full px-4 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors duration-200" // NEW: Destructive button styling
                  >
                    מחק
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        <div className="mt-12 text-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition duration-200" // NEW: Primary button styling
          >
            חזרה לדף הבית
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;