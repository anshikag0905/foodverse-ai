import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, ChefHat, Play, Pause, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DoodleRamen } from '../../assets/doodles';

export default function ChatPanel({
  messages = [],
  onSendMessage,
  onPantrySuggest,
  quickPrompts = [
    "How to make street-style Masala Maggi in 2 minutes?",
    "Quick garlic herb pasta under 15 minutes",
    "High-protein tawa paneer with veggies",
    "What can I cook with eggs, tomatoes, and spinach?"
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
      recognition.lang = i18n.language?.startsWith('hi') ? 'hi-IN' : 'en-US';
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
    <div className={`flex flex-col h-[650px] rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker overflow-hidden ${className}`}>
      {/* Cooking Assistant Header */}
      <div className="p-4 border-b-2 border-ink/10 bg-sunny/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-dusk-surface border-2 border-ink flex items-center justify-center shadow-sticker-xs">
            <ChefHat className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm text-ink dark:text-dusk-text">Smart Cooking Assistant</h3>
            <p className="text-[11px] font-semibold text-ink-muted">Pantry-aware recipes, step timers & substitutions</p>
          </div>
        </div>

        {onPantrySuggest && (
          <button
            onClick={onPantrySuggest}
            type="button"
            className="btn-squish inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-display font-black bg-sunny text-ink border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
          >
            <Sparkles className="w-3.5 h-3.5 text-ink" />
            <span>Cook From My Pantry</span>
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-ink-muted">
            <div className="w-16 h-16 rounded-3xl bg-sunny/20 border-2 border-ink flex items-center justify-center p-2 shadow-sticker-sm animate-float">
              <DoodleRamen size={42} />
            </div>
            <div>
              <p className="font-display font-black text-base text-ink dark:text-dusk-text">Ask Chef AI for Any Recipe</p>
              <p className="text-xs font-semibold text-ink-muted mt-1">Get instant ingredient steps, smart substitutions, and interactive timers.</p>
            </div>
            <div className="w-full max-w-md space-y-2 pt-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted">Try a Quick Recipe:</span>
              <div className="flex flex-col gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage && onSendMessage(prompt)}
                    className="btn-squish p-2.5 rounded-2xl text-xs font-bold text-left bg-sky-50 dark:bg-dusk-surface hover:bg-sunny/30 text-ink dark:text-dusk-text border-2 border-ink shadow-sticker-xs transition-colors cursor-pointer"
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
                  <div className="w-9 h-9 rounded-2xl bg-sunny/30 border-2 border-ink text-ink flex items-center justify-center flex-shrink-0 mt-1 shadow-sticker-xs">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-3xl text-xs sm:text-sm border-2 border-ink shadow-sticker-xs ${
                    isUser
                      ? 'bg-tomato text-white rounded-br-xs'
                      : 'bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text rounded-bl-xs'
                  }`}
                >
                  <div className="font-semibold whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                  {/* Render recipe ingredients if present */}
                  {msg.ingredients && (
                    <div className="mt-3 pt-3 border-t-2 border-ink/10 space-y-1.5">
                      <span className="font-display font-black text-xs text-ink dark:text-dusk-text block">
                        Ingredients:
                      </span>
                      <ul className="space-y-1">
                        {msg.ingredients.map((ing, i) => (
                          <li key={i} className="text-xs font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sunny border border-ink flex-shrink-0" />
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Render recipe instructions if present */}
                  {msg.instructions && (
                    <div className="mt-3 pt-3 border-t-2 border-ink/10 space-y-1.5">
                      <span className="font-display font-black text-xs text-ink dark:text-dusk-text block">
                        Instructions:
                      </span>
                      <ol className="space-y-1.5">
                        {msg.instructions.map((step, i) => (
                          <li key={i} className="text-xs font-medium leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Render interactive cooking timer */}
                  {msg.timerMinutes && (
                    <div className="mt-3 pt-3 border-t-2 border-ink/10">
                      <div className="p-3 rounded-2xl bg-sunny/20 border-2 border-ink flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="font-black text-xs">
                            Step Timer ({msg.timerMinutes} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => startTimer(idx, msg.timerMinutes)}
                            className="p-1 rounded-lg bg-mint border border-ink text-ink font-bold text-xs"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => pauseTimer(idx)}
                            className="p-1 rounded-lg bg-sunny border border-ink text-ink font-bold text-xs"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => resetTimer(idx, msg.timerMinutes)}
                            className="p-1 rounded-lg bg-white border border-ink text-ink font-bold text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t-2 border-ink/10 bg-white dark:bg-dusk-card flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Ask Chef AI anything (e.g. how to make Maggi, pasta, or use spinach)..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-tomato"
          />
          <button
            type="button"
            onClick={toggleSpeech}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl border border-ink transition-all ${
              isRecording ? 'bg-tomato text-white animate-pulse' : 'bg-sky-100 dark:bg-dusk-surface text-ink'
            }`}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="btn-squish inline-flex items-center gap-1 px-5 py-2.5 rounded-2xl bg-tomato hover:bg-tomato/90 disabled:opacity-50 text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
