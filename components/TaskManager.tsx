import React, { useState, useEffect, useRef } from 'react';
import TaskItem from './TaskItem';

export interface Task {
  id: string;
  title: string;
  estCycles: number;
  completedCycles: number;
}

interface TaskManagerProps {
  currentCycle: number;
}

function isTaskComplete(task: Task): boolean {
  return task.completedCycles >= task.estCycles;
}

export default function TaskManager({ currentCycle }: TaskManagerProps) {
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

  const effectiveCurrentTaskId = isCurrentTaskValid
    ? currentTaskId
    : tasks.find((task) => !isTaskComplete(task))?.id || null;

  useEffect(() => {
    if (currentCycle > prevCycleRef.current && effectiveCurrentTaskId) {
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
  }, [currentCycle, effectiveCurrentTaskId]);

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
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      {/* Current Task Field */}
      <div
        onDragOver={handleCurrentTaskDragOver}
        onDragLeave={handleCurrentTaskDragLeave}
        onDrop={handleCurrentTaskDrop}
        className={`mb-4 rounded-lg transition-colors `}
      >
        {displayCurrentTask && (
          <>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Current Task
            </h3>
            <div className="flex w-full min-h-[70px]">
              {isDraggingOverCurrent ? (
                <div className="flex w-full items-center justify-center flex-col gap-2 rounded dark:bg-slate-600 dark:text-gray-200 border border-dashed dark:border-slate-400">
                  {' '}
                  <p className="dark:text-slate-400">Drop to set task</p>
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
          </>
        )}
      </div>
      <span className="h-px my-4 block border-t dark:border-slate-600"></span>
      {/* Tasks List */}
      <ul className="space-y-2 w-full">
        {tasks
          .filter((task) => task.id !== effectiveCurrentTaskId)
          .map((task) => {
            const isCurrent = task.id === effectiveCurrentTaskId;
            const isComplete = isTaskComplete(task);

            return (
              <li key={task.id} className={`flex w-full min-h-[70px] `}>
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
      <span className="h-px my-4 block border-t dark:border-slate-600"></span>
      {/* New Task Form */}
      <div className="mb-4 flex gap-2 dark:bg-slate-800 ">
        <input
          type="text"
          placeholder="Task Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="grow rounded px-2 py-1"
        />
        <input
          type="number"
          min={1}
          value={newEstCycles}
          onChange={(e) => setNewEstCycles(Number(e.target.value))}
          className="w-20 rounded px-2 py-1"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
