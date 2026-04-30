import React from 'react';
const StatCard = ({ label, value, tone = 'slate' }) => {
  const tones = {
    slate: 'border-slate-200 bg-white text-slate-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    orange: 'border-orange-200 bg-orange-50 text-orange-800'
  };

  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
