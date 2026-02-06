import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle, Zap, Target, Bot, ArrowLeft, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/Calendar";
import { TaskList } from "@/components/TaskList";
import { TaskAssistant } from "@/components/TaskAssistant";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

const Index = () => {
  const [started, setStarted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Попробовать ZenTask", completed: false },
    { id: 2, text: "Добавить задачу в календарь", completed: false },
  ]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const addTask = (text: string, dueDate?: string) => {
    if (text.trim()) {
      setTasks([...tasks, { id: Date.now(), text, completed: false, dueDate }]);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddTaskToDate = (date: string) => {
    setSelectedDate(date);
  };

  if (started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Zen<span className="text-primary">Task</span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAssistant(!showAssistant)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  showAssistant
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                <Bot className="w-4 h-4" />
                <span className="hidden md:inline text-sm font-medium">Ассистент</span>
              </button>
              <button
                onClick={() => {
                  setStarted(false);
                  setShowAssistant(false);
                }}
                className="p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Calendar - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Calendar
                tasks={tasks}
                onAddTaskToDate={handleAddTaskToDate}
                onSelectDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>

            {/* Task List */}
            <div className="lg:col-span-1">
              <TaskList
                tasks={tasks}
                selectedDate={selectedDate}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
              />
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 grid grid-cols-2 gap-3"
              >
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{tasks.filter(t => t.completed).length}</p>
                  <p className="text-xs text-muted-foreground">Выполнено</p>
                </div>
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{tasks.filter(t => !t.completed).length}</p>
                  <p className="text-xs text-muted-foreground">Осталось</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Clear Date Selection */}
          {selectedDate && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedDate(null)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 mx-auto"
            >
              <CalendarDays className="w-4 h-4" />
              Показать все задачи
            </motion.button>
          )}
        </motion.div>

        {/* AI Assistant */}
        {showAssistant && (
          <TaskAssistant tasks={tasks} onClose={() => setShowAssistant(false)} />
        )}
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
          <span className="text-sm font-medium">С ИИ-ассистентом</span>
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
          Умный менеджер задач с календарём и ботом-помощником
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
          { icon: Bot, title: "ИИ-ассистент", desc: "Бот помогает ставить задачи и напоминает о сроках" },
          { icon: CalendarDays, title: "Календарь", desc: "Планируй задачи прямо на календаре" },
          { icon: Target, title: "Фокус", desc: "Концентрация на главных задачах дня" },
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
    </div>
  );
};

export default Index;
