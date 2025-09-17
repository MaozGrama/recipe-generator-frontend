import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaPepperHot, FaCarrot } from 'react-icons/fa';

interface PantryListProps {
  items: string[];
  onRemove: (item: string) => void;
}

const PantryList: React.FC<PantryListProps> = ({ items, onRemove }) => {
  return (
    <motion.div
      className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
        <FaPepperHot className="text-orange-500" />
        פריטי מזווה
      </h2>
      {items.length === 0 ? (
        <motion.p
          className="text-neutral-500 text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          אין עדיין מצרכים במזווה
        </motion.p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {items.map((item, idx) => (
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
                  onClick={() => onRemove(item)}
                  className="text-rose-600 hover:text-rose-800 transition-colors p-1 rounded-full hover:bg-rose-100"
                >
                  <FaTrashAlt className="text-sm" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
};

export default PantryList;