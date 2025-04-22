"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  ChevronDown, 
  Plus, 
  Star, 
  Heart,
  Utensils,
  User,
  Tag
} from 'lucide-react';
import Card from '@/components/ui/Card';

// Recipe interface
interface Recipe {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  tags: string[];
  isFavorite: boolean;
  rating: number;
  author: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

// Mock data for recipes
const RECIPE_DATA: Recipe[] = [
  {
    id: 1,
    title: "Grilled Chicken Salad",
    category: "Lunch",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    calories: 320,
    tags: ["High Protein", "Low Carb", "Keto-Friendly"],
    isFavorite: true,
    rating: 4.7,
    author: "Nutrition Team",
    description: "A light and protein-packed salad perfect for a healthy lunch or dinner option.",
    ingredients: [
      "2 chicken breasts, boneless and skinless",
      "4 cups mixed greens",
      "1 cucumber, sliced",
      "1 bell pepper, diced",
      "1 avocado, sliced",
      "2 tbsp olive oil",
      "1 tbsp balsamic vinegar",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Season chicken breasts with salt and pepper.",
      "Grill chicken for 6-7 minutes per side or until fully cooked.",
      "Let chicken rest for 5 minutes, then slice.",
      "In a large bowl, combine mixed greens, cucumber, bell pepper, and avocado.",
      "In a small bowl, whisk together olive oil and balsamic vinegar.",
      "Add sliced chicken to the salad, drizzle with dressing, and toss gently.",
      "Serve immediately."
    ]
  },
  {
    id: 2,
    title: "Protein-Packed Smoothie Bowl",
    category: "Breakfast",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    calories: 350,
    tags: ["High Protein", "Vegetarian", "Pre-Workout"],
    isFavorite: false,
    rating: 4.5,
    author: "Nutrition Team",
    description: "A delicious and nutrient-dense smoothie bowl that's perfect for a quick breakfast or post-workout meal.",
    ingredients: [
      "1 frozen banana",
      "1 cup frozen berries",
      "1 scoop protein powder",
      "1/2 cup Greek yogurt",
      "1/4 cup almond milk",
      "Toppings: granola, chia seeds, sliced fruits"
    ],
    instructions: [
      "Add frozen banana, berries, protein powder, Greek yogurt, and almond milk to a blender.",
      "Blend until smooth, adding more almond milk if needed.",
      "Pour into a bowl.",
      "Top with granola, chia seeds, and fresh fruit.",
      "Serve immediately."
    ]
  },
  {
    id: 3,
    title: "Baked Salmon with Roasted Vegetables",
    category: "Dinner",
    difficulty: "Intermediate",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    calories: 420,
    tags: ["High Protein", "Omega-3", "Gluten-Free"],
    isFavorite: true,
    rating: 4.9,
    author: "Chef Marcus",
    description: "A nutritious and delicious dinner option that's packed with protein and healthy fats.",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 lemon, sliced",
      "1 zucchini, sliced",
      "1 bell pepper, chopped",
      "1 red onion, chopped",
      "2 cups cherry tomatoes",
      "Fresh dill or parsley for garnish",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Toss vegetables with 1 tbsp olive oil, salt, and pepper. Spread on a baking sheet.",
      "Roast vegetables for 10 minutes.",
      "Season salmon with remaining olive oil, garlic, salt, and pepper.",
      "Move vegetables to sides of the baking sheet and place salmon in the center.",
      "Top salmon with lemon slices and fresh herbs.",
      "Bake for 12-15 minutes until salmon is cooked through.",
      "Garnish with additional herbs and serve."
    ]
  },
  {
    id: 4,
    title: "Vegan Buddha Bowl",
    category: "Lunch",
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    calories: 380,
    tags: ["Vegan", "Plant-Based", "High Fiber"],
    isFavorite: false,
    rating: 4.6,
    author: "Plant Power Chef",
    description: "A colorful, nutrient-packed bowl that's completely plant-based and will keep you energized throughout the day.",
    ingredients: [
      "1 cup quinoa, cooked",
      "1 sweet potato, cubed and roasted",
      "1 cup chickpeas, roasted",
      "1 avocado, sliced",
      "2 cups kale, massaged",
      "1/2 cup red cabbage, shredded",
      "1/4 cup tahini",
      "1 tbsp lemon juice",
      "1 tbsp maple syrup",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa according to package instructions.",
      "Roast sweet potato cubes and chickpeas at 400°F for 20 minutes.",
      "Make dressing by whisking together tahini, lemon juice, maple syrup, and 2-3 tbsp water.",
      "Assemble bowls with quinoa, roasted vegetables, chickpeas, kale, and cabbage.",
      "Drizzle with tahini dressing and top with avocado slices.",
      "Season with salt and pepper to taste."
    ]
  },
  {
    id: 5,
    title: "Protein Energy Balls",
    category: "Snack",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 0,
    servings: 12,
    calories: 120,
    tags: ["High Protein", "Vegetarian", "Meal Prep"],
    isFavorite: true,
    rating: 4.8,
    author: "Nutrition Team",
    description: "No-bake protein balls that are perfect for a quick energy boost before or after workouts.",
    ingredients: [
      "1 cup rolled oats",
      "1/2 cup peanut butter or almond butter",
      "1/3 cup honey or maple syrup",
      "1/4 cup protein powder",
      "2 tbsp chia seeds",
      "1/4 cup dark chocolate chips",
      "1 tsp vanilla extract",
      "Pinch of salt"
    ],
    instructions: [
      "In a large bowl, mix all ingredients until well combined.",
      "Refrigerate the mixture for 30 minutes to firm up.",
      "Roll the mixture into 12 balls (about 1-inch in diameter).",
      "Store in an airtight container in the refrigerator for up to a week.",
      "Enjoy as a snack or quick breakfast on the go."
    ]
  }
];

// Available filters
const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const DIFFICULTIES = ["All", "Easy", "Intermediate", "Advanced"];
const TAGS = ["All", "High Protein", "Low Carb", "Vegetarian", "Vegan", "Gluten-Free", "Keto-Friendly", "Meal Prep"];

export default function RecipesPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState(RECIPE_DATA);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);

  // Filter recipes based on criteria
  useEffect(() => {
    let filteredRecipes = [...RECIPE_DATA];
    
    // Apply search filter
    if (searchTerm) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.category === selectedCategory
      );
    }
    
    // Apply difficulty filter
    if (selectedDifficulty !== "All") {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.difficulty === selectedDifficulty
      );
    }
    
    // Apply tag filter
    if (selectedTag !== "All") {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.tags.includes(selectedTag)
      );
    }
    
    setRecipes(filteredRecipes);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedTag]);

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id 
        ? {...recipe, isFavorite: !recipe.isFavorite} 
        : recipe
    ));
  };

  // Handle recipe selection
  const handleRecipeSelect = (id: number) => {
    setSelectedRecipe(selectedRecipe === id ? null : id);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Recipes</h1>
        <p className="text-gray-600">Discover healthy and delicious recipes to fuel your fitness journey.</p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search recipes..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus size={18} />
            Add Recipe
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
              <select 
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Recipe Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recipes.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Utensils size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        ) : (
          recipes.map(recipe => (
            <Card key={recipe.id} className="h-full">
              <div 
                className="p-5 cursor-pointer"
                onClick={() => handleRecipeSelect(recipe.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
                    <span className="text-sm text-gray-500">{recipe.category} • {recipe.difficulty}</span>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                  >
                    <Heart size={20} fill={recipe.isFavorite ? "#ef4444" : "none"} stroke={recipe.isFavorite ? "#ef4444" : "currentColor"} />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">{tag}</span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={16} />
                      <span className="text-sm">{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <User size={16} />
                      <span className="text-sm">{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Tag size={16} />
                      <span className="text-sm">{recipe.calories} cal</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{recipe.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Expanded recipe details */}
              {selectedRecipe === recipe.id && (
                <div className="p-5 border-t border-gray-100">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-600 text-sm">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="text-gray-600 text-sm">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1">
                      <Plus size={16} />
                      <span>Add to Meal Plan</span>
                    </button>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1">
                      <Heart size={16} />
                      <span>Save Recipe</span>
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
