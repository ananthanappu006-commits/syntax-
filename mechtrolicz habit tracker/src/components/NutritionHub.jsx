import React, { useState, useCallback } from 'react';
import {
  Flame, Leaf, TrendingUp, ShieldCheck, Zap, Heart, Wind,
  Plus, Check, Droplets, Apple, Fish, Egg, Wheat,
  Clock, ChefHat, Target, Star, CheckCircle2, CircleDashed,
  Sun, Moon, Coffee, Sunset
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   DATA LAYER
═══════════════════════════════════════════════════════════════ */

const GOALS = [
  { id: 'loss', label: 'Weight Loss', icon: TrendingUp, color: '#e11d48', gradient: 'linear-gradient(135deg,#fef2f2,#ffe4e6)', activeGradient: 'linear-gradient(135deg,#e11d48,#fb7185)', desc: 'High-protein · High-fiber · Low-calorie-density' },
  { id: 'gain', label: 'Weight Gain', icon: Zap, color: '#d97706', gradient: 'linear-gradient(135deg,#fffbeb,#fef3c7)', activeGradient: 'linear-gradient(135deg,#d97706,#f59e0b)', desc: 'Calorie-dense · Nutrient-rich · Healthy fats' },
  { id: 'maintain', label: 'Nutrient-Dense Maintenance', icon: ShieldCheck, color: '#059669', gradient: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', activeGradient: 'linear-gradient(135deg,#059669,#34d399)', desc: 'Micronutrient-rich · Immunity · Energy · Gut Health' },
];

const RECIPES = {
  loss: [
    {
      id: 'wl-1', title: 'Grilled Chicken & Kale Power Bowl', emoji: '🥗', prepTime: 25, difficulty: 'Easy',
      macros: { calories: 380, protein: 42, carbs: 28, fats: 9 },
      tags: ['High Protein', 'Low-Cal', 'High Fiber'],
      color: '#e11d48', description: 'Lean grilled chicken over massaged kale with cherry tomatoes, chickpeas, and lemon-tahini dressing.',
      ingredients: ['150g chicken breast', '2 cups kale', '½ cup chickpeas', 'Cherry tomatoes', '1 tbsp tahini', 'Lemon juice'],
    },
    {
      id: 'wl-2', title: 'Zucchini Noodles with Turkey Bolognese', emoji: '🍝', prepTime: 30, difficulty: 'Medium',
      macros: { calories: 310, protein: 35, carbs: 18, fats: 8 },
      tags: ['High Protein', 'Low-Carb', 'Anti-Inflammatory'],
      color: '#dc2626', description: 'Spiralized zucchini replaces pasta, topped with lean turkey & tomato sauce — satisfying without the calorie load.',
      ingredients: ['2 zucchini', '150g lean turkey mince', 'Crushed tomatoes', 'Garlic', 'Basil', 'Olive oil'],
    },
    {
      id: 'wl-3', title: 'Egg White Veggie Scramble', emoji: '🍳', prepTime: 12, difficulty: 'Easy',
      macros: { calories: 195, protein: 28, carbs: 10, fats: 5 },
      tags: ['High Protein', 'Low-Cal', 'Quick Prep'],
      color: '#9f1239', description: 'Fluffy egg whites loaded with spinach, bell peppers, mushrooms, and onion. A protein-packed breakfast under 200kcal.',
      ingredients: ['5 egg whites', '1 cup spinach', 'Bell peppers', 'Mushrooms', '½ tsp turmeric', 'Black pepper'],
    },
    {
      id: 'wl-4', title: 'Salmon & Asparagus Bake', emoji: '🐟', prepTime: 35, difficulty: 'Easy',
      macros: { calories: 420, protein: 45, carbs: 6, fats: 24 },
      tags: ['Omega-3', 'High Protein', 'Keto-Friendly'],
      color: '#b91c1c', description: 'Oven-baked salmon fillet with asparagus and lemon — omega-3 rich, satiating, and meal-prep perfect.',
      ingredients: ['180g salmon fillet', '10 asparagus spears', 'Lemon', 'Olive oil', 'Dill', 'Garlic'],
    },
    {
      id: 'wl-5', title: 'Lentil & Spinach Soup', emoji: '🍲', prepTime: 40, difficulty: 'Easy',
      macros: { calories: 260, protein: 18, carbs: 38, fats: 4 },
      tags: ['High Fiber', 'Plant Protein', 'Gut Health'],
      color: '#be123c', description: 'Hearty red lentil soup with wilted spinach, cumin, and turmeric. Filling, fiber-rich, and deeply nourishing.',
      ingredients: ['½ cup red lentils', '2 cups spinach', 'Onion', 'Garlic', 'Cumin', 'Vegetable broth'],
    },
    {
      id: 'wl-6', title: 'Greek Yogurt Parfait with Berries', emoji: '🫐', prepTime: 5, difficulty: 'Easy',
      macros: { calories: 210, protein: 22, carbs: 24, fats: 3 },
      tags: ['High Protein', 'Probiotic', 'Low-Cal'],
      color: '#e11d48', description: 'Layers of plain Greek yogurt, mixed berries, and a sprinkle of chia seeds. A 5-minute high-protein snack or breakfast.',
      ingredients: ['200g Greek yogurt', 'Mixed berries', '1 tsp chia seeds', 'Dash of cinnamon'],
    },
  ],
  gain: [
    {
      id: 'wg-1', title: 'Mass-Builder Peanut Butter Banana Smoothie', emoji: '🥤', prepTime: 5, difficulty: 'Easy',
      macros: { calories: 680, protein: 32, carbs: 82, fats: 22 },
      tags: ['Calorie-Dense', 'Mass Gain', 'Quick'],
      color: '#d97706', description: 'High-calorie smoothie with oats, banana, peanut butter, whole milk, and whey. Ideal post-workout mass fuel.',
      ingredients: ['1 banana', '2 tbsp peanut butter', '1 cup whole milk', '½ cup oats', '1 scoop whey', 'Honey'],
    },
    {
      id: 'wg-2', title: 'Steak & Sweet Potato Gain Plate', emoji: '🥩', prepTime: 30, difficulty: 'Medium',
      macros: { calories: 750, protein: 55, carbs: 62, fats: 28 },
      tags: ['Calorie-Dense', 'Creatine', 'Zinc-Rich'],
      color: '#b45309', description: 'Juicy sirloin steak with roasted sweet potato and broccoli — complete muscle-building plate with creatine and zinc.',
      ingredients: ['200g sirloin steak', '1 large sweet potato', 'Broccoli', 'Butter', 'Garlic', 'Rosemary'],
    },
    {
      id: 'wg-3', title: 'Avocado Egg Toast Stack', emoji: '🥑', prepTime: 12, difficulty: 'Easy',
      macros: { calories: 520, protein: 22, carbs: 40, fats: 32 },
      tags: ['Healthy Fats', 'Calorie-Dense', 'Nutrient-Rich'],
      color: '#92400e', description: 'Thick sourdough toast with mashed avocado, 2 fried eggs, olive oil drizzle, and hemp seeds. A calorie-dense breakfast.',
      ingredients: ['2 slices sourdough', '1 avocado', '2 eggs', 'Hemp seeds', 'Chilli flakes', 'Sea salt'],
    },
    {
      id: 'wg-4', title: 'Nut & Oat Overnight Power Jar', emoji: '🫙', prepTime: 5, difficulty: 'Easy',
      macros: { calories: 610, protein: 25, carbs: 72, fats: 26 },
      tags: ['Calorie-Dense', 'Slow-Release', 'Prep-Ahead'],
      color: '#d97706', description: 'Overnight oats with whole milk, mixed nuts, dates, Greek yogurt, and dark chocolate chips — prep once, fuel tomorrow.',
      ingredients: ['½ cup oats', '1 cup whole milk', '¼ cup mixed nuts', 'Medjool dates', 'Greek yogurt', 'Dark choc chips'],
    },
    {
      id: 'wg-5', title: 'Tuna, Rice & Avocado Gain Bowl', emoji: '🍱', prepTime: 15, difficulty: 'Easy',
      macros: { calories: 640, protein: 48, carbs: 65, fats: 18 },
      tags: ['High Protein', 'Calorie-Dense', 'Omega-3'],
      color: '#ca8a04', description: 'Canned tuna mixed with avocado over white rice, sesame seeds, and soy sauce. A cheap, fast mass-building meal.',
      ingredients: ['1 can tuna', '1 cup white rice', '½ avocado', 'Sesame seeds', 'Soy sauce', 'Green onion'],
    },
    {
      id: 'wg-6', title: 'Cottage Cheese & Honey Protein Bowl', emoji: '🍯', prepTime: 3, difficulty: 'Easy',
      macros: { calories: 380, protein: 30, carbs: 42, fats: 9 },
      tags: ['Casein Protein', 'Night Recovery', 'Sweet'],
      color: '#d97706', description: 'Full-fat cottage cheese with banana, granola, and honey — slow-digesting casein perfect before bed for overnight muscle growth.',
      ingredients: ['1 cup cottage cheese', '1 banana', '¼ cup granola', 'Honey drizzle', 'Cinnamon'],
    },
  ],
  maintain: [
    {
      id: 'mt-1', title: 'Rainbow Immunity Salad', emoji: '🌈', prepTime: 15, difficulty: 'Easy',
      macros: { calories: 290, protein: 10, carbs: 32, fats: 14 },
      tags: ['Immunity', 'Antioxidant', 'Vitamin C'],
      color: '#059669', benefit: 'Immunity',
      description: 'Red cabbage, orange pepper, yellow corn, spinach, purple onion, and carrots — every color brings a different phytonutrient.',
      ingredients: ['Red cabbage', 'Orange bell pepper', 'Corn', 'Spinach', 'Purple onion', 'Carrot', 'Olive oil dressing'],
    },
    {
      id: 'mt-2', title: 'Matcha Chia Energy Pudding', emoji: '🍵', prepTime: 5, difficulty: 'Easy',
      macros: { calories: 240, protein: 8, carbs: 28, fats: 12 },
      tags: ['High Energy', 'Antioxidant', 'Brain Boost'],
      color: '#047857', benefit: 'High Energy',
      description: 'Matcha-infused chia pudding with almond milk, topped with kiwi and banana. EGCG antioxidants + slow-release energy.',
      ingredients: ['1 tsp matcha powder', '3 tbsp chia seeds', '1 cup almond milk', 'Kiwi', 'Banana', 'Maple syrup'],
    },
    {
      id: 'mt-3', title: 'Kimchi & Brown Rice Buddha Bowl', emoji: '🍜', prepTime: 20, difficulty: 'Easy',
      macros: { calories: 370, protein: 14, carbs: 58, fats: 10 },
      tags: ['Gut Health', 'Probiotic', 'Fiber-Rich'],
      color: '#065f46', benefit: 'Gut Health',
      description: 'Probiotic-rich kimchi over brown rice with edamame, cucumber, and sesame. Supports gut microbiome and digestion.',
      ingredients: ['1 cup brown rice', '½ cup kimchi', 'Edamame', 'Cucumber', 'Sesame seeds', 'Tamari sauce'],
    },
    {
      id: 'mt-4', title: 'Turmeric Golden Milk Overnight Oats', emoji: '🌙', prepTime: 5, difficulty: 'Easy',
      macros: { calories: 340, protein: 12, carbs: 52, fats: 10 },
      tags: ['Anti-Inflammatory', 'High Energy', 'Gut Health'],
      color: '#059669', benefit: 'High Energy',
      description: 'Oats soaked in golden turmeric milk with black pepper, ginger, and mango. Anti-inflammatory powerhouse breakfast.',
      ingredients: ['½ cup oats', '1 cup golden milk', '1 mango', '½ tsp turmeric', '¼ tsp ginger', 'Black pepper'],
    },
    {
      id: 'mt-5', title: 'Garlic & Ginger Immune Bone Broth Soup', emoji: '🍵', prepTime: 15, difficulty: 'Easy',
      macros: { calories: 180, protein: 15, carbs: 16, fats: 4 },
      tags: ['Immunity', 'Gut Healing', 'Anti-Inflammatory'],
      color: '#047857', benefit: 'Immunity',
      description: 'Slow-simmered bone broth with garlic, ginger, mushrooms, and spinach. Collagen + zinc + vitamin D for immune defence.',
      ingredients: ['2 cups bone broth', '4 cloves garlic', 'Fresh ginger', 'Shiitake mushrooms', '2 cups spinach', 'Lemon'],
    },
    {
      id: 'mt-6', title: 'Fermented Yogurt Gut-Heal Bowl', emoji: '🫐', prepTime: 5, difficulty: 'Easy',
      macros: { calories: 220, protein: 16, carbs: 26, fats: 6 },
      tags: ['Gut Health', 'Probiotic', 'Prebiotic'],
      color: '#059669', benefit: 'Gut Health',
      description: 'Full-fat live-culture yogurt with flaxseeds, banana, and blueberries. Prebiotic + probiotic synergy for gut flora balance.',
      ingredients: ['200g live yogurt', '1 tbsp flaxseeds', '1 banana', 'Blueberries', 'Walnuts', 'Raw honey'],
    },
  ],
};

const BENEFIT_COLORS = { Immunity: '#e11d48', 'High Energy': '#d97706', 'Gut Health': '#059669' };

const RAINBOW_NUTRIENTS = [
  { id: 'red', emoji: '🔴', label: 'Red Foods', sub: 'Lycopene & Vit C', examples: 'Tomato, strawberry, red pepper', color: '#e11d48' },
  { id: 'orange', emoji: '🟠', label: 'Orange Foods', sub: 'Beta-carotene', examples: 'Carrot, pumpkin, mango', color: '#ea580c' },
  { id: 'yellow', emoji: '🟡', label: 'Yellow Foods', sub: 'Vitamin A & C', examples: 'Banana, corn, yellow pepper', color: '#ca8a04' },
  { id: 'green', emoji: '🟢', label: 'Green Foods', sub: 'Folate & Iron', examples: 'Spinach, broccoli, avocado', color: '#059669' },
  { id: 'blue', emoji: '🫐', label: 'Blue / Purple', sub: 'Anthocyanins', examples: 'Blueberry, eggplant, red cabbage', color: '#7c3aed' },
  { id: 'white', emoji: '⚪', label: 'White Foods', sub: 'Allicin & Quercetin', examples: 'Garlic, onion, mushroom', color: '#64748b' },
];

const DAILY_TARGETS = [
  { id: 'water', label: 'Water', icon: Droplets, unit: 'ml', target: 2500, color: '#0891b2', step: 250 },
  { id: 'protein', label: 'Protein', icon: Egg, unit: 'g', target: 140, color: '#8b5cf6', step: 10 },
  { id: 'fiber', label: 'Fiber', icon: Wheat, unit: 'g', target: 30, color: '#059669', step: 5 },
  { id: 'vitamins', label: 'Vitamins', icon: Apple, unit: 'servings', target: 5, color: '#e11d48', step: 1 },
];

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

function GoalTab({ goal, active, onClick }) {
  const Icon = goal.icon;
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '14px 8px', borderRadius: 16, border: 'none', cursor: 'pointer',
        background: active ? goal.activeGradient : goal.gradient,
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: active ? 'translateY(-2px) scale(1.02)' : 'scale(1)',
        boxShadow: active ? `0 8px 24px ${goal.color}35` : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <Icon size={20} color={active ? '#fff' : goal.color} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 13, color: active ? '#fff' : goal.color, letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2 }}>
        {goal.label}
      </span>
      <span style={{ fontSize: 10, color: active ? 'rgba(255,255,255,0.8)' : '#64748b', textAlign: 'center', lineHeight: 1.3 }}>
        {goal.desc}
      </span>
    </button>
  );
}

function MacroBadge({ label, value, unit, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span style={{ fontSize: 16, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{value}{unit}</span>
      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}

function RecipeCard({ recipe, goal, onAdd, isAdded }) {
  const [expanded, setExpanded] = useState(false);
  const goalData = GOALS.find(g => g.id === goal);
  const color = goalData?.color || '#4f46e5';

  return (
    <div
      className="animate-fade"
      style={{
        borderRadius: 18, overflow: 'hidden', background: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px -2px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Card Header */}
      <div style={{
        background: `linear-gradient(135deg, ${color}12, ${color}20)`,
        padding: '16px 16px 12px', borderBottom: '1px solid #e2e8f0',
        position: 'relative',
      }}>
        {goal === 'maintain' && recipe.benefit && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: BENEFIT_COLORS[recipe.benefit] || color,
            color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px',
            borderRadius: 99, letterSpacing: '0.04em',
          }}>{recipe.benefit}</span>
        )}
        <div style={{ fontSize: 36, marginBottom: 8 }}>{recipe.emoji}</div>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', lineHeight: 1.3, marginRight: 60 }}>
          {recipe.title}
        </h4>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {recipe.tags.map(tag => (
            <span key={tag} style={{
              background: `${color}18`, color, fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 99, letterSpacing: '0.03em',
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Macros Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9', gap: 4,
      }}>
        <MacroBadge label="Calories" value={recipe.macros.calories} unit="" color="#ea580c" />
        <MacroBadge label="Protein" value={recipe.macros.protein} unit="g" color="#8b5cf6" />
        <MacroBadge label="Carbs" value={recipe.macros.carbs} unit="g" color="#d97706" />
        <MacroBadge label="Fats" value={recipe.macros.fats} unit="g" color="#059669" />
      </div>

      {/* Prep Info */}
      <div style={{ display: 'flex', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          <Clock size={13} color={color} /> {recipe.prepTime} min
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          <ChefHat size={13} color={color} /> {recipe.difficulty}
        </span>
      </div>

      {/* Description (expandable) */}
      <div style={{ padding: '10px 16px', flex: 1 }}>
        <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{recipe.description}</p>
        {expanded && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#000', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ingredients</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color, fontWeight: 700, fontSize: 11, padding: '4px 0', marginTop: 4 }}
        >
          {expanded ? 'Show less ▲' : 'Show ingredients ▼'}
        </button>
      </div>

      {/* CTA Button */}
      <div style={{ padding: '0 16px 16px' }}>
        <button
          onClick={() => onAdd(recipe)}
          style={{
            width: '100%', padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em',
            background: isAdded ? '#f0fdf4' : `linear-gradient(135deg, ${color}, ${color}cc)`,
            color: isAdded ? '#059669' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s ease',
            boxShadow: isAdded ? 'none' : `0 4px 12px ${color}30`,
          }}
        >
          {isAdded ? <><CheckCircle2 size={15} /> Added to Today!</> : <><Plus size={15} /> Add to Today's Routine</>}
        </button>
      </div>
    </div>
  );
}

function NutrientProgressBar({ item, value, onAdd }) {
  const pct = Math.min(100, Math.round((value / item.target) * 100));
  const Icon = item.icon;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${item.color}15`,
          }}>
            <Icon size={16} color={item.color} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#000' }}>{item.label}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>{value} / {item.target} {item.unit}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 13, fontWeight: 800, color: pct >= 100 ? '#059669' : item.color,
          }}>{pct}%</span>
          <button
            onClick={onAdd}
            style={{
              width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, transition: 'all 0.15s ease',
            }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: pct >= 100 ? '#059669' : `linear-gradient(90deg, ${item.color}, ${item.color}99)`,
          width: `${pct}%`, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}

function RainbowChecklist({ checked, onToggle }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#e11d48,#d97706,#059669,#7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={18} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#000', letterSpacing: '-0.02em' }}>🌈 Eat the Rainbow</h3>
          <p style={{ fontSize: 11, color: '#64748b' }}>Check off each colour group you've eaten today</p>
        </div>
        <div style={{
          marginLeft: 'auto', fontSize: 20, fontWeight: 900, color: '#000',
          letterSpacing: '-0.04em',
        }}>
          {checked.length}<span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>/{RAINBOW_NUTRIENTS.length}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {RAINBOW_NUTRIENTS.map(n => {
          const isChecked = checked.includes(n.id);
          return (
            <button
              key={n.id}
              onClick={() => onToggle(n.id)}
              style={{
                border: `2px solid ${isChecked ? n.color : '#e2e8f0'}`,
                borderRadius: 14, padding: '12px', background: isChecked ? `${n.color}10` : '#fafafa',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                transform: isChecked ? 'scale(1.02)' : 'scale(1)',
                display: 'flex', flexDirection: 'column', gap: 3,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>{n.emoji}</span>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isChecked ? n.color : '#cbd5e1'}`,
                  background: isChecked ? n.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isChecked && <Check size={11} color="#fff" strokeWidth={3} />}
                </span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 800, color: isChecked ? n.color : '#000', lineHeight: 1.2 }}>{n.label}</p>
              <p style={{ fontSize: 10, color: '#64748b', lineHeight: 1.3 }}>{n.sub}</p>
              <p style={{ fontSize: 9.5, color: '#94a3b8', lineHeight: 1.3 }}>{n.examples}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function NutritionHub({ data, setData }) {
  const [activeGoal, setActiveGoal] = useState('loss');
  const [benefitFilter, setBenefitFilter] = useState('All');
  const [addedMeals, setAddedMeals] = useState(new Set());
  const [rainbowChecked, setRainbowChecked] = useState([]);
  const [nutrients, setNutrients] = useState({ water: 750, protein: 45, fiber: 8, vitamins: 2 });

  const goalData = GOALS.find(g => g.id === activeGoal);
  const rawRecipes = RECIPES[activeGoal] || [];
  const recipes = activeGoal === 'maintain' && benefitFilter !== 'All'
    ? rawRecipes.filter(r => r.benefit === benefitFilter)
    : rawRecipes;

  const handleAddMeal = useCallback((recipe) => {
    if (addedMeals.has(recipe.id)) return;
    setAddedMeals(prev => new Set([...prev, recipe.id]));

    // Auto-populate into schedule & calorie tracker
    if (setData) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const newItem = {
        id: `meal-${recipe.id}-${Date.now()}`,
        title: `🍽️ ${recipe.title}`,
        time: `${hours}:${mins}`,
        duration: recipe.prepTime,
        category: 'Health',
        status: 'pending',
        linkedHabitId: null,
        source: 'nutrition',
        macros: recipe.macros,
      };

      const newIntake = {
        id: `intake-${recipe.id}-${Date.now()}`,
        name: recipe.title,
        calories: recipe.macros?.calories || 250,
        meal: 'Lunch',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        protein: recipe.macros?.protein,
        carbs: recipe.macros?.carbs,
        fat: recipe.macros?.fats,
      };

      setData(prev => ({
        ...prev,
        schedule: [...(prev.schedule || []), newItem],
        calories: prev.calories ? {
          ...prev.calories,
          intake: [newIntake, ...(prev.calories.intake || [])]
        } : prev.calories,
        user: prev.user ? {
          ...prev.user,
          totalPoints: (prev.user.totalPoints || 0) + 10,
          currentXP: (prev.user.currentXP || 0) + 15,
        } : prev.user,
      }));
    }
  }, [addedMeals, setData]);

  const toggleRainbow = useCallback((id) => {
    setRainbowChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const addNutrient = useCallback((id) => {
    const item = DAILY_TARGETS.find(t => t.id === id);
    if (!item) return;
    setNutrients(prev => ({ ...prev, [id]: Math.min(item.target + item.step, prev[id] + item.step) }));
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero Header */}
      <div style={{
        background: `linear-gradient(135deg, ${goalData.color}15, ${goalData.color}08)`,
        border: `1px solid ${goalData.color}25`,
        borderRadius: 24, padding: '24px 28px',
        display: 'flex', alignItems: 'center', gap: 16,
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 18,
          background: goalData.activeGradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${goalData.color}35`,
          flexShrink: 0,
        }}>
          <ChefHat size={28} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#000', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Goal-Based Nutrition Hub
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Personalised recipes & meal plans tailored to your <strong style={{ color: goalData.color }}>{goalData.label}</strong> goal
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: goalData.color }}>{recipes.length}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>Recipes</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: goalData.color }}>{addedMeals.size}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>Logged</p>
          </div>
        </div>
      </div>

      {/* Goal Selector Tabs */}
      <div style={{ display: 'flex', gap: 12 }}>
        {GOALS.map(g => (
          <GoalTab key={g.id} goal={g} active={activeGoal === g.id} onClick={() => { setActiveGoal(g.id); setBenefitFilter('All'); }} />
        ))}
      </div>

      {/* Core Benefit Filters for Nutrient-Dense Maintenance */}
      {activeGoal === 'maintain' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '6px 0' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginRight: 4 }}>Core Benefit:</span>
          {['All', 'Immunity', 'High Energy', 'Gut Health'].map(benefit => {
            const isSel = benefitFilter === benefit;
            const bColor = benefit === 'All' ? '#059669' : BENEFIT_COLORS[benefit] || '#059669';
            return (
              <button
                key={benefit}
                onClick={() => setBenefitFilter(benefit)}
                style={{
                  padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${isSel ? bColor : '#e2e8f0'}`,
                  background: isSel ? bColor : '#fff', color: isSel ? '#fff' : '#475569',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: isSel ? `0 2px 8px ${bColor}35` : 'none'
                }}
              >
                {benefit === 'Immunity' ? '🛡️ ' : benefit === 'High Energy' ? '⚡ ' : benefit === 'Gut Health' ? '🌱 ' : '✨ '}
                {benefit}
              </button>
            );
          })}
        </div>
      )}

      {/* Recipe Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#000', letterSpacing: '-0.02em' }}>
            {activeGoal === 'maintain' ? '🌿' : activeGoal === 'loss' ? '🔥' : '⚡'} {goalData.label} Recipes
          </h3>
          <span style={{
            fontSize: 12, fontWeight: 700, color: goalData.color,
            background: `${goalData.color}15`, padding: '4px 12px', borderRadius: 99,
          }}>
            {recipes.length} meals
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              goal={activeGoal}
              onAdd={handleAddMeal}
              isAdded={addedMeals.has(recipe.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Two-Column: Rainbow + Nutrient Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Rainbow Checklist */}
        <RainbowChecklist checked={rainbowChecked} onToggle={toggleRainbow} />

        {/* Micro-Nutrient Quick Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Target size={18} color="#4f46e5" />
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#000', letterSpacing: '-0.02em' }}>Daily Nutrient Targets</h3>
          </div>
          {DAILY_TARGETS.map(item => (
            <NutrientProgressBar
              key={item.id}
              item={item}
              value={nutrients[item.id]}
              onAdd={() => addNutrient(item.id)}
            />
          ))}
          {/* Overall Rainbow Progress */}
          <div style={{
            background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '1px solid #e2e8f0',
            borderRadius: 16, padding: '14px 16px',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rainbow Score
            </p>
            <div style={{ height: 8, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg,#e11d48,#ea580c,#d97706,#059669,#7c3aed)',
                width: `${Math.round((rainbowChecked.length / RAINBOW_NUTRIENTS.length) * 100)}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>
              {rainbowChecked.length}/{RAINBOW_NUTRIENTS.length} colour groups consumed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
