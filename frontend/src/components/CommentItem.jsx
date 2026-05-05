const CommentItem = ({ comment }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{comment.user?.name || 'Unknown'}</p>
          <p className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-3 text-slate-700">{comment.text}</p>
    </div>
  );
};

export default CommentItem;
