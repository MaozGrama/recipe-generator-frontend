import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaUtensils, FaSpinner, FaFilter, FaPepperHot, FaCarrot, FaTrashAlt } from 'react-icons/fa';

interface Props {
  setPantryItems: (items: string[]) => void;
  onGenerateRecipes: (items: string[], filters: { vegan?: boolean; nonDairy?: boolean; kosher?: boolean }) => void;
  onGenerateRandomRecipes: () => void;
  loading: boolean;
}

const UserPantryInput: React.FC<Props> = ({ setPantryItems, onGenerateRecipes, onGenerateRandomRecipes, loading }) => {
  const [input, setInput] = useState("");
  const [localPantryItems, setLocalPantryItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({ vegan: false, nonDairy: false, kosher: false });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    const newItems = input.split(",").map((item) => item.trim()).filter(Boolean);
    const updatedItems = [...new Set([...localPantryItems, ...newItems])];
    setLocalPantryItems(updatedItems);
    setInput("");
  };

  const handleRemoveItem = (itemToRemove: string) => {
    const updatedItems = localPantryItems.filter((item) => item !== itemToRemove);
    setLocalPantryItems(updatedItems);
  };

  const handleGenerateClick = () => {
    onGenerateRecipes(localPantryItems, filters);
    setPantryItems(localPantryItems);
  };

  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  return (
    <motion.div
      className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200 mx-auto max-w-2xl w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
        <FaUtensils className="text-teal-600" />
        הזן את המצרכים שלך
      </h2>
      <p className="text-neutral-500 mb-4">הכנס פריטים בודדים או רשימה מופרדת בפסיקים.</p>
      <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="לדוגמה: חלב, קמח, ביצים"
          className="flex-1 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <FaPlus />
          <span>הוסף</span>
        </button>
      </form>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-2 flex items-center gap-2">
          <FaFilter className="text-indigo-600" />
          סננים:
        </h3>
        
        <div className="flex flex-wrap gap-4">
          {["vegan", "nonDairy", "kosher"].map((filter) => (
            <label key={filter} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters[filter as keyof typeof filters]}
                onChange={() => handleFilterChange(filter as keyof typeof filters)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-neutral-700 capitalize">{filter.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">          לא יודע/ת מה רוצה לאכול? תנסו את זה!

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleGenerateClick}
            disabled={loading || localPantryItems.length === 0}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>מייצר מתכונים...</span>
              </>
            ) : (
              <>
                <FaUtensils />
                <span>צור מתכונים</span>
              </>
            )}
          </button>
          <button
            onClick={onGenerateRandomRecipes}
            disabled={loading}
            className="px-6 py-3 bg-red-400 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#EF4444' }}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>מייצר...</span>
              </>
            ) : (
              <>
                <FaUtensils />
                <span>צור 3 מתכונים אקראיים</span>
              </>
            )}
          </button>
        </div>
      </div>
      {localPantryItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <FaPepperHot className="text-orange-500" />
            פריטי מזווה
          </h3>
          <ul className="space-y-3">
            <AnimatePresence>
              {localPantryItems.map((item, idx) => (
                <motion.li
                  key={item}
                  className="flex justify-between items-center bg-teal-50 p-3 rounded-xl border border-teal-200 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div className="flex items-center gap-2">
                    <FaCarrot className="text-orange-400" />
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-rose-600 hover:text-rose-800 transition-colors p-1 rounded-full hover:bg-rose-100"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default UserPantryInput;