import React from 'react';
import { Task } from './TaskManager';
import { GripVertical, Trash2, Circle, CircleCheck } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isCurrent?: boolean;
  isComplete: boolean;
  isDragged?: boolean;
  editingTaskId: string | null;
  editTitle: string;
  editEstCycles: number;
  onDragStart: (taskId: string) => void;
  onDragOver: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditTitleChange: (value: string) => void;
  onEditEstCyclesChange: (value: number) => void;
  onToggleComplete: (taskId: string) => void;
}

export default function TaskItem({
  task,
  isCurrent = false,
  isComplete,
  isDragged = false,
  editingTaskId,
  editTitle,
  editEstCycles,
  onDragStart,
  onDragOver,
  onDragEnd,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditTitleChange,
  onEditEstCyclesChange,
  onToggleComplete,
}: TaskItemProps) {
  const isEditing = editingTaskId === task.id;

  if (isEditing) {
    return (
      <div className="flex w-full flex-col gap-2 rounded dark:bg-gray-300 dark:text-slate-600 ">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          className="border rounded px-2 py-1 font-semibold"
          autoFocus
        />

        <div className="flex gap-2 p-2 justify-between">
          <div>
            <label htmlFor="">cycles:</label>
            <input
              type="number"
              min={1}
              value={editEstCycles}
              onChange={(e) => onEditEstCyclesChange(Number(e.target.value))}
              className="w-24 border rounded px-2 py-1"
            />
          </div>
          <div>
            <button
              onClick={onCancelEdit}
              className="dark:text-gray-500 px-3 py-1 rounded hover:text-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onSaveEdit}
              className="dark:bg-slate-600 text-white px-3 py-1 rounded dark:hover:bg-slate-500 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-between  hover:bg-gray-200 dark:hover:bg-gray-700  select-none pl-4 bg-gray-100 rounded-md ${
        isDragged ? 'opacity-70' : ''
      } ${
        isComplete
          ? ' cursor-default dark:bg-slate-700'
          : 'cursor-pointer dark:bg-gray-300 '
      }`}
      onClick={(e) => {
        if (isComplete) return;
        const target = e.target as HTMLElement;
        if (
          target.closest('button') ||
          target.closest('input[type="checkbox"]') ||
          target.closest('.drag-handle')
        ) {
          return;
        }
        onStartEdit(task);
      }}
      role="button"
      tabIndex={isComplete ? -1 : 0} // not focusable if completed
      onKeyDown={(e) => {
        if (isComplete) return; // no editing if complete
        if (e.key === 'Enter' || e.key === ' ') {
          onStartEdit(task);
        }
      }}
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(task.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, task.id);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
    >
      {/* Checkbox circle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isComplete) onToggleComplete(task.id);
        }}
        className={`
            mr-3 flex items-center justify-center cursor-pointer
        `}
        aria-label="Toggle complete"
      >
        {isComplete ? (
          <CircleCheck size={22} className="text-green-600" />
        ) : (
          <Circle size={22} className="text-gray-500" />
        )}
      </button>
      {/* Task info */}
      <div className="flex flex-col grow">
        <span
          className={`font-semibold ${
            isComplete
              ? 'line-through dark:text-gray-500'
              : 'dark:text-slate-600 '
          } ${isCurrent ? 'text-green-700' : ''}`}
        >
          {task.title}
        </span>
      </div>

      {/* Delete button - hidden if complete */}
      <span className="text-sm text-gray-600">
        {task.completedCycles} / {task.estCycles}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        aria-label="Delete task"
        className="text-red-600 hover:text-red-800 font-bold text-lg px-2 mx-2 cursor-pointer"
        title="Delete task"
        type="button"
      >
        <Trash2 size={18} />
      </button>

      {/* Drag handle - hidden if complete */}
      {!isComplete && (
        <span
          className="drag-handle cursor-move h-full text-gray-600 hover:text-gray-900 flex items-center dark:bg-gray-200 px-2 rounded-r-md relative -right-px"
          title="Drag to reorder or move to current task"
          aria-label="Drag handle"
        >
          <GripVertical size={20} className="text-slate-800" />
        </span>
      )}
    </div>
  );
}
