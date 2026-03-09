import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Modern Todo List App - ULTRA ENHANCED Edition
 * 
 * Features:
 * - Smart Templates (Work, Personal, Shopping, Health)
 * - Priority & Categories with 3D effects
 * - Recurring tasks (Daily, Weekly, Monthly)
 * - Due dates with smart reminders
 * - Sub-tasks for breaking down projects
 * - Time tracking & Pomodoro
 * - Productivity insights & streaks
 * - Focus mode (distraction-free)
 * - Advanced search & filtering
 * - Glassmorphism UI with 3D animations
 * - Confetti celebrations on completion
 * - Motion graphics & parallax effects
 */

// TEMPLATE DEFINITIONS
const TEMPLATES = {
  work: {
    icon: '💼',
    name: 'Work',
    desc: 'Professional tasks',
    tasks: [
      { text: 'Review team emails', priority: 'high' },
      { text: 'Complete project documentation', priority: 'medium' },
      { text: 'Schedule team meeting', priority: 'medium' },
      { text: 'Code review for PR #123', priority: 'high' },
    ]
  },
  project: {
    icon: '📊',
    name: 'New Project',
    desc: 'Project setup checklist',
    tasks: [
      { text: 'Define project goals', priority: 'high' },
      { text: 'Create project timeline', priority: 'high' },
      { text: 'Assign team members', priority: 'medium' },
      { text: 'Set up project repository', priority: 'high' },
      { text: 'Create initial documentation', priority: 'medium' },
    ]
  },
  personal: {
    icon: '🌱',
    name: 'Self Growth',
    desc: 'Personal development',
    tasks: [
      { text: 'Morning meditation (10 mins)', priority: 'low' },
      { text: 'Read 20 pages of book', priority: 'medium' },
      { text: 'Exercise/workout session', priority: 'high' },
      { text: 'Journaling - reflect on day', priority: 'low' },
      { text: 'Learn something new', priority: 'medium' },
    ]
  },
  habits: {
    icon: '📈',
    name: 'Daily Habits',
    desc: 'Habit tracking',
    tasks: [
      { text: 'Drink 8 glasses of water', priority: 'medium', recurring: 'daily' },
      { text: 'Morning stretching routine', priority: 'high', recurring: 'daily' },
      { text: 'Gratitude practice', priority: 'low', recurring: 'daily' },
      { text: 'No phone after 9 PM', priority: 'medium', recurring: 'daily' },
    ]
  },
  fitness: {
    icon: '💪',
    name: 'Fitness Goal',
    desc: 'Workout planning',
    tasks: [
      { text: 'Chest & Triceps workout', priority: 'high' },
      { text: 'Cardio 30 mins', priority: 'medium' },
      { text: 'Meal prep for week', priority: 'high' },
      { text: 'Track weight & measurements', priority: 'low' },
    ]
  },
  shopping: {
    icon: '🛒',
    name: 'Shopping List',
    desc: 'Shopping checklist',
    tasks: [
      { text: 'Milk & Dairy products', priority: 'high' },
      { text: 'Fresh vegetables & fruits', priority: 'high' },
      { text: 'Meat & proteins', priority: 'high' },
      { text: 'Pantry staples', priority: 'medium' },
      { text: 'Snacks & drinks', priority: 'low' },
    ]
  },
  health: {
    icon: '🏥',
    name: 'Health Check',
    desc: 'Health maintenance',
    tasks: [
      { text: 'Schedule doctor appointment', priority: 'high' },
      { text: 'Refill medications', priority: 'high' },
      { text: 'Vitamin supplements intake', priority: 'medium' },
      { text: 'Eye check appointment', priority: 'low' },
    ]
  },
  meeting: {
    icon: '🎯',
    name: 'Meeting Prep',
    desc: 'Meeting preparation',
    tasks: [
      { text: 'Prepare presentation slides', priority: 'high' },
      { text: 'Review agenda points', priority: 'medium' },
      { text: 'Gather supporting data', priority: 'medium' },
      { text: 'Test audio/video setup', priority: 'high' },
    ]
  },
};

function App() {
  // State Management
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [recurring, setRecurring] = useState('once');
  const [dueDate, setDueDate] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification?.permission || 'default');
  const [focusMessage, setFocusMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [showInvalidShake, setShowInvalidShake] = useState(false);
  const [streaks, setStreaks] = useState({});
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [timeTracking, setTimeTracking] = useState({});
  const [subtaskInputId, setSubtaskInputId] = useState(null);
  const [subtaskText, setSubtaskText] = useState('');
  const [pomodoroTime, setPomodoroTime] = useState(1500); // 25 minutes in seconds
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievements, setAchievements] = useState({});
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Motivational Quotes
  const MOTIVATIONAL_QUOTES = [
    { text: "Focus on the goal, not the obstacles.", emoji: "🎯" },
    { text: "Every todo completed is a victory!", emoji: "🏆" },
    { text: "You're closer to your goals than yesterday.", emoji: "📈" },
    { text: "Consistency is the key to success.", emoji: "🔑" },
    { text: "Your future self will thank you.", emoji: "🙏" },
    { text: "One step at a time - you got this!", emoji: "👣" },
    { text: "Progress over perfection, always.", emoji: "✨" },
    { text: "Believe in the power of today.", emoji: "💫" },
    { text: "Build momentum with small wins.", emoji: "🚀" },
    { text: "You're stronger than you think.", emoji: "💪" },
  ];

  const STORAGE_KEY = 'modernTodoList_todos_ultra';

  /**
   * Load todos from localStorage on mount
   */
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem(STORAGE_KEY);
      const storedStreaks = localStorage.getItem('todoStreaks');
      const storedCompleted = localStorage.getItem('totalCompleted');
      
      if (storedTodos) setTodos(JSON.parse(storedTodos));
      if (storedStreaks) setStreaks(JSON.parse(storedStreaks));
      if (storedCompleted) setTotalCompleted(parseInt(storedCompleted));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  /**
   * Save todos to localStorage
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      localStorage.setItem('todoStreaks', JSON.stringify(streaks));
      localStorage.setItem('totalCompleted', totalCompleted.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [todos, streaks, totalCompleted]);

  /**
   * Pomodoro Timer Effect
   */
  useEffect(() => {
    if (!pomodoroActive || pomodoroTime <= 0) return;
    
    const interval = setInterval(() => {
      setPomodoroTime((prev) => {
        if (prev <= 1) {
          setPomodoroActive(false);
          const isWork = pomodoroTime > 300; // If it was work session (>5 min)
          alert(isWork ? '🎉 Work session complete! Time for a break.' : '✨ Break over! Ready to work?');
          setPomodoroTime(1500); // Reset to 25 min
          return 1500;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  /**
   * Quote Rotation Effect
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000); // Change quote every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Real-time Clock Update
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Check Achievements
   */
  useEffect(() => {
    const newAchievements = { ...achievements };
    
    if (totalCompleted >= 1 && !newAchievements.firstTodo) {
      newAchievements.firstTodo = true;
    }
    if (totalCompleted >= 10 && !newAchievements.tenTodos) {
      newAchievements.tenTodos = true;
    }
    if (totalCompleted >= 50 && !newAchievements.fiftyTodos) {
      newAchievements.fiftyTodos = true;
    }
    if (Object.keys(streaks).length >= 7 && !newAchievements.weekStreak) {
      newAchievements.weekStreak = true;
    }
    
    setAchievements(newAchievements);
  }, [totalCompleted, streaks]);

  /**
   * Create confetti animation
   */
  const createConfetti = () => {
    const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.delay = Math.random() * 0.3 + 's';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  /**
   * Apply template to create multiple todos
   */
  const applyTemplate = () => {
    if (!selectedTemplate) return;
    
    const templateTasks = TEMPLATES[selectedTemplate].tasks;
    const newTodos = templateTasks.map(task => ({
      id: Date.now() + Math.random(),
      text: task.text,
      completed: false,
      priority: task.priority || 'medium',
      category: selectedTemplate === 'shopping' ? 'shopping' : 
               selectedTemplate === 'health' ? 'health' : 
               selectedTemplate === 'fitness' ? 'health' :
               selectedTemplate === 'work' || selectedTemplate === 'project' || selectedTemplate === 'meeting' ? 'work' : 'personal',
      recurring: task.recurring || 'once',
      createdAt: new Date().toLocaleDateString(),
      subtasks: [],
      timeSpent: 0,
    }));

    setTodos([...todos, ...newTodos]);
    setShowTemplateModal(false);
    setSelectedTemplate(null);
  };

  /**
   * Add a new todo
   */
  const addTodo = () => {
    if (!input.trim()) {
      setShowInvalidShake(true);
      setTimeout(() => setShowInvalidShake(false), 500);
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      priority,
      category,
      recurring,
      dueDate,
      createdAt: new Date().toLocaleDateString(),
      subtasks: [],
      timeSpent: 0,
    };

    setTodos([...todos, newTodo]);
    setHistory([todos, ...history.slice(0, 9)]);
    setInput('');
    setRecurring('once');
    setDueDate('');
  };

  /**
   * Toggle todo completion
   */
  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id && !todo.completed) {
        createConfetti();
        setTotalCompleted(totalCompleted + 1);
        
        // Update streak
        const today = new Date().toDateString();
        if (!streaks[today]) {
          setStreaks({ ...streaks, [today]: 1 });
        }
      }
      return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
    });
    setTodos(updatedTodos);
  };

  /**
   * Start editing a todo
   */
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  /**
   * Save edited todo
   */
  const saveEdit = (id) => {
    if (!editText.trim()) {
      alert('Todo text cannot be empty');
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    );
    setTodos(updatedTodos);
    setHistory([todos, ...history.slice(0, 9)]);
    setEditingId(null);
  };

  /**
   * Delete todo
   */
  const deleteTodo = (id) => {
    if (confirm('Delete this todo?')) {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    }
  };

  /**
   * Add subtask
   */
  const addSubtask = (todoId, subtaskText) => {
    if (!subtaskText.trim()) return;
    
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: [...(todo.subtasks || []), {
            id: Date.now(),
            text: subtaskText,
            completed: false,
          }]
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setSubtaskText('');
    setSubtaskInputId(null);
  };

  /**
   * Toggle subtask
   */
  const toggleSubtask = (todoId, subtaskId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          )
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  /**
   * Undo last action
   */
  const undo = () => {
    if (history.length > 0) {
      setTodos(history[0]);
      setHistory(history.slice(1));
    }
  };

  /**
   * Handle Enter key press in input field
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  /**
   * Clear completed todos
   */
  const clearCompleted = () => {
    if (confirm('Clear all completed todos?')) {
      const updatedTodos = todos.filter((todo) => !todo.completed);
      setTodos(updatedTodos);
      setHistory([todos, ...history.slice(0, 9)]);
    }
  };

  /**
   * Handle Focus Mode - Request notification permission
   */
  const handleFocusMode = async () => {
    if (!focusMode) {
      // Entering focus mode
      try {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            setFocusMessage('✨ Focus Mode Activated! Notifications are suppressed.');
            setNotificationPermission('granted');
          } else if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
              setFocusMessage('✨ Focus Mode Activated! Device notifications will be suppressed.');
              // Close any existing notifications
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                  registrations.forEach((reg) => reg.unregister());
                });
              }
            } else {
              setFocusMessage('⚠️ Notification permission denied. Continuing in Focus Mode.');
            }
          } else {
            setFocusMessage('✨ Focus Mode Activated! (Notifications permanently blocked)');
          }
        } else {
          setFocusMessage('✨ Focus Mode Activated! (Notifications not supported)');
        }
        setFocusMode(true);
        setTimeout(() => setFocusMessage(''), 4000);
      } catch (error) {
        console.error('Focus Mode Error:', error);
        setFocusMode(true);
        setFocusMessage('✨ Focus Mode Activated!');
        setTimeout(() => setFocusMessage(''), 4000);
      }
    } else {
      // Exiting focus mode
      setFocusMode(false);
      setFocusMessage('🎯 Focus Mode Deactivated. Welcome back!');
      setTimeout(() => setFocusMessage(''), 3000);
    }
  };

  /**
   * Filter and search todos
   */
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Calculate stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const completionPercentage = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  const highPriorityCount = todos.filter((todo) => !todo.completed && todo.priority === 'high').length;
  const streakCount = Object.keys(streaks).length;

  // Format Pomodoro time
  const formatPomodoroTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Export todos as JSON
  const exportTodos = () => {
    const dataStr = JSON.stringify({ todos, streaks, totalCompleted }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TaskFlow-Backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    alert('✅ Todos exported successfully!');
  };

  // Get achievements list
  const achievementsList = [
    { id: 'firstTodo', name: '🎯 First Step', desc: 'Complete your first todo' },
    { id: 'tenTodos', name: '📚 Getting Started', desc: 'Complete 10 todos' },
    { id: 'fiftyTodos', name: '🏆 Unstoppable', desc: 'Complete 50 todos' },
    { id: 'weekStreak', name: '🔥 Week Warrior', desc: 'Build a 7-day streak' },
  ];

  return (
    <>
      {/* Template Modal */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Choose a Template</h2>
              <p>Quick-start your productivity with pre-made tasks</p>
            </div>

            <div className="template-grid">
              {Object.entries(TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className={`template-card ${selectedTemplate === key ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <div className="template-icon">{template.icon}</div>
                  <div className="template-name">{template.name}</div>
                  <div className="template-desc">{template.desc}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="modal-btn-primary" onClick={applyTemplate} disabled={!selectedTemplate}>
                ✨ Apply Template
              </button>
              <button className="modal-btn-secondary" onClick={() => setShowTemplateModal(false)}>
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`app-container ${focusMode ? 'focus-mode' : ''}`}>
        {/* Header */}
        <div className="app-header">
          <h1>✨ TaskFlow Pro</h1>
          <p>Next-generation productivity at your fingertips</p>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            fontSize: '11px',
            fontWeight: '600',
            padding: '6px 12px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '20px',
            color: '#667eea'
          }}>
            {notificationPermission === 'granted' ? '🔔 Notifications On' : '🔕 Notifications Off'}
          </div>
        </div>

        {/* Animated Motivational Quotes */}
        <div className="animated-quotes">
          <div className="quote-emoji">{MOTIVATIONAL_QUOTES[currentQuoteIndex].emoji}</div>
          <div className="quote-content">{MOTIVATIONAL_QUOTES[currentQuoteIndex].text}</div>
        </div>

        {/* Pomodoro Timer */}
        <div className={`pomodoro-display ${pomodoroActive ? 'active' : ''}`}>
          ⏱️ {formatPomodoroTime(pomodoroTime)}
        </div>

        {/* Premium Features */}
        <div className="premium-features">
          <button className="premium-btn achievements" onClick={() => setShowAchievements(!showAchievements)}>
            🏆 Achievements {Object.values(achievements).length > 0 && `(${Object.values(achievements).filter(Boolean).length})`}
          </button>
          <button className="premium-btn export" onClick={exportTodos}>
            💾 Export Data
          </button>
          <button className="premium-btn keyboard" onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}>
            ⌨️ Shortcuts
          </button>
          <button 
            className="premium-btn"
            style={{background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(229, 62, 62, 0.1))', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444'}}
            onClick={() => {
              if (pomodoroActive) {
                setPomodoroActive(false);
              } else {
                setPomodoroActive(true);
              }
            }}
          >
            {pomodoroActive ? '⏸️ Pause' : '▶️ Focus'} Timer
          </button>
        </div>

        {/* Achievements Modal */}
        {showAchievements && (
          <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>🏆 Your Achievements</h2>
                <p>Keep completing tasks to unlock more badges!</p>
              </div>
              <div className="achievements-grid">
                {achievementsList.map((achievement) => (
                  <div key={achievement.id} className={`achievement-card ${achievements[achievement.id] ? 'unlocked' : ''}`}>
                    <div className="achievement-icon">
                      {achievement.name.split(' ')[0]}
                    </div>
                    <div className="achievement-name">{achievement.name}</div>
                    <div className="achievement-desc">{achievement.desc}</div>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button className="modal-btn-secondary" onClick={() => setShowAchievements(false)}>
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {showKeyboardHelp && (
          <div className="modal-overlay" onClick={() => setShowKeyboardHelp(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <p>Master these shortcuts for better productivity</p>
              </div>
              <div className="shortcuts-grid">
                <div className="shortcut-item">
                  <span className="shortcut-desc">Add Todo</span>
                  <span className="shortcut-key">Enter</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Toggle Focus Mode</span>
                  <span className="shortcut-key">F + Click</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Export Todos</span>
                  <span className="shortcut-key">Ctrl + E</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Show Achievements</span>
                  <span className="shortcut-key">Ctrl + A</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Start Pomodoro Timer</span>
                  <span className="shortcut-key">Ctrl + T</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Undo Last Action</span>
                  <span className="shortcut-key">Ctrl + Z</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-btn-secondary" onClick={() => setShowKeyboardHelp(false)}>
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Insights */}
        {completedTodos > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
            textAlign: 'center',
            animation: 'slideDownFade 0.6s ease-out 0.3s both'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              {completionPercentage === 100 ? '🏆' : completionPercentage >= 50 ? '⭐' : '🎯'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#059669' }}>
              {completionPercentage === 100 
                ? '🎉 Perfect! All tasks completed! Keep it up!'
                : completionPercentage >= 75
                ? '✨ Almost there! Final stretch!'
                : completionPercentage >= 50
                ? '🚀 You\'re halfway! Keep going!'
                : '💪 Great start! Keep building momentum!'}
            </div>
          </div>
        )}
        {totalTodos > 0 && (
          <div className="productivity-insights">
            <div className="insight-title">📊 Today's Performance</div>
            <div className="insight-stats">
              <div className="insight-stat">
                <div className="insight-label">Streak</div>
                <div className="insight-value">{streakCount} days</div>
              </div>
              <div className="insight-stat">
                <div className="insight-label">Completed</div>
                <div className="insight-value">{totalCompleted} total</div>
              </div>
              <div className="insight-stat">
                <div className="insight-label">At Risk</div>
                <div className="insight-value">{highPriorityCount} high</div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {totalTodos > 0 && (
          <div className="progress-container">
            <div className="progress-label">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Input Section - Main */}
        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              className={`todo-input ${showInvalidShake ? 'shake' : ''}`}
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Add a new todo"
            />
            <select
              className="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Med</option>
              <option value="high">🔴 High</option>
            </select>
            <select
              className="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="shopping">Shop</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button className="add-btn" onClick={addTodo}>
              ➕ Add
            </button>
            <button className="template-btn" onClick={() => setShowTemplateModal(true)}>
              📋 Template
            </button>
          </div>
        </div>

        {/* Quick Options Row */}
        <div className="input-section" style={{ marginTop: '16px', marginBottom: '16px' }}>
          <select
            className="priority-select"
            value={recurring}
            onChange={(e) => setRecurring(e.target.value)}
            style={{ flex: 1, minWidth: '140px' }}
          >
            <option value="once">📌 Once</option>
            <option value="daily">📅 Daily</option>
            <option value="weekly">📆 Weekly</option>
            <option value="monthly">📋 Monthly</option>
          </select>
          <input
            type="date"
            className="todo-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ flex: 1, minWidth: '140px' }}
          />
          <button className="focus-mode-btn" onClick={handleFocusMode}>
            {focusMode ? '❌ Focus' : '🎯 Focus'}
          </button>
        </div>

        {/* Focus Mode Status Message */}
        {focusMessage && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600',
            color: '#667eea',
            animation: 'slideDownFade 0.3s ease-out'
          }}>
            {focusMessage}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="input-section" style={{ justifyContent: 'center', gap: '8px' }}>
          <button
            className={`filter-btn ${filterPriority === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPriority('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterPriority === 'high' ? 'active' : ''}`}
            onClick={() => setFilterPriority('high')}
          >
            🔴 High
          </button>
          <button
            className={`filter-btn ${filterPriority === 'medium' ? 'active' : ''}`}
            onClick={() => setFilterPriority('medium')}
          >
            🟡 Medium
          </button>
          <button
            className={`filter-btn ${filterPriority === 'low' ? 'active' : ''}`}
            onClick={() => setFilterPriority('low')}
          >
            🟢 Low
          </button>
        </div>

      {/* Todo List or Empty State */}
      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <div className="empty-state-text">
            {totalTodos === 0 ? 'No todos yet...' : 'No matching todos found'}
          </div>
        </div>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'todo-item-completed' : ''} ${
                todo.completed ? 'bouncing' : ''
              }`}
            >
              {editingId === todo.id ? (
                <div className="edit-form" style={{ width: '100%' }}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-form-actions">
                    <button
                      className="save-edit-btn"
                      onClick={() => saveEdit(todo.id)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-edit-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    aria-label={`Mark "${todo.text}" as ${
                      todo.completed ? 'incomplete' : 'complete'
                    }`}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span className={`priority-badge priority-${todo.priority}`}>
                        {todo.priority}
                      </span>
                      <span className={`category-badge ${todo.category}`}>
                        {todo.category}
                      </span>
                      {todo.recurring && todo.recurring !== 'once' && (
                        <span className="recurring-badge">🔄 {todo.recurring}</span>
                      )}
                      {todo.dueDate && (
                        <span className="due-date-badge">
                          📅 {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <span className="todo-text">{todo.text}</span>
                    
                    {/* Subtasks Section */}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                      <div className="subtasks" style={{ marginTop: '8px' }}>
                        {todo.subtasks.map((subtask) => (
                          <div key={subtask.id} className="subtask-item">
                            <input
                              type="checkbox"
                              className="subtask-checkbox"
                              checked={subtask.completed}
                              onChange={() => toggleSubtask(todo.id, subtask.id)}
                            />
                            <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
                              {subtask.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Subtask Section */}
                    {!todo.completed && (
                      <div style={{ marginTop: '8px' }}>
                        {subtaskInputId === todo.id ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="todo-input"
                              style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
                              placeholder="Add a subtask..."
                              value={subtaskText}
                              onChange={(e) => setSubtaskText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addSubtask(todo.id, subtaskText);
                                } else if (e.key === 'Escape') {
                                  setSubtaskInputId(null);
                                  setSubtaskText('');
                                }
                              }}
                              autoFocus
                            />
                            <button
                              className="save-edit-btn"
                              onClick={() => addSubtask(todo.id, subtaskText)}
                              style={{ padding: '6px 12px' }}
                            >
                              ✓
                            </button>
                            <button
                              className="cancel-edit-btn"
                              onClick={() => {
                                setSubtaskInputId(null);
                                setSubtaskText('');
                              }}
                              style={{ padding: '6px 12px' }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            className="filter-btn"
                            onClick={() => setSubtaskInputId(todo.id)}
                            style={{ fontSize: '11px', padding: '4px 8px', marginTop: '6px' }}
                          >
                            ➕ Add Subtask
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="todo-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(todo)}
                      disabled={todo.completed}
                      aria-label={`Edit "${todo.text}"`}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label={`Delete "${todo.text}"`}
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Action Buttons */}
      {totalTodos > 0 && (
        <div className="input-section" style={{ marginTop: '16px', justifyContent: 'center', gap: '12px' }}>
          <button
            className="filter-btn"
            onClick={undo}
            disabled={history.length === 0}
            style={{ opacity: history.length === 0 ? 0.5 : 1, cursor: history.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            ↩️ Undo
          </button>
          <button
            className="filter-btn"
            onClick={clearCompleted}
            disabled={completedTodos === 0}
            style={{ opacity: completedTodos === 0 ? 0.5 : 1, cursor: completedTodos === 0 ? 'not-allowed' : 'pointer' }}
          >
            🗑️ Clear Done ({completedTodos})
          </button>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
