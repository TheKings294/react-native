// src/i18n/index.ts
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import fr from "./fr";
import en from "./en";
import ar from "./ar";

export const i18n = new I18n({
  fr,
  en,
  ar,
});

i18n.enableFallback = true;

// ✅ SDK 53+ : getLocales() est le plus fiable
const deviceLocale =
  Localization.getLocales()?.[0]?.languageCode || "fr";

i18n.locale = deviceLocale;
