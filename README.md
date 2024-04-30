# bun-extension-boilerplate

### Dependencies

Install dependencies:

```bash
bun install
```

### Config

```json
{
  "build": {
    "source": "./src/",
    "entrypoints": ["./src/inject.ts", "./src/index.ts"],
    "out": "./build/"
  },
  "server": {
    "port": 3360
  }
}
```

### Build

Build extension:

```bash
bun run build
```

Run developer server:

```bash
bun run build --server
```

### Development
I recommend creating `inject.ts` file which will inject your extension into pages.  
You can use `__mode__` variable which will tell is this is production or development build.  

For example you can use `src/inject.ts`:
```ts
declare const __mode__: Mode;

export type Mode = 'production' | 'development';

const source: Record<Mode, string> = {
  production: chrome.runtime.getURL('index.js'),
  development:
    'http://127.0.0.1:3360/index.js?cache=' + Math.random().toString(),
};

const head =
  document.head ||
  document.getElementsByTagName('head')[0] ||
  document.documentElement;

const script = document.createElement('script');
script.src = source[__mode__];

head.appendChild(script);
```
Of coure you will have to change script for your project.