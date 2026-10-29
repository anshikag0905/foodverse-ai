import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function MacroChart({
  calories = 250,
  protein = 20,
  carbs = 30,
  fat = 8,
  fiber = 4,
  sugar = 2,
  servingSize = "1 serving (150g)",
  className = ""
}) {
  const data = [
    { name: 'Protein', value: Number(protein) || 0, color: '#3b82f6', unit: 'g' },
    { name: 'Carbs', value: Number(carbs) || 0, color: '#f59e0b', unit: 'g' },
    { name: 'Fat', value: Number(fat) || 0, color: '#f43f5e', unit: 'g' },
    { name: 'Fiber', value: Number(fiber) || 0, color: '#10b981', unit: 'g' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-slate-700">
          <span className="font-semibold">{item.name}: </span>
          <span>{item.value}g</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Nutrition Breakdown</h4>
          <span className="text-[11px] text-slate-400">{servingSize}</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{calories}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold ml-1">kcal</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Recharts Pie */}
        <div className="w-36 h-36 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={54}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Macros</span>
          </div>
        </div>

        {/* Macro Details Grid */}
        <div className="grid grid-cols-2 gap-2 flex-1 w-full text-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <span className="text-blue-700 dark:text-blue-300 font-medium">Protein</span>
            <span className="font-extrabold text-blue-900 dark:text-blue-100">{protein}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
            <span className="text-amber-700 dark:text-amber-300 font-medium">Carbs</span>
            <span className="font-extrabold text-amber-900 dark:text-amber-100">{carbs}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
            <span className="text-rose-700 dark:text-rose-300 font-medium">Fats</span>
            <span className="font-extrabold text-rose-900 dark:text-rose-100">{fat}g</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">Fiber</span>
            <span className="font-extrabold text-emerald-900 dark:text-emerald-100">{fiber}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
