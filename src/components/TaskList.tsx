import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle, CalendarDays } from "lucide-react";
import { VoiceInput } from "./VoiceInput";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
  selectedDate: string | null;
  onAddTask: (text: string, dueDate?: string) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export const TaskList = ({
  tasks,
  selectedDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) => {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask, selectedDate || undefined);
      setNewTask("");
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  const filteredTasks = selectedDate
    ? tasks.filter((t) => t.dueDate === selectedDate)
    : tasks;

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {selectedDate ? `Задачи на ${formatDate(selectedDate)}` : "Все задачи"}
        </h3>
        {selectedDate && (
          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            {filteredTasks.length} задач
          </span>
        )}
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          placeholder={selectedDate ? "Добавить задачу на эту дату..." : "Новая задача..."}
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <VoiceInput 
          onResult={(text) => {
            setNewTask(text);
          }}
        />
        <button
          onClick={handleAddTask}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 p-3 bg-background/50 border border-border/30 rounded-xl group"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                  task.completed
                    ? "bg-primary border-primary"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {task.completed && (
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm block truncate ${
                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {task.text}
                </span>
                {task.dueDate && !selectedDate && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTasks.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            {selectedDate ? "Нет задач на эту дату ✨" : "Нет задач. Добавь первую! ✨"}
          </p>
        )}
      </div>
    </div>
  );
};
