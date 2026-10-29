import React from 'react';

const BOX_COLORS = [
  { border: 'border-blue-500', bg: 'bg-blue-600', text: 'text-white' },
  { border: 'border-emerald-500', bg: 'bg-emerald-600', text: 'text-white' },
  { border: 'border-amber-500', bg: 'bg-amber-600', text: 'text-white' },
  { border: 'border-purple-500', bg: 'bg-purple-600', text: 'text-white' },
  { border: 'border-cyan-500', bg: 'bg-cyan-600', text: 'text-white' },
  { border: 'border-rose-500', bg: 'bg-rose-600', text: 'text-white' },
];

export default function FoodPlateOverlay({
  imageUrl,
  items = [],
  selectedItemId = null,
  onSelectItem = () => {},
  className = ""
}) {
  if (!imageUrl) return null;

  return (
    <div className={`relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-color)] bg-black/90 shadow-sm ${className}`}>
      {/* Base Image */}
      <img
        src={imageUrl}
        alt="Analyzed food plate"
        className="w-full h-auto max-h-[460px] object-contain block mx-auto select-none"
      />

      {/* Bounding Box Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {items.map((item, idx) => {
          if (!item.box) return null;
          const { ymin, xmin, ymax, xmax } = item.box;
          const color = BOX_COLORS[idx % BOX_COLORS.length];
          const isSelected = selectedItemId === item.id || selectedItemId === item.name;

          const top = Math.max(0, Math.min(100, ymin * 100));
          const left = Math.max(0, Math.min(100, xmin * 100));
          const width = Math.max(5, Math.min(100 - left, (xmax - xmin) * 100));
          const height = Math.max(5, Math.min(100 - top, (ymax - ymin) * 100));

          return (
            <div
              key={item.id || idx}
              onClick={() => onSelectItem(item)}
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={`absolute pointer-events-auto cursor-pointer transition-all duration-150 border-2 rounded-lg ${color.border} ${
                isSelected
                  ? 'ring-2 ring-white shadow-md z-20'
                  : 'hover:ring-1 hover:ring-white/80 z-10'
              }`}
            >
              <div
                className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide whitespace-nowrap shadow-xs ${color.bg} ${color.text}`}
              >
                {item.name} {item.portion_grams ? `(${Math.round(item.portion_grams)}g)` : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
