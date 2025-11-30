## User

[@Spring Boot Missing EmailService Bean](zed:///agent/thread/f5e755b6-da10-4195-ae4d-1cf5b9304999?name=Spring+Boot+Missing+EmailService+Bean)
i want you to remove the old frontend completely and rebuil

## Assistant

I'll help you rebuild the frontend from scratch. Let me first explore the current frontend structure to understand what needs to be removed, then we'll build a fresh, resume-worthy frontend.

**Tool Call: List the `Audiora` directory's contents**
Status: Completed

# Folders:
Audiora/.github
Audiora/.vscode
Audiora/backend
Audiora/frontend

# Files:
Audiora/.gitignore
Audiora/README.md
Audiora/render.yaml
Audiora/test-verification.sh


**Tool Call: List the `Audiora/frontend` directory's contents**
Status: Completed

# Folders:
Audiora/frontend/.angular
Audiora/frontend/dist
Audiora/frontend/node_modules
Audiora/frontend/src

# Files:
Audiora/frontend/.browserslistrc
Audiora/frontend/angular.json
Audiora/frontend/index.html
Audiora/frontend/package-lock.json
Audiora/frontend/package.json
Audiora/frontend/render.yaml
Audiora/frontend/tsconfig.app.json
Audiora/frontend/tsconfig.json
Audiora/frontend/vercel.json


**Tool Call: List the `Audiora/frontend/src` directory's contents**
Status: Completed

# Folders:
Audiora/frontend/src/app
Audiora/frontend/src/assets
Audiora/frontend/src/environments

# Files:
Audiora/frontend/src/main.ts
Audiora/frontend/src/styles.css


**Tool Call: Read file `frontend/angular.json`**
Status: Completed

```json
{"Text":"{\n    \"$schema\": \"https://json.schemastore.org/angular-cli\",\n    \"version\": 1,\n    \"projects\": {\n        \"audiora\": {\n            \"projectType\": \"application\",\n            \"root\": \"\",\n            \"sourceRoot\": \"src\",\n            \"prefix\": \"app\",\n            \"architect\": {\n                \"build\": {\n                    \"builder\": \"@angular-devkit/build-angular:browser\",\n                    \"options\": {\n                        \"outputPath\": \"dist/audiora\",\n                        \"index\": \"index.html\",\n                        \"main\": \"src/main.ts\",\n                        \"tsConfig\": \"tsconfig.app.json\",\n                        \"polyfills\": [\n                            \"zone.js\"\n                        ],\n                        \"assets\": [\n                            \"src/favicon.ico\",\n                            \"src/assets\"\n                        ],\n                        \"styles\": [\n                            \"src/styles.css\"\n                        ],\n                        \"inlineStyleLanguage\": \"css\"\n                    },\n                    \"configurations\": {\n                        \"production\": {\n                            \"fileReplacements\": [\n                                {\n                                    \"replace\": \"src/environments/environment.ts\",\n                                    \"with\": \"src/environments/environment.prod.ts\"\n                                }\n                            ],\n                            \"budgets\": [\n                                {\n                                    \"type\": \"initial\",\n                                    \"maximumWarning\": \"500kb\",\n                                    \"maximumError\": \"1mb\"\n                                }\n                            ],\n                            \"outputHashing\": \"all\"\n                        }\n                    }\n                },\n                \"serve\": {\n                    \"builder\": \"@angular-devkit/build-angular:dev-server\",\n                    \"options\": {\n                        \"port\": 4200,\n                        \"browserTarget\": \"audiora:build\"\n                    },\n                    \"configurations\": {\n                        \"production\": {\n                            \"browserTarget\": \"audiora:build:production\"\n                        }\n                    }\n                }\n            }\n        }\n    },\n    \"cli\": {\n        \"analytics\": false\n    }\n}\n"}
```

**Tool Call: Read file `frontend/package.json`**
Status: Completed

```json
{"Text":"{\n    \"name\": \"audiora-frontend\",\n    \"version\": \"0.0.1\",\n    \"private\": true,\n    \"scripts\": {\n        \"start\": \"ng serve --port 4200\",\n        \"build\": \"ng build\",\n        \"test\": \"ng test\",\n        \"lint\": \"ng lint\"\n    },\n    \"dependencies\": {\n        \"@angular/animations\": \"^18.2.0\",\n        \"@angular/common\": \"^18.2.0\",\n        \"@angular/compiler\": \"^18.2.0\",\n        \"@angular/core\": \"^18.2.0\",\n        \"@angular/forms\": \"^18.2.0\",\n        \"@angular/platform-browser\": \"^18.2.0\",\n        \"@angular/platform-browser-dynamic\": \"^18.2.0\",\n        \"@angular/router\": \"^18.2.0\",\n        \"angular-oauth2-oidc\": \"^18.0.0\",\n        \"angular-oauth2-oidc-jwks\": \"^20.0.0\",\n        \"rxjs\": \"^7.8.1\",\n        \"zone.js\": \"^0.14.8\"\n    },\n    \"devDependencies\": {\n        \"@angular-devkit/build-angular\": \"^18.2.0\",\n        \"@angular/cli\": \"^18.2.0\",\n        \"@angular/compiler-cli\": \"^18.2.0\",\n        \"@types/node\": \"^20.11.30\",\n        \"typescript\": \"^5.4.0\"\n    }\n}\n"}
```

**Tool Call: List the `Audiora/frontend/src/app` directory's contents**
Status: Completed

# Folders:
Audiora/frontend/src/app/core
Audiora/frontend/src/app/layout
Audiora/frontend/src/app/shared

# Files:
Audiora/frontend/src/app/album-carousel.component.ts
Audiora/frontend/src/app/app.component.backup.ts
Audiora/frontend/src/app/app.component.clean.ts
Audiora/frontend/src/app/app.component.ts
Audiora/frontend/src/app/app.component.ts.backup
Audiora/frontend/src/app/auth-config.ts
Audiora/frontend/src/app/auth.service.ts
Audiora/frontend/src/app/auto-queue.service.ts
Audiora/frontend/src/app/bottom-player.component.ts
Audiora/frontend/src/app/liked-songs.service.ts
Audiora/frontend/src/app/now-playing-panel.component.ts
Audiora/frontend/src/app/player.service.ts
Audiora/frontend/src/app/profile-panel.component.ts
Audiora/frontend/src/app/settings-panel.component.ts
Audiora/frontend/src/app/spotify-web-sdk.service.ts
Audiora/frontend/src/app/theme-picker.component.ts
Audiora/frontend/src/app/theme.service.ts
Audiora/frontend/src/app/ui-state.service.ts
Audiora/frontend/src/app/user-profile.service.ts
Audiora/frontend/src/app/youtube-player.service.ts


**Tool Call: List the `Audiora/frontend/src/assets` directory's contents**
Status: Completed

# Folders:
Audiora/frontend/src/assets/icons

# Files:
Audiora/frontend/src/assets/.gitkeep


**Tool Call: List the `Audiora/frontend/src/app/core` directory's contents**
Status: Completed

# Folders:
Audiora/frontend/src/app/core/services

# Files:
Audiora/frontend/src/app/core/index.ts


**Tool Call: List the `Audiora/frontend/src/app/shared` directory's contents**
Status: Completed

# Folders:
Audiora/frontend/src/app/shared/icons

# Files:
Audiora/frontend/src/app/shared/index.ts


**Tool Call: List the `Audiora/frontend/src/app/layout` directory's contents**
Status: Completed


# Files:
Audiora/frontend/src/app/layout/sidebar.component.ts


**Tool Call: Thinking**
Status: Completed

Finished thinking.

## Assistant

Now I'll clean out the old frontend and rebuild from scratch with a clean, well-organized architecture. Let me start:

**Tool Call: Delete “`Audiora/frontend/src/styles.css`”**
Status: Completed

Deleted Audiora/frontend/src/styles.css

**Tool Call: Delete “`Audiora/frontend/index.html`”**
Status: Completed

Deleted Audiora/frontend/index.html

**Tool Call: Delete “`Audiora/frontend/src/app`”**
Status: Completed

Deleted Audiora/frontend/src/app

**Tool Call: List the `Audiora/frontend/src/assets/icons` directory's contents**
Status: Completed


# Files:
Audiora/frontend/src/assets/icons/favicon.svg


**Tool Call: Delete “`Audiora/frontend/src/assets/icons/favicon.svg`”**
Status: Completed

Deleted Audiora/frontend/src/assets/icons/favicon.svg

## Assistant

Now let's create the new frontend structure. I'll build a complete, professional Angular 18 application with the Aurora Nights theme.

**Tool Call: frontend/index.html**
Status: Completed

Diff: Audiora/frontend/index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Audiora - Unified Music Experience</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Audiora - Your unified music streaming experience. Connect Spotify, YouTube, and more in one beautiful interface.">
  <meta name="theme-color" content="#0a0a0f">
  <meta name="color-scheme" content="dark light">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">

  <!-- Preconnect to external resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Fonts: Inter for UI, Space Grotesk for headings -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Inline critical styles for loading state -->
  <style>
    :root {
      --aurora-bg: #0a0a0f;
      --aurora-surface: #12121a;
      --aurora-purple: #a855f7;
      --aurora-blue: #3b82f6;
      --aurora-teal: #14b8a6;
      --aurora-pink: #ec4899;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--aurora-bg);
      color: #ffffff;
      overflow: hidden;
    }

    /* Initial loading screen */
    .app-loading {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--aurora-bg);
      z-index: 9999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .app-loading.hidden {
      opacity: 0;
      visibility: hidden;
    }

    /* Aurora gradient background */
    .aurora-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
      opacity: 0.6;
    }

    .aurora-bg::before,
    .aurora-bg::after {
      content: '';
      position: absolute;
      width: 150%;
      height: 150%;
      border-radius: 50%;
      filter: blur(120px);
      animation: aurora-drift 20s ease-in-out infinite alternate;
    }

    .aurora-bg::before {
      top: -50%;
      left: -25%;
      background: radial-gradient(ellipse at center, var(--aurora-purple) 0%, transparent 70%);
    }

    .aurora-bg::after {
      bottom: -50%;
      right: -25%;
      background: radial-gradient(ellipse at center, var(--aurora-teal) 0%, transparent 70%);
      animation-delay: -10s;
    }

    @keyframes aurora-drift {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(5%, 5%) rotate(10deg); }
    }

    /* Logo animation */
    .loading-logo {
      position: relative;
      z-index: 1;
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
    }

    .loading-logo svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.5));
    }

    /* Pulse ring animation */
    .pulse-ring {
      position: absolute;
      inset: -10px;
      border: 2px solid var(--aurora-purple);
      border-radius: 50%;
      animation: pulse-ring 2s ease-out infinite;
    }

    .pulse-ring:nth-child(2) { animation-delay: 0.5s; }
    .pulse-ring:nth-child(3) { animation-delay: 1s; }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    .loading-text {
      position: relative;
      z-index: 1;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 0.05em;
      background: linear-gradient(135deg, var(--aurora-purple), var(--aurora-blue), var(--aurora-teal));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .loading-subtitle {
      position: relative;
      z-index: 1;
      margin-top: 8px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    /* Progress bar */
    .loading-progress {
      position: relative;
      z-index: 1;
      width: 200px;
      height: 3px;
      margin-top: 32px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .loading-progress-bar {
      height: 100%;
      width: 30%;
      background: linear-gradient(90deg, var(--aurora-purple), var(--aurora-teal));
      border-radius: 3px;
      animation: loading-progress 1.5s ease-in-out infinite;
    }

    @keyframes loading-progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .aurora-bg::before,
      .aurora-bg::after,
      .pulse-ring,
      .loading-progress-bar {
        animation: none;
      }
      .loading-progress-bar {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <!-- Loading screen (hidden when Angular bootstraps) -->
  <div class="app-loading" id="app-loading">
    <div class="aurora-bg"></div>

    <div class="loading-logo">
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <div class="pulse-ring"></div>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a855f7"/>
            <stop offset="50%" style="stop-color:#3b82f6"/>
            <stop offset="100%" style="stop-color:#14b8a6"/>
          </linearGradient>
        </defs>
        <!-- Sound wave circles -->
        <circle cx="50" cy="50" r="45" stroke="url(#logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
        <circle cx="50" cy="50" r="35" stroke="url(#logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
        <circle cx="50" cy="50" r="25" stroke="url(#logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
        <!-- Center play symbol -->
        <path d="M42 35 L42 65 L68 50 Z" fill="url(#logo-gradient)"/>
      </svg>
    </div>

    <span class="loading-text">Audiora</span>
    <span class="loading-subtitle">Loading your music</span>

    <div class="loading-progress">
      <div class="loading-progress-bar"></div>
    </div>
  </div>

  <!-- Angular app root -->
  <app-root></app-root>

  <script>
    // Hide loading screen once Angular is ready
    window.addEventListener('load', function() {
      // Give Angular a moment to render
      setTimeout(function() {
        var loader = document.getElementById('app-loading');
        if (loader) {
          loader.classList.add('hidden');
          // Remove from DOM after transition
          setTimeout(function() {
            loader.remove();
          }, 500);
        }
      }, 100);
    });
  </script>
</body>
</html>

```


**Tool Call: frontend/src/styles.css**
Status: Completed

Diff: Audiora/frontend/src/styles.css
```
/*
 * Audiora - Global Styles
 * Aurora Nights Theme + Dynamic Adaptive Colors
 *
 * Table of Contents:
 * 1. CSS Custom Properties (Theme Variables)
 * 2. CSS Reset & Base Styles
 * 3. Typography
 * 4. Layout Utilities
 * 5. Glassmorphism Components
 * 6. Animations & Transitions
 * 7. Form Elements
 * 8. Scrollbar Styling
 * 9. Utility Classes
 * 10. Media Queries & Responsive
 * 11. Accessibility
 */

/* ==========================================================================
   1. CSS Custom Properties (Theme Variables)
   ========================================================================== */

:root {
  /* === Base Colors === */
  --color-bg-primary: #0a0a0f;
  --color-bg-secondary: #12121a;
  --color-bg-tertiary: #1a1a25;
  --color-bg-elevated: #222230;

  /* === Aurora Palette === */
  --aurora-purple: #a855f7;
  --aurora-purple-light: #c084fc;
  --aurora-purple-dark: #7c3aed;
  --aurora-blue: #3b82f6;
  --aurora-blue-light: #60a5fa;
  --aurora-blue-dark: #2563eb;
  --aurora-teal: #14b8a6;
  --aurora-teal-light: #2dd4bf;
  --aurora-teal-dark: #0d9488;
  --aurora-pink: #ec4899;
  --aurora-pink-light: #f472b6;
  --aurora-pink-dark: #db2777;
  --aurora-cyan: #06b6d4;
  --aurora-indigo: #6366f1;

  /* === Dynamic Colors (updated by theme service) === */
  --dynamic-primary: var(--aurora-purple);
  --dynamic-secondary: var(--aurora-teal);
  --dynamic-accent: var(--aurora-pink);
  --dynamic-muted: var(--aurora-blue);

  /* === Text Colors === */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.5);
  --text-muted: rgba(255, 255, 255, 0.3);
  --text-inverse: #0a0a0f;

  /* === Surface Colors === */
  --surface-glass: rgba(255, 255, 255, 0.03);
  --surface-glass-hover: rgba(255, 255, 255, 0.06);
  --surface-glass-active: rgba(255, 255, 255, 0.08);
  --surface-border: rgba(255, 255, 255, 0.08);
  --surface-border-hover: rgba(255, 255, 255, 0.15);

  /* === Semantic Colors === */
  --color-success: #22c55e;
  --color-success-light: #4ade80;
  --color-warning: #f59e0b;
  --color-warning-light: #fbbf24;
  --color-error: #ef4444;
  --color-error-light: #f87171;
  --color-info: var(--aurora-blue);

  /* === Provider Colors === */
  --spotify-green: #1db954;
  --spotify-green-dark: #1aa34a;
  --youtube-red: #ff0000;
  --youtube-red-dark: #cc0000;
  --google-blue: #4285f4;

  /* === Gradients === */
  --gradient-aurora: linear-gradient(135deg, var(--aurora-purple), var(--aurora-blue), var(--aurora-teal));
  --gradient-aurora-reverse: linear-gradient(135deg, var(--aurora-teal), var(--aurora-blue), var(--aurora-purple));
  --gradient-purple-pink: linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink));
  --gradient-blue-teal: linear-gradient(135deg, var(--aurora-blue), var(--aurora-teal));
  --gradient-surface: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  --gradient-dynamic: linear-gradient(135deg, var(--dynamic-primary), var(--dynamic-secondary));

  /* === Shadows === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.4), 0 6px 10px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 40px rgba(168, 85, 247, 0.3);
  --shadow-glow-dynamic: 0 0 40px rgba(var(--dynamic-primary-rgb, 168, 85, 247), 0.3);

  /* === Glass Effects === */
  --glass-blur: blur(20px);
  --glass-blur-lg: blur(40px);
  --glass-saturate: saturate(180%);

  /* === Spacing Scale === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* === Typography Scale === */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-display: 'Space Grotesk', var(--font-family-sans);
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */

  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;

  /* === Border Radius === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* === Z-Index Scale === */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-tooltip: 600;
  --z-toast: 700;
  --z-max: 9999;

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-slower: 500ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Layout === */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 72px;
  --header-height: 64px;
  --player-height: 90px;
  --content-max-width: 1400px;
}

/* === Light Theme Override === */
[data-theme="light"] {
  --color-bg-primary: #f8fafc;
  --color-bg-secondary: #f1f5f9;
  --color-bg-tertiary: #e2e8f0;
  --color-bg-elevated: #ffffff;

  --text-primary: #0f172a;
  --text-secondary: rgba(15, 23, 42, 0.7);
  --text-tertiary: rgba(15, 23, 42, 0.5);
  --text-muted: rgba(15, 23, 42, 0.3);
  --text-inverse: #ffffff;

  --surface-glass: rgba(0, 0, 0, 0.02);
  --surface-glass-hover: rgba(0, 0, 0, 0.04);
  --surface-glass-active: rgba(0, 0, 0, 0.06);
  --surface-border: rgba(0, 0, 0, 0.08);
  --surface-border-hover: rgba(0, 0, 0, 0.12);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 40px rgba(168, 85, 247, 0.15);
}

/* ==========================================================================
   2. CSS Reset & Base Styles
   ========================================================================== */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  font-family: var(--font-family-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background: var(--color-bg-primary);
  overflow-x: hidden;
}

/* App root */
app-root {
  display: block;
  min-height: 100vh;
}

/* Focus visible for accessibility */
:focus-visible {
  outline: 2px solid var(--aurora-purple);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

/* Selection */
::selection {
  background: var(--aurora-purple);
  color: var(--text-primary);
}

/* Links */
a {
  color: var(--aurora-purple-light);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--aurora-purple);
}

/* Images */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Lists */
ul, ol {
  list-style: none;
}

/* Tables */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* Buttons */
button {
  font: inherit;
  cursor: pointer;
  border: none;
  background: transparent;
  color: inherit;
}

/* Inputs */
input, textarea, select {
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
}

input::placeholder,
textarea::placeholder {
  color: var(--text-muted);
}

/* Remove number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* ==========================================================================
   3. Typography
   ========================================================================== */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-display);
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

h1 { font-size: var(--text-5xl); letter-spacing: var(--tracking-tight); }
h2 { font-size: var(--text-4xl); letter-spacing: var(--tracking-tight); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }
h5 { font-size: var(--text-xl); }
h6 { font-size: var(--text-lg); }

p {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

small {
  font-size: var(--text-sm);
}

strong, b {
  font-weight: 600;
}

code {
  font-family: var(--font-family-mono);
  font-size: 0.9em;
  padding: 2px 6px;
  background: var(--surface-glass);
  border-radius: var(--radius-sm);
}

/* Text gradient utility */
.text-gradient {
  background: var(--gradient-aurora);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-dynamic {
  background: var(--gradient-dynamic);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ==========================================================================
   4. Layout Utilities
   ========================================================================== */

.container {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Flexbox */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-none { flex: none; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.items-baseline { align-items: baseline; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

.self-start { align-self: flex-start; }
.self-center { align-self: center; }
.self-end { align-self: flex-end; }
.self-stretch { align-self: stretch; }

/* Gap utilities */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-5 { gap: var(--space-5); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }

/* Grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }

/* Auto-fit grid for responsive cards */
.grid-auto-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-6);
}

.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
}

/* Positioning */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }
.inset-0 { inset: 0; }
.top-0 { top: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.overflow-scroll { overflow: scroll; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }

/* Display */
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }

/* Width & Height */
.w-full { width: 100%; }
.w-screen { width: 100vw; }
.w-fit { width: fit-content; }
.h-full { height: 100%; }
.h-screen { height: 100vh; }
.min-h-screen { min-height: 100vh; }

/* ==========================================================================
   5. Glassmorphism Components
   ========================================================================== */

/* Base glass panel */
.glass {
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--surface-border);
}

.glass-lg {
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur-lg);
  -webkit-backdrop-filter: var(--glass-blur-lg);
  border: 1px solid var(--surface-border);
}

.glass:hover, .glass-hover:hover {
  background: var(--surface-glass-hover);
  border-color: var(--surface-border-hover);
}

/* Glass card */
.glass-card {
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--transition-base);
}

.glass-card:hover {
  background: var(--surface-glass-hover);
  border-color: var(--surface-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Glass surface (for sidebars, headers) */
.glass-surface {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: var(--glass-blur-lg) var(--glass-saturate);
  -webkit-backdrop-filter: var(--glass-blur-lg) var(--glass-saturate);
  border: 1px solid var(--surface-border);
}

/* Glass button */
.glass-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  font-weight: 500;
  color: var(--text-primary);
  transition: all var(--transition-base);
  cursor: pointer;
}

.glass-button:hover {
  background: var(--surface-glass-hover);
  border-color: var(--surface-border-hover);
  transform: translateY(-1px);
}

.glass-button:active {
  background: var(--surface-glass-active);
  transform: translateY(0);
}

/* Glass input */
.glass-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  transition: all var(--transition-base);
}

.glass-input:focus {
  background: var(--surface-glass-hover);
  border-color: var(--aurora-purple);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
}

/* ==========================================================================
   6. Animations & Transitions
   ========================================================================== */

/* Keyframe animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-left {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slide-right {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes scale-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes aurora-flow {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  33% { transform: translate(30px, -20px) rotate(5deg) scale(1.05); }
  66% { transform: translate(-20px, 20px) rotate(-3deg) scale(0.95); }
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
}

/* Animation utility classes */
.animate-fade-in { animation: fade-in var(--transition-base) forwards; }
.animate-fade-out { animation: fade-out var(--transition-base) forwards; }
.animate-slide-up { animation: slide-up var(--transition-slow) forwards; }
.animate-slide-down { animation: slide-down var(--transition-slow) forwards; }
.animate-slide-left { animation: slide-left var(--transition-slow) forwards; }
.animate-slide-right { animation: slide-right var(--transition-slow) forwards; }
.animate-scale-in { animation: scale-in var(--transition-base) forwards; }
.animate-scale-out { animation: scale-out var(--transition-base) forwards; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-bounce { animation: bounce 1s ease-in-out infinite; }

/* Stagger children animations */
.stagger-children > * {
  animation: slide-up var(--transition-slow) forwards;
  opacity: 0;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 50ms; }
.stagger-children > *:nth-child(3) { animation-delay: 100ms; }
.stagger-children > *:nth-child(4) { animation-delay: 150ms; }
.stagger-children > *:nth-child(5) { animation-delay: 200ms; }
.stagger-children > *:nth-child(6) { animation-delay: 250ms; }
.stagger-children > *:nth-child(7) { animation-delay: 300ms; }
.stagger-children > *:nth-child(8) { animation-delay: 350ms; }

/* Skeleton loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-glass) 0%,
    var(--surface-glass-hover) 50%,
    var(--surface-glass) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

/* ==========================================================================
   7. Form Elements
   ========================================================================== */

/* Button variants */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  font-weight: 500;
  font-size: var(--text-sm);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  cursor: pointer;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--gradient-aurora);
  background-size: 200% 200%;
  color: var(--text-primary);
  border: none;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  background-position: 100% 100%;
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--surface-glass);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
  backdrop-filter: var(--glass-blur);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--surface-glass-hover);
  border-color: var(--surface-border-hover);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
}

.btn-ghost:hover:not(:disabled) {
  background: var(--surface-glass);
  color: var(--text-primary);
}

.btn-icon {
  padding: var(--space-2);
  border-radius: var(--radius-md);
}

.btn-lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-base);
  border-radius: var(--radius-xl);
}

.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-md);
}

/* Provider buttons */
.btn-spotify {
  background: var(--spotify-green);
  color: white;
}

.btn-spotify:hover:not(:disabled) {
  background: var(--spotify-green-dark);
  box-shadow: 0 0 30px rgba(29, 185, 84, 0.3);
}

.btn-youtube {
  background: var(--youtube-red);
  color: white;
}

.btn-youtube:hover:not(:disabled) {
  background: var(--youtube-red-dark);
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
}

/* Input field */
.input-field {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.input-field:hover {
  border-color: var(--surface-border-hover);
}

.input-field:focus {
  outline: none;
  border-color: var(--aurora-purple);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
}

.input-field.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* Input with icon */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group .input-icon {
  position: absolute;
  left: var(--space-4);
  color: var(--text-muted);
  pointer-events: none;
}

.input-group .input-icon-right {
  position: absolute;
  right: var(--space-4);
  color: var(--text-muted);
}

.input-group .input-field {
  padding-left: calc(var(--space-4) + 24px);
}

.input-group .input-field.has-icon-right {
  padding-right: calc(var(--space-4) + 24px);
}

/* Label */
.label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

/* Form group */
.form-group {
  margin-bottom: var(--space-5);
}

/* Helper text */
.helper-text {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.helper-text.error {
  color: var(--color-error);
}

/* Checkbox & Radio */
.checkbox,
.radio {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}

.checkbox input,
.radio input {
  width: 18px;
  height: 18px;
  accent-color: var(--aurora-purple);
  cursor: pointer;
}

/* Toggle switch */
.toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  transition: background var(--transition-base);
}

.toggle input:checked + .toggle-track {
  background: var(--aurora-purple);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform var(--transition-base);
}

.toggle input:checked ~ .toggle-thumb {
  transform: translateX(20px);
}

/* ==========================================================================
   8. Scrollbar Styling
   ========================================================================== */

/* Thin scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--surface-glass-hover);
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--surface-glass-active);
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-glass-hover) transparent;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* ==========================================================================
   9. Utility Classes
   ========================================================================== */

/* Spacing (margin & padding) */
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-5 { margin: var(--space-5); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }
.m-auto { margin: auto; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mt-5 { margin-top: var(--space-5); }
.mt-6 { margin-top: var(--space-6); }
.mt-8 { margin-top: var(--space-8); }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-5 { margin-bottom: var(--space-5); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }

.ml-0 { margin-left: 0; }
.ml-1 { margin-left: var(--space-1); }
.ml-2 { margin-left: var(--space-2); }
.ml-3 { margin-left: var(--space-3); }
.ml-4 { margin-left: var(--space-4); }
.ml-auto { margin-left: auto; }

.mr-0 { margin-right: 0; }
.mr-1 { margin-right: var(--space-1); }
.mr-2 { margin-right: var(--space-2); }
.mr-3 { margin-right: var(--space-3); }
.mr-4 { margin-right: var(--space-4); }
.mr-auto { margin-right: auto; }

.mx-auto { margin-left: auto; margin-right: auto; }
.my-0 { margin-top: 0; margin-bottom: 0; }
.my-4 { margin-top: var(--space-4); margin-bottom: var(--space-4); }
.my-6 { margin-top: var(--space-6); margin-bottom: var(--space-6); }

.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-5 { padding: var(--space-5); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

.pt-0 { padding-top: 0; }
.pt-4 { padding-top: var(--space-4); }
.pt-6 { padding-top: var(--space-6); }

.pb-0 { padding-bottom: 0; }
.pb-4 { padding-bottom: var(--space-4); }
.pb-6 { padding-bottom: var(--space-6); }

.px-0 { padding-left: 0; padding-right: 0; }
.px-2 { padding-left: var(--space-2); padding-right: var(--space-2); }
.px-3 { padding-left: var(--space-3); padding-right: var(--space-3); }
.px-4 { padding-left: var(--space-4); padding-right: var(--space-4); }
.px-5 { padding-left: var(--space-5); padding-right: var(--space-5); }
.px-6 { padding-left: var(--space-6); padding-right: var(--space-6); }

.py-0 { padding-top: 0; padding-bottom: 0; }
.py-2 { padding-top: var(--space-2); padding-bottom: var(--space-2); }
.py-3 { padding-top: var(--space-3); padding-bottom: var(--space-3); }
.py-4 { padding-top: var(--space-4); padding-bottom: var(--space-4); }
.py-6 { padding-top: var(--space-6); padding-bottom: var(--space-6); }

/* Border radius */
.rounded-none { border-radius: 0; }
.rounded-sm { border-radius: var(--radius-sm); }
.rounded { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-2xl { border-radius: var(--radius-2xl); }
.rounded-full { border-radius: var(--radius-full); }

/* Text utilities */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }

.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Color utilities */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.text-muted { color: var(--text-muted); }
.text-accent { color: var(--aurora-purple); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }

.bg-primary { background-color: var(--color-bg-primary); }
.bg-secondary { background-color: var(--color-bg-secondary); }
.bg-tertiary { background-color: var(--color-bg-tertiary); }
.bg-elevated { background-color: var(--color-bg-elevated); }

/* Opacity */
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: 0.25; }
.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }
.opacity-100 { opacity: 1; }

/* Pointer events */
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }

/* Cursor */
.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }

/* User select */
.select-none { user-select: none; }
.select-text { user-select: text; }
.select-all { user-select: all; }

/* Visibility */
.visible { visibility: visible; }
.invisible { visibility: hidden; }

/* Shadow utilities */
.shadow-none { box-shadow: none; }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
.shadow-glow { box-shadow: var(--shadow-glow); }

/* Divider */
.divider {
  height: 1px;
  background: var(--surface-border);
  border: none;
}

.divider-vertical {
  width: 1px;
  height: 100%;
  background: var(--surface-border);
}

/* ==========================================================================
   10. Media Queries & Responsive
   ========================================================================== */

/* Responsive breakpoints */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px */

@media (max-width: 1279px) {
  :root {
    --sidebar-width: 240px;
  }
}

@media (max-width: 1023px) {
  :root {
    --sidebar-width: 72px;
  }

  h1 { font-size: var(--text-4xl); }
  h2 { font-size: var(--text-3xl); }
  h3 { font-size: var(--text-2xl); }
}

@media (max-width: 767px) {
  :root {
    --header-height: 56px;
    --player-height: 72px;
  }

  h1 { font-size: var(--text-3xl); }
  h2 { font-size: var(--text-2xl); }
  h3 { font-size: var(--text-xl); }

  .container {
    padding: 0 var(--space-4);
  }

  /* Hide on mobile */
  .md\:hidden {
    display: none !important;
  }
}

@media (min-width: 768px) {
  /* Show on tablet+ */
  .hidden-md {
    display: none !important;
  }
}

@media (min-width: 1024px) {
  /* Grid responsive variants */
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}

/* ==========================================================================
   11. Accessibility
   ========================================================================== */

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --surface-border: rgba(255, 255, 255, 0.3);
    --surface-border-hover: rgba(255, 255, 255, 0.5);
    --text-secondary: rgba(255, 255, 255, 0.85);
    --text-tertiary: rgba(255, 255, 255, 0.7);
  }
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip link for keyboard navigation */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-5);
  background: var(--aurora-purple);
  color: white;
  border-radius: var(--radius-lg);
  z-index: var(--z-max);
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: var(--space-4);
}

/* Focus trap indicator */
.focus-trap-active {
  box-shadow: inset 0 0 0 2px var(--aurora-purple);
}

/* ==========================================================================
   12. Aurora Background Effects
   ========================================================================== */

/* Aurora background container */
.aurora-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.aurora-background::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
  animation: aurora-flow 30s ease-in-out infinite;
}

/* Dynamic aurora that adapts to album colors */
.aurora-dynamic {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 1s ease;
}

.aurora-dynamic::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(ellipse at 20% 30%, var(--dynamic-primary) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, var(--dynamic-secondary) 0%, transparent 50%);
  opacity: 0.12;
  filter: blur(100px);
  animation: aurora-flow 25s ease-in-out infinite;
}

/* Noise texture overlay */
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

```


## Assistant

Now let's create the core application structure. I'll create the app component, routes, and configuration:

**Tool Call: frontend/src/app/app.config.ts**
Status: Failed

Can't create file: parent directory doesn't exist

**Tool Call: Create directory `Audiora/frontend/src/app`**
Status: Completed

Created directory Audiora/frontend/src/app

**Tool Call: frontend/src/app/app.config.ts**
Status: Completed

Diff: Audiora/frontend/src/app/app.config.ts
```
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimations()
  ]
};

```


**Tool Call: frontend/src/app/app.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/app.component.ts
```
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- Aurora Background -->
    <div class="aurora-background"></div>
    <div class="aurora-dynamic"></div>
    <div class="noise-overlay"></div>

    <!-- Skip Link for Accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Main App Shell -->
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar glass-surface" [class.collapsed]="sidebarCollapsed">
        <!-- Logo -->
        <div class="sidebar-header">
          <div class="logo" (click)="toggleSidebar()">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
              <defs>
                <linearGradient id="sidebar-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#a855f7"/>
                  <stop offset="50%" style="stop-color:#3b82f6"/>
                  <stop offset="100%" style="stop-color:#14b8a6"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#sidebar-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
              <circle cx="50" cy="50" r="35" stroke="url(#sidebar-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" stroke="url(#sidebar-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
              <path d="M42 35 L42 65 L68 50 Z" fill="url(#sidebar-logo-gradient)"/>
            </svg>
            <span class="logo-text" *ngIf="!sidebarCollapsed">Audiora</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-section-title" *ngIf="!sidebarCollapsed">Menu</span>
            <a class="nav-item" [class.active]="activeRoute === 'home'" (click)="setActiveRoute('home')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Home</span>
            </a>
            <a class="nav-item" [class.active]="activeRoute === 'search'" (click)="setActiveRoute('search')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Search</span>
            </a>
            <a class="nav-item" [class.active]="activeRoute === 'library'" (click)="setActiveRoute('library')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Library</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-section-title" *ngIf="!sidebarCollapsed">Playlists</span>
            <a class="nav-item" [class.active]="activeRoute === 'liked'" (click)="setActiveRoute('liked')">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Liked Songs</span>
            </a>
            <a class="nav-item" (click)="createPlaylist()">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Create Playlist</span>
            </a>
          </div>
        </nav>

        <!-- Connected Services -->
        <div class="sidebar-footer" *ngIf="!sidebarCollapsed">
          <span class="nav-section-title">Connected</span>
          <div class="connected-services">
            <button class="service-badge spotify" [class.connected]="spotifyConnected">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Spotify</span>
            </button>
            <button class="service-badge youtube" [class.connected]="youtubeConnected">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="header glass-surface">
          <div class="header-left">
            <button class="btn-icon nav-btn" (click)="goBack()" [disabled]="!canGoBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button class="btn-icon nav-btn" (click)="goForward()" [disabled]="!canGoForward">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <div class="header-center">
            <div class="search-bar glass">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="performSearch()"
              />
              <kbd class="search-shortcut">⌘K</kbd>
            </div>
          </div>

          <div class="header-right">
            <button class="btn-icon" (click)="toggleTheme()">
              <svg *ngIf="isDarkTheme" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg *ngIf="!isDarkTheme" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <button class="btn-icon notifications-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="notification-dot"></span>
            </button>
            <button class="user-menu glass" (click)="toggleUserMenu()">
              <div class="user-avatar">
                <img *ngIf="userAvatar" [src]="userAvatar" alt="User avatar" />
                <svg *ngIf="!userAvatar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="user-name">{{ userName || 'Guest' }}</span>
              <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- Main Content -->
        <main id="main-content" class="main-content">
          <router-outlet></router-outlet>

          <!-- Placeholder content when no route matched -->
          <div class="welcome-content" *ngIf="!hasRouteContent">
            <div class="welcome-hero">
              <h1 class="text-gradient">Welcome to Audiora</h1>
              <p>Your unified music streaming experience. Connect your favorite services and enjoy all your music in one beautiful place.</p>
            </div>

            <div class="quick-actions">
              <div class="action-card glass-card" (click)="connectSpotify()">
                <div class="action-icon spotify-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <h3>Connect Spotify</h3>
                <p>Access your Spotify playlists and favorites</p>
              </div>

              <div class="action-card glass-card" (click)="connectYouTube()">
                <div class="action-icon youtube-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3>Connect YouTube</h3>
                <p>Stream YouTube Music and videos</p>
              </div>

              <div class="action-card glass-card" (click)="setActiveRoute('search')">
                <div class="action-icon search-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <h3>Discover Music</h3>
                <p>Search across all your connected services</p>
              </div>
            </div>

            <div class="recent-section" *ngIf="recentlyPlayed.length > 0">
              <h2>Recently Played</h2>
              <div class="recent-grid">
                <div class="recent-item glass-card" *ngFor="let item of recentlyPlayed">
                  <img [src]="item.albumArt" [alt]="item.title" />
                  <div class="recent-info">
                    <span class="recent-title">{{ item.title }}</span>
                    <span class="recent-artist">{{ item.artist }}</span>
                  </div>
                  <button class="play-btn" (click)="playTrack(item)">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Player Bar -->
      <footer class="player-bar glass-surface">
        <div class="player-track">
          <div class="track-art" *ngIf="currentTrack">
            <img [src]="currentTrack.albumArt" [alt]="currentTrack.title" />
          </div>
          <div class="track-art placeholder" *ngIf="!currentTrack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="4"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="12" cy="12" r="1"/>
            </svg>
          </div>
          <div class="track-info" *ngIf="currentTrack">
            <span class="track-title truncate">{{ currentTrack.title }}</span>
            <span class="track-artist truncate">{{ currentTrack.artist }}</span>
          </div>
          <div class="track-info" *ngIf="!currentTrack">
            <span class="track-title text-muted">No track playing</span>
            <span class="track-artist text-muted">Select a song to play</span>
          </div>
          <button class="btn-icon like-btn" *ngIf="currentTrack" (click)="toggleLike()">
            <svg viewBox="0 0 24 24" [attr.fill]="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <div class="player-controls">
          <div class="control-buttons">
            <button class="btn-icon" (click)="toggleShuffle()" [class.active]="isShuffled">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" y1="20" x2="21" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" y1="15" x2="21" y2="21"/>
                <line x1="4" y1="4" x2="9" y2="9"/>
              </svg>
            </button>
            <button class="btn-icon" (click)="previousTrack()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="19 20 9 12 19 4 19 20"/>
                <line x1="5" y1="19" x2="5" y2="5"/>
              </svg>
            </button>
            <button class="btn-icon play-pause-btn" (click)="togglePlayPause()">
              <svg *ngIf="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg *ngIf="isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
            <button class="btn-icon" (click)="nextTrack()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
            <button class="btn-icon" (click)="toggleRepeat()" [class.active]="repeatMode !== 'off'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
              <span class="repeat-indicator" *ngIf="repeatMode === 'one'">1</span>
            </button>
          </div>

          <div class="progress-bar">
            <span class="time-current">{{ formatTime(currentTime) }}</span>
            <div class="progress-track" (click)="seekTo($event)">
              <div class="progress-fill" [style.width.%]="progressPercent"></div>
              <div class="progress-handle" [style.left.%]="progressPercent"></div>
            </div>
            <span class="time-total">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="player-extra">
          <button class="btn-icon" (click)="toggleQueue()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button class="btn-icon" (click)="toggleDevices()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>
          <div class="volume-control">
            <button class="btn-icon" (click)="toggleMute()">
              <svg *ngIf="volume > 0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg *ngIf="volume > 0 && volume <= 0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg *ngIf="volume === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>
            <div class="volume-slider">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                [value]="volume"
                (input)="setVolume($event)"
              />
              <div class="volume-fill" [style.width.%]="volume * 100"></div>
            </div>
          </div>
          <button class="btn-icon" (click)="toggleFullscreen()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 3 21 3 21 9"/>
              <polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    /* App Shell Layout */
    .app-shell {
      display: grid;
      grid-template-columns: var(--sidebar-width) 1fr;
      grid-template-rows: 1fr var(--player-height);
      height: 100vh;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      grid-row: 1 / 3;
      display: flex;
      flex-direction: column;
      padding: var(--space-4);
      border-right: 1px solid var(--surface-border);
      overflow-y: auto;
      transition: width var(--transition-slow);
    }

    .sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
    }

    .sidebar-header {
      padding: var(--space-2) 0 var(--space-6);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .logo-text {
      font-family: var(--font-family-display);
      font-size: var(--text-xl);
      font-weight: 700;
      background: var(--gradient-aurora);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .nav-section-title {
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
      color: var(--text-muted);
      padding: var(--space-2) var(--space-3);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .nav-item:hover {
      background: var(--surface-glass);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .nav-item.active .nav-icon {
      color: var(--aurora-purple);
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-label {
      font-size: var(--text-sm);
      font-weight: 500;
    }

    /* Sidebar Footer - Connected Services */
    .sidebar-footer {
      padding-top: var(--space-4);
      border-top: 1px solid var(--surface-border);
      margin-top: auto;
    }

    .connected-services {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin-top: var(--space-2);
    }

    .service-badge {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .service-badge svg {
      width: 16px;
      height: 16px;
    }

    .service-badge.spotify.connected {
      color: var(--spotify-green);
      border-color: rgba(29, 185, 84, 0.3);
    }

    .service-badge.youtube.connected {
      color: var(--youtube-red);
      border-color: rgba(255, 0, 0, 0.3);
    }

    .service-badge:hover {
      background: var(--surface-glass-hover);
    }

    /* Main Wrapper */
    .main-wrapper {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height);
      padding: 0 var(--space-6);
      border-bottom: 1px solid var(--surface-border);
      flex-shrink: 0;
    }

    .header-left,
    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .nav-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--surface-glass);
    }

    .nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .nav-btn svg {
      width: 16px;
      height: 16px;
    }

    /* Search Bar */
    .header-center {
      flex: 1;
      max-width: 500px;
      margin: 0 var(--space-6);
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-full);
      background: var(--color-bg-secondary);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .search-bar input {
      flex: 1;
      font-size: var(--text-sm);
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
    }

    .search-bar input::placeholder {
      color: var(--text-muted);
    }

    .search-shortcut {
      padding: var(--space-1) var(--space-2);
      font-size: var(--text-xs);
      font-family: var(--font-family-sans);
      color: var(--text-muted);
      background: var(--surface-glass);
      border-radius: var(--radius-sm);
      border: 1px solid var(--surface-border);
    }

    /* Header Buttons */
    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--surface-glass);
      color: var(--text-primary);
    }

    .btn-icon svg {
      width: 20px;
      height: 20px;
    }

    .notifications-btn {
      position: relative;
    }

    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--aurora-pink);
      border-radius: 50%;
      border: 2px solid var(--color-bg-secondary);
    }

    /* User Menu */
    .user-menu {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3) var(--space-1) var(--space-1);
      border-radius: var(--radius-full);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .user-menu:hover {
      background: var(--surface-glass-hover);
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--gradient-aurora);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-avatar svg {
      width: 16px;
      height: 16px;
      color: white;
    }

    .user-name {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-primary);
    }

    .dropdown-icon {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-6);
    }

    /* Welcome Content */
    .welcome-content {
      animation: fade-in var(--transition-slow) ease;
    }

    .welcome-hero {
      text-align: center;
      padding: var(--space-12) 0;
    }

    .welcome-hero h1 {
      font-size: var(--text-5xl);
      margin-bottom: var(--space-4);
    }

    .welcome-hero p {
      font-size: var(--text-lg);
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Quick Actions */
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
      margin-top: var(--space-8);
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--space-8);
      cursor: pointer;
    }

    .action-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .action-icon svg {
      width: 32px;
      height: 32px;
      color: white;
    }

    .spotify-bg {
      background: var(--spotify-green);
    }

    .youtube-bg {
      background: var(--youtube-red);
    }

    .search-bg {
      background: var(--gradient-aurora);
    }

    .action-card h3 {
      font-size: var(--text-lg);
      margin-bottom: var(--space-2);
    }

    .action-card p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Recently Played */
    .recent-section {
      margin-top: var(--space-12);
    }

    .recent-section h2 {
      margin-bottom: var(--space-6);
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .recent-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      cursor: pointer;
    }

    .recent-item img {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      object-fit: cover;
    }

    .recent-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .recent-title {
      font-weight: 500;
      color: var(--text-primary);
    }

    .recent-artist {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .play-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--aurora-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.8);
      transition: all var(--transition-base);
    }

    .play-btn svg {
      width: 16px;
      height: 16px;
      color: white;
      margin-left: 2px;
    }

    .recent-item:hover .play-btn {
      opacity: 1;
      transform: scale(1);
    }

    /* Player Bar */
    .player-bar {
      grid-column: 1 / 3;
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      align-items: center;
      padding: 0 var(--space-4);
      border-top: 1px solid var(--surface-border);
    }

    /* Track Info */
    .player-track {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .track-art {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      overflow: hidden;
      flex-shrink: 0;
    }

    .track-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .track-art.placeholder {
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .track-art.placeholder svg {
      width: 24px;
      height: 24px;
      color: var(--text-muted);
    }

    .track-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      max-width: 180px;
    }

    .track-title {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-primary);
    }

    .track-artist {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
    }

    .like-btn.active svg {
      color: var(--aurora-pink);
      fill: var(--aurora-pink);
    }

    /* Player Controls */
    .player-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }

    .control-buttons {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .play-pause-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--text-primary);
      color: var(--text-inverse);
    }

    .play-pause-btn:hover {
      transform: scale(1.05);
      background: var(--text-primary);
    }

    .play-pause-btn svg {
      width: 16px;
      height: 16px;
    }

    .control-buttons .btn-icon.active {
      color: var(--aurora-purple);
    }

    .repeat-indicator {
      position: absolute;
      font-size: 9px;
      font-weight: 700;
      bottom: 4px;
      right: 4px;
    }

    /* Progress Bar */
    .progress-bar {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      width: 100%;
      max-width: 600px;
    }

    .time-current,
    .time-total {
      font-size: var(--text-xs);
      color: var(--text-muted);
      min-width: 40px;
      text-align: center;
    }

    .progress-track {
      flex: 1;
      height: 4px;
      background: var(--surface-glass-hover);
      border-radius: var(--radius-full);
      cursor: pointer;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: var(--text-primary);
      border-radius: var(--radius-full);
      transition: width 0.1s linear;
    }

    .progress-handle {
      position: absolute;
      top: 50%;
      width: 12px;
      height: 12px;
      background: var(--text-primary);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .progress-track:hover .progress-handle {
      opacity: 1;
    }

    .progress-track:hover .progress-fill {
      background: var(--aurora-purple);
    }

    /* Player Extra Controls */
    .player-extra {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-2);
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .volume-slider {
      width: 100px;
      height: 4px;
      background: var(--surface-glass-hover);
      border-radius: var(--radius-full);
      position: relative;
    }

    .volume-slider input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .volume-fill {
      height: 100%;
      background: var(--text-primary);
      border-radius: var(--radius-full);
      pointer-events: none;
    }

    .volume-slider:hover .volume-fill {
      background: var(--aurora-purple);
    }

    /* Responsive */
    @media (max-width: 1023px) {
      .app-shell {
        grid-template-columns: var(--sidebar-collapsed-width) 1fr;
      }

      .sidebar {
        width: var(--sidebar-collapsed-width);
        align-items: center;
      }

      .nav-label,
      .nav-section-title,
      .logo-text,
      .sidebar-footer,
      .user-name,
      .search-shortcut {
        display: none;
      }

      .nav-item {
        justify-content: center;
        padding: var(--space-3);
      }
    }

    @media (max-width: 767px) {
      .app-shell {
        grid-template-columns: 1fr;
        grid-template-rows: var(--header-height) 1fr var(--player-height);
      }

      .sidebar {
        display: none;
      }

      .player-bar {
        grid-column: 1;
        grid-template-columns: 1fr auto;
        gap: var(--space-3);
        padding: var(--space-2) var(--space-4);
      }

      .player-controls {
        display: none;
      }

      .player-extra {
        display: none;
      }

      .header-center {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  // Sidebar state
  sidebarCollapsed = false;
  activeRoute = 'home';

  // Navigation state
  canGoBack = false;
  canGoForward = false;

  // Search
  searchQuery = '';

  // Theme
  isDarkTheme = true;

  // User
  userName = '';
  userAvatar = '';

  // Services
  spotifyConnected = false;
  youtubeConnected = false;

  // Player state
  currentTrack: any = null;
  isPlaying = false;
  isShuffled = false;
  repeatMode: 'off' | 'all' | 'one' = 'off';
  isLiked = false;
  currentTime = 0;
  duration = 0;
  volume = 0.7;

  // Content
  hasRouteContent = false;
  recentlyPlayed: any[] = [];

  get progressPercent(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  ngOnInit(): void {
    // Initialize app state
    this.checkTheme();
    this.loadUserData();
    this.loadRecentlyPlayed();
  }

  // Sidebar
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setActiveRoute(route: string): void {
    this.activeRoute = route;
  }

  // Navigation
  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }

  // Search
  performSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Navigate to search results
    }
  }

  // Theme
  checkTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
    } else {
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  // User
  loadUserData(): void {
    // Load user data from storage/API
  }

  toggleUserMenu(): void {
    console.log('Toggle user menu');
  }

  // Services
  connectSpotify(): void {
    console.log('Connect Spotify');
  }

  connectYouTube(): void {
    console.log('Connect YouTube');
  }

  // Playlists
  createPlaylist(): void {
    console.log('Create playlist');
  }

  // Player controls
  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
  }

  previousTrack(): void {
    console.log('Previous track');
  }

  nextTrack(): void {
    console.log('Next track');
  }

  toggleShuffle(): void {
    this.isShuffled = !this.isShuffled;
  }

  toggleRepeat(): void {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(currentIndex + 1) % modes.length];
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
  }

  seekTo(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.currentTime = percent * this.duration;
  }

  toggleMute(): void {
    this.volume = this.volume > 0 ? 0 : 0.7;
  }

  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
  }

  toggleQueue(): void {
    console.log('Toggle queue');
  }

  toggleDevices(): void {
    console.log('Toggle devices');
  }

  toggleFullscreen(): void {
    console.log('Toggle fullscreen');
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Content
  loadRecentlyPlayed(): void {
    // Load from storage/API
  }

  playTrack(track: any): void {
    this.currentTrack = track;
    this.isPlaying = true;
  }
}

```


**Tool Call: frontend/src/app/app.routes.ts**
Status: Completed

Diff: Audiora/frontend/src/app/app.routes.ts
```
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Audiora - Home',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Audiora - Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Audiora - Register',
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./features/auth/verify/verify.component').then(
        (m) => m.VerifyComponent
      ),
    title: 'Audiora - Verify Email',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
    title: 'Audiora - Forgot Password',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    title: 'Audiora - Reset Password',
  },
  {
    path: 'oauth/callback',
    loadComponent: () =>
      import('./features/auth/oauth-callback/oauth-callback.component').then(
        (m) => m.OAuthCallbackComponent
      ),
    title: 'Audiora - Connecting...',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(
        (m) => m.SearchComponent
      ),
    title: 'Audiora - Search',
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/library.component').then(
        (m) => m.LibraryComponent
      ),
    title: 'Audiora - Library',
  },
  {
    path: 'liked',
    loadComponent: () =>
      import('./features/liked/liked.component').then((m) => m.LikedComponent),
    title: 'Audiora - Liked Songs',
  },
  {
    path: 'playlist/:id',
    loadComponent: () =>
      import('./features/playlist/playlist.component').then(
        (m) => m.PlaylistComponent
      ),
    title: 'Audiora - Playlist',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    title: 'Audiora - Profile',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    title: 'Audiora - Settings',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

```


## Assistant

Now let's create the core services and interceptors:

**Tool Call: Create directory `Audiora/frontend/src/app/core/models`**
Status: Completed

Created directory Audiora/frontend/src/app/core/models

**Tool Call: Create directory `Audiora/frontend/src/app/core/services`**
Status: Completed

Created directory Audiora/frontend/src/app/core/services

**Tool Call: Create directory `Audiora/frontend/src/app/core/guards`**
Status: Completed

Created directory Audiora/frontend/src/app/core/guards

**Tool Call: Create directory `Audiora/frontend/src/app/core/interceptors`**
Status: Completed

Created directory Audiora/frontend/src/app/core/interceptors

**Tool Call: frontend/src/app/core/models/index.ts**
Status: Completed

Diff: Audiora/frontend/src/app/core/models/index.ts
```
// ============================================================================
// Audiora Core Models
// ============================================================================

// ============================================================================
// User Models
// ============================================================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: string;
  autoPlay: boolean;
  crossfade: number;
  normalizeVolume: boolean;
  showExplicitContent: boolean;
  defaultProvider: Provider;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  newReleases: boolean;
  playlistUpdates: boolean;
  socialActivity: boolean;
  emailDigest: boolean;
}

// ============================================================================
// Authentication Models
// ============================================================================

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface OAuthExchangeRequest {
  sessionId: string;
  userId: string;
  provider: Provider;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// ============================================================================
// Provider Models
// ============================================================================

export type Provider = 'spotify' | 'youtube' | 'local';

export interface ProviderConnection {
  provider: Provider;
  connected: boolean;
  sessionId?: string;
  displayName?: string;
  avatarUrl?: string;
  expiresAt?: number;
}

export interface ProviderToken {
  provider: Provider;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

// ============================================================================
// Track Models
// ============================================================================

export interface Track {
  id: string;
  provider: Provider;
  providerId: string;
  title: string;
  artist: string;
  artists?: Artist[];
  album?: string;
  albumId?: string;
  albumArt?: string;
  duration: number; // in milliseconds
  explicit?: boolean;
  popularity?: number;
  previewUrl?: string;
  externalUrl?: string;
  isPlayable: boolean;
  addedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  provider: Provider;
  providerId: string;
}

export interface Album {
  id: string;
  provider: Provider;
  providerId: string;
  name: string;
  artist: string;
  artists?: Artist[];
  imageUrl?: string;
  releaseDate?: string;
  totalTracks?: number;
  tracks?: Track[];
}

// ============================================================================
// Playlist Models
// ============================================================================

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  owner: PlaylistOwner;
  provider: Provider;
  providerId?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  totalTracks: number;
  tracks?: PlaylistTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistOwner {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PlaylistTrack {
  track: Track;
  addedAt: string;
  addedBy?: PlaylistOwner;
  position: number;
}

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

// ============================================================================
// Liked Tracks Models
// ============================================================================

export interface LikedTrack {
  id: string;
  userId: string;
  trackId: string;
  provider: Provider;
  trackData: Track;
  likedAt: string;
}

export interface LikeTrackRequest {
  trackId: string;
  provider: Provider;
  trackData: Track;
}

// ============================================================================
// Player Models
// ============================================================================

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  position: number; // in milliseconds
  duration: number; // in milliseconds
  volume: number; // 0-1
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  activeDevice: Device | null;
}

export type RepeatMode = 'off' | 'track' | 'context';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  isActive: boolean;
  volumePercent: number;
}

export type DeviceType = 'computer' | 'smartphone' | 'speaker' | 'tv' | 'web';

export interface PlayRequest {
  trackId?: string;
  trackIds?: string[];
  contextUri?: string;
  offset?: number;
  positionMs?: number;
}

// ============================================================================
// Search Models
// ============================================================================

export interface SearchRequest {
  query: string;
  types?: SearchType[];
  providers?: Provider[];
  limit?: number;
  offset?: number;
}

export type SearchType = 'track' | 'artist' | 'album' | 'playlist';

export interface SearchResults {
  query: string;
  tracks: SearchResultGroup<Track>;
  artists: SearchResultGroup<Artist>;
  albums: SearchResultGroup<Album>;
  playlists: SearchResultGroup<Playlist>;
}

export interface SearchResultGroup<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  provider?: Provider;
}

export interface UnifiedSearchResults {
  query: string;
  spotify?: SearchResults;
  youtube?: SearchResults;
}

// ============================================================================
// API Response Models
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// Theme Models
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  background: string;
  surface: string;
  text: string;
}

export interface DynamicTheme {
  isActive: boolean;
  colors: ThemeColors;
  sourceImage?: string;
}

// ============================================================================
// UI State Models
// ============================================================================

export interface UIState {
  sidebarCollapsed: boolean;
  queueVisible: boolean;
  nowPlayingExpanded: boolean;
  searchFocused: boolean;
  modalStack: string[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  callback: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

```


**Tool Call: frontend/src/app/core/guards/auth.guard.ts**
Status: Completed

Diff: Audiora/frontend/src/app/core/guards/auth.guard.ts
```
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  authService.setRedirectUrl(state.url);

  // Navigate to the login page
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // User is already logged in, redirect to home
  router.navigate(['/']);
  return false;
};

```


**Tool Call: frontend/src/app/core/interceptors/auth.interceptor.ts**
Status: Completed

Diff: Audiora/frontend/src/app/core/interceptors/auth.interceptor.ts
```
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Track if we're currently refreshing the token
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Skip auth header for certain endpoints
  const skipAuthUrls = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify',
    '/api/auth/resend-verification',
    '/api/health'
  ];

  const shouldSkipAuth = skipAuthUrls.some(url => req.url.includes(url));

  if (shouldSkipAuth) {
    return next(req);
  }

  // Get the current access token
  const accessToken = authService.getAccessToken();

  // Clone and add auth header if we have a token
  let authReq = req;
  if (accessToken) {
    authReq = addTokenToRequest(req, accessToken);
  }

  // Add session ID for provider APIs (Spotify, YouTube)
  const sessionId = authService.getSessionId();
  if (sessionId && (req.url.includes('/api/spotify') || req.url.includes('/api/youtube'))) {
    authReq = authReq.clone({
      setHeaders: {
        'X-Session-Id': sessionId
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (error.status === 401 && !shouldSkipAuth) {
        return handle401Error(authReq, next, authService);
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        console.error('Access forbidden:', error.message);
        // Could navigate to an access denied page
      }

      // Handle other errors
      return throwError(() => error);
    })
  );
};

/**
 * Add the JWT token to the request headers
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Handle 401 errors by attempting to refresh the token
 */
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();

    if (refreshToken) {
      return authService.refreshAccessToken(refreshToken).pipe(
        switchMap((response: any) => {
          isRefreshing = false;

          // Store the new tokens
          authService.setTokens(response.accessToken, response.refreshToken);
          refreshTokenSubject.next(response.accessToken);

          // Retry the original request with the new token
          return next(addTokenToRequest(req, response.accessToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          refreshTokenSubject.next(null);

          // Refresh failed, logout the user
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // No refresh token available, logout
      isRefreshing = false;
      authService.logout();
      return throwError(() => new Error('No refresh token available'));
    }
  }

  // If we're already refreshing, wait for the new token
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addTokenToRequest(req, token!)))
  );
}

```


## Assistant

Now let's create the core services:

**Tool Call: frontend/src/app/core/services/api.service.ts**
Status: Completed

Diff: Audiora/frontend/src/app/core/services/api.service.ts
```
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, ApiError, PaginatedResponse } from '../models';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || '/api';

  /**
   * Performs a GET request
   */
  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, this.buildOptions(options))
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Performs a GET request with raw response (no ApiResponse wrapper)
   */
  getRaw<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a GET request for paginated data
   */
  getPaginated<T>(
    endpoint: string,
    page = 0,
    limit = 20,
    options?: RequestOptions
  ): Observable<PaginatedResponse<T>> {
    const params = {
      offset: (page * limit).toString(),
      limit: limit.toString(),
      ...options?.params,
    };

    return this.http
      .get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, {
        ...this.buildOptions(options),
        params,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a POST request
   */
  post<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, this.buildOptions(options))
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Performs a POST request with raw response
   */
  postRaw<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a PUT request
   */
  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, this.buildOptions(options))
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Performs a PUT request with raw response
   */
  putRaw<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a PATCH request
   */
  patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, this.buildOptions(options))
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Performs a DELETE request
   */
  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, this.buildOptions(options))
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Performs a DELETE request with raw response
   */
  deleteRaw<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Upload a file using multipart/form-data
   */
  upload<T>(endpoint: string, file: File, fieldName = 'file'): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);

    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData)
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Build HTTP options with defaults
   */
  private buildOptions(options?: RequestOptions): RequestOptions {
    const defaultHeaders = new HttpHeaders({
      Accept: 'application/json',
    });

    // Don't set Content-Type for FormData - let browser set it with boundary
    if (options?.headers instanceof HttpHeaders) {
      return {
        ...options,
        headers: defaultHeaders.keys().reduce(
          (headers, key) => headers.set(key, defaultHeaders.get(key)!),
          options.headers
        ),
      };
    }

    return {
      headers: defaultHeaders,
      withCredentials: true,
      ...options,
    };
  }

  /**
   * Extract data from ApiResponse wrapper
   */
  private extractData<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }
    return response as T;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
      errorCode = 'CLIENT_ERROR';
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiError;
        if (apiError.error) {
          errorMessage = apiError.error.message || errorMessage;
          errorCode = apiError.error.code || `HTTP_${error.status}`;
        } else if ('message' in error.error) {
          errorMessage = (error.error as any).message;
          errorCode = `HTTP_${error.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
        errorCode = `HTTP_${error.status}`;
      }

      // Map common HTTP status codes to user-friendly messages
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          errorCode = 'NETWORK_ERROR';
          break;
        case 400:
          errorMessage = errorMessage || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Your session has expired. Please log in again.';
          errorCode = 'UNAUTHORIZED';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorMessage = errorMessage || 'The requested resource was not found.';
          errorCode = 'NOT_FOUND';
          break;
        case 409:
          errorMessage = errorMessage || 'A conflict occurred with the current state.';
          errorCode = 'CONFLICT';
          break;
        case 422:
          errorMessage = errorMessage || 'The request could not be processed.';
          errorCode = 'UNPROCESSABLE_ENTITY';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          errorCode = 'RATE_LIMITED';
          break;
        case 500:
          errorMessage = 'An internal server error occurred. Please try again later.';
          errorCode = 'SERVER_ERROR';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'The service is temporarily unavailable. Please try again later.';
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
      }
    }

    console.error(`[API Error] ${errorCode}: ${errorMessage}`, error);

    return throwError(() => ({
      code: errorCode,
      message: errorMessage,
      status: error.status,
      originalError: error,
    }));
  }
}

```


**Tool Call: frontend/src/app/core/services/theme.service.ts**
Status: Completed

Diff: Audiora/frontend/src/app/core/services/theme.service.ts
```
import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
}

export interface DynamicTheme {
  isActive: boolean;
  colors: ThemeColors;
  sourceImage?: string;
}

const DEFAULT_AURORA_COLORS: ThemeColors = {
  primary: '#a855f7', // purple
  secondary: '#14b8a6', // teal
  accent: '#ec4899', // pink
  muted: '#3b82f6', // blue
};

const STORAGE_KEYS = {
  THEME_MODE: 'audiora_theme_mode',
  DYNAMIC_ENABLED: 'audiora_dynamic_theme',
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Signals for reactive state
  private readonly _themeMode = signal<ThemeMode>('dark');
  private readonly _dynamicTheme = signal<DynamicTheme>({
    isActive: false,
    colors: DEFAULT_AURORA_COLORS,
  });
  private readonly _systemPrefersDark = signal<boolean>(true);

  // Computed values
  readonly themeMode = computed(() => this._themeMode());
  readonly dynamicTheme = computed(() => this._dynamicTheme());
  readonly isDarkMode = computed(() => {
    const mode = this._themeMode();
    if (mode === 'system') {
      return this._systemPrefersDark();
    }
    return mode === 'dark';
  });
  readonly currentColors = computed(() => this._dynamicTheme().colors);

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();

    // Effect to apply theme changes to DOM
    effect(() => {
      this.applyThemeToDOM();
    });

    // Effect to apply dynamic colors
    effect(() => {
      const theme = this._dynamicTheme();
      if (theme.isActive) {
        this.applyDynamicColors(theme.colors);
      } else {
        this.applyDynamicColors(DEFAULT_AURORA_COLORS);
      }
    });
  }

  /**
   * Initialize theme from storage or system preference
   */
  private initializeTheme(): void {
    // Load saved theme mode
    const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode | null;
    if (savedMode && ['dark', 'light', 'system'].includes(savedMode)) {
      this._themeMode.set(savedMode);
    }

    // Load dynamic theme preference
    const dynamicEnabled = localStorage.getItem(STORAGE_KEYS.DYNAMIC_ENABLED);
    if (dynamicEnabled === 'true') {
      this._dynamicTheme.update((current) => ({ ...current, isActive: true }));
    }

    // Check system preference
    this._systemPrefersDark.set(
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  /**
   * Listen for system theme changes
   */
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      this._systemPrefersDark.set(e.matches);
    });
  }

  /**
   * Apply current theme to DOM
   */
  private applyThemeToDOM(): void {
    const isDark = this.isDarkMode();
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0a0a0f' : '#f8fafc');
    }
  }

  /**
   * Apply dynamic colors to CSS custom properties
   */
  private applyDynamicColors(colors: ThemeColors): void {
    const root = document.documentElement;
    root.style.setProperty('--dynamic-primary', colors.primary);
    root.style.setProperty('--dynamic-secondary', colors.secondary);
    root.style.setProperty('--dynamic-accent', colors.accent);
    root.style.setProperty('--dynamic-muted', colors.muted);

    // Also set RGB versions for transparency
    const primaryRgb = this.hexToRgb(colors.primary);
    if (primaryRgb) {
      root.style.setProperty(
        '--dynamic-primary-rgb',
        `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`
      );
    }
  }

  /**
   * Set the theme mode
   */
  setThemeMode(mode: ThemeMode): void {
    this._themeMode.set(mode);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }

  /**
   * Toggle between dark and light mode
   */
  toggleTheme(): void {
    const current = this._themeMode();
    if (current === 'system') {
      this.setThemeMode(this._systemPrefersDark() ? 'light' : 'dark');
    } else {
      this.setThemeMode(current === 'dark' ? 'light' : 'dark');
    }
  }

  /**
   * Enable or disable dynamic theming
   */
  setDynamicThemeEnabled(enabled: boolean): void {
    this._dynamicTheme.update((current) => ({ ...current, isActive: enabled }));
    localStorage.setItem(STORAGE_KEYS.DYNAMIC_ENABLED, String(enabled));
  }

  /**
   * Extract colors from an album art image
   */
  async extractColorsFromImage(imageUrl: string): Promise<ThemeColors> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const colors = this.analyzeImage(img);
          resolve(colors);
        } catch (error) {
          console.warn('Failed to analyze image, using defaults:', error);
          resolve(DEFAULT_AURORA_COLORS);
        }
      };

      img.onerror = () => {
        console.warn('Failed to load image for color extraction');
        resolve(DEFAULT_AURORA_COLORS);
      };

      img.src = imageUrl;
    });
  }

  /**
   * Update dynamic theme with colors from album art
   */
  async updateFromAlbumArt(imageUrl: string): Promise<void> {
    if (!this._dynamicTheme().isActive) {
      return;
    }

    const colors = await this.extractColorsFromImage(imageUrl);
    this._dynamicTheme.update((current) => ({
      ...current,
      colors,
      sourceImage: imageUrl,
    }));
  }

  /**
   * Reset to default aurora colors
   */
  resetToDefaultColors(): void {
    this._dynamicTheme.update((current) => ({
      ...current,
      colors: DEFAULT_AURORA_COLORS,
      sourceImage: undefined,
    }));
  }

  /**
   * Analyze image and extract dominant colors
   */
  private analyzeImage(img: HTMLImageElement): ThemeColors {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Use smaller size for faster processing
    const size = 100;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(img, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Extract colors using a simple color quantization approach
    const colorCounts: Map<string, { count: number; r: number; g: number; b: number }> = new Map();

    for (let i = 0; i < pixels.length; i += 4) {
      const r = Math.round(pixels[i] / 32) * 32;
      const g = Math.round(pixels[i + 1] / 32) * 32;
      const b = Math.round(pixels[i + 2] / 32) * 32;

      // Skip very dark or very light colors
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;

      const key = `${r},${g},${b}`;
      const existing = colorCounts.get(key);

      if (existing) {
        existing.count++;
      } else {
        colorCounts.set(key, { count: 1, r, g, b });
      }
    }

    // Sort by count and get top colors
    const sortedColors = Array.from(colorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    if (sortedColors.length < 2) {
      return DEFAULT_AURORA_COLORS;
    }

    // Find colors with good saturation and variety
    const vibrantColors = sortedColors.filter((c) => {
      const max = Math.max(c.r, c.g, c.b);
      const min = Math.min(c.r, c.g, c.b);
      const saturation = max > 0 ? (max - min) / max : 0;
      return saturation > 0.2;
    });

    const colorsToUse = vibrantColors.length >= 2 ? vibrantColors : sortedColors;

    // Select primary (most prominent vibrant color)
    const primary = colorsToUse[0];

    // Select secondary (different hue from primary)
    let secondary = colorsToUse.find((c, i) => {
      if (i === 0) return false;
      const hueDiff = Math.abs(this.getHue(c) - this.getHue(primary));
      return hueDiff > 30 || hueDiff < 330;
    }) || colorsToUse[1] || primary;

    // Select accent (most saturated or contrasting)
    const accent = colorsToUse.find((c, i) => {
      if (i === 0 || c === secondary) return false;
      return true;
    }) || this.adjustColor(primary, 30);

    // Muted is a desaturated version
    const muted = this.desaturate(primary);

    return {
      primary: this.rgbToHex(primary.r, primary.g, primary.b),
      secondary: this.rgbToHex(secondary.r, secondary.g, secondary.b),
      accent: typeof accent === 'string' ? accent : this.rgbToHex(accent.r, accent.g, accent.b),
      muted: this.rgbToHex(muted.r, muted.g, muted.b),
    };
  }

  /**
   * Get hue from RGB color
   */
  private getHue(color: { r: number; g: number; b: number }): number {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return 0;

    let hue = 0;
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }

    hue = Math.round(hue * 60);
    return hue < 0 ? hue + 360 : hue;
  }

  /**
   * Adjust color by shifting hue
   */
  private adjustColor(color: { r: number; g: number; b: number }, hueDelta: number): string {
    const hsl = this.rgbToHsl(color.r, color.g, color.b);
    hsl.h = (hsl.h + hueDelta) % 360;
    const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Desaturate a color
   */
  private desaturate(color: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
    const hsl = this.rgbToHsl(color.r, color.g, color.b);
    hsl.s = Math.max(0, hsl.s - 0.4);
    return this.hslToRgb(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s, l };
  }

  /**
   * Convert HSL to RGB
   */
  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number): string => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Check if a color has sufficient contrast against background
   */
  hasGoodContrast(foreground: string, background: string): boolean {
    const fg = this.hexToRgb(foreground);
    const bg = this.hexToRgb(background);

    if (!fg || !bg) return true;

    const luminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = luminance(fg.r, fg.g, fg.b);
    const l2 = luminance(bg.r, bg.g, bg.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    // WCAG AA requires 4.5:1 for normal text
    return ratio >= 4.5;
  }
}

```


**Tool Call: frontend/src/app/core/services/auth.service.ts**
Status: Completed

Diff: Audiora/frontend/src/app/core/services/auth.service.ts
```
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError, of } from 'rxjs';
import {
  User,
  AuthState,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  OAuthExchangeRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  Provider,
  ProviderConnection,
} from '../models';
import { environment } from '../../../environments/environment';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'audiora_access_token',
  REFRESH_TOKEN: 'audiora_refresh_token',
  USER: 'audiora_user',
  EXPIRES_AT: 'audiora_expires_at',
  SESSION_ID: 'audiora_session_id',
  PROVIDER_SESSIONS: 'audiora_provider_sessions',
  REDIRECT_URL: 'audiora_redirect_url',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  // Auth state using signals for reactivity
  private authStateSignal = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null,
  });

  // Public readonly computed signals
  readonly isAuthenticated = computed(() => this.authStateSignal().isAuthenticated);
  readonly currentUser = computed(() => this.authStateSignal().user);
  readonly authState = computed(() => this.authStateSignal());

  // Provider connections
  private providerConnectionsSubject = new BehaviorSubject<ProviderConnection[]>([]);
  readonly providerConnections$ = this.providerConnectionsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  /**
   * Initialize auth state from localStorage on app startup
   */
  private initializeAuthState(): void {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getStoredUser();
    const expiresAt = this.getExpiresAt();

    if (accessToken && user && expiresAt) {
      // Check if token is expired
      if (Date.now() < expiresAt) {
        this.authStateSignal.set({
          isAuthenticated: true,
          user,
          token: accessToken,
          refreshToken,
          expiresAt,
        });
      } else if (refreshToken) {
        // Token expired but we have refresh token, try to refresh
        this.refreshAccessToken(refreshToken).subscribe({
          error: () => this.clearAuthState(),
        });
      } else {
        this.clearAuthState();
      }
    }

    // Load provider connections
    this.loadProviderConnections();
  }

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    // Call logout endpoint if authenticated
    if (this.isAuthenticated()) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: () => {}, // Ignore errors on logout
      });
    }

    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify`, { token });
  }

  /**
   * Resend verification email
   */
  resendVerification(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/resend-verification`, { email });
  }

  /**
   * Request password reset
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Reset password with token
   */
  resetPassword(data: PasswordResetConfirm): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data);
  }

  /**
   * Refresh access token
   */
  refreshAccessToken(refreshToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.clearAuthState();
          return throwError(() => error);
        })
      );
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((user) => {
        this.authStateSignal.update((state) => ({ ...state, user }));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      })
    );
  }

  // ============================================================================
  // OAuth Methods
  // ============================================================================

  /**
   * Initiate OAuth flow for a provider
   */
  initiateOAuth(provider: Provider): void {
    // Generate a unique state for CSRF protection
    const state = this.generateRandomString(32);
    sessionStorage.setItem(`oauth_state_${provider}`, state);

    // Open OAuth popup or redirect
    const oauthUrl = `${environment.apiUrl}/api/auth/oauth/${provider}?state=${state}`;

    // Open in new window for popup flow
    const width = 500;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      oauthUrl,
      `${provider}-oauth`,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }

  /**
   * Exchange OAuth callback data for JWT tokens
   */
  exchangeOAuthToken(data: OAuthExchangeRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/oauth/exchange`, data).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  /**
   * Handle OAuth callback from provider
   */
  handleOAuthCallback(
    provider: Provider,
    sessionId: string,
    userId: string
  ): Observable<AuthResponse> {
    // Verify state if available
    const savedState = sessionStorage.getItem(`oauth_state_${provider}`);
    sessionStorage.removeItem(`oauth_state_${provider}`);

    // Store session ID for provider API calls
    this.storeProviderSession(provider, sessionId);

    // Exchange for JWT
    return this.exchangeOAuthToken({ sessionId, userId, provider });
  }

  /**
   * Connect additional provider to existing account
   */
  connectProvider(provider: Provider): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const state = this.generateRandomString(32);
    sessionStorage.setItem(`oauth_state_${provider}`, state);

    const connectUrl = `${environment.apiUrl}/api/auth/oauth/${provider}/connect?state=${state}`;

    const width = 500;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      connectUrl,
      `${provider}-connect`,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }

  /**
   * Disconnect a provider
   */
  disconnectProvider(provider: Provider): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/oauth/${provider}/disconnect`).pipe(
      tap(() => {
        this.removeProviderSession(provider);
        this.updateProviderConnection(provider, false);
      })
    );
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set tokens in storage
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  /**
   * Get session ID for provider API calls
   */
  getSessionId(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticatedSync(): boolean {
    const token = this.getAccessToken();
    const expiresAt = this.getExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    return Date.now() < expiresAt;
  }

  // ============================================================================
  // Redirect URL Management
  // ============================================================================

  /**
   * Set redirect URL for after login
   */
  setRedirectUrl(url: string): void {
    sessionStorage.setItem(STORAGE_KEYS.REDIRECT_URL, url);
  }

  /**
   * Get and clear redirect URL
   */
  getAndClearRedirectUrl(): string | null {
    const url = sessionStorage.getItem(STORAGE_KEYS.REDIRECT_URL);
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_URL);
    return url;
  }

  // ============================================================================
  // Provider Session Management
  // ============================================================================

  /**
   * Store provider session ID
   */
  storeProviderSession(provider: Provider, sessionId: string): void {
    const sessions = this.getProviderSessions();
    sessions[provider] = sessionId;
    localStorage.setItem(STORAGE_KEYS.PROVIDER_SESSIONS, JSON.stringify(sessions));
    this.updateProviderConnection(provider, true, sessionId);
  }

  /**
   * Get provider session ID
   */
  getProviderSession(provider: Provider): string | null {
    const sessions = this.getProviderSessions();
    return sessions[provider] || null;
  }

  /**
   * Remove provider session
   */
  removeProviderSession(provider: Provider): void {
    const sessions = this.getProviderSessions();
    delete sessions[provider];
    localStorage.setItem(STORAGE_KEYS.PROVIDER_SESSIONS, JSON.stringify(sessions));
  }

  /**
   * Get all provider sessions
   */
  private getProviderSessions(): Record<string, string> {
    const sessionsJson = localStorage.getItem(STORAGE_KEYS.PROVIDER_SESSIONS);
    return sessionsJson ? JSON.parse(sessionsJson) : {};
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    const expiresAt = Date.now() + response.expiresIn * 1000;

    // Store tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

    // Update auth state
    this.authStateSignal.set({
      isAuthenticated: true,
      user: response.user,
      token: response.token,
      refreshToken: response.refreshToken,
      expiresAt,
    });

    // Navigate to redirect URL or home
    const redirectUrl = this.getAndClearRedirectUrl();
    this.router.navigate([redirectUrl || '/']);
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: any): Observable<never> {
    console.error('Authentication error:', error);
    return throwError(() => error);
  }

  /**
   * Clear all auth state
   */
  private clearAuthState(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);

    this.authStateSignal.set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
    });
  }

  /**
   * Get stored user from localStorage
   */
  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Get token expiration time
   */
  private getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  /**
   * Load provider connections from storage
   */
  private loadProviderConnections(): void {
    const sessions = this.getProviderSessions();
    const connections: ProviderConnection[] = [
      {
        provider: 'spotify',
        connected: !!sessions['spotify'],
        sessionId: sessions['spotify'],
      },
      {
        provider: 'youtube',
        connected: !!sessions['youtube'],
        sessionId: sessions['youtube'],
      },
    ];
    this.providerConnectionsSubject.next(connections);
  }

  /**
   * Update a provider connection status
   */
  private updateProviderConnection(
    provider: Provider,
    connected: boolean,
    sessionId?: string
  ): void {
    const connections = this.providerConnectionsSubject.getValue();
    const index = connections.findIndex((c) => c.provider === provider);

    if (index >= 0) {
      connections[index] = { ...connections[index], connected, sessionId };
    } else {
      connections.push({ provider, connected, sessionId });
    }

    this.providerConnectionsSubject.next([...connections]);
  }

  /**
   * Generate random string for OAuth state
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  }
}

```


## Assistant

Now let's create the environment files, main.ts, and some feature components:

**Tool Call: Read file `frontend/src/environments`**
Status: Failed

Could not open path: frontend/src/environments

**Tool Call: Create directory `Audiora/frontend/src/environments`**
Status: Completed

Created directory Audiora/frontend/src/environments

**Tool Call: frontend/src/environments/environment.ts**
Status: Failed

Can't create file: file already exists

**Tool Call: frontend/src/main.ts**
Status: Completed

Diff: Audiora/frontend/src/main.ts
```
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error("Failed to bootstrap application:", err),
);

```


**Tool Call: frontend/src/environments/environment.prod.ts**
Status: Failed

Can't create file: file already exists

**Tool Call: Read file `frontend/src/environments/environment.ts`**
Status: Completed

```json
{"Text":"export const environment = {\n  production: false,\n  apiUrl: 'http://localhost:8080/api'\n};\n"}
```

**Tool Call: frontend/src/environments/environment.ts**
Status: Completed

Diff: Audiora/frontend/src/environments/environment.ts
```
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",
  spotifyClientId: "",
  youtubeClientId: "",
  appName: "Audiora",
  appVersion: "1.0.0",
};

```


**Tool Call: frontend/src/environments/environment.prod.ts**
Status: Completed

Diff: Audiora/frontend/src/environments/environment.prod.ts
```
export const environment = {
  production: true,
  apiUrl: "/api",
};

```


## Assistant

Now let's create the feature components. First, let me create the directory structure and the main feature components:

**Tool Call: Create directory `Audiora/frontend/src/app/features/playlist`**
Status: Completed

Created directory Audiora/frontend/src/app/features/playlist

**Tool Call: Create directory `Audiora/frontend/src/app/features/auth/oauth-callback`**
Status: Completed

Created directory Audiora/frontend/src/app/features/auth/oauth-callback

**Tool Call: Create directory `Audiora/frontend/src/app/features/auth/register`**
Status: Completed

Created directory Audiora/frontend/src/app/features/auth/register

**Tool Call: Create directory `Audiora/frontend/src/app/features/liked`**
Status: Completed

Created directory Audiora/frontend/src/app/features/liked

**Tool Call: Create directory `Audiora/frontend/src/app/features/auth/reset-password`**
Status: Completed

Created directory Audiora/frontend/src/app/features/auth/reset-password

**Tool Call: Create directory `Audiora/frontend/src/app/features/auth/login`**
Status: Completed

Created directory Audiora/frontend/src/app/features/auth/login

**Tool Call: Create directory `Audiora/frontend/src/app/features/library`**
Status: Completed

Created directory Audiora/frontend/src/app/features/library

**Tool Call: Create directory `Audiora/frontend/src/app/features/settings`**
Status: Completed

Created directory Audiora/frontend/src/app/features/settings

**Tool Call: Create directory `Audiora/frontend/src/app/features/auth/forgot-password`**
Status: Completed

Created directory Audiora/frontend/src/app/features/auth/forgot-password

**Tool Call: Create directory `Audiora/frontend/src/app/features/home`**
Status: Completed

Created directory Audiora/frontend/src/app/features/home

**Tool Call: Create directory `Audiora/frontend/src/app/features/profile`**
Status: Completed

Created directory Audiora/frontend/src/app/features/profile

**Tool Call: Create directory `Audiora/frontend/src/app/features/search`**
Status: Completed

Created directory Audiora/frontend/src/app/features/search

**Tool Call: Create directory `Audiora/frontend/src/app/features/auth/verify`**
Status: Completed

Created directory Audiora/frontend/src/app/features/auth/verify

**Tool Call: frontend/src/app/features/home/home.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/home/home.component.ts
```
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface FeaturedPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
}

interface RecentTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  provider: 'spotify' | 'youtube';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="text-gradient">Good {{ greeting }}</span>
          </h1>
          <p class="hero-subtitle" *ngIf="userName">
            Welcome back, {{ userName }}
          </p>
          <p class="hero-subtitle" *ngIf="!userName">
            Your unified music experience awaits
          </p>
        </div>
      </section>

      <!-- Quick Play Section -->
      <section class="quick-play-section" *ngIf="recentTracks.length > 0">
        <div class="section-header">
          <h2>Jump Back In</h2>
        </div>
        <div class="quick-play-grid">
          <div
            class="quick-play-card glass-card"
            *ngFor="let track of recentTracks.slice(0, 6)"
            (click)="playTrack(track)"
          >
            <div class="quick-play-image">
              <img [src]="track.albumArt" [alt]="track.title" />
              <div class="play-overlay">
                <button class="play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
              </div>
              <span class="provider-badge" [class]="track.provider">
                {{ track.provider === 'spotify' ? 'S' : 'Y' }}
              </span>
            </div>
            <div class="quick-play-info">
              <span class="track-name truncate">{{ track.title }}</span>
              <span class="track-artist truncate">{{ track.artist }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Connect Services Section (shown when not connected) -->
      <section class="connect-section" *ngIf="!hasConnectedServices">
        <div class="section-header">
          <h2>Connect Your Music</h2>
          <p class="section-description">
            Link your streaming services to unlock the full Audiora experience
          </p>
        </div>
        <div class="connect-grid">
          <div class="connect-card glass-card spotify" (click)="connectSpotify()">
            <div class="connect-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <h3>Connect Spotify</h3>
            <p>Access millions of songs from your Spotify library</p>
            <button class="btn btn-spotify">
              <span>Connect</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <div class="connect-card glass-card youtube" (click)="connectYouTube()">
            <div class="connect-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h3>Connect YouTube</h3>
            <p>Stream videos and music from YouTube</p>
            <button class="btn btn-youtube">
              <span>Connect</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Featured Playlists -->
      <section class="featured-section" *ngIf="featuredPlaylists.length > 0">
        <div class="section-header">
          <h2>Made For You</h2>
          <button class="see-all-btn" (click)="viewAllPlaylists()">See all</button>
        </div>
        <div class="featured-grid">
          <div
            class="featured-card glass-card"
            *ngFor="let playlist of featuredPlaylists"
            (click)="openPlaylist(playlist)"
          >
            <div class="featured-image">
              <img [src]="playlist.imageUrl" [alt]="playlist.name" />
              <button class="play-btn-lg" (click)="playPlaylist(playlist); $event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
            <div class="featured-info">
              <h3 class="truncate">{{ playlist.name }}</h3>
              <p class="line-clamp-2">{{ playlist.description }}</p>
              <span class="track-count">{{ playlist.trackCount }} tracks</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Discover Section -->
      <section class="discover-section">
        <div class="section-header">
          <h2>Discover</h2>
        </div>
        <div class="discover-grid">
          <div class="discover-card glass-card" (click)="navigateTo('/search')">
            <div class="discover-icon search-gradient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>Search</h3>
            <p>Find your favorite songs across all platforms</p>
          </div>

          <div class="discover-card glass-card" (click)="navigateTo('/liked')">
            <div class="discover-icon liked-gradient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>Liked Songs</h3>
            <p>All your favorites in one place</p>
          </div>

          <div class="discover-card glass-card" (click)="navigateTo('/library')">
            <div class="discover-icon library-gradient">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h3>Your Library</h3>
            <p>Browse your playlists and albums</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding-bottom: var(--space-12);
      animation: fade-in var(--transition-slow) ease;
    }

    /* Hero Section */
    .hero-section {
      padding: var(--space-8) 0 var(--space-12);
    }

    .hero-content {
      max-width: 600px;
    }

    .hero-title {
      font-size: var(--text-5xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
    }

    .hero-subtitle {
      font-size: var(--text-xl);
      color: var(--text-secondary);
    }

    /* Section Styles */
    section {
      margin-bottom: var(--space-12);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6);
    }

    .section-header h2 {
      font-size: var(--text-2xl);
      font-weight: 700;
    }

    .section-description {
      color: var(--text-tertiary);
      margin-top: var(--space-1);
    }

    .see-all-btn {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color var(--transition-fast);
    }

    .see-all-btn:hover {
      color: var(--text-primary);
    }

    /* Quick Play Grid */
    .quick-play-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .quick-play-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2);
      cursor: pointer;
      border-radius: var(--radius-lg);
    }

    .quick-play-card:hover {
      background: var(--surface-glass-hover);
    }

    .quick-play-image {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: var(--radius-md);
      overflow: hidden;
      flex-shrink: 0;
    }

    .quick-play-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .quick-play-card:hover .play-overlay {
      opacity: 1;
    }

    .play-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--aurora-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: transform var(--transition-fast);
    }

    .play-btn:hover {
      transform: scale(1.1);
    }

    .play-btn svg {
      width: 14px;
      height: 14px;
      color: white;
      margin-left: 2px;
    }

    .provider-badge {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .provider-badge.spotify {
      background: var(--spotify-green);
    }

    .provider-badge.youtube {
      background: var(--youtube-red);
    }

    .quick-play-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .track-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .track-artist {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Connect Section */
    .connect-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }

    .connect-card {
      padding: var(--space-8);
      text-align: center;
      cursor: pointer;
    }

    .connect-icon {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-5);
    }

    .connect-icon svg {
      width: 36px;
      height: 36px;
    }

    .connect-card.spotify .connect-icon {
      background: rgba(29, 185, 84, 0.15);
      color: var(--spotify-green);
    }

    .connect-card.youtube .connect-icon {
      background: rgba(255, 0, 0, 0.15);
      color: var(--youtube-red);
    }

    .connect-card h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-2);
    }

    .connect-card p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      margin-bottom: var(--space-5);
    }

    .connect-card .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-full);
      font-weight: 600;
      transition: all var(--transition-base);
    }

    .connect-card .btn svg {
      width: 16px;
      height: 16px;
    }

    .btn-spotify {
      background: var(--spotify-green);
      color: white;
    }

    .btn-spotify:hover {
      background: var(--spotify-green-dark);
      transform: translateY(-2px);
    }

    .btn-youtube {
      background: var(--youtube-red);
      color: white;
    }

    .btn-youtube:hover {
      background: var(--youtube-red-dark);
      transform: translateY(-2px);
    }

    /* Featured Section */
    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-6);
    }

    .featured-card {
      padding: var(--space-4);
      cursor: pointer;
    }

    .featured-image {
      position: relative;
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: var(--space-4);
    }

    .featured-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .featured-card:hover .featured-image img {
      transform: scale(1.05);
    }

    .play-btn-lg {
      position: absolute;
      bottom: var(--space-3);
      right: var(--space-3);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--aurora-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      opacity: 0;
      transform: translateY(10px);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .featured-card:hover .play-btn-lg {
      opacity: 1;
      transform: translateY(0);
    }

    .play-btn-lg:hover {
      transform: scale(1.1) !important;
      background: var(--aurora-purple-light);
    }

    .play-btn-lg svg {
      width: 20px;
      height: 20px;
      color: white;
      margin-left: 3px;
    }

    .featured-info h3 {
      font-size: var(--text-base);
      font-weight: 600;
      margin-bottom: var(--space-1);
    }

    .featured-info p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      margin-bottom: var(--space-2);
    }

    .track-count {
      font-size: var(--text-xs);
      color: var(--text-muted);
    }

    /* Discover Section */
    .discover-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }

    .discover-card {
      padding: var(--space-6);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .discover-card:hover {
      transform: translateY(-4px);
    }

    .discover-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .discover-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .search-gradient {
      background: linear-gradient(135deg, var(--aurora-purple), var(--aurora-blue));
    }

    .liked-gradient {
      background: linear-gradient(135deg, var(--aurora-pink), var(--aurora-purple));
    }

    .library-gradient {
      background: linear-gradient(135deg, var(--aurora-teal), var(--aurora-blue));
    }

    .discover-card h3 {
      font-size: var(--text-lg);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .discover-card p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Responsive */
    @media (max-width: 767px) {
      .hero-title {
        font-size: var(--text-3xl);
      }

      .hero-subtitle {
        font-size: var(--text-base);
      }

      .quick-play-grid {
        grid-template-columns: 1fr;
      }

      .connect-grid {
        grid-template-columns: 1fr;
      }

      .featured-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
      }

      .discover-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  greeting = 'evening';
  userName = '';
  hasConnectedServices = false;

  recentTracks: RecentTrack[] = [];
  featuredPlaylists: FeaturedPlaylist[] = [];

  ngOnInit(): void {
    this.setGreeting();
    this.loadUserData();
    this.loadRecentTracks();
    this.loadFeaturedPlaylists();
    this.checkConnectedServices();
  }

  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'morning';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'afternoon';
    } else {
      this.greeting = 'evening';
    }
  }

  private loadUserData(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.displayName || user.username;
    }
  }

  private loadRecentTracks(): void {
    // TODO: Load from API or localStorage
    // Mock data for now
    this.recentTracks = [];
  }

  private loadFeaturedPlaylists(): void {
    // TODO: Load from API
    this.featuredPlaylists = [];
  }

  private checkConnectedServices(): void {
    this.authService.providerConnections$.subscribe(connections => {
      this.hasConnectedServices = connections.some(c => c.connected);
    });
  }

  playTrack(track: RecentTrack): void {
    console.log('Playing track:', track);
    // TODO: Implement play functionality
  }

  connectSpotify(): void {
    this.authService.initiateOAuth('spotify');
  }

  connectYouTube(): void {
    this.authService.initiateOAuth('youtube');
  }

  openPlaylist(playlist: FeaturedPlaylist): void {
    this.router.navigate(['/playlist', playlist.id]);
  }

  playPlaylist(playlist: FeaturedPlaylist): void {
    console.log('Playing playlist:', playlist);
    // TODO: Implement playlist play
  }

  viewAllPlaylists(): void {
    this.router.navigate(['/library']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}

```


**Tool Call: frontend/src/app/features/auth/register/register.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/auth/register/register.component.ts
```
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card">
        <!-- Logo -->
        <div class="auth-header">
          <div class="logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
              <defs>
                <linearGradient id="register-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#a855f7"/>
                  <stop offset="50%" style="stop-color:#3b82f6"/>
                  <stop offset="100%" style="stop-color:#14b8a6"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#register-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
              <circle cx="50" cy="50" r="35" stroke="url(#register-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
              <circle cx="50" cy="50" r="25" stroke="url(#register-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
              <path d="M42 35 L42 65 L68 50 Z" fill="url(#register-logo-gradient)"/>
            </svg>
          </div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join Audiora and start your music journey</p>
        </div>

        <!-- Register Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Display Name -->
          <div class="form-group">
            <label for="displayName" class="label">Display Name</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                id="displayName"
                formControlName="displayName"
                class="input-field"
                placeholder="How should we call you?"
                autocomplete="name"
              />
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('displayName')?.touched && registerForm.get('displayName')?.errors?.['required']">
              Display name is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('displayName')?.touched && registerForm.get('displayName')?.errors?.['minlength']">
              Display name must be at least 2 characters
            </span>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label for="username" class="label">Username</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <input
                type="text"
                id="username"
                formControlName="username"
                class="input-field"
                placeholder="Choose a unique username"
                autocomplete="username"
              />
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['required']">
              Username is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['minlength']">
              Username must be at least 3 characters
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.errors?.['pattern']">
              Username can only contain letters, numbers, and underscores
            </span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="label">Email</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="input-field"
                placeholder="you@example.com"
                autocomplete="email"
              />
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']">
              Email is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']">
              Please enter a valid email
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="label">Password</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="input-field has-icon-right"
                placeholder="Create a strong password"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="input-icon-right"
                (click)="togglePasswordVisibility()"
                tabindex="-1"
              >
                <svg *ngIf="!showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']">
              Password is required
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']">
              Password must be at least 8 characters
            </span>

            <!-- Password Strength Indicator -->
            <div class="password-strength" *ngIf="registerForm.get('password')?.value">
              <div class="strength-bars">
                <div class="strength-bar" [class.active]="passwordStrength() >= 1" [class.weak]="passwordStrength() === 1" [class.medium]="passwordStrength() === 2" [class.strong]="passwordStrength() >= 3"></div>
                <div class="strength-bar" [class.active]="passwordStrength() >= 2" [class.medium]="passwordStrength() === 2" [class.strong]="passwordStrength() >= 3"></div>
                <div class="strength-bar" [class.active]="passwordStrength() >= 3" [class.strong]="passwordStrength() >= 3"></div>
                <div class="strength-bar" [class.active]="passwordStrength() >= 4" [class.strong]="passwordStrength() >= 4"></div>
              </div>
              <span class="strength-text">{{ passwordStrengthText() }}</span>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword" class="label">Confirm Password</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <path d="M12 16v1"/>
              </svg>
              <input
                [type]="showConfirmPassword() ? 'text' : 'password'"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="input-field has-icon-right"
                placeholder="Confirm your password"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="input-icon-right"
                (click)="toggleConfirmPasswordVisibility()"
                tabindex="-1"
              >
                <svg *ngIf="!showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span class="helper-text error" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.get('confirmPassword')?.errors?.['required']">
              Please confirm your password
            </span>
            <span class="helper-text error" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']">
              Passwords do not match
            </span>
          </div>

          <!-- Terms Agreement -->
          <div class="form-group">
            <label class="checkbox">
              <input type="checkbox" formControlName="agreeToTerms" />
              <span class="checkbox-label">
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
              </span>
            </label>
            <span class="helper-text error" *ngIf="registerForm.get('agreeToTerms')?.touched && registerForm.get('agreeToTerms')?.errors?.['requiredTrue']">
              You must agree to the terms to continue
            </span>
          </div>

          <!-- Error Message -->
          <div class="error-alert" *ngIf="errorMessage()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            [disabled]="registerForm.invalid || isLoading()"
          >
            <span *ngIf="!isLoading()">Create Account</span>
            <span *ngIf="isLoading()" class="loading-spinner">
              <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <!-- OAuth Buttons -->
        <div class="oauth-buttons">
          <button type="button" class="btn btn-secondary oauth-btn" (click)="loginWithSpotify()">
            <svg viewBox="0 0 24 24" fill="currentColor" class="oauth-icon spotify">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </button>
          <button type="button" class="btn btn-secondary oauth-btn" (click)="loginWithGoogle()">
            <svg viewBox="0 0 24 24" class="oauth-icon google">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        <!-- Login Link -->
        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: var(--space-8);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .logo-icon {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .auth-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
      background: var(--gradient-aurora);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-subtitle {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--space-3);
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .input-icon-right {
      position: absolute;
      right: var(--space-3);
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .input-icon-right:hover {
      color: var(--text-secondary);
    }

    .input-icon-right svg {
      width: 20px;
      height: 20px;
    }

    .input-field {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      padding-left: calc(var(--space-3) + 28px);
      background: var(--color-bg-secondary);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      font-size: var(--text-base);
      color: var(--text-primary);
      transition: all var(--transition-base);
    }

    .input-field.has-icon-right {
      padding-right: calc(var(--space-3) + 28px);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    .helper-text {
      font-size: var(--text-xs);
      margin-top: var(--space-1);
      color: var(--text-muted);
    }

    .helper-text.error {
      color: var(--color-error);
    }

    .checkbox {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      cursor: pointer;
    }

    .checkbox input {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: var(--aurora-purple);
      cursor: pointer;
      flex-shrink: 0;
    }

    .checkbox-label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .checkbox-label a {
      color: var(--aurora-purple-light);
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    .strength-bars {
      display: flex;
      gap: var(--space-1);
      flex: 1;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      background: var(--surface-glass-hover);
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
    }

    .strength-bar.active.weak {
      background: var(--color-error);
    }

    .strength-bar.active.medium {
      background: var(--color-warning);
    }

    .strength-bar.active.strong {
      background: var(--color-success);
    }

    .strength-text {
      font-size: var(--text-xs);
      color: var(--text-muted);
      min-width: 60px;
      text-align: right;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-lg);
      color: var(--color-error);
      font-size: var(--text-sm);
    }

    .error-alert svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .loading-spinner svg {
      width: 20px;
      height: 20px;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin: var(--space-6) 0;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--surface-border);
    }

    .auth-divider span {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    .oauth-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .oauth-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
    }

    .oauth-icon {
      width: 20px;
      height: 20px;
    }

    .oauth-icon.spotify {
      color: #1db954;
    }

    .auth-footer {
      text-align: center;
      margin-top: var(--space-6);
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .auth-footer a {
      color: var(--aurora-purple-light);
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: var(--space-6);
      }

      .oauth-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  // Signals for component state
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordStrength = signal(0);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        displayName: ['', [Validators.required, Validators.minLength(2)]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z0-9_]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    // Watch password changes for strength calculation
    this.registerForm.get('password')?.valueChanges.subscribe((password) => {
      this.calculatePasswordStrength(password);
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength.set(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Character variety checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    this.passwordStrength.set(Math.min(strength, 4));
  }

  passwordStrengthText(): string {
    const strength = this.passwordStrength();
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { displayName, username, email, password } = this.registerForm.value;

    this.authService
      .register({
        displayName,
        username,
        email,
        password,
      })
      .subscribe({
        next: () => {
          // AuthService handles redirect
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.message || 'Registration failed. Please try again.'
          );
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  loginWithSpotify(): void {
    this.authService.initiateOAuth('spotify');
  }

  loginWithGoogle(): void {
    // Google OAuth through YouTube
    this.authService.initiateOAuth('youtube');
  }
}

```


**Tool Call: frontend/src/app/features/auth/login/login.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/auth/login/login.component.ts
```
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <!-- Aurora background -->
      <div class="aurora-bg">
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
        <div class="aurora-blob aurora-blob-3"></div>
      </div>

      <!-- Login card -->
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="login-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#login-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#login-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#login-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#login-logo-gradient)"/>
          </svg>
          <span class="logo-text">Audiora</span>
        </div>

        <!-- Header -->
        <div class="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your music</p>
        </div>

        <!-- Error message -->
        <div class="error-banner" *ngIf="error()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error() }}</span>
        </div>

        <!-- Login form -->
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="label">Email</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                id="email"
                class="input-field"
                placeholder="Enter your email"
                [(ngModel)]="email"
                name="email"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password" class="label">Password</label>
              <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
            </div>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                class="input-field has-icon-right"
                placeholder="Enter your password"
                [(ngModel)]="password"
                name="password"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="input-icon-right"
                (click)="togglePasswordVisibility()"
                tabindex="-1"
              >
                <svg *ngIf="!showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span class="checkbox-label">Remember me</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Sign In</span>
            <span *ngIf="isLoading()" class="loading-spinner">
              <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <!-- OAuth buttons -->
        <div class="oauth-buttons">
          <button type="button" class="oauth-btn spotify" (click)="loginWithSpotify()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </button>
          <button type="button" class="oauth-btn youtube" (click)="loginWithYouTube()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </button>
          <button type="button" class="oauth-btn google" (click)="loginWithGoogle()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p>
            Don't have an account?
            <a routerLink="/register" class="link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      position: relative;
      overflow: hidden;
    }

    /* Aurora background */
    .aurora-bg {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
    }

    .aurora-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
      animation: aurora-float 20s ease-in-out infinite;
    }

    .aurora-blob-1 {
      width: 600px;
      height: 600px;
      background: var(--aurora-purple);
      top: -20%;
      left: -10%;
      animation-delay: 0s;
    }

    .aurora-blob-2 {
      width: 500px;
      height: 500px;
      background: var(--aurora-teal);
      bottom: -20%;
      right: -10%;
      animation-delay: -7s;
    }

    .aurora-blob-3 {
      width: 400px;
      height: 400px;
      background: var(--aurora-pink);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -14s;
    }

    @keyframes aurora-float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(50px, -30px) scale(1.1);
      }
      50% {
        transform: translate(-30px, 50px) scale(0.95);
      }
      75% {
        transform: translate(-50px, -20px) scale(1.05);
      }
    }

    /* Auth card */
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
      background: rgba(18, 18, 26, 0.8);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid var(--surface-border);
      box-shadow: var(--shadow-xl);
    }

    /* Logo */
    .auth-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }

    .auth-logo svg {
      width: 48px;
      height: 48px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .logo-text {
      font-family: var(--font-family-display);
      font-size: var(--text-2xl);
      font-weight: 700;
      background: var(--gradient-aurora);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Header */
    .auth-header {
      text-align: center;
      margin-bottom: var(--space-6);
    }

    .auth-header h1 {
      font-size: var(--text-2xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .auth-header p {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    /* Error banner */
    .error-banner {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-5);
      color: var(--color-error-light);
      font-size: var(--text-sm);
    }

    .error-banner svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

    .label-row .label {
      margin-bottom: 0;
    }

    .forgot-link {
      font-size: var(--text-xs);
      color: var(--aurora-purple-light);
      transition: color var(--transition-fast);
    }

    .forgot-link:hover {
      color: var(--aurora-purple);
    }

    /* Input group */
    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--space-4);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      pointer-events: none;
      z-index: 1;
    }

    .input-icon-right {
      position: absolute;
      right: var(--space-3);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .input-icon-right:hover {
      color: var(--text-secondary);
      background: var(--surface-glass);
    }

    .input-icon-right svg {
      width: 18px;
      height: 18px;
    }

    .input-field {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      padding-left: calc(var(--space-4) + 26px);
      font-size: var(--text-base);
      color: var(--text-primary);
      background: var(--color-bg-secondary);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .input-field.has-icon-right {
      padding-right: calc(var(--space-4) + 32px);
    }

    .input-field:hover {
      border-color: var(--surface-border-hover);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    /* Checkbox */
    .checkbox-group {
      flex-direction: row;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
    }

    .checkbox input {
      width: 18px;
      height: 18px;
      accent-color: var(--aurora-purple);
      cursor: pointer;
    }

    .checkbox-label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }

    /* Submit button */
    .btn-lg {
      padding: var(--space-4) var(--space-6);
      font-size: var(--text-base);
      font-weight: 600;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .loading-spinner svg {
      width: 20px;
      height: 20px;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Divider */
    .auth-divider {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin: var(--space-6) 0;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--surface-border);
    }

    .auth-divider span {
      font-size: var(--text-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }

    /* OAuth buttons */
    .oauth-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-3);
    }

    .oauth-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-size: var(--text-xs);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .oauth-btn:hover {
      background: var(--surface-glass-hover);
      border-color: var(--surface-border-hover);
      transform: translateY(-2px);
    }

    .oauth-btn svg {
      width: 24px;
      height: 24px;
    }

    .oauth-btn.spotify:hover {
      border-color: var(--spotify-green);
      color: var(--spotify-green);
    }

    .oauth-btn.youtube:hover {
      border-color: var(--youtube-red);
      color: var(--youtube-red);
    }

    .oauth-btn.google:hover {
      border-color: var(--google-blue);
    }

    /* Footer */
    .auth-footer {
      text-align: center;
      margin-top: var(--space-6);
      padding-top: var(--space-6);
      border-top: 1px solid var(--surface-border);
    }

    .auth-footer p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .link {
      color: var(--aurora-purple-light);
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .link:hover {
      color: var(--aurora-purple);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .auth-card {
        padding: var(--space-6);
      }

      .oauth-buttons {
        grid-template-columns: 1fr;
      }

      .oauth-btn {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class LoginComponent {
  // Form fields
  email = '';
  password = '';
  rememberMe = false;

  // UI state
  isLoading = signal(false);
  showPassword = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Please enter your email and password');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Navigation handled by AuthService
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to sign in. Please check your credentials.');
      }
    });
  }

  loginWithSpotify(): void {
    this.authService.initiateOAuth('spotify');
  }

  loginWithYouTube(): void {
    this.authService.initiateOAuth('youtube');
  }

  loginWithGoogle(): void {
    // Google OAuth flow
    window.location.href = '/api/auth/oauth/google';
  }
}

```


## Assistant

Now let's create the remaining feature components that are required by routes:

**Tool Call: frontend/src/app/features/library/library.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/library/library.component.ts
```
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  provider: 'spotify' | 'youtube' | 'local';
  isOwned: boolean;
}

interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  trackCount: number;
  provider: 'spotify' | 'youtube';
}

type LibraryView = 'playlists' | 'albums' | 'artists';
type SortOption = 'recent' | 'alphabetical' | 'creator';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="library-container">
      <!-- Header -->
      <header class="library-header">
        <h1>Your Library</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="createPlaylist()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>Create Playlist</span>
          </button>
        </div>
      </header>

      <!-- Filters -->
      <div class="library-filters">
        <div class="view-tabs">
          <button
            class="tab-btn"
            [class.active]="currentView() === 'playlists'"
            (click)="setView('playlists')"
          >
            Playlists
          </button>
          <button
            class="tab-btn"
            [class.active]="currentView() === 'albums'"
            (click)="setView('albums')"
          >
            Albums
          </button>
          <button
            class="tab-btn"
            [class.active]="currentView() === 'artists'"
            (click)="setView('artists')"
          >
            Artists
          </button>
        </div>

        <div class="filter-actions">
          <!-- Provider filter -->
          <div class="filter-dropdown">
            <button class="filter-btn" (click)="toggleProviderFilter()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <span>{{ selectedProvider() || 'All' }}</span>
            </button>
          </div>

          <!-- Sort -->
          <div class="sort-dropdown">
            <button class="filter-btn" (click)="toggleSortMenu()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="16" y2="12"/>
                <line x1="4" y1="18" x2="12" y2="18"/>
              </svg>
              <span>{{ sortLabel() }}</span>
            </button>
          </div>

          <!-- Grid/List toggle -->
          <button class="view-toggle" (click)="toggleGridView()">
            <svg *ngIf="isGridView()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <svg *ngIf="!isGridView()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="library-content">
        <!-- Loading state -->
        <div class="loading-grid" *ngIf="isLoading()">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5,6,7,8]">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-subtitle"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="!isLoading() && items().length === 0">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <h2>Your library is empty</h2>
          <p>Start building your collection by adding playlists and albums</p>
          <button class="btn btn-primary" (click)="navigateToSearch()">
            Discover Music
          </button>
        </div>

        <!-- Playlists Grid -->
        <div
          class="items-grid"
          [class.list-view]="!isGridView()"
          *ngIf="!isLoading() && currentView() === 'playlists' && playlists().length > 0"
        >
          <div
            class="library-card glass-card"
            *ngFor="let playlist of playlists()"
            (click)="openPlaylist(playlist)"
          >
            <div class="card-image">
              <img [src]="playlist.imageUrl || 'assets/images/default-playlist.png'" [alt]="playlist.name" />
              <button class="play-btn" (click)="playPlaylist(playlist); $event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
              <span class="provider-badge" [class]="playlist.provider">
                <ng-container *ngIf="playlist.provider === 'spotify'">S</ng-container>
                <ng-container *ngIf="playlist.provider === 'youtube'">Y</ng-container>
                <ng-container *ngIf="playlist.provider === 'local'">A</ng-container>
              </span>
            </div>
            <div class="card-info">
              <h3 class="truncate">{{ playlist.name }}</h3>
              <p class="truncate">{{ playlist.trackCount }} tracks</p>
            </div>
          </div>
        </div>

        <!-- Albums Grid -->
        <div
          class="items-grid"
          [class.list-view]="!isGridView()"
          *ngIf="!isLoading() && currentView() === 'albums' && albums().length > 0"
        >
          <div
            class="library-card glass-card"
            *ngFor="let album of albums()"
            (click)="openAlbum(album)"
          >
            <div class="card-image">
              <img [src]="album.imageUrl" [alt]="album.name" />
              <button class="play-btn" (click)="playAlbum(album); $event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
              <span class="provider-badge" [class]="album.provider">
                <ng-container *ngIf="album.provider === 'spotify'">S</ng-container>
                <ng-container *ngIf="album.provider === 'youtube'">Y</ng-container>
              </span>
            </div>
            <div class="card-info">
              <h3 class="truncate">{{ album.name }}</h3>
              <p class="truncate">{{ album.artist }}</p>
            </div>
          </div>
        </div>

        <!-- Artists (coming soon) -->
        <div class="coming-soon" *ngIf="currentView() === 'artists'">
          <div class="coming-soon-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2>Artists view coming soon</h2>
          <p>We're working on bringing you a beautiful artist library view</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .library-container {
      padding-bottom: var(--space-12);
      animation: fade-in var(--transition-slow) ease;
    }

    /* Header */
    .library-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6);
    }

    .library-header h1 {
      font-size: var(--text-3xl);
      font-weight: 700;
    }

    .header-actions .btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .header-actions .btn svg {
      width: 18px;
      height: 18px;
    }

    /* Filters */
    .library-filters {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6);
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .view-tabs {
      display: flex;
      gap: var(--space-2);
    }

    .tab-btn {
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab-btn:hover {
      background: var(--surface-glass);
      color: var(--text-primary);
    }

    .tab-btn.active {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-sm);
      color: var(--text-secondary);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .filter-btn:hover {
      background: var(--surface-glass-hover);
      border-color: var(--surface-border-hover);
    }

    .filter-btn svg {
      width: 16px;
      height: 16px;
    }

    .view-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: var(--text-secondary);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .view-toggle:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .view-toggle svg {
      width: 18px;
      height: 18px;
    }

    /* Content */
    .library-content {
      min-height: 400px;
    }

    /* Grid */
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-5);
    }

    .items-grid.list-view {
      grid-template-columns: 1fr;
      gap: var(--space-2);
    }

    /* Card */
    .library-card {
      padding: var(--space-4);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .library-card:hover {
      transform: translateY(-4px);
    }

    .list-view .library-card {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-3);
    }

    .list-view .library-card:hover {
      transform: none;
      background: var(--surface-glass-hover);
    }

    .card-image {
      position: relative;
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: var(--space-3);
      background: var(--surface-glass);
    }

    .list-view .card-image {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      margin-bottom: 0;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .library-card:hover .card-image img {
      transform: scale(1.05);
    }

    .play-btn {
      position: absolute;
      bottom: var(--space-2);
      right: var(--space-2);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--aurora-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      opacity: 0;
      transform: translateY(8px);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .library-card:hover .play-btn {
      opacity: 1;
      transform: translateY(0);
    }

    .play-btn:hover {
      transform: scale(1.1) !important;
      background: var(--aurora-purple-light);
    }

    .play-btn svg {
      width: 16px;
      height: 16px;
      color: white;
      margin-left: 2px;
    }

    .provider-badge {
      position: absolute;
      top: var(--space-2);
      left: var(--space-2);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .provider-badge.spotify {
      background: var(--spotify-green);
    }

    .provider-badge.youtube {
      background: var(--youtube-red);
    }

    .provider-badge.local {
      background: var(--gradient-aurora);
    }

    .card-info {
      min-width: 0;
    }

    .card-info h3 {
      font-size: var(--text-base);
      font-weight: 600;
      margin-bottom: var(--space-1);
    }

    .card-info p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Loading */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-5);
    }

    .skeleton-card {
      padding: var(--space-4);
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--surface-glass) 0%,
        var(--surface-glass-hover) 50%,
        var(--surface-glass) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }

    .skeleton-image {
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-3);
    }

    .skeleton-title {
      height: 20px;
      margin-bottom: var(--space-2);
      width: 80%;
    }

    .skeleton-subtitle {
      height: 16px;
      width: 60%;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-16) var(--space-6);
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-xl);
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .empty-icon svg {
      width: 40px;
      height: 40px;
      color: var(--text-muted);
    }

    .empty-state h2 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-2);
    }

    .empty-state p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
      max-width: 300px;
    }

    /* Coming soon */
    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-16) var(--space-6);
    }

    .coming-soon-icon {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-xl);
      background: var(--gradient-aurora);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .coming-soon-icon svg {
      width: 40px;
      height: 40px;
      color: white;
    }

    .coming-soon h2 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-2);
    }

    .coming-soon p {
      color: var(--text-tertiary);
    }

    /* Responsive */
    @media (max-width: 767px) {
      .library-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }

      .library-filters {
        flex-direction: column;
        align-items: stretch;
      }

      .view-tabs {
        overflow-x: auto;
        padding-bottom: var(--space-2);
      }

      .filter-actions {
        justify-content: flex-end;
      }

      .items-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-3);
      }

      .library-card {
        padding: var(--space-3);
      }
    }
  `]
})
export class LibraryComponent implements OnInit {
  // State
  currentView = signal<LibraryView>('playlists');
  sortOption = signal<SortOption>('recent');
  selectedProvider = signal<string | null>(null);
  isGridView = signal(true);
  isLoading = signal(true);

  // Data
  playlists = signal<Playlist[]>([]);
  albums = signal<Album[]>([]);

  items = signal<any[]>([]);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadLibrary();
  }

  private loadLibrary(): void {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data - replace with actual API call
      this.playlists.set([]);
      this.albums.set([]);
      this.updateItems();
      this.isLoading.set(false);
    }, 1000);
  }

  private updateItems(): void {
    const view = this.currentView();
    if (view === 'playlists') {
      this.items.set(this.playlists());
    } else if (view === 'albums') {
      this.items.set(this.albums());
    } else {
      this.items.set([]);
    }
  }

  setView(view: LibraryView): void {
    this.currentView.set(view);
    this.updateItems();
  }

  sortLabel(): string {
    const labels: Record<SortOption, string> = {
      recent: 'Recent',
      alphabetical: 'A-Z',
      creator: 'Creator'
    };
    return labels[this.sortOption()];
  }

  toggleProviderFilter(): void {
    // Toggle between providers
    const current = this.selectedProvider();
    if (!current) {
      this.selectedProvider.set('spotify');
    } else if (current === 'spotify') {
      this.selectedProvider.set('youtube');
    } else {
      this.selectedProvider.set(null);
    }
  }

  toggleSortMenu(): void {
    // Cycle through sort options
    const options: SortOption[] = ['recent', 'alphabetical', 'creator'];
    const currentIndex = options.indexOf(this.sortOption());
    const nextIndex = (currentIndex + 1) % options.length;
    this.sortOption.set(options[nextIndex]);
  }

  toggleGridView(): void {
    this.isGridView.update(v => !v);
  }

  createPlaylist(): void {
    console.log('Create playlist');
    // TODO: Open create playlist modal
  }

  openPlaylist(playlist: Playlist): void {
    this.router.navigate(['/playlist', playlist.id]);
  }

  playPlaylist(playlist: Playlist): void {
    console.log('Play playlist:', playlist.name);
    // TODO: Implement playback
  }

  openAlbum(album: Album): void {
    console.log('Open album:', album.name);
    // TODO: Navigate to album view
  }

  playAlbum(album: Album): void {
    console.log('Play album:', album.name);
    // TODO: Implement playback
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }
}

```


**Tool Call: frontend/src/app/features/liked/liked.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/liked/liked.component.ts
```
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LikedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  provider: 'spotify' | 'youtube';
  likedAt: string;
}

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="liked-container">
      <!-- Header -->
      <header class="liked-header">
        <div class="header-gradient" [style.background]="headerGradient"></div>
        <div class="header-content">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div class="header-info">
            <span class="header-type">Playlist</span>
            <h1 class="header-title">Liked Songs</h1>
            <p class="header-meta">
              <span class="track-count">{{ tracks().length }} songs</span>
              <span class="separator">•</span>
              <span class="total-duration">{{ formatTotalDuration() }}</span>
            </p>
          </div>
        </div>
      </header>

      <!-- Controls -->
      <div class="controls-section">
        <button class="play-all-btn" (click)="playAll()" [disabled]="tracks().length === 0">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
        <button class="shuffle-btn" (click)="shufflePlay()" [disabled]="tracks().length === 0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
        </button>

        <!-- Filter by provider -->
        <div class="filter-group">
          <button
            class="filter-btn"
            [class.active]="providerFilter() === 'all'"
            (click)="setProviderFilter('all')"
          >
            All
          </button>
          <button
            class="filter-btn spotify"
            [class.active]="providerFilter() === 'spotify'"
            (click)="setProviderFilter('spotify')"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="filter-icon">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </button>
          <button
            class="filter-btn youtube"
            [class.active]="providerFilter() === 'youtube'"
            (click)="setProviderFilter('youtube')"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="filter-icon">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </button>
        </div>

        <!-- Search -->
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search in liked songs..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          />
        </div>
      </div>

      <!-- Track List -->
      <div class="track-list" *ngIf="filteredTracks().length > 0">
        <!-- Table Header -->
        <div class="track-list-header">
          <span class="col-num">#</span>
          <span class="col-title">Title</span>
          <span class="col-album">Album</span>
          <span class="col-date">Date Added</span>
          <span class="col-duration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
        </div>

        <!-- Track Items -->
        <div
          class="track-item"
          *ngFor="let track of filteredTracks(); let i = index"
          (click)="playTrack(track)"
          (dblclick)="playTrack(track)"
          [class.playing]="currentTrackId() === track.id"
        >
          <span class="col-num">
            <span class="track-number">{{ i + 1 }}</span>
            <button class="play-btn-small">
              <svg *ngIf="currentTrackId() !== track.id || !isPlaying()" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg *ngIf="currentTrackId() === track.id && isPlaying()" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          </span>

          <div class="col-title">
            <img [src]="track.albumArt" [alt]="track.album" class="track-art" />
            <div class="track-info">
              <span class="track-name truncate" [class.active]="currentTrackId() === track.id">
                {{ track.title }}
              </span>
              <span class="track-artist truncate">{{ track.artist }}</span>
            </div>
            <span class="provider-badge" [class]="track.provider">
              {{ track.provider === 'spotify' ? 'S' : 'Y' }}
            </span>
          </div>

          <span class="col-album truncate">{{ track.album }}</span>

          <span class="col-date">{{ formatDate(track.likedAt) }}</span>

          <div class="col-duration">
            <button class="action-btn unlike-btn" (click)="unlikeTrack(track, $event)">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <span class="duration-text">{{ formatDuration(track.duration) }}</span>
            <button class="action-btn more-btn" (click)="showTrackMenu(track, $event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredTracks().length === 0 && !isLoading()">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h3 *ngIf="tracks().length === 0">Songs you like will appear here</h3>
        <h3 *ngIf="tracks().length > 0 && filteredTracks().length === 0">No songs match your search</h3>
        <p *ngIf="tracks().length === 0">Save songs by tapping the heart icon</p>
        <p *ngIf="tracks().length > 0 && filteredTracks().length === 0">Try a different search term or filter</p>
        <button class="btn btn-primary" (click)="navigateToSearch()" *ngIf="tracks().length === 0">
          Find something to like
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="loading-spinner">
          <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
          </svg>
        </div>
        <p>Loading your liked songs...</p>
      </div>
    </div>
  `,
  styles: [`
    .liked-container {
      padding-bottom: var(--space-12);
      animation: fade-in var(--transition-slow) ease;
    }

    /* Header */
    .liked-header {
      position: relative;
      padding: var(--space-12) var(--space-6);
      margin: calc(var(--space-6) * -1);
      margin-bottom: var(--space-6);
      overflow: hidden;
    }

    .header-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.3), transparent);
      z-index: 0;
    }

    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      gap: var(--space-6);
    }

    .header-icon {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, var(--aurora-purple), var(--aurora-pink));
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-xl);
      flex-shrink: 0;
    }

    .header-icon svg {
      width: 80px;
      height: 80px;
      color: white;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .header-type {
      font-size: var(--text-sm);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
      color: var(--text-secondary);
    }

    .header-title {
      font-size: var(--text-6xl);
      font-weight: 700;
      line-height: 1.1;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    .separator {
      color: var(--text-muted);
    }

    /* Controls Section */
    .controls-section {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6) 0;
      flex-wrap: wrap;
    }

    .play-all-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--aurora-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .play-all-btn:hover:not(:disabled) {
      transform: scale(1.05);
      background: var(--aurora-purple-light);
    }

    .play-all-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .play-all-btn svg {
      width: 24px;
      height: 24px;
      color: white;
      margin-left: 3px;
    }

    .shuffle-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all var(--transition-base);
    }

    .shuffle-btn:hover:not(:disabled) {
      color: var(--text-primary);
    }

    .shuffle-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .shuffle-btn svg {
      width: 22px;
      height: 22px;
    }

    .filter-group {
      display: flex;
      gap: var(--space-2);
      margin-left: var(--space-4);
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-full);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      color: var(--text-secondary);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .filter-btn:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .filter-btn.active {
      background: var(--aurora-purple);
      border-color: var(--aurora-purple);
      color: white;
    }

    .filter-btn.spotify.active {
      background: var(--spotify-green);
      border-color: var(--spotify-green);
    }

    .filter-btn.youtube.active {
      background: var(--youtube-red);
      border-color: var(--youtube-red);
    }

    .filter-icon {
      width: 14px;
      height: 14px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-full);
      margin-left: auto;
      min-width: 200px;
      max-width: 300px;
    }

    .search-box svg {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .search-box input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: var(--text-sm);
    }

    .search-box input::placeholder {
      color: var(--text-muted);
    }

    /* Track List */
    .track-list {
      display: flex;
      flex-direction: column;
    }

    .track-list-header {
      display: grid;
      grid-template-columns: 48px 1fr 200px 150px 120px;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--surface-border);
      color: var(--text-muted);
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }

    .track-list-header .col-duration {
      display: flex;
      justify-content: flex-end;
    }

    .track-list-header .col-duration svg {
      width: 16px;
      height: 16px;
    }

    .track-item {
      display: grid;
      grid-template-columns: 48px 1fr 200px 150px 120px;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      align-items: center;
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .track-item:hover {
      background: var(--surface-glass);
    }

    .track-item.playing {
      background: var(--surface-glass-hover);
    }

    .col-num {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: var(--text-sm);
    }

    .track-number {
      display: block;
    }

    .play-btn-small {
      display: none;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-primary);
    }

    .play-btn-small svg {
      width: 16px;
      height: 16px;
    }

    .track-item:hover .track-number,
    .track-item.playing .track-number {
      display: none;
    }

    .track-item:hover .play-btn-small,
    .track-item.playing .play-btn-small {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .col-title {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      min-width: 0;
    }

    .track-art {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      flex-shrink: 0;
    }

    .track-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .track-name {
      font-size: var(--text-base);
      font-weight: 500;
      color: var(--text-primary);
    }

    .track-name.active {
      color: var(--aurora-purple);
    }

    .track-artist {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .provider-badge {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .provider-badge.spotify {
      background: var(--spotify-green);
    }

    .provider-badge.youtube {
      background: var(--youtube-red);
    }

    .col-album {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    .col-date {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    .col-duration {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-3);
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      opacity: 0;
      transition: all var(--transition-fast);
    }

    .track-item:hover .action-btn {
      opacity: 1;
    }

    .action-btn:hover {
      color: var(--text-primary);
      background: var(--surface-glass);
    }

    .unlike-btn svg {
      width: 16px;
      height: 16px;
      color: var(--aurora-pink);
    }

    .unlike-btn:hover svg {
      color: var(--text-muted);
    }

    .more-btn svg {
      width: 18px;
      height: 18px;
    }

    .duration-text {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
      min-width: 40px;
      text-align: right;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16) var(--space-6);
      text-align: center;
    }

    .empty-icon {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .empty-icon svg {
      width: 48px;
      height: 48px;
      color: var(--text-muted);
    }

    .empty-state h3 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .empty-state p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16);
    }

    .loading-spinner svg {
      width: 48px;
      height: 48px;
      color: var(--aurora-purple);
    }

    .loading-state p {
      margin-top: var(--space-4);
      color: var(--text-tertiary);
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 1023px) {
      .track-list-header,
      .track-item {
        grid-template-columns: 40px 1fr 100px;
      }

      .col-album,
      .col-date {
        display: none;
      }

      .header-icon {
        width: 150px;
        height: 150px;
      }

      .header-icon svg {
        width: 60px;
        height: 60px;
      }

      .header-title {
        font-size: var(--text-4xl);
      }
    }

    @media (max-width: 767px) {
      .liked-header {
        padding: var(--space-6);
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-icon {
        width: 120px;
        height: 120px;
      }

      .header-icon svg {
        width: 48px;
        height: 48px;
      }

      .header-title {
        font-size: var(--text-3xl);
      }

      .controls-section {
        flex-wrap: wrap;
      }

      .filter-group {
        margin-left: 0;
        width: 100%;
        order: 3;
      }

      .search-box {
        margin-left: 0;
        width: 100%;
        max-width: none;
        order: 4;
      }

      .track-list-header {
        display: none;
      }

      .track-item {
        grid-template-columns: 1fr auto;
        gap: var(--space-3);
      }

      .col-num {
        display: none;
      }

      .provider-badge {
        display: none;
      }
    }
  `]
})
export class LikedComponent implements OnInit {
  private router = inject(Router);

  // State signals
  tracks = signal<LikedTrack[]>([]);
  filteredTracks = signal<LikedTrack[]>([]);
  isLoading = signal(true);
  currentTrackId = signal<string | null>(null);
  isPlaying = signal(false);
  providerFilter = signal<'all' | 'spotify' | 'youtube'>('all');
  searchQuery = '';

  headerGradient = 'linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.3), transparent)';

  ngOnInit(): void {
    this.loadLikedTracks();
  }

  private loadLikedTracks(): void {
    // TODO: Load from API
    this.isLoading.set(true);

    // Simulated loading
    setTimeout(() => {
      // For now, return empty array (user can add liked tracks)
      this.tracks.set([]);
      this.filteredTracks.set([]);
      this.isLoading.set(false);
    }, 500);
  }

  setProviderFilter(filter: 'all' | 'spotify' | 'youtube'): void {
    this.providerFilter.set(filter);
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.tracks();

    // Apply provider filter
    const provider = this.providerFilter();
    if (provider !== 'all') {
      filtered = filtered.filter(t => t.provider === provider);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        t.album.toLowerCase().includes(query)
      );
    }

    this.filteredTracks.set(filtered);
  }

  playAll(): void {
    const tracks = this.filteredTracks();
    if (tracks.length > 0) {
      this.playTrack(tracks[0]);
      console.log('Playing all tracks');
    }
  }

  shufflePlay(): void {
    const tracks = [...this.filteredTracks()];
    if (tracks.length > 0) {
      // Shuffle array
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      }
      this.playTrack(tracks[0]);
      console.log('Shuffle playing');
    }
  }

  playTrack(track: LikedTrack): void {
    this.currentTrackId.set(track.id);
    this.isPlaying.set(true);
    console.log('Playing track:', track.title);
    // TODO: Integrate with player service
  }

  unlikeTrack(track: LikedTrack, event: Event): void {
    event.stopPropagation();
    console.log('Unliking track:', track.title);
    // TODO: Call API to unlike
    const updated = this.tracks().filter(t => t.id !== track.id);
    this.tracks.set(updated);
    this.applyFilters();
  }

  showTrackMenu(track: LikedTrack, event: Event): void {
    event.stopPropagation();
    console.log('Show menu for:', track.title);
    // TODO: Implement context menu
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatTotalDuration(): string {
    const totalMs = this.tracks().reduce((acc, t) => acc + t.duration, 0);
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

```


**Tool Call: frontend/src/app/features/search/search.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/search/search.component.ts
```
import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: 'track' | 'artist' | 'album' | 'playlist';
  provider: 'spotify' | 'youtube';
  duration?: number;
}

interface SearchCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-page">
      <!-- Search Header -->
      <div class="search-header">
        <div class="search-input-container glass">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="What do you want to listen to?"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            autofocus
          />
          <button
            *ngIf="searchQuery"
            class="clear-btn"
            (click)="clearSearch()"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs" *ngIf="hasResults()">
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'all'"
            (click)="setFilter('all')"
          >
            All
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'tracks'"
            (click)="setFilter('tracks')"
          >
            Songs
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'artists'"
            (click)="setFilter('artists')"
          >
            Artists
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'albums'"
            (click)="setFilter('albums')"
          >
            Albums
          </button>
          <button
            class="filter-tab"
            [class.active]="activeFilter() === 'playlists'"
            (click)="setFilter('playlists')"
          >
            Playlists
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let _ of [1,2,3,4,5,6,7,8]">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-subtitle"></div>
          </div>
        </div>
      </div>

      <!-- Browse Categories (shown when no search) -->
      <div class="browse-section" *ngIf="!searchQuery && !isLoading()">
        <h2>Browse All</h2>
        <div class="categories-grid">
          <div
            class="category-card"
            *ngFor="let category of categories"
            [style.background]="category.gradient"
            (click)="browseCategory(category)"
          >
            <span class="category-name">{{ category.name }}</span>
            <div class="category-icon" [innerHTML]="category.icon"></div>
          </div>
        </div>

        <!-- Recent Searches -->
        <div class="recent-searches" *ngIf="recentSearches().length > 0">
          <div class="section-header">
            <h2>Recent Searches</h2>
            <button class="clear-all-btn" (click)="clearRecentSearches()">Clear all</button>
          </div>
          <div class="recent-grid">
            <div
              class="recent-item glass-card"
              *ngFor="let item of recentSearches()"
              (click)="searchFor(item.query)"
            >
              <div class="recent-image">
                <img [src]="item.imageUrl" [alt]="item.query" *ngIf="item.imageUrl" />
                <div class="recent-placeholder" *ngIf="!item.imageUrl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
              </div>
              <div class="recent-info">
                <span class="recent-query">{{ item.query }}</span>
                <span class="recent-type">{{ item.type }}</span>
              </div>
              <button class="remove-btn" (click)="removeRecentSearch(item); $event.stopPropagation()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="search-results" *ngIf="searchQuery && !isLoading()">
        <!-- No Results -->
        <div class="no-results" *ngIf="!hasResults()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <h3>No results found for "{{ searchQuery }}"</h3>
          <p>Please check your spelling or try different keywords.</p>
        </div>

        <!-- Top Result + Songs -->
        <div class="top-results-section" *ngIf="hasResults() && (activeFilter() === 'all' || activeFilter() === 'tracks')">
          <div class="results-row">
            <!-- Top Result -->
            <div class="top-result" *ngIf="topResult() && activeFilter() === 'all'">
              <h3>Top Result</h3>
              <div class="top-result-card glass-card" (click)="playResult(topResult()!)">
                <img [src]="topResult()!.imageUrl" [alt]="topResult()!.title" class="top-result-image" />
                <h4 class="top-result-title">{{ topResult()!.title }}</h4>
                <p class="top-result-subtitle">
                  <span class="result-type-badge">{{ topResult()!.type }}</span>
                  {{ topResult()!.subtitle }}
                </p>
                <button class="play-btn-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
                <span class="provider-badge" [class]="topResult()!.provider">
                  {{ topResult()!.provider === 'spotify' ? 'S' : 'Y' }}
                </span>
              </div>
            </div>

            <!-- Songs -->
            <div class="songs-results" [class.full-width]="activeFilter() === 'tracks'">
              <h3>Songs</h3>
              <div class="songs-list">
                <div
                  class="song-row"
                  *ngFor="let track of filteredTracks().slice(0, activeFilter() === 'all' ? 4 : 50); let i = index"
                  (click)="playResult(track)"
                >
                  <div class="song-index">{{ i + 1 }}</div>
                  <div class="song-image">
                    <img [src]="track.imageUrl" [alt]="track.title" />
                    <div class="song-play-overlay">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </div>
                  <div class="song-info">
                    <span class="song-title truncate">{{ track.title }}</span>
                    <span class="song-artist truncate">{{ track.subtitle }}</span>
                  </div>
                  <span class="provider-badge small" [class]="track.provider">
                    {{ track.provider === 'spotify' ? 'S' : 'Y' }}
                  </span>
                  <span class="song-duration">{{ formatDuration(track.duration || 0) }}</span>
                  <button class="more-btn" (click)="showTrackMenu(track); $event.stopPropagation()">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Artists -->
        <div class="results-section" *ngIf="filteredArtists().length > 0 && (activeFilter() === 'all' || activeFilter() === 'artists')">
          <h3>Artists</h3>
          <div class="results-grid artists-grid">
            <div
              class="result-card glass-card artist-card"
              *ngFor="let artist of filteredArtists().slice(0, activeFilter() === 'all' ? 6 : 50)"
              (click)="viewArtist(artist)"
            >
              <div class="result-image artist-image">
                <img [src]="artist.imageUrl" [alt]="artist.title" />
              </div>
              <h4 class="result-title truncate">{{ artist.title }}</h4>
              <p class="result-subtitle">Artist</p>
              <span class="provider-badge" [class]="artist.provider">
                {{ artist.provider === 'spotify' ? 'S' : 'Y' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Albums -->
        <div class="results-section" *ngIf="filteredAlbums().length > 0 && (activeFilter() === 'all' || activeFilter() === 'albums')">
          <h3>Albums</h3>
          <div class="results-grid">
            <div
              class="result-card glass-card"
              *ngFor="let album of filteredAlbums().slice(0, activeFilter() === 'all' ? 6 : 50)"
              (click)="viewAlbum(album)"
            >
              <div class="result-image">
                <img [src]="album.imageUrl" [alt]="album.title" />
                <button class="play-btn" (click)="playResult(album); $event.stopPropagation()">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
              </div>
              <h4 class="result-title truncate">{{ album.title }}</h4>
              <p class="result-subtitle truncate">{{ album.subtitle }}</p>
              <span class="provider-badge" [class]="album.provider">
                {{ album.provider === 'spotify' ? 'S' : 'Y' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Playlists -->
        <div class="results-section" *ngIf="filteredPlaylists().length > 0 && (activeFilter() === 'all' || activeFilter() === 'playlists')">
          <h3>Playlists</h3>
          <div class="results-grid">
            <div
              class="result-card glass-card"
              *ngFor="let playlist of filteredPlaylists().slice(0, activeFilter() === 'all' ? 6 : 50)"
              (click)="viewPlaylist(playlist)"
            >
              <div class="result-image">
                <img [src]="playlist.imageUrl" [alt]="playlist.title" />
                <button class="play-btn" (click)="playResult(playlist); $event.stopPropagation()">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
              </div>
              <h4 class="result-title truncate">{{ playlist.title }}</h4>
              <p class="result-subtitle truncate">{{ playlist.subtitle }}</p>
              <span class="provider-badge" [class]="playlist.provider">
                {{ playlist.provider === 'spotify' ? 'S' : 'Y' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-page {
      padding-bottom: var(--space-12);
    }

    /* Search Header */
    .search-header {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      padding: var(--space-4) 0;
      margin-bottom: var(--space-6);
      background: linear-gradient(to bottom, var(--color-bg-primary) 60%, transparent);
    }

    .search-input-container {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-full);
      background: var(--color-bg-secondary);
      max-width: 600px;
    }

    .search-icon {
      width: 24px;
      height: 24px;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      font-size: var(--text-lg);
      background: transparent;
      border: none;
      color: var(--text-primary);
      outline: none;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .clear-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--surface-glass);
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      transition: all var(--transition-fast);
    }

    .clear-btn:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .clear-btn svg {
      width: 16px;
      height: 16px;
    }

    /* Filter Tabs */
    .filter-tabs {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-4);
      overflow-x: auto;
      padding-bottom: var(--space-2);
    }

    .filter-tab {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: 500;
      background: var(--surface-glass);
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-base);
    }

    .filter-tab:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .filter-tab.active {
      background: var(--text-primary);
      color: var(--text-inverse);
    }

    /* Loading State */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-6);
    }

    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--surface-glass) 0%,
        var(--surface-glass-hover) 50%,
        var(--surface-glass) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }

    .skeleton-image {
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
    }

    .skeleton-title {
      height: 16px;
      width: 80%;
    }

    .skeleton-subtitle {
      height: 14px;
      width: 60%;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Browse Section */
    .browse-section h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-6);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-10);
    }

    .category-card {
      aspect-ratio: 1.5;
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-base);
    }

    .category-card:hover {
      transform: scale(1.02);
    }

    .category-name {
      font-size: var(--text-lg);
      font-weight: 700;
      color: white;
      position: relative;
      z-index: 1;
    }

    .category-icon {
      position: absolute;
      bottom: -10px;
      right: -10px;
      width: 80px;
      height: 80px;
      transform: rotate(25deg);
      opacity: 0.8;
    }

    /* Recent Searches */
    .recent-searches {
      margin-top: var(--space-8);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .section-header h2 {
      margin-bottom: 0;
    }

    .clear-all-btn {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      background: none;
      border: none;
      cursor: pointer;
      transition: color var(--transition-fast);
    }

    .clear-all-btn:hover {
      color: var(--text-primary);
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .recent-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2);
      cursor: pointer;
      border-radius: var(--radius-lg);
    }

    .recent-image {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      overflow: hidden;
      flex-shrink: 0;
    }

    .recent-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .recent-placeholder {
      width: 100%;
      height: 100%;
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .recent-placeholder svg {
      width: 24px;
      height: 24px;
      color: var(--text-muted);
    }

    .recent-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .recent-query {
      font-weight: 500;
      color: var(--text-primary);
    }

    .recent-type {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .remove-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      opacity: 0;
      transition: all var(--transition-fast);
    }

    .recent-item:hover .remove-btn {
      opacity: 1;
    }

    .remove-btn:hover {
      background: var(--surface-glass);
      color: var(--text-primary);
    }

    .remove-btn svg {
      width: 16px;
      height: 16px;
    }

    /* No Results */
    .no-results {
      text-align: center;
      padding: var(--space-16) var(--space-6);
    }

    .no-results svg {
      width: 64px;
      height: 64px;
      color: var(--text-muted);
      margin-bottom: var(--space-4);
    }

    .no-results h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-2);
    }

    .no-results p {
      color: var(--text-tertiary);
    }

    /* Results Sections */
    .results-section {
      margin-bottom: var(--space-10);
    }

    .results-section h3,
    .top-results-section h3 {
      font-size: var(--text-xl);
      margin-bottom: var(--space-4);
    }

    .results-row {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: var(--space-6);
    }

    @media (max-width: 1024px) {
      .results-row {
        grid-template-columns: 1fr;
      }
    }

    /* Top Result */
    .top-result-card {
      position: relative;
      padding: var(--space-5);
      height: 100%;
      cursor: pointer;
    }

    .top-result-card:hover .play-btn-lg {
      opacity: 1;
      transform: translateY(0);
    }

    .top-result-image {
      width: 92px;
      height: 92px;
      border-radius: var(--radius-md);
      object-fit: cover;
      margin-bottom: var(--space-4);
    }

    .top-result-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
    }

    .top-result-subtitle {
      color: var(--text-secondary);
      font-size: var(--text-sm);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .result-type-badge {
      padding: var(--space-1) var(--space-2);
      background: var(--color-bg-tertiary);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
    }

    .play-btn-lg {
      position: absolute;
      bottom: var(--space-5);
      right: var(--space-5);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--aurora-purple);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(10px);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .play-btn-lg:hover {
      transform: scale(1.1) translateY(0) !important;
      background: var(--aurora-purple-light);
    }

    .play-btn-lg svg {
      width: 20px;
      height: 20px;
      color: white;
      margin-left: 3px;
    }

    /* Songs List */
    .songs-results {
      min-width: 0;
    }

    .songs-results.full-width {
      grid-column: 1 / -1;
    }

    .songs-list {
      display: flex;
      flex-direction: column;
    }

    .song-row {
      display: grid;
      grid-template-columns: 32px 48px 1fr auto auto auto;
      gap: var(--space-3);
      align-items: center;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .song-row:hover {
      background: var(--surface-glass);
    }

    .song-index {
      font-size: var(--text-sm);
      color: var(--text-muted);
      text-align: center;
    }

    .song-row:hover .song-index {
      display: none;
    }

    .song-image {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .song-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .song-play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
    }

    .song-row:hover .song-play-overlay {
      display: flex;
    }

    .song-play-overlay svg {
      width: 16px;
      height: 16px;
      color: white;
    }

    .song-info {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .song-title {
      font-weight: 500;
      color: var(--text-primary);
    }

    .song-artist {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .song-duration {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }

    .more-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      opacity: 0;
      transition: all var(--transition-fast);
    }

    .song-row:hover .more-btn {
      opacity: 1;
    }

    .more-btn:hover {
      background: var(--surface-glass);
      color: var(--text-primary);
    }

    .more-btn svg {
      width: 16px;
      height: 16px;
    }

    /* Results Grid */
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--space-6);
    }

    .result-card {
      position: relative;
      padding: var(--space-4);
      cursor: pointer;
    }

    .result-card:hover .play-btn {
      opacity: 1;
      transform: translateY(0);
    }

    .result-image {
      position: relative;
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: var(--space-4);
    }

    .artist-card .result-image,
    .artists-grid .artist-image {
      border-radius: 50%;
    }

    .result-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .result-card:hover .result-image img {
      transform: scale(1.05);
    }

    .play-btn {
      position: absolute;
      bottom: var(--space-2);
      right: var(--space-2);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--aurora-purple);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(10px);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .play-btn:hover {
      transform: scale(1.1) translateY(0) !important;
    }

    .play-btn svg {
      width: 16px;
      height: 16px;
      color: white;
      margin-left: 2px;
    }

    .result-title {
      font-size: var(--text-base);
      font-weight: 600;
      margin-bottom: var(--space-1);
    }

    .result-subtitle {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Provider Badge */
    .provider-badge {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      z-index: 1;
    }

    .provider-badge.small {
      position: static;
      width: 20px;
      height: 20px;
      font-size: 9px;
    }

    .provider-badge.spotify {
      background: var(--spotify-green);
    }

    .provider-badge.youtube {
      background: var(--youtube-red);
    }

    /* Responsive */
    @media (max-width: 767px) {
      .song-row {
        grid-template-columns: 48px 1fr auto auto;
      }

      .song-index {
        display: none;
      }

      .song-duration {
        display: none;
      }

      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .results-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
      }
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  searchQuery = '';
  isLoading = signal(false);
  activeFilter = signal<'all' | 'tracks' | 'artists' | 'albums' | 'playlists'>('all');

  // Results
  private allResults = signal<SearchResult[]>([]);
  recentSearches = signal<{ query: string; type: string; imageUrl?: string }[]>([]);

  // Computed filtered results
  filteredTracks = computed(() =>
    this.allResults().filter(r => r.type === 'track')
  );
  filteredArtists = computed(() =>
    this.allResults().filter(r => r.type === 'artist')
  );
  filteredAlbums = computed(() =>
    this.allResults().filter(r => r.type === 'album')
  );
  filteredPlaylists = computed(() =>
    this.allResults().filter(r => r.type === 'playlist')
  );

  topResult = computed(() => {
    const results = this.allResults();
    return results.length > 0 ? results[0] : null;
  });

  hasResults = computed(() => this.allResults().length > 0);

  // Browse categories
  categories: SearchCategory[] = [
    { id: 'pop', name: 'Pop', icon: '🎵', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)' },
    { id: 'hiphop', name: 'Hip-Hop', icon: '🎤', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    { id: 'rock', name: 'Rock', icon: '🎸', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { id: 'electronic', name: 'Electronic', icon: '🎧', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    { id: 'jazz', name: 'Jazz', icon: '🎷', color: '#84cc16', gradient: 'linear-gradient(135deg, #84cc16, #65a30d)' },
    { id: 'classical', name: 'Classical', icon: '🎻', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { id: 'rnb', name: 'R&B', icon: '💜', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { id: 'country', name: 'Country', icon: '🤠', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { id: 'indie', name: 'Indie', icon: '🌿', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    { id: 'metal', name: 'Metal', icon: '🤘', color: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #475569)' },
    { id: 'latin', name: 'Latin', icon: '💃', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)' },
    { id: 'kpop', name: 'K-Pop', icon: '✨', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #d946ef)' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load recent searches from localStorage
    this.loadRecentSearches();

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query.trim()) {
        this.performSearch(query);
      } else {
        this.allResults.set([]);
      }
    });

    // Check for query param
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.onSearchChange(params['q']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  performSearch(query: string): void {
    this.isLoading.set(true);

    // TODO: Call actual search API
    // For now, simulate search with timeout
    setTimeout(() => {
      // Mock results - replace with actual API call
      this.allResults.set([]);
      this.isLoading.set(false);

      // Save to recent searches
      if (query.trim()) {
        this.addToRecentSearches(query);
      }
    }, 500);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.allResults.set([]);
  }

  setFilter(filter: 'all' | 'tracks' | 'artists' | 'albums' | 'playlists'): void {
    this.activeFilter.set(filter);
  }

  searchFor(query: string): void {
    this.searchQuery = query;
    this.onSearchChange(query);
  }

  browseCategory(category: SearchCategory): void {
    this.searchFor(category.name);
  }

  // Recent searches management
  private loadRecentSearches(): void {
    const saved = localStorage.getItem('audiora_recent_searches');
    if (saved) {
      try {
        this.recentSearches.set(JSON.parse(saved));
      } catch {
        this.recentSearches.set([]);
      }
    }
  }

  private saveRecentSearches(): void {
    localStorage.setItem('audiora_recent_searches', JSON.stringify(this.recentSearches()));
  }

  private addToRecentSearches(query: string): void {
    const current = this.recentSearches();
    const filtered = current.filter(s => s.query.toLowerCase() !== query.toLowerCase());
    const updated = [{ query, type: 'Search' }, ...filtered].slice(0, 10);
    this.recentSearches.set(updated);
    this.saveRecentSearches();
  }

  removeRecentSearch(item: { query: string }): void {
    const updated = this.recentSearches().filter(s => s.query !== item.query);
    this.recentSearches.set(updated);
    this.saveRecentSearches();
  }

  clearRecentSearches(): void {
    this.recentSearches.set([]);
    localStorage.removeItem('audiora_recent_searches');
  }

  // Actions
  playResult(result: SearchResult): void {
    console.log('Playing:', result);
    // TODO: Implement play functionality
  }

  viewArtist(artist: SearchResult): void {
    console.log('View artist:', artist);
    // TODO: Navigate to artist page
  }

  viewAlbum(album: SearchResult): void {
    console.log('View album:', album);
    // TODO: Navigate to album page
  }

  viewPlaylist(playlist: SearchResult): void {
    this.router.navigate(['/playlist', playlist.id]);
  }

  showTrackMenu(track: SearchResult): void {
    console.log('Show menu for:', track);
    // TODO: Show context menu
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

```


## Assistant

Now let's create the remaining placeholder components for the routes:

**Tool Call: frontend/src/app/features/auth/reset-password/reset-password.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/auth/reset-password/reset-password.component.ts
```
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="reset-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#reset-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#reset-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#reset-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#reset-logo-gradient)"/>
          </svg>
        </div>

        <!-- Success State -->
        <div class="success-state" *ngIf="isSuccess()">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Password Reset!</h1>
          <p>Your password has been successfully reset. You can now sign in with your new password.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg w-full">
            Sign In
          </a>
        </div>

        <!-- Reset Form -->
        <div class="reset-form-container" *ngIf="!isSuccess()">
          <div class="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password below</p>
          </div>

          <!-- Error Banner -->
          <div class="error-banner" *ngIf="error()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error() }}</span>
          </div>

          <!-- Invalid Token State -->
          <div class="invalid-token" *ngIf="!token">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h3>Invalid Reset Link</h3>
            <p>This password reset link is invalid or has expired.</p>
            <a routerLink="/forgot-password" class="btn btn-primary">
              Request New Link
            </a>
          </div>

          <!-- Reset Form -->
          <form (ngSubmit)="onSubmit()" class="auth-form" *ngIf="token">
            <div class="form-group">
              <label for="password" class="label">New Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  class="input-field has-icon-right"
                  placeholder="Enter new password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="input-icon-right"
                  (click)="togglePasswordVisibility()"
                  tabindex="-1"
                >
                  <svg *ngIf="!showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <div class="password-requirements">
                <span [class.met]="password.length >= 8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  At least 8 characters
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="label">Confirm Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="16" r="1"/>
                </svg>
                <input
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  id="confirmPassword"
                  class="input-field has-icon-right"
                  placeholder="Confirm new password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="input-icon-right"
                  (click)="toggleConfirmPasswordVisibility()"
                  tabindex="-1"
                >
                  <svg *ngIf="!showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <span class="helper-text error" *ngIf="confirmPassword && password !== confirmPassword">
                Passwords do not match
              </span>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg w-full"
              [disabled]="isLoading() || !isFormValid()"
            >
              <span *ngIf="!isLoading()">Reset Password</span>
              <span *ngIf="isLoading()" class="loading-spinner">
                <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Resetting...
              </span>
            </button>
          </form>

          <div class="auth-footer">
            <a routerLink="/login" class="back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
      background: rgba(18, 18, 26, 0.8);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid var(--surface-border);
    }

    .auth-logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .auth-logo svg {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-6);
    }

    .auth-header h1 {
      font-size: var(--text-2xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .auth-header p {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    .success-state {
      text-align: center;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-6);
    }

    .success-icon svg {
      width: 40px;
      height: 40px;
      color: var(--color-success);
    }

    .success-state h1 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-3);
    }

    .success-state p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-5);
      color: var(--color-error-light);
      font-size: var(--text-sm);
    }

    .error-banner svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .invalid-token {
      text-align: center;
      padding: var(--space-6);
    }

    .invalid-token svg {
      width: 64px;
      height: 64px;
      color: var(--color-error);
      margin-bottom: var(--space-4);
    }

    .invalid-token h3 {
      font-size: var(--text-lg);
      margin-bottom: var(--space-2);
    }

    .invalid-token p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--space-4);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      pointer-events: none;
      z-index: 1;
    }

    .input-icon-right {
      position: absolute;
      right: var(--space-3);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      background: none;
      border: none;
      transition: all var(--transition-base);
    }

    .input-icon-right:hover {
      color: var(--text-secondary);
      background: var(--surface-glass);
    }

    .input-icon-right svg {
      width: 18px;
      height: 18px;
    }

    .input-field {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      padding-left: calc(var(--space-4) + 26px);
      font-size: var(--text-base);
      color: var(--text-primary);
      background: var(--color-bg-secondary);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .input-field.has-icon-right {
      padding-right: calc(var(--space-4) + 32px);
    }

    .input-field:hover {
      border-color: var(--surface-border-hover);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    .password-requirements {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      margin-top: var(--space-2);
    }

    .password-requirements span {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-xs);
      color: var(--text-muted);
      transition: color var(--transition-fast);
    }

    .password-requirements span.met {
      color: var(--color-success);
    }

    .password-requirements svg {
      width: 14px;
      height: 14px;
    }

    .helper-text {
      font-size: var(--text-xs);
      margin-top: var(--space-1);
    }

    .helper-text.error {
      color: var(--color-error);
    }

    .btn-lg {
      padding: var(--space-4) var(--space-6);
      font-size: var(--text-base);
      font-weight: 600;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .loading-spinner svg {
      width: 20px;
      height: 20px;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      margin-top: var(--space-6);
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-sm);
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--aurora-purple-light);
    }

    .back-link svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: var(--space-6);
      }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  password = '';
  confirmPassword = '';

  isLoading = signal(false);
  isSuccess = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  isFormValid(): boolean {
    return (
      this.password.length >= 8 &&
      this.password === this.confirmPassword
    );
  }

  onSubmit(): void {
    if (!this.isFormValid() || !this.token) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to reset password. Please try again.');
      }
    });
  }
}

```


**Tool Call: frontend/src/app/features/auth/verify/verify.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/auth/verify/verify.component.ts
```
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="verify-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#verify-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#verify-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#verify-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#verify-logo-gradient)"/>
          </svg>
        </div>

        <!-- Loading State -->
        <div class="verify-content" *ngIf="isLoading()">
          <div class="loading-spinner">
            <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
          </div>
          <h1>Verifying your email</h1>
          <p>Please wait while we verify your email address...</p>
        </div>

        <!-- Success State -->
        <div class="verify-content" *ngIf="!isLoading() && isSuccess()">
          <div class="status-icon success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Email Verified!</h1>
          <p>Your email has been successfully verified. You can now sign in to your account.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg w-full">
            Sign In
          </a>
        </div>

        <!-- Error State -->
        <div class="verify-content" *ngIf="!isLoading() && !isSuccess() && errorMessage()">
          <div class="status-icon error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1>Verification Failed</h1>
          <p>{{ errorMessage() }}</p>
          <div class="action-buttons">
            <button class="btn btn-secondary" (click)="resendVerification()">
              Resend Verification Email
            </button>
            <a routerLink="/login" class="btn btn-ghost">
              Back to Login
            </a>
          </div>
        </div>

        <!-- No Token State -->
        <div class="verify-content" *ngIf="!isLoading() && !token">
          <div class="status-icon warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>Invalid Verification Link</h1>
          <p>The verification link is missing or invalid. Please check your email for the correct link.</p>
          <a routerLink="/login" class="btn btn-primary btn-lg w-full">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: var(--space-8);
      text-align: center;
    }

    .auth-logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .auth-logo svg {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .verify-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }

    .loading-spinner svg {
      width: 48px;
      height: 48px;
      color: var(--aurora-purple);
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .status-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2);
    }

    .status-icon svg {
      width: 36px;
      height: 36px;
    }

    .status-icon.success {
      background: rgba(34, 197, 94, 0.15);
      color: var(--color-success);
    }

    .status-icon.error {
      background: rgba(239, 68, 68, 0.15);
      color: var(--color-error);
    }

    .status-icon.warning {
      background: rgba(245, 158, 11, 0.15);
      color: var(--color-warning);
    }

    .verify-content h1 {
      font-size: var(--text-2xl);
      font-weight: 600;
    }

    .verify-content p {
      color: var(--text-secondary);
      max-width: 300px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      width: 100%;
      margin-top: var(--space-4);
    }
  `]
})
export class VerifyComponent implements OnInit {
  token: string | null = null;

  isLoading = signal(true);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (this.token) {
        this.verifyEmail(this.token);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  private verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.isSuccess.set(false);
        this.errorMessage.set(error.message || 'Verification failed. The link may have expired.');
      }
    });
  }

  resendVerification(): void {
    // Navigate to a resend page or show a form to enter email
    this.router.navigate(['/login'], {
      queryParams: { resend: 'true' }
    });
  }
}

```


**Tool Call: frontend/src/app/features/auth/oauth-callback/oauth-callback.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/auth/oauth-callback/oauth-callback.component.ts
```
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Provider } from '../../../core/models';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <!-- Aurora background -->
      <div class="aurora-bg">
        <div class="aurora-blob aurora-blob-1"></div>
        <div class="aurora-blob aurora-blob-2"></div>
      </div>

      <!-- Loading state -->
      <div class="callback-card glass-card" *ngIf="!error()">
        <div class="loading-spinner">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="url(#spinner-gradient)" stroke-width="4"/>
            <defs>
              <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2>{{ statusMessage() }}</h2>
        <p class="subtitle">Please wait while we complete the connection...</p>

        <!-- Provider indicator -->
        <div class="provider-indicator" *ngIf="provider()">
          <div class="provider-icon" [class]="provider()">
            <svg *ngIf="provider() === 'spotify'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <svg *ngIf="provider() === 'youtube'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span>Connecting to {{ providerName() }}</span>
        </div>
      </div>

      <!-- Error state -->
      <div class="callback-card glass-card error-card" *ngIf="error()">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2>Connection Failed</h2>
        <p class="error-message">{{ error() }}</p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="retry()">
            Try Again
          </button>
          <button class="btn btn-secondary" (click)="goHome()">
            Go Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      position: relative;
      overflow: hidden;
    }

    /* Aurora background */
    .aurora-bg {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
    }

    .aurora-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
      animation: aurora-float 20s ease-in-out infinite;
    }

    .aurora-blob-1 {
      width: 500px;
      height: 500px;
      background: var(--aurora-purple);
      top: -20%;
      left: -10%;
    }

    .aurora-blob-2 {
      width: 400px;
      height: 400px;
      background: var(--aurora-teal);
      bottom: -20%;
      right: -10%;
      animation-delay: -10s;
    }

    @keyframes aurora-float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(30px, -30px) scale(1.1);
      }
    }

    /* Card */
    .callback-card {
      width: 100%;
      max-width: 400px;
      padding: var(--space-10);
      border-radius: var(--radius-2xl);
      text-align: center;
      background: rgba(18, 18, 26, 0.9);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      animation: scale-in var(--transition-slow) ease;
    }

    @keyframes scale-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Loading Spinner */
    .loading-spinner {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--space-6);
    }

    .spinner {
      width: 100%;
      height: 100%;
      animation: spin 1.5s linear infinite;
    }

    .spinner circle {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .subtitle {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
      margin-bottom: var(--space-6);
    }

    /* Provider Indicator */
    .provider-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-5);
      background: var(--surface-glass);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }

    .provider-icon {
      width: 24px;
      height: 24px;
    }

    .provider-icon svg {
      width: 100%;
      height: 100%;
    }

    .provider-icon.spotify {
      color: var(--spotify-green);
    }

    .provider-icon.youtube {
      color: var(--youtube-red);
    }

    /* Error State */
    .error-card .error-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--space-5);
      color: var(--color-error);
    }

    .error-card .error-icon svg {
      width: 100%;
      height: 100%;
    }

    .error-message {
      color: var(--text-secondary);
      font-size: var(--text-sm);
      margin-bottom: var(--space-6);
    }

    .error-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .btn {
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: var(--gradient-aurora);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: var(--surface-glass);
      color: var(--text-secondary);
      border: 1px solid var(--surface-border);
    }

    .btn-secondary:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  provider = signal<Provider | null>(null);
  error = signal<string | null>(null);
  statusMessage = signal('Connecting...');

  providerName(): string {
    const p = this.provider();
    if (p === 'spotify') return 'Spotify';
    if (p === 'youtube') return 'YouTube';
    return 'Service';
  }

  ngOnInit(): void {
    this.handleCallback();
  }

  private handleCallback(): void {
    // Get query parameters
    const params = this.route.snapshot.queryParams;

    // Check for error in params
    if (params['error']) {
      this.error.set(params['error_description'] || 'Authentication was cancelled or failed.');
      return;
    }

    // Get provider from URL path or state
    const urlSegments = window.location.pathname.split('/');
    const providerIndex = urlSegments.findIndex(s => s === 'callback') - 1;
    const providerFromPath = urlSegments[providerIndex] as Provider;

    // Try to get provider from state or path
    const provider = (params['state']?.split('_')[0] as Provider) || providerFromPath || 'spotify';
    this.provider.set(provider);

    // Get session ID and user ID from params
    const sessionId = params['sessionId'] || params['session_id'];
    const userId = params['userId'] || params['user_id'];
    const code = params['code'];

    if (sessionId && userId) {
      // We have the session info, exchange for JWT
      this.statusMessage.set('Completing authentication...');
      this.exchangeToken(provider, sessionId, userId);
    } else if (code) {
      // We have an auth code, the backend should handle the exchange
      this.statusMessage.set('Processing authorization...');
      this.handleAuthCode(provider, code, params['state']);
    } else {
      this.error.set('Missing authentication data. Please try again.');
    }
  }

  private exchangeToken(provider: Provider, sessionId: string, userId: string): void {
    this.authService.handleOAuthCallback(provider, sessionId, userId).subscribe({
      next: () => {
        this.statusMessage.set('Success! Redirecting...');

        // Close popup if this is a popup window
        if (window.opener) {
          window.opener.postMessage(
            { type: 'oauth_success', provider },
            window.location.origin
          );
          window.close();
        } else {
          // Navigate to home or intended destination
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        }
      },
      error: (err) => {
        console.error('OAuth exchange error:', err);
        this.error.set(err.message || 'Failed to complete authentication. Please try again.');
      }
    });
  }

  private handleAuthCode(provider: Provider, code: string, state?: string): void {
    // For auth code flow, we need to exchange the code on the backend
    // This might redirect or be handled by the backend directly
    // For now, show an error since the backend should redirect with sessionId
    this.error.set('Authentication flow incomplete. Please try again.');
  }

  retry(): void {
    const provider = this.provider();
    if (provider) {
      this.authService.initiateOAuth(provider);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goHome(): void {
    // Close popup if applicable
    if (window.opener) {
      window.close();
    } else {
      this.router.navigate(['/']);
    }
  }
}

```


**Tool Call: frontend/src/app/features/auth/forgot-password/forgot-password.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/auth/forgot-password/forgot-password.component.ts
```
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-card animate-scale-in">
        <!-- Logo -->
        <div class="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="forgot-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7"/>
                <stop offset="50%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#14b8a6"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#forgot-logo-gradient)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" stroke="url(#forgot-logo-gradient)" stroke-width="2" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="25" stroke="url(#forgot-logo-gradient)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M42 35 L42 65 L68 50 Z" fill="url(#forgot-logo-gradient)"/>
          </svg>
        </div>

        <!-- Success State -->
        <div class="success-state" *ngIf="emailSent()">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>Check your email</h1>
          <p>We've sent a password reset link to <strong>{{ email }}</strong></p>
          <p class="helper-text">Didn't receive the email? Check your spam folder or</p>
          <button class="btn btn-secondary" (click)="resendEmail()" [disabled]="isLoading()">
            Resend email
          </button>
          <a routerLink="/login" class="back-link">Back to sign in</a>
        </div>

        <!-- Form State -->
        <div class="form-state" *ngIf="!emailSent()">
          <div class="auth-header">
            <h1>Forgot password?</h1>
            <p>No worries, we'll send you reset instructions.</p>
          </div>

          <!-- Error message -->
          <div class="error-banner" *ngIf="error()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error() }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email" class="label">Email</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  class="input-field"
                  placeholder="Enter your email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  autocomplete="email"
                />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="isLoading() || !email">
              <span *ngIf="!isLoading()">Reset password</span>
              <span *ngIf="isLoading()" class="loading-spinner">
                <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                </svg>
                Sending...
              </span>
            </button>
          </form>

          <a routerLink="/login" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
    }

    .auth-logo {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .auth-logo svg {
      width: 56px;
      height: 56px;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-6);
    }

    .auth-header h1 {
      font-size: var(--text-2xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .auth-header p {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    /* Success State */
    .success-state {
      text-align: center;
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-6);
    }

    .success-icon svg {
      width: 32px;
      height: 32px;
      color: var(--color-success);
    }

    .success-state h1 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .success-state p {
      color: var(--text-secondary);
      font-size: var(--text-sm);
      margin-bottom: var(--space-4);
    }

    .success-state p strong {
      color: var(--text-primary);
    }

    .success-state .helper-text {
      color: var(--text-muted);
      font-size: var(--text-xs);
      margin-bottom: var(--space-3);
    }

    .success-state .btn {
      margin-bottom: var(--space-4);
    }

    /* Error */
    .error-banner {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-5);
      color: var(--color-error-light);
      font-size: var(--text-sm);
    }

    .error-banner svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--space-4);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      pointer-events: none;
      z-index: 1;
    }

    .input-field {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      padding-left: calc(var(--space-4) + 26px);
      font-size: var(--text-base);
      color: var(--text-primary);
      background: var(--color-bg-secondary);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .input-field:hover {
      border-color: var(--surface-border-hover);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    /* Button */
    .btn-lg {
      padding: var(--space-4) var(--space-6);
      font-size: var(--text-base);
      font-weight: 600;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .loading-spinner svg {
      width: 20px;
      height: 20px;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Back link */
    .back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin-top: var(--space-6);
      font-size: var(--text-sm);
      color: var(--text-tertiary);
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--text-primary);
    }

    .back-link svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: var(--space-6);
      }
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = signal(false);
  error = signal<string | null>(null);
  emailSent = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.error.set('Please enter your email address');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.emailSent.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to send reset email. Please try again.');
      }
    });
  }

  resendEmail(): void {
    this.emailSent.set(false);
    this.onSubmit();
  }
}

```


## Assistant

Now let's create the remaining placeholder feature components:

**Tool Call: frontend/src/app/features/profile/profile.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/profile/profile.component.ts
```
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-gradient"></div>
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar" (click)="triggerAvatarUpload()">
              <img *ngIf="user()?.avatarUrl" [src]="user()?.avatarUrl" [alt]="user()?.displayName" />
              <div class="avatar-placeholder" *ngIf="!user()?.avatarUrl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input
                type="file"
                #avatarInput
                accept="image/*"
                (change)="onAvatarChange($event)"
                style="display: none"
              />
            </div>
            <div class="user-info">
              <span class="profile-label">Profile</span>
              <h1 class="display-name">{{ user()?.displayName || 'User' }}</h1>
              <p class="username">@{{ user()?.username }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="profile-content">
        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card glass-card">
            <span class="stat-value">{{ likedCount() }}</span>
            <span class="stat-label">Liked Songs</span>
          </div>
          <div class="stat-card glass-card">
            <span class="stat-value">{{ playlistCount() }}</span>
            <span class="stat-label">Playlists</span>
          </div>
          <div class="stat-card glass-card">
            <span class="stat-value">{{ connectedServices() }}</span>
            <span class="stat-label">Connected Services</span>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <section class="profile-section">
          <h2>Edit Profile</h2>
          <div class="form-card glass-card">
            <form (ngSubmit)="saveProfile()" class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="displayName" class="label">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    class="input-field"
                    [(ngModel)]="displayName"
                    name="displayName"
                    placeholder="Your display name"
                  />
                </div>
                <div class="form-group">
                  <label for="username" class="label">Username</label>
                  <input
                    type="text"
                    id="username"
                    class="input-field"
                    [(ngModel)]="username"
                    name="username"
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="bio" class="label">Bio</label>
                <textarea
                  id="bio"
                  class="input-field textarea"
                  [(ngModel)]="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="email" class="label">Email</label>
                <input
                  type="email"
                  id="email"
                  class="input-field"
                  [value]="user()?.email"
                  disabled
                />
                <span class="helper-text">Email cannot be changed</span>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="resetForm()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  <span *ngIf="!isSaving()">Save Changes</span>
                  <span *ngIf="isSaving()" class="loading-spinner">
                    <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
                    </svg>
                    Saving...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>

        <!-- Connected Services -->
        <section class="profile-section">
          <h2>Connected Services</h2>
          <div class="services-grid">
            <div class="service-card glass-card">
              <div class="service-icon spotify">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <div class="service-info">
                <h3>Spotify</h3>
                <p *ngIf="spotifyConnected()">Connected</p>
                <p *ngIf="!spotifyConnected()" class="not-connected">Not connected</p>
              </div>
              <button
                class="btn"
                [class.btn-secondary]="spotifyConnected()"
                [class.btn-spotify]="!spotifyConnected()"
                (click)="toggleSpotify()"
              >
                {{ spotifyConnected() ? 'Disconnect' : 'Connect' }}
              </button>
            </div>

            <div class="service-card glass-card">
              <div class="service-icon youtube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div class="service-info">
                <h3>YouTube</h3>
                <p *ngIf="youtubeConnected()">Connected</p>
                <p *ngIf="!youtubeConnected()" class="not-connected">Not connected</p>
              </div>
              <button
                class="btn"
                [class.btn-secondary]="youtubeConnected()"
                [class.btn-youtube]="!youtubeConnected()"
                (click)="toggleYouTube()"
              >
                {{ youtubeConnected() ? 'Disconnect' : 'Connect' }}
              </button>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="profile-section danger-section">
          <h2>Danger Zone</h2>
          <div class="danger-card glass-card">
            <div class="danger-item">
              <div class="danger-info">
                <h3>Sign Out</h3>
                <p>Sign out of your account on this device</p>
              </div>
              <button class="btn btn-secondary" (click)="logout()">
                Sign Out
              </button>
            </div>
            <hr class="divider" />
            <div class="danger-item">
              <div class="danger-info">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all data</p>
              </div>
              <button class="btn btn-danger" (click)="deleteAccount()">
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding-bottom: var(--space-12);
      animation: fade-in var(--transition-slow) ease;
    }

    /* Header */
    .profile-header {
      position: relative;
      padding: var(--space-12) var(--space-6);
      margin: calc(var(--space-6) * -1);
      margin-bottom: var(--space-8);
      overflow: hidden;
    }

    .header-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.2), transparent);
      z-index: 0;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .avatar-section {
      display: flex;
      align-items: flex-end;
      gap: var(--space-6);
    }

    .avatar {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: var(--surface-glass);
      position: relative;
      cursor: pointer;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient-aurora);
    }

    .avatar-placeholder svg {
      width: 80px;
      height: 80px;
      color: white;
    }

    .avatar-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .avatar:hover .avatar-overlay {
      opacity: 1;
    }

    .avatar-overlay svg {
      width: 32px;
      height: 32px;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .profile-label {
      font-size: var(--text-sm);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
      color: var(--text-secondary);
    }

    .display-name {
      font-size: var(--text-5xl);
      font-weight: 700;
      line-height: 1.1;
    }

    .username {
      font-size: var(--text-lg);
      color: var(--text-tertiary);
    }

    /* Content */
    .profile-content {
      max-width: 800px;
    }

    /* Stats */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
      margin-bottom: var(--space-10);
    }

    .stat-card {
      padding: var(--space-5);
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--aurora-purple);
      margin-bottom: var(--space-1);
    }

    .stat-label {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    /* Sections */
    .profile-section {
      margin-bottom: var(--space-10);
    }

    .profile-section h2 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    /* Form Card */
    .form-card {
      padding: var(--space-6);
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: var(--space-2);
    }

    .input-field {
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-base);
      color: var(--text-primary);
      background: var(--color-bg-secondary);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .input-field:hover:not(:disabled) {
      border-color: var(--surface-border-hover);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }

    .input-field:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    .textarea {
      resize: vertical;
      min-height: 80px;
    }

    .helper-text {
      font-size: var(--text-xs);
      color: var(--text-muted);
      margin-top: var(--space-1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid var(--surface-border);
    }

    /* Buttons */
    .btn {
      padding: var(--space-3) var(--space-5);
      font-size: var(--text-sm);
      font-weight: 600;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: var(--gradient-aurora);
      color: white;
      border: none;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: var(--surface-glass);
      color: var(--text-secondary);
      border: 1px solid var(--surface-border);
    }

    .btn-secondary:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .btn-spotify {
      background: var(--spotify-green);
      color: white;
      border: none;
    }

    .btn-youtube {
      background: var(--youtube-red);
      color: white;
      border: none;
    }

    .btn-danger {
      background: var(--color-error);
      color: white;
      border: none;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .loading-spinner svg {
      width: 16px;
      height: 16px;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Services */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    .service-card {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-5);
    }

    .service-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .service-icon svg {
      width: 28px;
      height: 28px;
    }

    .service-icon.spotify {
      background: rgba(29, 185, 84, 0.15);
      color: var(--spotify-green);
    }

    .service-icon.youtube {
      background: rgba(255, 0, 0, 0.15);
      color: var(--youtube-red);
    }

    .service-info {
      flex: 1;
    }

    .service-info h3 {
      font-size: var(--text-base);
      font-weight: 600;
      margin-bottom: var(--space-1);
    }

    .service-info p {
      font-size: var(--text-sm);
      color: var(--color-success);
    }

    .service-info p.not-connected {
      color: var(--text-muted);
    }

    /* Danger Zone */
    .danger-section h2 {
      color: var(--color-error);
    }

    .danger-card {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .danger-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4);
    }

    .danger-info h3 {
      font-size: var(--text-base);
      font-weight: 600;
      margin-bottom: var(--space-1);
    }

    .danger-info p {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .divider {
      border: none;
      border-top: 1px solid var(--surface-border);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 767px) {
      .avatar-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .avatar {
        width: 140px;
        height: 140px;
      }

      .display-name {
        font-size: var(--text-3xl);
      }

      .stats-row {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .danger-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // User data
  user = this.authService.currentUser;

  // Form fields
  displayName = '';
  username = '';
  bio = '';

  // Stats
  likedCount = signal(0);
  playlistCount = signal(0);
  connectedServices = signal(0);

  // Connection status
  spotifyConnected = signal(false);
  youtubeConnected = signal(false);

  // Loading states
  isSaving = signal(false);

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
    this.loadConnections();
  }

  private loadUserData(): void {
    const user = this.user();
    if (user) {
      this.displayName = user.displayName || '';
      this.username = user.username || '';
      this.bio = user.bio || '';
    }
  }

  private loadStats(): void {
    // TODO: Load from API
    this.likedCount.set(0);
    this.playlistCount.set(0);
  }

  private loadConnections(): void {
    this.authService.providerConnections$.subscribe(connections => {
      this.spotifyConnected.set(connections.some(c => c.provider === 'spotify' && c.connected));
      this.youtubeConnected.set(connections.some(c => c.provider === 'youtube' && c.connected));
      this.connectedServices.set(connections.filter(c => c.connected).length);
    });
  }

  triggerAvatarUpload(): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log('Avatar file selected:', file.name);
      // TODO: Upload avatar
    }
  }

  saveProfile(): void {
    this.isSaving.set(true);

    // TODO: Call API to save profile
    setTimeout(() => {
      this.isSaving.set(false);
      console.log('Profile saved');
    }, 1000);
  }

  resetForm(): void {
    this.loadUserData();
  }

  toggleSpotify(): void {
    if (this.spotifyConnected()) {
      this.authService.disconnectProvider('spotify').subscribe({
        next: () => console.log('Spotify disconnected'),
        error: (err) => console.error('Failed to disconnect Spotify:', err)
      });
    } else {
      this.authService.connectProvider('spotify');
    }
  }

  toggleYouTube(): void {
    if (this.youtubeConnected()) {
      this.authService.disconnectProvider('youtube').subscribe({
        next: () => console.log('YouTube disconnected'),
        error: (err) => console.error('Failed to disconnect YouTube:', err)
      });
    } else {
      this.authService.connectProvider('youtube');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Delete account requested');
      // TODO: Call API to delete account
    }
  }
}

```


**Tool Call: frontend/src/app/features/settings/settings.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/settings/settings.component.ts
```
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <!-- Header -->
      <header class="settings-header">
        <h1>Settings</h1>
        <p>Customize your Audiora experience</p>
      </header>

      <!-- Settings Navigation -->
      <div class="settings-layout">
        <nav class="settings-nav">
          <button
            *ngFor="let section of sections"
            class="nav-item"
            [class.active]="activeSection() === section.id"
            (click)="setActiveSection(section.id)"
          >
            <span class="nav-icon" [innerHTML]="section.icon"></span>
            <span>{{ section.title }}</span>
          </button>
        </nav>

        <!-- Settings Content -->
        <div class="settings-content">
          <!-- Account Section -->
          <section class="settings-section" *ngIf="activeSection() === 'account'">
            <h2>Account</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Email</label>
                  <p class="setting-value">{{ userEmail }}</p>
                </div>
                <button class="btn btn-secondary btn-sm">Change</button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Password</label>
                  <p class="setting-description">Last changed 30 days ago</p>
                </div>
                <button class="btn btn-secondary btn-sm">Update</button>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Two-Factor Authentication</label>
                  <p class="setting-description">Add an extra layer of security</p>
                </div>
                <button class="btn btn-secondary btn-sm">Enable</button>
              </div>
            </div>

            <div class="danger-zone">
              <h3>Danger Zone</h3>
              <div class="setting-item danger">
                <div class="setting-info">
                  <label>Delete Account</label>
                  <p class="setting-description">Permanently delete your account and all data</p>
                </div>
                <button class="btn btn-danger btn-sm">Delete Account</button>
              </div>
            </div>
          </section>

          <!-- Appearance Section -->
          <section class="settings-section" *ngIf="activeSection() === 'appearance'">
            <h2>Appearance</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Theme</label>
                  <p class="setting-description">Choose your preferred color scheme</p>
                </div>
                <div class="theme-options">
                  <button
                    class="theme-option"
                    [class.active]="themeMode() === 'dark'"
                    (click)="setTheme('dark')"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                    <span>Dark</span>
                  </button>
                  <button
                    class="theme-option"
                    [class.active]="themeMode() === 'light'"
                    (click)="setTheme('light')"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                    <span>Light</span>
                  </button>
                  <button
                    class="theme-option"
                    [class.active]="themeMode() === 'system'"
                    (click)="setTheme('system')"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    <span>System</span>
                  </button>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Dynamic Theme</label>
                  <p class="setting-description">Adapt colors based on album artwork</p>
                </div>
                <label class="toggle">
                  <input
                    type="checkbox"
                    [checked]="dynamicThemeEnabled()"
                    (change)="toggleDynamicTheme($event)"
                  />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
            </div>
          </section>

          <!-- Playback Section -->
          <section class="settings-section" *ngIf="activeSection() === 'playback'">
            <h2>Playback</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Autoplay</label>
                  <p class="setting-description">Automatically play similar songs when queue ends</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="autoplay" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Crossfade</label>
                  <p class="setting-description">Smoothly transition between songs</p>
                </div>
                <div class="slider-control">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    [(ngModel)]="crossfadeDuration"
                  />
                  <span class="slider-value">{{ crossfadeDuration }}s</span>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Normalize Volume</label>
                  <p class="setting-description">Set consistent volume for all tracks</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="normalizeVolume" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Audio Quality</label>
                  <p class="setting-description">Higher quality uses more data</p>
                </div>
                <select class="select-field" [(ngModel)]="audioQuality">
                  <option value="low">Low (96 kbps)</option>
                  <option value="normal">Normal (160 kbps)</option>
                  <option value="high">High (320 kbps)</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Connected Services Section -->
          <section class="settings-section" *ngIf="activeSection() === 'services'">
            <h2>Connected Services</h2>

            <div class="setting-group">
              <div class="service-item">
                <div class="service-icon spotify">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div class="service-info">
                  <label>Spotify</label>
                  <p class="setting-description" *ngIf="spotifyConnected">Connected as spotify_user</p>
                  <p class="setting-description" *ngIf="!spotifyConnected">Not connected</p>
                </div>
                <button
                  class="btn btn-sm"
                  [class.btn-secondary]="spotifyConnected"
                  [class.btn-spotify]="!spotifyConnected"
                  (click)="toggleSpotifyConnection()"
                >
                  {{ spotifyConnected ? 'Disconnect' : 'Connect' }}
                </button>
              </div>

              <div class="service-item">
                <div class="service-icon youtube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div class="service-info">
                  <label>YouTube</label>
                  <p class="setting-description" *ngIf="youtubeConnected">Connected as youtube_user</p>
                  <p class="setting-description" *ngIf="!youtubeConnected">Not connected</p>
                </div>
                <button
                  class="btn btn-sm"
                  [class.btn-secondary]="youtubeConnected"
                  [class.btn-youtube]="!youtubeConnected"
                  (click)="toggleYoutubeConnection()"
                >
                  {{ youtubeConnected ? 'Disconnect' : 'Connect' }}
                </button>
              </div>
            </div>
          </section>

          <!-- Notifications Section -->
          <section class="settings-section" *ngIf="activeSection() === 'notifications'">
            <h2>Notifications</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>New Releases</label>
                  <p class="setting-description">Get notified about new releases from artists you follow</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="notifyNewReleases" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Playlist Updates</label>
                  <p class="setting-description">Get notified when playlists you follow are updated</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="notifyPlaylistUpdates" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Email Digest</label>
                  <p class="setting-description">Receive weekly email with your listening activity</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="emailDigest" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
            </div>
          </section>

          <!-- Privacy Section -->
          <section class="settings-section" *ngIf="activeSection() === 'privacy'">
            <h2>Privacy</h2>

            <div class="setting-group">
              <div class="setting-item">
                <div class="setting-info">
                  <label>Private Session</label>
                  <p class="setting-description">Your listening activity won't be shown publicly</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="privateSession" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Show Listening Activity</label>
                  <p class="setting-description">Let others see what you're listening to</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="showListeningActivity" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <label>Data Collection</label>
                  <p class="setting-description">Help improve Audiora by sharing usage data</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" [(ngModel)]="dataCollection" />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3>Your Data</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label>Download Your Data</label>
                  <p class="setting-description">Get a copy of all your Audiora data</p>
                </div>
                <button class="btn btn-secondary btn-sm">Request Download</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding-bottom: var(--space-12);
      max-width: 1000px;
      margin: 0 auto;
    }

    /* Header */
    .settings-header {
      margin-bottom: var(--space-8);
    }

    .settings-header h1 {
      font-size: var(--text-3xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
    }

    .settings-header p {
      color: var(--text-tertiary);
    }

    /* Layout */
    .settings-layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: var(--space-8);
    }

    @media (max-width: 768px) {
      .settings-layout {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
    }

    /* Navigation */
    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    @media (max-width: 768px) {
      .settings-nav {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: var(--space-2);
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: left;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: var(--surface-glass);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .nav-icon {
      display: flex;
      width: 20px;
      height: 20px;
    }

    .nav-icon svg {
      width: 100%;
      height: 100%;
    }

    /* Content */
    .settings-content {
      min-width: 0;
    }

    .settings-section h2 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--surface-border);
    }

    .setting-group {
      margin-bottom: var(--space-8);
    }

    .setting-group h3 {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }

    /* Setting Item */
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--surface-border);
      gap: var(--space-4);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info {
      flex: 1;
      min-width: 0;
    }

    .setting-info label {
      display: block;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }

    .setting-description {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .setting-value {
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }

    /* Service Items */
    .service-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--surface-glass);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-3);
    }

    .service-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .service-icon svg {
      width: 24px;
      height: 24px;
    }

    .service-icon.spotify {
      background: rgba(29, 185, 84, 0.15);
      color: var(--spotify-green);
    }

    .service-icon.youtube {
      background: rgba(255, 0, 0, 0.15);
      color: var(--youtube-red);
    }

    .service-info {
      flex: 1;
    }

    /* Theme Options */
    .theme-options {
      display: flex;
      gap: var(--space-2);
    }

    .theme-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-size: var(--text-xs);
      cursor: pointer;
      transition: all var(--transition-base);
      min-width: 80px;
    }

    .theme-option:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .theme-option.active {
      border-color: var(--aurora-purple);
      color: var(--aurora-purple);
    }

    .theme-option svg {
      width: 24px;
      height: 24px;
    }

    /* Toggle */
    .toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 44px;
      height: 24px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-track {
      position: absolute;
      inset: 0;
      background: var(--color-bg-tertiary);
      border-radius: var(--radius-full);
      transition: background var(--transition-base);
    }

    .toggle input:checked + .toggle-track {
      background: var(--aurora-purple);
    }

    .toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform var(--transition-base);
    }

    .toggle input:checked ~ .toggle-thumb {
      transform: translateX(20px);
    }

    /* Slider */
    .slider-control {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .slider-control input[type="range"] {
      width: 120px;
      height: 4px;
      background: var(--surface-glass-hover);
      border-radius: var(--radius-full);
      appearance: none;
      cursor: pointer;
    }

    .slider-control input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: var(--aurora-purple);
      border-radius: 50%;
      cursor: pointer;
    }

    .slider-value {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      min-width: 30px;
    }

    /* Select */
    .select-field {
      padding: var(--space-2) var(--space-3);
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: var(--text-sm);
      cursor: pointer;
    }

    .select-field:focus {
      outline: none;
      border-color: var(--aurora-purple);
    }

    /* Buttons */
    .btn {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-sm {
      padding: var(--space-2) var(--space-3);
    }

    .btn-secondary {
      background: var(--surface-glass);
      border: 1px solid var(--surface-border);
      color: var(--text-secondary);
    }

    .btn-secondary:hover {
      background: var(--surface-glass-hover);
      color: var(--text-primary);
    }

    .btn-spotify {
      background: var(--spotify-green);
      border: none;
      color: white;
    }

    .btn-spotify:hover {
      background: var(--spotify-green-dark);
    }

    .btn-youtube {
      background: var(--youtube-red);
      border: none;
      color: white;
    }

    .btn-youtube:hover {
      background: var(--youtube-red-dark);
    }

    .btn-danger {
      background: transparent;
      border: 1px solid var(--color-error);
      color: var(--color-error);
    }

    .btn-danger:hover {
      background: var(--color-error);
      color: white;
    }

    /* Danger Zone */
    .danger-zone {
      margin-top: var(--space-8);
      padding-top: var(--space-6);
      border-top: 1px solid rgba(239, 68, 68, 0.3);
    }

    .danger-zone h3 {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-error);
      margin-bottom: var(--space-4);
    }

    .setting-item.danger {
      border-color: rgba(239, 68, 68, 0.2);
    }
  `]
})
export class SettingsComponent implements OnInit {
  private themeService = new ThemeService();
  private authService: AuthService | null = null;

  // Navigation
  activeSection = signal('account');

  sections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
    },
    {
      id: 'playback',
      title: 'Playback',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
    },
    {
      id: 'services',
      title: 'Connected Services',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
    }
  ];

  // User info
  userEmail = 'user@example.com';

  // Theme
  themeMode = signal<ThemeMode>('dark');
  dynamicThemeEnabled = signal(false);

  // Playback
  autoplay = true;
  crossfadeDuration = 0;
  normalizeVolume = false;
  audioQuality = 'high';

  // Services
  spotifyConnected = false;
  youtubeConnected = false;

  // Notifications
  notifyNewReleases = true;
  notifyPlaylistUpdates = true;
  emailDigest = false;

  // Privacy
  privateSession = false;
  showListeningActivity = true;
  dataCollection = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    // Load theme settings
    this.themeMode.set(this.themeService.themeMode());
    this.dynamicThemeEnabled.set(this.themeService.dynamicTheme().isActive);
  }

  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
    this.themeService.setThemeMode(mode);
  }

  toggleDynamicTheme(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.dynamicThemeEnabled.set(checked);
    this.themeService.setDynamicThemeEnabled(checked);
  }

  toggleSpotifyConnection(): void {
    if (this.spotifyConnected) {
      // Disconnect
      this.spotifyConnected = false;
    } else {
      // Connect via OAuth
      console.log('Connecting Spotify...');
    }
  }

  toggleYoutubeConnection(): void {
    if (this.youtubeConnected) {
      // Disconnect
      this.youtubeConnected = false;
    } else {
      // Connect via OAuth
      console.log('Connecting YouTube...');
    }
  }
}

```


**Tool Call: frontend/src/app/features/playlist/playlist.component.ts**
Status: Completed

Diff: Audiora/frontend/src/app/features/playlist/playlist.component.ts
```
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  provider: 'spotify' | 'youtube';
  addedAt: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  trackCount: number;
  totalDuration: number;
  isPublic: boolean;
  provider: 'spotify' | 'youtube' | 'local';
  tracks: PlaylistTrack[];
}

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist-container" *ngIf="playlist()">
      <!-- Header -->
      <header class="playlist-header">
        <div class="header-gradient" [style.background]="headerGradient"></div>
        <div class="header-content">
          <div class="playlist-image">
            <img [src]="playlist()!.imageUrl || 'assets/images/default-playlist.png'" [alt]="playlist()!.name" />
          </div>
          <div class="playlist-info">
            <span class="playlist-type">{{ playlist()!.isPublic ? 'Public Playlist' : 'Private Playlist' }}</span>
            <h1 class="playlist-name">{{ playlist()!.name }}</h1>
            <p class="playlist-description" *ngIf="playlist()!.description">{{ playlist()!.description }}</p>
            <div class="playlist-meta">
              <span class="owner">{{ playlist()!.owner }}</span>
              <span class="separator">•</span>
              <span class="track-count">{{ playlist()!.trackCount }} songs</span>
              <span class="separator">•</span>
              <span class="duration">{{ formatTotalDuration(playlist()!.totalDuration) }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Controls -->
      <div class="controls-section">
        <button class="play-all-btn" (click)="playAll()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
        <button class="shuffle-btn" (click)="shufflePlay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
        </button>
        <button class="action-btn" (click)="toggleLike()">
          <svg viewBox="0 0 24 24" [attr.fill]="isLiked() ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="action-btn" (click)="showMenu()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
      </div>

      <!-- Track List -->
      <div class="track-list" *ngIf="playlist()!.tracks.length > 0">
        <!-- Header -->
        <div class="track-list-header">
          <span class="col-num">#</span>
          <span class="col-title">Title</span>
          <span class="col-album">Album</span>
          <span class="col-date">Date Added</span>
          <span class="col-duration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
        </div>

        <!-- Tracks -->
        <div
          class="track-item"
          *ngFor="let track of playlist()!.tracks; let i = index"
          (click)="playTrack(track)"
          [class.playing]="currentTrackId() === track.id"
        >
          <span class="col-num">
            <span class="track-number">{{ i + 1 }}</span>
            <button class="play-btn-small">
              <svg *ngIf="currentTrackId() !== track.id || !isPlaying()" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg *ngIf="currentTrackId() === track.id && isPlaying()" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
          </span>

          <div class="col-title">
            <img [src]="track.albumArt" [alt]="track.album" class="track-art" />
            <div class="track-info">
              <span class="track-name truncate" [class.active]="currentTrackId() === track.id">
                {{ track.title }}
              </span>
              <span class="track-artist truncate">{{ track.artist }}</span>
            </div>
            <span class="provider-badge" [class]="track.provider">
              {{ track.provider === 'spotify' ? 'S' : 'Y' }}
            </span>
          </div>

          <span class="col-album truncate">{{ track.album }}</span>
          <span class="col-date">{{ formatDate(track.addedAt) }}</span>

          <div class="col-duration">
            <button class="like-btn" (click)="likeTrack(track, $event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <span class="duration-text">{{ formatDuration(track.duration) }}</span>
            <button class="more-btn" (click)="showTrackMenu(track, $event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="playlist()!.tracks.length === 0">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <h3>This playlist is empty</h3>
        <p>Add some songs to get started</p>
        <button class="btn btn-primary" (click)="navigateToSearch()">
          Find Songs
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="isLoading()">
      <div class="loading-spinner">
        <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
        </svg>
      </div>
      <p>Loading playlist...</p>
    </div>
  `,
  styles: [`
    .playlist-container {
      padding-bottom: var(--space-12);
      animation: fade-in var(--transition-slow) ease;
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Header */
    .playlist-header {
      position: relative;
      padding: var(--space-12) var(--space-6);
      margin: calc(var(--space-6) * -1);
      margin-bottom: var(--space-6);
      overflow: hidden;
    }

    .header-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.3), transparent);
      z-index: 0;
    }

    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      gap: var(--space-6);
    }

    .playlist-image {
      width: 232px;
      height: 232px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      flex-shrink: 0;
    }

    .playlist-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .playlist-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .playlist-type {
      font-size: var(--text-sm);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
      color: var(--text-secondary);
    }

    .playlist-name {
      font-size: var(--text-6xl);
      font-weight: 700;
      line-height: 1.1;
    }

    .playlist-description {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      max-width: 600px;
    }

    .playlist-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
      font-size: var(--text-sm);
      margin-top: var(--space-2);
    }

    .owner {
      font-weight: 600;
      color: var(--text-primary);
    }

    .separator {
      color: var(--text-muted);
    }

    /* Controls */
    .controls-section {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6) 0;
    }

    .play-all-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--aurora-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .play-all-btn:hover {
      transform: scale(1.05);
      background: var(--aurora-purple-light);
    }

    .play-all-btn svg {
      width: 24px;
      height: 24px;
      color: white;
      margin-left: 3px;
    }

    .shuffle-btn,
    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all var(--transition-base);
    }

    .shuffle-btn:hover,
    .action-btn:hover {
      color: var(--text-primary);
    }

    .shuffle-btn svg,
    .action-btn svg {
      width: 22px;
      height: 22px;
    }

    /* Track List */
    .track-list {
      display: flex;
      flex-direction: column;
    }

    .track-list-header {
      display: grid;
      grid-template-columns: 48px 1fr 200px 150px 120px;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--surface-border);
      color: var(--text-muted);
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }

    .track-list-header .col-duration {
      display: flex;
      justify-content: flex-end;
    }

    .track-list-header .col-duration svg {
      width: 16px;
      height: 16px;
    }

    .track-item {
      display: grid;
      grid-template-columns: 48px 1fr 200px 150px 120px;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      align-items: center;
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .track-item:hover {
      background: var(--surface-glass);
    }

    .track-item.playing {
      background: var(--surface-glass-hover);
    }

    .col-num {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: var(--text-sm);
    }

    .track-number {
      display: block;
    }

    .play-btn-small {
      display: none;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-primary);
    }

    .play-btn-small svg {
      width: 16px;
      height: 16px;
    }

    .track-item:hover .track-number,
    .track-item.playing .track-number {
      display: none;
    }

    .track-item:hover .play-btn-small,
    .track-item.playing .play-btn-small {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .col-title {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      min-width: 0;
    }

    .track-art {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      flex-shrink: 0;
    }

    .track-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }

    .track-name {
      font-size: var(--text-base);
      font-weight: 500;
      color: var(--text-primary);
    }

    .track-name.active {
      color: var(--aurora-purple);
    }

    .track-artist {
      font-size: var(--text-sm);
      color: var(--text-tertiary);
    }

    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .provider-badge {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .provider-badge.spotify {
      background: var(--spotify-green);
    }

    .provider-badge.youtube {
      background: var(--youtube-red);
    }

    .col-album {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    .col-date {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }

    .col-duration {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-3);
    }

    .like-btn,
    .more-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      opacity: 0;
      transition: all var(--transition-fast);
    }

    .track-item:hover .like-btn,
    .track-item:hover .more-btn {
      opacity: 1;
    }

    .like-btn:hover,
    .more-btn:hover {
      color: var(--text-primary);
      background: var(--surface-glass);
    }

    .like-btn svg,
    .more-btn svg {
      width: 16px;
      height: 16px;
    }

    .duration-text {
      color: var(--text-tertiary);
      font-size: var(--text-sm);
      min-width: 40px;
      text-align: right;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16) var(--space-6);
      text-align: center;
    }

    .empty-icon {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: var(--surface-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-6);
    }

    .empty-icon svg {
      width: 48px;
      height: 48px;
      color: var(--text-muted);
    }

    .empty-state h3 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .empty-state p {
      color: var(--text-tertiary);
      margin-bottom: var(--space-6);
    }

    .btn {
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-lg);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: var(--gradient-aurora);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .loading-spinner svg {
      width: 48px;
      height: 48px;
      color: var(--aurora-purple);
    }

    .loading-container p {
      margin-top: var(--space-4);
      color: var(--text-tertiary);
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 1023px) {
      .track-list-header,
      .track-item {
        grid-template-columns: 40px 1fr 100px;
      }

      .col-album,
      .col-date {
        display: none;
      }

      .playlist-image {
        width: 180px;
        height: 180px;
      }

      .playlist-name {
        font-size: var(--text-4xl);
      }
    }

    @media (max-width: 767px) {
      .playlist-header {
        padding: var(--space-6);
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .playlist-image {
        width: 140px;
        height: 140px;
      }

      .playlist-name {
        font-size: var(--text-3xl);
      }

      .track-list-header {
        display: none;
      }

      .track-item {
        grid-template-columns: 1fr auto;
        gap: var(--space-3);
      }

      .col-num {
        display: none;
      }

      .provider-badge {
        display: none;
      }
    }
  `]
})
export class PlaylistComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  playlist = signal<Playlist | null>(null);
  isLoading = signal(true);
  isLiked = signal(false);
  currentTrackId = signal<string | null>(null);
  isPlaying = signal(false);

  headerGradient = 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.3), transparent)';

  ngOnInit(): void {
    const playlistId = this.route.snapshot.params['id'];
    if (playlistId) {
      this.loadPlaylist(playlistId);
    }
  }

  private loadPlaylist(id: string): void {
    this.isLoading.set(true);

    // TODO: Load from API
    setTimeout(() => {
      // Mock empty playlist for now
      this.playlist.set({
        id,
        name: 'My Playlist',
        description: '',
        imageUrl: '',
        owner: 'You',
        trackCount: 0,
        totalDuration: 0,
        isPublic: false,
        provider: 'local',
        tracks: []
      });
      this.isLoading.set(false);
    }, 500);
  }

  playAll(): void {
    const tracks = this.playlist()?.tracks;
    if (tracks && tracks.length > 0) {
      this.playTrack(tracks[0]);
    }
  }

  shufflePlay(): void {
    const tracks = [...(this.playlist()?.tracks || [])];
    if (tracks.length > 0) {
      for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      }
      this.playTrack(tracks[0]);
    }
  }

  toggleLike(): void {
    this.isLiked.update(v => !v);
  }

  showMenu(): void {
    console.log('Show playlist menu');
  }

  playTrack(track: PlaylistTrack): void {
    this.currentTrackId.set(track.id);
    this.isPlaying.set(true);
    console.log('Playing:', track.title);
  }

  likeTrack(track: PlaylistTrack, event: Event): void {
    event.stopPropagation();
    console.log('Like track:', track.title);
  }

  showTrackMenu(track: PlaylistTrack, event: Event): void {
    event.stopPropagation();
    console.log('Show menu for:', track.title);
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatTotalDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

```


## User

continue
