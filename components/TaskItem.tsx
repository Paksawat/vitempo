import React, { useEffect, useRef } from 'react';
import { Task } from './TaskManager';
import { GripVertical, Trash2, Circle, CircleCheck, X } from 'lucide-react';

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
  const editRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.style.height = 'auto';
      editRef.current.style.height = `${editRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="flex w-full flex-col gap-2 rounded dark:bg-slate-800 dark:text-slate-400 p-3 mt-4 bg-slate-200 text-slate-500">
        {/* Header: Edit + Close button */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium border-l-4 pl-1 border-slate-400 dark:border-slate-600">
            Edit task
          </p>
          <button onClick={onCancelEdit} className="cursor-pointer">
            <X size={16} className="dark:text-slate-500" />
          </button>
        </div>

        {/* Title input (textarea auto-size) */}
        <textarea
          ref={editRef}
          placeholder="Task title"
          value={editTitle}
          onChange={(e) => {
            onEditTitleChange(e.target.value);

            // auto-grow
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          rows={1}
          className="rounded py-1 text-xs font-semibold focus:outline-none resize-none overflow-hidden leading-tight"
        />

        {/* Cycles selector */}
        <div className="flex items-center">
          <label className="font-medium mr-4 text-xs">Est. cycles</label>
          <select
            value={editEstCycles}
            onChange={(e) => onEditEstCyclesChange(Number(e.target.value))}
            className="w-14 rounded px-2 py-1 border-none focus:outline-none center dark:text-slate-400 dark:bg-slate-700 bg-slate-300"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option
                key={num}
                value={num}
                className="dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500"
              >
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Save button */}
        <button
          onClick={onSaveEdit}
          className="dark:bg-slate-700 text-slate-700 bg-slate-300 px-4 py-1 rounded dark:hover:bg-slate-600 cursor-pointer mt-1"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between w-full select-none pl-4 dark:bg-slate-700 rounded-md ${
        isDragged ? 'opacity-70' : ''
      } ${
        isComplete
          ? ' cursor-default dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-700 hover:bg-slate-300'
          : 'cursor-pointer dark:bg-gray-300 bg-slate-200 dark:hover:bg-gray-700 hover:bg-slate-300'
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
          <CircleCheck size={22} className="text-green-700" />
        ) : (
          <Circle size={22} className="text-gray-500" />
        )}
      </button>
      {/* Task info */}
      <div className="flex flex-col grow min-w-0 pr-2 py-2">
        <span
          className={`font-semibold text-xs wrap-break-word whitespace-normal ${
            isComplete
              ? 'line-through dark:text-slate-600'
              : 'dark:text-slate-400 '
          } ${isCurrent ? 'text-slate-500' : 'text-slate-500'}`}
        >
          {task.title}
        </span>
      </div>

      {/* Delete button - hidden if complete */}
      <span className="text-sm dark:text-slate-400 min-w-12 text-center">
        {task.completedCycles} / {task.estCycles}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        aria-label="Delete task"
        className="text-red-800 hover:text-red-700 font-bold text-lg px-2 mx-2 cursor-pointer"
        title="Delete task"
        type="button"
      >
        <Trash2 size={18} />
      </button>

      {/* Drag handle - hidden if complete */}
      {!isComplete && (
        <span
          className="drag-handle cursor-move h-full text-gray-600 hover:text-gray-900 flex items-center pr-4 rounded-r-md relative -right-px"
          title="Drag to reorder or move to current task"
          aria-label="Drag handle"
        >
          <GripVertical
            size={20}
            className="dark:text-slate-400 text-slate-500"
          />
        </span>
      )}
    </div>
  );
}
