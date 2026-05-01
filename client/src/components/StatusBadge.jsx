import React from 'react';
const styles = {
  Todo: 'bg-slate-100 text-slate-700 border-slate-200',
  'In Progress': 'bg-primary-50 text-primary-700 border-primary-200',
  Done: 'bg-leaf/10 text-leaf border-leaf/20'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || styles.Todo}`}>
    {status}
  </span>
);

export default StatusBadge;
