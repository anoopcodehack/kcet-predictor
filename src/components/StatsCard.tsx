import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  color: string; // 'lime', 'red', 'white' etc.
}

export default function StatsCard({ title, value, sub, icon: Icon, color }: StatsCardProps) {
  
  const colors = {
    lime: 'bg-lime border-black',
    red: 'bg-red border-black text-white',
    white: 'bg-white border-black text-black',
    gray: 'bg-light-gray border-black text-black'
  };

  const selectedColor = colors[color as keyof typeof colors] || colors.white;

  return (
    <div className={`border-3 border-black p-5 brutalist-shadow-sm flex flex-col justify-between ${selectedColor}`}>
      <div className="flex justify-between items-start gap-2 mb-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest font-black opacity-80 block">
            {title}
          </span>
          <span className="font-black text-3xl md:text-4xl tracking-tight uppercase leading-none block mt-1">
            {value}
          </span>
        </div>
        <div className="bg-black border border-black p-2 shrink-0">
          <Icon className={`w-5 h-5 ${color === 'red' ? 'text-lime' : 'text-lime'}`} />
        </div>
      </div>
      <p className="text-xs font-black uppercase opacity-75">
        {sub}
      </p>
    </div>
  );
}
