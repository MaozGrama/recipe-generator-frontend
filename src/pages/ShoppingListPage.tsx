import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, CanceledError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ShoppingItem {
  item: string;
  count: number;
  deal?: string;
  dealLink?: string; // Add a link property
  isSearching?: boolean; // Add a loading state for each item
}

const ShoppingListPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!token) {
      toast.error("יש להתחבר כדי לגשת לדף זה");
      navigate("/");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => toast.error("לא ניתן לקבל מיקום. חיפוש ללא מיקום")
      );
    }
    
    const fetchShoppingList = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      try {
        const pantryItemsStr = localStorage.getItem("pantryItems") || "[]";
        const selectedRecipesStr = localStorage.getItem("selectedRecipes") || "[]";
        const shoppingCartStr = localStorage.getItem("shoppingCart") || "[]";
        const pantryItems = JSON.parse(pantryItemsStr);
        const selectedRecipes = JSON.parse(selectedRecipesStr);
        const shoppingCart = JSON.parse(shoppingCartStr);

        if (!Array.isArray(pantryItems) || !Array.isArray(selectedRecipes) || !Array.isArray(shoppingCart)) {
          throw new Error("נתונים לא תקינים ב-localStorage");
        }

        const response = await axios.post(
          `${apiUrl}/api/recipes/shopping-list`,
          {
            pantryItems,
            recipeTitles: selectedRecipes.map((r: any) => r.title),
            additionalItems: shoppingCart,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        const list = Object.entries(response.data.shoppingList).map(([item, count]) => ({
          item,
          count: Number(count),
          isSearching: false, // Initialize searching state
        }));
        setShoppingList(list);
        if (list.length === 0) {
          toast("אין פריטים חסרים ברשימת הקניות", { icon: "ℹ️" });
        }
      } catch (err) {
        const error = err as Error;
        toast.error(`שגיאה בטעינת רשימת הקניות: ${error.message}`);
        console.error("Error fetching shopping list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingList();
  }, [token, navigate]);

  const fetchDeals = async (item: string, signal: AbortSignal) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    setShoppingList(prev => prev.map(i => i.item === item ? { ...i, isSearching: true } : i));
    try {
      const response = await axios.post(
        `${apiUrl}/api/deals`,
        { items: [item], location: location },
        { headers: { Authorization: `Bearer ${token}` }, signal }
      );

      const deals = response.data.deals;
      setShoppingList(prev => prev.map(i => {
        if (i.item === item) {
          const foundDeal = deals[item];
          return {
            ...i,
            deal: foundDeal ? foundDeal.description : "אין מבצעים",
            dealLink: foundDeal ? foundDeal.link : "",
            isSearching: false,
          };
        }
        return i;
      }));
      if (!deals[item]) {
        toast.error(`לא נמצאו מבצעים עבור ${item}`);
      }
    } catch (err: unknown) {
      if (err instanceof CanceledError) {
        return;
      }
      
      console.error("Error fetching deals:", err);
      let errorMessage = "טעינת המבצעים נכשלה.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
      setShoppingList(prev => prev.map(i => i.item === item ? { ...i, isSearching: false } : i));
    }
  };

  const handleDeleteItem = (itemToDelete: string) => {
    const updatedList = shoppingList.filter((item) => item.item !== itemToDelete);
    setShoppingList(updatedList);
    toast.success(`הפריט ${itemToDelete} הוסר בהצלחה מרשימת הקניות!`);
  };

  const handleBackToPantry = () => {
    navigate("/");
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
          טוען רשימת קניות...
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
      className="min-h-screen bg-neutral-50 py-12" dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4">
        <Toaster position="bottom-center" reverseOrder={false} />
        <h1 className="text-4xl font-extrabold text-neutral-800 mb-8 text-center sm:text-right">רשימת הקניות שלך 🛒</h1>
        {shoppingList.length === 0 ? (
          <div className="text-center p-8 border border-neutral-200 rounded-xl bg-white shadow-sm">
            <p className="text-neutral-600 text-lg">אין פריטים ברשימת הקניות.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {shoppingList.map((item, index) => (
                <motion.li
                  key={item.item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0" // NEW: Card styling
                >
                  <div className="flex-1">
                    <span className="text-neutral-800 font-bold text-lg">{item.item} (כמות: {item.count})</span>
                    {item.deal && (
                      <p className="text-neutral-600 text-sm mt-1">
                        מבצע: <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(item.deal)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          {item.deal}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => fetchDeals(item.item, new AbortController().signal)}
                      className={`px-4 py-2 text-white font-semibold rounded-lg transition duration-200 ${
                        item.isSearching ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600" // NEW: Search button styling
                      }`}
                      disabled={item.isSearching}
                    >
                      {item.isSearching ? "מחפש..." : "חפש מבצע"}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.item)}
                      className="px-4 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition duration-200" // NEW: Destructive button styling
                    >
                      מחק
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        <div className="mt-12 text-center">
          <button
            onClick={handleBackToPantry}
            className="px-8 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition duration-200"
          >
            חזרה לדף המתכונים
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShoppingListPage;