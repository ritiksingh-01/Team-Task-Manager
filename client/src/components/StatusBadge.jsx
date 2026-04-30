import React from 'react';
const styles = {
  Todo: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Done: 'bg-emerald-100 text-emerald-700'
};

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
    {status}
  </span>
);

export default StatusBadge;
