const ActivityItem = ({ activity }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-900">{activity.action}</div>
        <div className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleString()}</div>
      </div>
      <div className="mt-2 text-sm text-slate-600">Performed by: {activity.performedBy?.name || 'Unknown'}</div>
    </div>
  );
};

export default ActivityItem;
