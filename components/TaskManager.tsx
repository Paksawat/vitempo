import React, { useState, useEffect, useRef } from 'react';
import TaskItem from './TaskItem';
import { X, SquarePlus } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  estCycles: number;
  completedCycles: number;
}

interface TaskManagerProps {
  currentCycle: number;
  autoCheckTasksOnCompletion: boolean;
}

function isTaskComplete(task: Task): boolean {
  return task.completedCycles >= task.estCycles;
}

export default function TaskManager({
  currentCycle,
  autoCheckTasksOnCompletion,
}: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newEstCycles, setNewEstCycles] = useState(1);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEstCycles, setEditEstCycles] = useState(1);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDraggingOverCurrent, setIsDraggingOverCurrent] = useState(false);

  const prevCycleRef = useRef(currentCycle);

  const currentTask = tasks.find((t) => t.id === currentTaskId);
  const isCurrentTaskValid = currentTask && !isTaskComplete(currentTask);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  const effectiveCurrentTaskId = isCurrentTaskValid
    ? currentTaskId
    : tasks.find((task) => !isTaskComplete(task))?.id || null;

  useEffect(() => {
    // Only auto-increment completedCycles if autoCheckTasksOnCompletion is enabled
    if (
      autoCheckTasksOnCompletion &&
      currentCycle > prevCycleRef.current &&
      effectiveCurrentTaskId
    ) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === effectiveCurrentTaskId
            ? {
                ...task,
                completedCycles: Math.min(
                  task.completedCycles + (currentCycle - prevCycleRef.current),
                  task.estCycles
                ),
              }
            : task
        )
      );
    }
    prevCycleRef.current = currentCycle;
  }, [currentCycle, effectiveCurrentTaskId, autoCheckTasksOnCompletion]);

  function addTask() {
    if (!newTitle.trim()) return alert('Task title is required');
    if (newEstCycles < 1) return alert('Estimated cycles must be at least 1');

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      estCycles: newEstCycles,
      completedCycles: 0,
    };
    setTasks((t) => [...t, newTask]);
    setNewTitle('');
    setNewEstCycles(1);
  }

  function deleteTask(id: string) {
    setTasks((t) => t.filter((task) => task.id !== id));
    if (currentTaskId === id) {
      setCurrentTaskId(null);
    }
  }

  function startEdit(task: Task) {
    if (showNewTaskForm) {
      setShowNewTaskForm(false); // close new task form if open
    }
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditEstCycles(task.estCycles);
  }

  function saveEdit() {
    if (!editTitle.trim()) return alert('Task title is required');
    if (editEstCycles < 1) return alert('Estimated cycles must be at least 1');

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, title: editTitle.trim(), estCycles: editEstCycles }
          : task
      )
    );
    setEditingTaskId(null);
  }

  function cancelEdit() {
    setEditingTaskId(null);
  }

  // New helper to open new task form with edit check
  function tryOpenNewTaskForm() {
    if (editingTaskId !== null) {
      const confirmResult = window.confirm(
        'You have unsaved changes. Save changes before adding a new task?'
      );
      if (confirmResult) {
        saveEdit();
        setShowNewTaskForm(true);
      } else {
        cancelEdit();
        setShowNewTaskForm(true);
      }
    } else {
      setShowNewTaskForm(true);
    }
  }

  function handleDragStart(taskId: string) {
    setDraggedTaskId(taskId);
  }

  function handleDragOver(e: React.DragEvent, targetTaskId: string) {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex((t) => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
  }

  function handleDragEnd() {
    setDraggedTaskId(null);
    setIsDraggingOverCurrent(false);
  }

  function handleCurrentTaskDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (draggedTaskId) {
      setIsDraggingOverCurrent(true);
    }
  }

  function handleCurrentTaskDragLeave() {
    setIsDraggingOverCurrent(false);
  }

  function handleCurrentTaskDrop(e: React.DragEvent) {
    e.preventDefault();
    if (draggedTaskId) {
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && !isTaskComplete(task)) {
        setCurrentTaskId(draggedTaskId);
      }
    }
    setIsDraggingOverCurrent(false);
  }

  // New toggle complete handler:
  function toggleComplete(taskId: string) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completedCycles: isTaskComplete(task) ? 0 : task.estCycles, // toggle fully complete or reset to 0
            }
          : task
      )
    );
  }

  const displayCurrentTask = tasks.find((t) => t.id === effectiveCurrentTaskId);

  return (
    <div className="mx-auto max-w-[500px] min-w-[300px] w-full px-4 over">
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-gray-200">
        Tasks
      </h2>
      {/* Current Task Field */}
      <div
        onDragOver={handleCurrentTaskDragOver}
        onDragLeave={handleCurrentTaskDragLeave}
        onDrop={handleCurrentTaskDrop}
        className={`mb-4 rounded-lg transition-colors `}
      >
        {displayCurrentTask && (
          <>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-600 mb-2">
              Current Task
            </h3>
            <div className="flex w-full min-h-[55px]">
              {isDraggingOverCurrent ? (
                <div className="flex w-full items-center justify-center flex-col gap-2 rounded bg-slate-200 border-slate-200 dark:bg-slate-600 dark:text-gray-200 border border-dashed dark:border-slate-400">
                  {' '}
                  <p className="dark:text-slate-600 text-slate-700">
                    Drop to set task
                  </p>
                </div>
              ) : (
                <TaskItem
                  task={displayCurrentTask}
                  isCurrent={true}
                  isComplete={isTaskComplete(displayCurrentTask)}
                  editingTaskId={editingTaskId}
                  editTitle={editTitle}
                  editEstCycles={editEstCycles}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onDelete={deleteTask}
                  onEditTitleChange={setEditTitle}
                  onEditEstCyclesChange={setEditEstCycles}
                  onToggleComplete={toggleComplete}
                />
              )}
            </div>
            <span className="h-px my-4 block border-t border-slate-300 dark:border-slate-600"></span>
          </>
        )}
      </div>

      {/* Tasks List */}
      <ul className="space-y-2 w-full">
        {tasks
          .filter((task) => task.id !== effectiveCurrentTaskId)
          .map((task) => {
            const isCurrent = task.id === effectiveCurrentTaskId;
            const isComplete = isTaskComplete(task);

            return (
              <li key={task.id} className={`flex w-full min-h-[55px] `}>
                <TaskItem
                  task={task}
                  isCurrent={isCurrent}
                  isComplete={isComplete}
                  isDragged={draggedTaskId === task.id}
                  editingTaskId={editingTaskId}
                  editTitle={editTitle}
                  editEstCycles={editEstCycles}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onDelete={deleteTask}
                  onEditTitleChange={setEditTitle}
                  onEditEstCyclesChange={setEditEstCycles}
                  onToggleComplete={toggleComplete}
                />
              </li>
            );
          })}
      </ul>

      {/* Add Task Toggle Box */}
      {!showNewTaskForm && (
        <div
          onClick={tryOpenNewTaskForm}
          className="cursor-pointer px-4 py-2 mb-4 rounded flex gap-2 justify-center dark:text-slate-500 text-slate-500 font-semibold  select-none mt-4 border border-dashed dark:border-slate-500 border-slate-500"
        >
          <SquarePlus className="text-slate-500 dark:text-slate-500" />{' '}
          <p className="text-slate-500 dark:text-slate-500">Add Task</p>
        </div>
      )}

      {/* New Task Form */}
      {showNewTaskForm && (
        <>
          <div className="flex w-full flex-col gap-2 rounded dark:bg-slate-800 dark:text-slate-400 p-3 mt-4 bg-slate-200 text-slate-500">
            <div
              onClick={() => setShowNewTaskForm(false)}
              className="flex justify-between align-middle cursor-pointer"
            >
              <p className="text-sm font-medium border-l-4 pl-1 border-slate-400 dark:border-slate-600">
                Add new task
              </p>
              <X size={16} className="dark:text-slate-500" />
            </div>
            {/* Close Button */}
            <textarea
              placeholder="Task title"
              value={newTitle}
              autoFocus
              onChange={(e) => {
                setNewTitle(e.target.value);

                // auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              rows={1}
              className="rounded py-1 font-semibold text-xs focus:outline-none resize-none overflow-hidden leading-tight"
            ></textarea>

            <div className="flex items-center">
              <label className="font-medium mr-4">Est. cycles</label>
              <select
                value={newEstCycles}
                onChange={(e) => setNewEstCycles(Number(e.target.value))}
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

            <button
              onClick={() => {
                addTask();
                setShowNewTaskForm(false);
              }}
              className="dark:bg-slate-700 dark:text-slate-200 text-slate-700 bg-slate-300 px-4 py-1 rounded dark:hover:bg-slate-600 cursor-pointer mt-1"
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
}
