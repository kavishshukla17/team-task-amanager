import React from "react";

export default function TaskCard({ task, onClick }) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && due.getTime() < Date.now() && task.status !== "Done";

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md active:translate-y-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-black">{task.title}</div>
          {task.description ? <div className="mt-1 text-sm text-black/60 line-clamp-2">{task.description}</div> : null}
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            task.priority === "High"
              ? "bg-black text-white"
              : task.priority === "Low"
              ? "bg-black/10 text-black"
              : "bg-black/5 text-black"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/60">
        <span className="rounded-md bg-black/5 px-2 py-1 text-black">{task.status}</span>
        {task.assignedTo?.name ? (
          <span className="rounded-md bg-black/5 px-2 py-1 text-black">Assignee: {task.assignedTo.name}</span>
        ) : (
          <span className="rounded-md bg-black/5 px-2 py-1 text-black">Unassigned</span>
        )}
        {due ? (
          <span className={`rounded-md px-2 py-1 ${overdue ? "bg-black text-white" : "bg-black/5 text-black"}`}>
            Due: {due.toLocaleDateString()}
          </span>
        ) : null}
      </div>
    </button>
  );
}

