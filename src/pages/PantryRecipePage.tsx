import React, { useState } from "react";
import UserPantryInput from "../components/UserPantryInput";
import RecipeSuggestions from "../components/RecipeSuggestions";

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

const generateRecipes = async (pantryItems: string[]): Promise<Recipe[]> => {
  const response = await fetch(`${process.env.VITE_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pantryItems }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate recipes');
  }
  
  const data = await response.json();
  return data.recipes;
};

const PantryRecipePage: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateRecipes = async (items: string[]) => {
    if (!items || items.length === 0) {
      console.log('No items to generate recipes for');
      return;
    }

    console.log('Starting recipe generation with items:', items);
    
    setLoading(true);
    setRecipes([]); // Clear previous recipes
    
    try {
      const result = await generateRecipes(items);
      console.log('API returned recipes:', result);
      setRecipes(result);
    } catch (error) {
      console.error('Error generating recipes:', error);
      setRecipes([{
        title: "שגיאה בהפקת מתכונים",
        ingredients: ["אנא נסה שוב"],
        instructions: ["בדוק את החיבור לאינטרנט ונסה שוב"]
      }]);
    } finally {
      setLoading(false);
      console.log('Recipe generation completed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            מחולל מתכונים בבינה מלאכותית
          </h1>
          <p className="text-gray-600">
            בחר את המצרכים שלך וקבל מתכונים מותאמים אישית
          </p>
        </div>
        
        <UserPantryInput 
          setPantryItems={setPantryItems}
          onGenerateRecipes={handleGenerateRecipes}
          loading={loading}
        />
        
        <RecipeSuggestions pantryItems={pantryItems} />
      </div>
    </div>
  );
};

export default PantryRecipePage;