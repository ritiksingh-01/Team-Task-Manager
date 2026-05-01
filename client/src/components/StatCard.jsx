import React from 'react';
const StatCard = ({ label, value, tone = 'slate', icon }) => {
  const tones = {
    slate: {
      bg: 'bg-white',
      border: 'border-border',
      text: 'text-textMain',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    primary: {
      bg: 'bg-white',
      border: 'border-primary-100',
      text: 'text-primary-900',
      iconBg: 'bg-primary-50',
      iconColor: 'text-primary-600'
    },
    green: {
      bg: 'bg-white',
      border: 'border-leaf/20',
      text: 'text-leaf',
      iconBg: 'bg-leaf/10',
      iconColor: 'text-leaf'
    },
    orange: {
      bg: 'bg-white',
      border: 'border-ember/20',
      text: 'text-ember',
      iconBg: 'bg-ember/10',
      iconColor: 'text-ember'
    }
  };

  const style = tones[tone] || tones.slate;

  return (
    <div className={`relative overflow-hidden rounded-xl border ${style.border} ${style.bg} p-6 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
         <div>
            <p className="text-sm font-semibold text-textMuted">{label}</p>
            <p className={`mt-2 text-4xl font-bold tracking-tight ${style.text}`}>{value}</p>
         </div>
         {icon && (
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}>
               <span className="icon text-2xl">{icon}</span>
            </div>
         )}
      </div>
    </div>
  );
};

export default StatCard;
