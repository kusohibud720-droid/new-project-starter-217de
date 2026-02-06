import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Sparkles, Zap, Target, Plus, Trash2 } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [started, setStarted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Попробовать ZenTask", completed: false },
    { id: 2, text: "Добавить новую задачу", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
            Zen<span className="text-primary">Task</span>
          </h1>

          {/* Add Task */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Новая задача..."
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={addTask}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl group"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      task.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                  </button>
                  <span
                    className={`flex-1 ${
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {tasks.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              Нет задач. Добавьте первую! ✨
            </p>
          )}

          <button
            onClick={() => setStarted(false)}
            className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mx-auto block"
          >
            ← Назад
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Проект успешно запущен</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold text-foreground mb-4 tracking-tight"
        >
          Zen<span className="text-primary">Task</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Минималистичный менеджер задач для продуктивной работы
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStarted(true)}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow cursor-pointer"
        >
          Начать работу
        </motion.button>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full"
      >
        {[
          { icon: CheckCircle, title: "Простота", desc: "Интуитивный интерфейс без лишних деталей" },
          { icon: Zap, title: "Скорость", desc: "Мгновенная работа без задержек" },
          { icon: Target, title: "Фокус", desc: "Концентрация на главных задачах" },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-xs text-muted-foreground/60 mt-16"
      >
        Готов к разработке ✓
      </motion.p>
    </div>
  );
};

export default Index;