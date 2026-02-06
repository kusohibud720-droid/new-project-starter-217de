import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Check, Clock, Calendar as CalendarIcon, Palette, Mic, X, Download, Sparkles, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Todo } from './types';
import { themes } from './themes';
import TodoItem from './components/TodoItem';
import AIAssistant from './components/AIAssistant';
import AlarmModal from './components/AlarmModal';
import CalendarView from './components/CalendarView';
import EditModal from './components/EditModal';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('zentask-todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('zentask-theme') || 'zen';
  });

  const [inputText, setInputText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = themes[currentTheme];

  useEffect(() => {
    localStorage.setItem('zentask-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('zentask-theme', currentTheme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const bgColor = currentTheme === 'zen' ? '#f9fafb' : currentTheme === 'cyberpunk' ? '#0f172a' : '#000000';
      metaThemeColor.setAttribute('content', bgColor);
    }
  }, [currentTheme]);

  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();
      let hasUpdates = false;
      let triggeredTodo: Todo | null = null;

      const updatedTodos = todos.map(todo => {
        if (!todo.completed && todo.reminder && todo.reminder <= now && !todo.reminderNotified) {
          if (Notification.permission === 'granted') {
            new Notification('Напоминание', { body: todo.text });
          }
          triggeredTodo = todo;
          hasUpdates = true;
          return { ...todo, reminderNotified: true };
        }
        return todo;
      });

      if (hasUpdates) {
        setTodos(updatedTodos);
        if (triggeredTodo) {
          setActiveAlarm(triggeredTodo);
        }
      }
    };

    const intervalId = setInterval(checkReminders, 5000);
    return () => clearInterval(intervalId);
  }, [todos]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowThemeMenu(false);
        setShowDatePicker(false);
        setShowAI(false);
        setActiveAlarm(null);
        setShowCalendar(false);
        setEditingTodo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ru-RU';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddTodo = useCallback((text: string, reminderTimestamp?: number) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      reminder: reminderTimestamp || (reminderDate ? new Date(reminderDate).getTime() : undefined),
      reminderNotified: false,
    };

    setTodos(prev => [newTodo, ...prev]);
    if (!reminderTimestamp) {
      setInputText('');
      setReminderDate('');
      setShowDatePicker(false);
    }
  }, [reminderDate]);

  const handleUpdateTodo = useCallback((id: string, updatedText: string, updatedReminder?: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, text: updatedText, reminder: updatedReminder, reminderNotified: false } 
        : todo
    ));
    setEditingTodo(null);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
  };

  const formatInputDisplay = (val: string) => {
    if (!val) return 'ДД/ММ/ГГГГ --:--';
    try {
      const [datePart, timePart] = val.split('T');
      const [y, m, d] = datePart.split('-');
      return `${d}/${m}/${y} ${timePart}`;
    } catch {
      return 'ДД/ММ/ГГГГ --:--';
    }
  };

  return (
    <div 
      className={`h-[100dvh] w-full transition-colors duration-500 ${theme.appBg} ${theme.font} overflow-hidden`}
    >
      <div className="scroll-container w-full flex flex-col items-center">
        <div 
          className="w-full max-w-lg px-6 flex flex-col min-h-full"
          style={{ 
            paddingTop: 'calc(1.5rem + var(--sat))',
            paddingBottom: 'calc(2rem + var(--sab))'
          }}
        >
          {/* Панель управления */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className={`p-3.5 shadow-lg active:scale-95 transition-all ${theme.itemBg} ${theme.itemText} ${theme.radius} border ${theme.itemBorder}`}
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => setShowAI(!showAI)}
                className={`p-3.5 shadow-lg active:scale-95 transition-all ${showAI ? theme.buttonMain + ' ' + theme.buttonMainText : theme.itemBg + ' ' + theme.itemText} ${theme.radius} border ${theme.itemBorder} relative`}
              >
                <Sparkles className={`w-5 h-5 ${showAI ? '' : 'text-purple-500'}`} />
                {!showAI && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></span>}
              </button>
              <button 
                onClick={() => setShowCalendar(true)}
                className={`p-3.5 shadow-lg active:scale-95 transition-all ${theme.itemBg} ${theme.itemText} ${theme.radius} border ${theme.itemBorder}`}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`p-3.5 shadow-lg active:scale-95 transition-all ${theme.itemBg} ${theme.itemText} ${theme.radius} border ${theme.itemBorder}`}
            >
              <Palette className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {showThemeMenu && (
              <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowThemeMenu(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  className={`relative w-full max-w-sm overflow-hidden shadow-2xl border ${theme.itemBg} ${theme.itemBorder} ${theme.radius} p-2`}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(themes).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setCurrentTheme(t); setShowThemeMenu(false); }}
                        className={`text-left px-4 py-4 rounded-xl text-sm font-bold transition-all active:scale-95
                          ${currentTheme === t ? theme.accent + ' bg-black/5 ring-2 ring-current ring-inset' : theme.textSec + ' hover:bg-black/5'}
                        `}
                      >
                        {themes[t].name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>{showAI && <AIAssistant todos={todos} theme={theme} onClose={() => setShowAI(false)} onAddTask={(text, rem) => handleAddTodo(text, rem)} />}</AnimatePresence>
          <AnimatePresence>{showCalendar && <CalendarView todos={todos} theme={theme} onClose={() => setShowCalendar(false)} />}</AnimatePresence>
          <AnimatePresence>{activeAlarm && <AlarmModal todo={activeAlarm} theme={theme} onDismiss={() => setActiveAlarm(null)} />}</AnimatePresence>
          <AnimatePresence>{editingTodo && <EditModal todo={editingTodo} theme={theme} currentThemeName={currentTheme} onClose={() => setEditingTodo(null)} onSave={(text, reminder) => handleUpdateTodo(editingTodo.id, text, reminder)} />}</AnimatePresence>

          {/* Заголовок */}
          <motion.div className="mb-10 text-center" layout>
            <h1 className={`text-5xl font-black tracking-tighter mb-2 ${theme.textMain}`}>Задачи</h1>
            <p className={`text-lg font-bold opacity-60 ${theme.textSec}`}>Выполнено {stats.completed} из {stats.total}</p>
            <div className={`w-full rounded-full h-2.5 mt-6 overflow-hidden ${theme.itemBg} border ${theme.itemBorder}`}>
              <motion.div className={`h-full ${theme.buttonMain}`} initial={{ width: 0 }} animate={{ width: `${stats.total === 0 ? 0 : (stats.completed / stats.total) * 100}%` }} transition={{ duration: 0.8, ease: "circOut" }} />
            </div>
          </motion.div>

          {/* Ввод задачи */}
          <div className="relative mb-10 z-10">
            <motion.form onSubmit={(e) => { e.preventDefault(); handleAddTodo(inputText); }} className="relative flex flex-col gap-3">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Что планируете?"
                  className={`w-full pl-6 pr-28 py-5 text-lg transition-all outline-none ${theme.inputBg} ${theme.inputText} ${theme.inputPlaceholder} ${theme.inputBorder} ${theme.inputShadow} ${theme.radius} focus:ring-4 focus:ring-opacity-10`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button type="button" onClick={toggleListening} className={`p-2.5 transition-all ${theme.radius} ${isListening ? 'text-red-500 bg-red-50' : theme.buttonSecondary}`}>
                    <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                  </button>
                  <button type="button" onClick={() => setShowDatePicker(!showDatePicker)} className={`p-2.5 transition-all ${theme.radius} ${reminderDate ? theme.accent : theme.buttonSecondary}`}>
                    <Clock className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {inputText.trim() && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} type="submit" className={`w-full py-4 font-bold flex items-center justify-center gap-2 ${theme.buttonMain} ${theme.buttonMainText} ${theme.radius} shadow-xl active:scale-95 transition-transform`}>
                  <Plus className="w-6 h-6" /> Добавить задачу
                </motion.button>
              )}
            </motion.form>

            {/* Блок Напоминания */}
            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-3 border shadow-xl ${theme.inputBg} ${theme.radius} ${theme.itemBorder} overflow-hidden`}
                >
                  <div className="p-5 flex flex-col gap-4 relative">
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold opacity-60 ${theme.textMain}`}>Напоминание</span>
                      <X className="w-5 h-5 opacity-40 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => setShowDatePicker(false)} />
                    </div>
                    
                    <div className="relative w-full flex items-center min-h-[40px] pb-1">
                      <div className={`text-2xl font-black ${theme.inputText} tracking-tight ${!reminderDate ? 'opacity-30' : 'opacity-100'}`}>
                        {formatInputDisplay(reminderDate)}
                      </div>
                      <input 
                        type="datetime-local"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full"
                      />
                      <Calendar className={`absolute right-0 bottom-1 w-7 h-7 opacity-80 ${theme.textMain}`} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Список */}
          <div className="flex-1">
            <ul className="space-y-3 pb-20">
              <AnimatePresence mode='popLayout' initial={false}>
                {todos.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-20">
                    <Check className={`w-12 h-12 mx-auto mb-2 ${theme.textSec}`} />
                    <p className="text-lg font-bold italic">Пока пусто</p>
                  </motion.div>
                ) : (
                  todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} theme={theme} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={() => setEditingTodo(todo)} />
                  ))
                )}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;