declare const __mode__: Mode;

export type Mode = 'production' | 'development';

const source: Record<Mode, string> = {
  production: chrome.runtime.getURL('index.js'),
  development: 'http://127.0.0.1:3360/index.js?cache=' + Math.random().toString(),
};

const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

const script = document.createElement('script');
script.src = source[__mode__];

head.appendChild(script);
