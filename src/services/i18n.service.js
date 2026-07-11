const STORAGE_KEY = 'lang';

class I18nService {
  constructor() {
    this.locale = null;
    this.cache = {
      en: LOCALE_EN,
      vi: LOCALE_VI,
    };
  }

  detect() {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) return fromStorage;

    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl) return fromUrl;

    const browser = navigator.language?.slice(0, 2);
    if (browser === 'vi') return 'vi';

    return 'en';
  }

  load(lang) {
    this.locale = this.cache[lang] || this.cache.en;
    localStorage.setItem(STORAGE_KEY, lang);
    return this.locale;
  }

  t(key) {
    if (!this.locale) return key;
    return typeof this.locale[key] === 'string' ? this.locale[key] : key;
  }

  get currentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }
}

const i18n = new I18nService();
export { i18n };
