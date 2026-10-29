import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChefHat, Sparkles } from 'lucide-react';
import apiClient from '../services/api';
import ChatPanel from '../components/common/ChatPanel';

export default function CookingAssistant() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (query, usePantry = false) => {
    setIsLoading(true);
    // Optimistic user bubble
    setMessages(prev => [...prev, { sender: 'user', text: query }]);

    try {
      const res = await apiClient.post('/cooking/chat', {
        query: query,
        session_id: sessionId,
        use_pantry: usePantry,
        lang: i18n.language || 'en'
      });

      setSessionId(res.session_id);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply,
          timerMinutes: res.timer_minutes,
          ingredients: res.ingredients,
          instructions: res.instructions,
          substitutions: res.substitutions
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `Chef AI Error: ${err.message || 'Unable to connect to kitchen model.'}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookFromPantry = () => {
    handleSendMessage("What recipes can I cook right now prioritizing items expiring soon in my pantry?", true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <ChefHat className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <span>{t('nav.cooking')}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Interactive recipe suggestions, step-by-step guidance with timers, and zero-waste pantry cooking.
        </p>
      </div>

      <ChatPanel
        messages={messages}
        onSendMessage={(q) => handleSendMessage(q, false)}
        onPantrySuggest={handleCookFromPantry}
        isLoading={isLoading}
      />
    </div>
  );
}
