// src/components/PantryList.tsx
import React from "react";

interface PantryListProps {
  items: string[];
  onRemove: (item: string) => void;
}

const PantryList: React.FC<PantryListProps> = ({ items, onRemove }) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">🧺 פריטי מזווה</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">אין עדיין מצרכים במזווה</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PantryList;
