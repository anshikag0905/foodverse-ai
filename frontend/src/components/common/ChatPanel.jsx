import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, ChefHat, Play, Pause, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ChatPanel({
  messages = [],
  onSendMessage,
  onPantrySuggest,
  quickPrompts = [
    "What can I cook with tomatoes, eggs, and spinach?",
    "Suggest a high-protein quick breakfast under 400 kcal",
    "How can I substitute buttermilk in pancakes?",
    "Show Indian vegetarian dinner recipes with low sodium"
  ],
  isLoading = false,
  className = ""
}) {
  const { t, i18n } = useTranslation();
  const [inputText, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeTimers, setActiveTimers] = useState({});
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice Query Speech Recognition
  const toggleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = i18n.language.startsWith('hi') ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTextInput(text);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim() && onSendMessage) {
      onSendMessage(inputText.trim());
      setTextInput("");
    }
  };

  // Cooking Timer Utilities
  const startTimer = (id, minutes) => {
    if (activeTimers[id]?.interval) return;
    const totalSeconds = (activeTimers[id]?.secondsLeft ?? minutes * 60);
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const cur = prev[id];
        if (!cur || cur.secondsLeft <= 1) {
          clearInterval(interval);
          alert(`Timer Complete: Step ${id}!`);
          return { ...prev, [id]: { secondsLeft: 0, isRunning: false, interval: null } };
        }
        return { ...prev, [id]: { ...cur, secondsLeft: cur.secondsLeft - 1, isRunning: true, interval } };
      });
    }, 1000);

    setActiveTimers(prev => ({
      ...prev,
      [id]: { secondsLeft: totalSeconds, isRunning: true, interval }
    }));
  };

  const pauseTimer = (id) => {
    if (activeTimers[id]?.interval) {
      clearInterval(activeTimers[id].interval);
      setActiveTimers(prev => ({
        ...prev,
        [id]: { ...prev[id], isRunning: false, interval: null }
      }));
    }
  };

  const resetTimer = (id, minutes) => {
    pauseTimer(id);
    setActiveTimers(prev => ({
      ...prev,
      [id]: { secondsLeft: minutes * 60, isRunning: false, interval: null }
    }));
  };

  return (
    <div className={`flex flex-col h-[650px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft overflow-hidden ${className}`}>
      {/* Cooking Assistant Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Cooking Assistant</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Contextual recipe advice, pantry-aware suggestions & timers</p>
          </div>
        </div>

        {onPantrySuggest && (
          <button
            onClick={onPantrySuggest}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cook From My Pantry</span>
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
            <ChefHat className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            <div>
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">Ask the Cooking Assistant Anything</p>
              <p className="text-xs text-slate-400 mt-1">Get custom recipes, substitution tricks, or step-by-step guidance</p>
            </div>
            <div className="w-full max-w-md space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Suggested Prompts:</span>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage && onSendMessage(prompt)}
                    className="p-2.5 rounded-xl text-xs text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-3xl text-sm ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                  {/* Render interactive cooking timer if message contains timer request */}
                  {msg.timerMinutes && (
                    <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold">
                          Step Timer: {Math.floor((activeTimers[idx]?.secondsLeft ?? msg.timerMinutes * 60) / 60)}:
                          {String((activeTimers[idx]?.secondsLeft ?? msg.timerMinutes * 60) % 60).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {activeTimers[idx]?.isRunning ? (
                          <button
                            onClick={() => pauseTimer(idx)}
                            className="p-1.5 rounded-lg bg-amber-500 text-white"
                            title="Pause Timer"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => startTimer(idx, msg.timerMinutes)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white"
                            title="Start Timer"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => resetTimer(idx, msg.timerMinutes)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          title="Reset Timer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Chef AI is thinking and preparing your recipe...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your cooking query or recipe request..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={toggleSpeech}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            title="Speech Input"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition-all"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
