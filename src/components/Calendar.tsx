import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

interface CalendarProps {
  tasks: Task[];
  onAddTaskToDate: (date: string) => void;
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}

const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export const Calendar = ({ tasks, onAddTaskToDate, onSelectDate, selectedDate }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;
  
  const daysInMonth = lastDayOfMonth.getDate();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  
  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const getTasksForDate = (date: string) => {
    return tasks.filter(t => t.dueDate === date);
  };
  
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };
  
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-20 md:h-24" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(day);
    const dayTasks = getTasksForDate(date);
    const isSelected = selectedDate === date;
    
    days.push(
      <motion.div
        key={day}
        whileHover={{ scale: 1.02 }}
        onClick={() => onSelectDate(date)}
        className={`h-20 md:h-24 p-1 md:p-2 rounded-lg border cursor-pointer transition-colors ${
          isSelected 
            ? "border-primary bg-primary/10" 
            : "border-border/50 hover:border-primary/50 bg-card/50"
        } ${isToday(day) ? "ring-2 ring-primary/30" : ""}`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${isToday(day) ? "text-primary" : "text-foreground"}`}>
            {day}
          </span>
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTaskToDate(date);
              }}
              className="p-0.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-3 h-3 text-primary" />
            </button>
          )}
        </div>
        <div className="space-y-0.5 overflow-hidden">
          <AnimatePresence>
            {dayTasks.slice(0, 2).map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-xs truncate px-1 py-0.5 rounded ${
                  task.completed 
                    ? "bg-muted text-muted-foreground line-through" 
                    : "bg-primary/20 text-primary"
                }`}
              >
                {task.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {dayTasks.length > 2 && (
            <span className="text-xs text-muted-foreground">+{dayTasks.length - 2}</span>
          )}
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h3 className="text-lg font-semibold text-foreground">
          {MONTHS_RU[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_RU.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};
