import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

interface Props {
  pantryItems: string[];
}

const RecipeCardSkeleton = () => (
  <motion.div
    className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100/50 animate-pulse"
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

const RecipeSuggestions: React.FC<Props> = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleRecipeSelect = (index: number) => {
    setSelectedRecipeIndex(selectedRecipeIndex === index ? null : index);
  };

  const fetchRecipes = async () => {
    if (pantryItems.length === 0) return;
    setLoading(true);
    setError(null);
    setSelectedRecipeIndex(null);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pantryItems }),
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
      } else {
        setError(data.error || "לא ניתן לטעון מתכונים.");
        setRecipes([]);
      }
    } catch (err: any) {
      setError(err.message || "שגיאה בטעינת המתכונים.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [pantryItems]);

  return (
    <div className="mt-6 sm:mt-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-3 sm:p-4 mb-6 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 rounded-xl text-center font-medium text-sm sm:text-base"
        >
          <p><strong>אופס, משהו השתבש:</strong> {error}</p>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {recipes.map((recipe, i) => (
              <motion.div
                key={i}
                layout
                onClick={() => handleRecipeSelect(i)}
                className={`p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border cursor-pointer transition-all duration-300
                  ${selectedRecipeIndex === i ? "border-blue-300 shadow-lg scale-[1.02]" : "border-gray-100/50 hover:shadow-lg hover:scale-[1.01]"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.h2 layout className="text-lg sm:text-xl font-bold text-gray-800 mb-3 tracking-tight">
                  {recipe.title}
                </motion.h2>
                <AnimatePresence>
                  {selectedRecipeIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100/50"
                    >
                      <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">מצרכים:</h3>
                      <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 space-y-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">הוראות:</h3>
                      <ol className="list-decimal list-inside text-gray-600 text-xs sm:text-sm space-y-1">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
