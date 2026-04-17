import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'app_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // 从 session 读取语言设置
  useEffect(() => {
    const saved = sessionStorage.getItem(LANGUAGE_KEY);
    if (saved === 'zh' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    sessionStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
