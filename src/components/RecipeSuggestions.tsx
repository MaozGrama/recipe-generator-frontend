import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast"; // Removed Toaster (move to App.tsx)

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  rating?: number;
}

interface Props {
  pantryItems: string[];
  recipes: Recipe[];
  loading: boolean;
  token?: string | null;
}

const RecipeCardSkeleton = () => (
  <motion.div
    className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100/50 animate-pulse"
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} // Fallback background
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded-md mb-3 sm:mb-4"></div>
    <div className="h-3 sm:h-4 w-2/5 bg-gray-200 rounded-md mb-2 sm:mb-3"></div>
    <div className="space-y-2 mb-3 sm:mb-4">
      <div className="h-3 w-11/12 bg-gray-100 rounded-md"></div>
      <div className="h-3 w-full bg-gray-100 rounded-md"></div>
      <div className="h-3 w-4/5 bg-gray-100 rounded-md"></div>
    </div>
  </motion.div>
);

const RecipeSuggestions: React.FC<Props> = ({ pantryItems, recipes, loading, token }) => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(null);
  const [shoppingCart, setShoppingCart] = useState<string[]>(() => {
    const savedCart = localStorage.getItem("shoppingCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [ratings, setRatings] = useState<{ [key: string]: number }>(() => {
    const savedRatings = localStorage.getItem("recipeRatings");
    return savedRatings ? JSON.parse(savedRatings) : {};
  });
  const toastShown = useRef<{ [key: string]: boolean }>({});

  const showToast = (message: string, type: "success" | "error" | "info", id: string, options?: { icon?: string }) => {
    if (!toastShown.current[id]) {
      toastShown.current[id] = true;
      let toastId: string;
      switch (type) {
        case "success":
          toastId = toast.success(message, options);
          break;
        case "error":
          toastId = toast.error(message, options);
          break;
        case "info":
          toastId = toast(message, options);
          break;
      }
      setTimeout(() => {
        toastShown.current[id] = false;
      }, 3000);
    }
  };

  const handleRecipeSelect = (index: number) => {
    setSelectedRecipeIndex(selectedRecipeIndex === index ? null : index);
  };

  const handleCloseModal = () => {
    setSelectedRecipeIndex(null);
  };

  const handleFavorite = async (recipe: Recipe) => {
    if (!token) {
      showToast("יש להתחבר כדי להוסיף למועדפים", "error", "noTokenFavorite");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      await axios.post(`${apiUrl}/api/favorites`, recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("המתכון נוסף למועדפים בהצלחה!", "success", "favoriteSuccess");
    } catch (err) {
      const error = err as AxiosError;
      showToast("נכשל בהוספת המועדף", "error", "favoriteError");
      console.error("Favorite error:", error);
    }
  };

  const handleAddToCart = (ingredient: string) => {
    if (!shoppingCart.includes(ingredient)) {
      const newCart = [...shoppingCart, ingredient];
      setShoppingCart(newCart);
      localStorage.setItem("shoppingCart", JSON.stringify(newCart));
      showToast(`${ingredient} נוסף לעגלת הקניות!`, "success", `addToCart_${ingredient}`);
    }
  };

  const handleRate = async (recipe: Recipe, rating: number) => {
    if (!token) {
      showToast("יש להתחבר כדי לדרג מתכונים", "error", "noTokenRate");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      await axios.post(`${apiUrl}/api/ratings`, { recipeTitle: recipe.title, rating }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newRatings = { ...ratings, [recipe.title]: rating };
      setRatings(newRatings);
      localStorage.setItem("recipeRatings", JSON.stringify(newRatings));
      showToast("הדירוג נשמר בהצלחה!", "success", `rateSuccess_${recipe.title}`);
    } catch (err) {
      const error = err as AxiosError;
      showToast("שגיאה בשמירת הדירוג", "error", `rateError_${recipe.title}`);
      console.error("Rating error:", error);
      if (error.response) console.log("Response data:", error.response.data);
    }
  };

  const handleOpenShoppingList = async () => {
    if (!token) {
      showToast("יש להתחבר כדי לראות את רשימת הקניות", "error", "noTokenShopping");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const selectedRecipes = selectedRecipeIndex !== null ? [recipes[selectedRecipeIndex]] : recipes;
    const recipeTitles = selectedRecipes.map((r) => r.title);
    console.log("Request Data:", { pantryItems, recipeTitles, additionalItems: shoppingCart });

    try {
      const response = await axios.post(
        `${apiUrl}/api/recipes/shopping-list`,
        {
          pantryItems,
          recipeTitles,
          additionalItems: shoppingCart,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API Response:", response.data);
      if (Object.keys(response.data.shoppingList).length > 0) {
        window.location.href = "/shopping-list";
      } else {
        showToast("אין פריטים חסרים ברשימת הקניות", "info", "emptyShoppingList", { icon: "ℹ️" });
      }
    } catch (err) {
      const error = err as AxiosError;
      showToast("שגיאה בטעינת רשימת הקניות", "error", "shoppingListError");
      console.error("Shopping list error:", err);
    }
  };

  const renderStars = (recipe: Recipe) => {
    const currentRating = ratings[recipe.title] || recipe.rating || 0;
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => handleRate(recipe, star)}
        style={{ cursor: "pointer", color: star <= currentRating ? "#ffd700" : "#d3d3d3", fontSize: "1.2em" }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="mt-4 relative" dir="rtl">
      <div className="fixed top-4 right-4 z-50">
        <div className="relative inline-block">
          <button
            onClick={() => {/* No-op to prevent closing, handled by dropdown */}}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            🛒 ({shoppingCart.length})
          </button>
          {shoppingCart.length > 0 && (
            <div className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-lg p-4 z-10 mt-2">
              <h3 className="text-lg font-bold mb-2">עגלת הקניות</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {shoppingCart.map((item, index) => (
                  <li key={index} className="text-sm flex justify-between items-center">
                    {item}
                    <button
                      onClick={() => {
                        const newCart = shoppingCart.filter((i) => i !== item);
                        setShoppingCart(newCart);
                        localStorage.setItem("shoppingCart", JSON.stringify(newCart));
                        showToast(`${item} הוסר מהעגלה`, "success", `removeFromCart_${item}`);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                    >
                      מחק
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 place-items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 place-items-center">
          <AnimatePresence>
            {recipes.map((recipe, i) => (
              <motion.div
                key={i}
                layout
                onClick={() => handleRecipeSelect(i)}
                className={`p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border cursor-pointer transition-all duration-300
                  ${selectedRecipeIndex === i ? "border-blue-300 shadow-lg scale-[1.02]" : "border-gray-100/50 hover:shadow-lg hover:scale-[1.01]"}`}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} // Fallback background
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.h2 layout className="text-lg sm:text-xl font-bold text-gray-800 mb-3 tracking-tight">
                  {recipe.title}
                </motion.h2>
                <div className="mb-3">{renderStars(recipe)}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedRecipeIndex !== null && recipes[selectedRecipeIndex] && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 sm:mx-6 relative overflow-y-auto max-h-[80vh]"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} // Fallback background
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{recipes[selectedRecipeIndex].title}</h2>
              <motion.button
                onClick={(e) => { e.stopPropagation(); handleFavorite(recipes[selectedRecipeIndex]); }}
                className="mb-4 px-4 py-2 bg-custom-indigo text-white hover:bg-custom-emerald transition-colors font-medium rounded-lg shadow-lg"
                style={{ backgroundColor: '#4B5EAA' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                הוסף למועדפים
              </motion.button>
              <div className="mb-4">{renderStars(recipes[selectedRecipeIndex])}</div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">מצרכים:</h3>
              <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm mb-4 space-y-1">
                {recipes[selectedRecipeIndex].ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{ing}</span>
                    {!pantryItems.includes(ing) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(ing); }}
                        className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                      >
                        הוסף לעגלה
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">הוראות:</h3>
              <ol className="list-decimal list-inside text-gray-600 text-xs sm:text-sm space-y-1">
                {recipes[selectedRecipeIndex].instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              {token && (
                <motion.button
                  onClick={(e) => { e.stopPropagation(); handleOpenShoppingList(); }}
                  className="mt-4 px-4 py-2 bg-custom-emerald text-white hover:bg-teal-600 transition-colors font-medium rounded-lg shadow-lg"
                  style={{ backgroundColor: '#10B981' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  לרשימת קניות
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeSuggestions;