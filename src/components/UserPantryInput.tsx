import React, { useState } from 'react';

interface UserPantryInputProps {
  setPantryItems: (items: string[]) => void;
  onGenerateRecipes: (items: string[]) => void;
  loading?: boolean;
}

const UserPantryInput: React.FC<UserPantryInputProps> = ({ 
  setPantryItems, 
  onGenerateRecipes,
  loading = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [currentItems, setCurrentItems] = useState<string[]>([]);

  const handleAddItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !currentItems.includes(trimmedValue)) {
      const newItems = [...currentItems, trimmedValue];
      setCurrentItems(newItems);
      setPantryItems(newItems);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    const newItems = currentItems.filter(item => item !== itemToRemove);
    setCurrentItems(newItems);
    setPantryItems(newItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleGenerateClick = () => {
    if (currentItems.length > 0) {
      onGenerateRecipes(currentItems);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        הוסף את המצרכים שלך
      </h2>
      
      {/* Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="הכנס מצרך (לדוגמה: עגבניות, בצל, אורז)..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleAddItem}
          disabled={!inputValue.trim() || loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          הוסף
        </button>
      </div>

      {/* Current Items Display */}
      {currentItems.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-gray-700">המצרכים שלך:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentItems.map((item, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 border"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveItem(item)}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 font-bold text-lg leading-none disabled:opacity-50"
                  title="הסר מצרך"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateClick}
        disabled={currentItems.length === 0 || loading}
        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading 
          ? 'מפיק מתכונים...' 
          : `צור מתכונים מ-${currentItems.length} מצרכים`
        }
      </button>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 mt-2 text-center">
        הוסף לפחות מצרך אחד כדי לקבל מתכונים מותאמים
      </p>
    </div>
  );
};

export default UserPantryInput;
