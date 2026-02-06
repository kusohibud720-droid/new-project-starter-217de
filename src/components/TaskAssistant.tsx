import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface TaskAssistantProps {
  tasks: Task[];
  onClose: () => void;
}

export const TaskAssistant = ({ tasks, onClose }: TaskAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial greeting with reminder
    getReminder();
  }, []);

  const getReminder = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("task-assistant", {
        body: { tasks, type: "reminder", message: "Дай напоминание о моих задачах" },
      });

      if (error) throw error;

      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: data.reply || "Привет! Я твой помощник ZenTask. Чем могу помочь? 🚀",
        },
      ]);
    } catch (error) {
      console.error("Error getting reminder:", error);
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: "Привет! Я твой помощник ZenTask. Чем могу помочь? 🚀",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("task-assistant", {
        body: { tasks, type: "help", message: userMessage.content },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: data.reply || "Извини, не смог обработать запрос. Попробуй ещё раз! 🔄",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Упс! Что-то пошло не так. Попробуй позже 😅",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-80 md:w-96 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-primary/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">ZenBot</h4>
            <p className="text-xs text-muted-foreground">Твой помощник</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-muted px-3 py-2 rounded-xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Думаю...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Спроси что-нибудь..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={getReminder}
          disabled={isLoading}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          Получить напоминание
        </button>
      </div>
    </motion.div>
  );
};
