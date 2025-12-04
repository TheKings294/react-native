import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { i18n } from "@/i18n";
import { I18nManager } from "react-native";

type LangCode = "fr" | "en" | "ar";

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

    const shouldRTL = l === "ar";
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(shouldRTL);
      I18nManager.forceRTL(shouldRTL);
    }
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
