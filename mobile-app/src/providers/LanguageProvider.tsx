import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/i18n";
// I18nManager kept in case RTL returns later; unused now that Arabic is removed

type LangCode = "fr" | "en";

type LanguageContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => Promise<void>;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("fr");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("appLanguage");
      const initial = (saved as LangCode) || "fr";
      i18n.locale = initial;
      setLangState(initial);
    })();
  }, []);

  const setLang = async (l: LangCode) => {
    await AsyncStorage.setItem("appLanguage", l);
    i18n.locale = l;
    setLangState(l);

    // RTL handling removed since Arabic is no longer supported
  };

  const t = (key: string) => i18n.t(key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
