/* ============================================================
   ZAMSURECO II — Admin Theme
   ------------------------------------------------------------
   One file for the colors, fonts, and shapes of every admin page.
   Change a value here and the whole admin site follows.

   COLOR SOURCE
   The palette is taken from the official ZAMSURECO II logo:
     - Logo yellow (gear)        -> sampled ≈ #F0E400
     - Logo blue (text & center) -> sampled ≈ #0000F0
   The logo blue is very bright for large surfaces, so the darker
   shades below keep the same blue hue but are deepened for the
   sidebar, buttons, and text (easier to read, less eye strain).

   HOW TO USE (in every admin page, inside <head>):
     <script src="https://cdn.tailwindcss.com"></script>
     <script src="theme.js"></script>
   ============================================================ */

(function () {
  // ---------------------------------------------------------------
  // 1. Brand palette
  // ---------------------------------------------------------------
  const brand = {                 // Logo blue, from light to deep
    50:  '#F3F5FD',
    100: '#E2E6FA',
    200: '#C3CBF4',
    300: '#94A2EA',
    400: '#5F73DE',
    500: '#3A50E0',
    600: '#2438C4',
    700: '#1A2B9E',               // Primary buttons, links
    800: '#111F78',
    900: '#0B1555',               // Sidebar
    950: '#070E3A',
  };

  const gold = {                  // Logo yellow
    50:  '#FFFBE6',
    100: '#FFF6BF',
    200: '#FFEE85',
    300: '#FBE64A',
    400: '#F7E21A',               // Logo yellow: highlights on dark (sidebar)
    500: '#EBCB00',               // Bars, badges, borders on light
    600: '#C9A800',
    700: '#7A6400',               // Yellow-family TEXT on white (readable)
    800: '#5C4B00',
  };

  const neutral = {               // Cool gray with a hint of the logo blue
    50:  '#F5F6FA',               // Page background
    100: '#ECEFF6',
    200: '#DFE3EE',               // Lines and borders
    300: '#C8CEDD',
    400: '#98A1B8',
    500: '#6B7490',
    600: '#4A5372',               // Muted text
    700: '#353D5C',
    800: '#232A47',
    900: '#141B3D',               // Main text
  };

  // Status colors (meaning, not brand)
  const ok     = { 100: '#E1EFE6', 600: '#2E7D4F' };
  const danger = { 100: '#F8E1DF', 600: '#B3261E' };
  const info   = { 100: brand[100], 600: brand[700] };

  // ---------------------------------------------------------------
  // 2. Tailwind configuration
  //    Older color names used in the pages (navy, ink, paper, copper,
  //    amber, slate, gray) are mapped to the brand palette so every
  //    page shares the same look without rewriting all its classes.
  // ---------------------------------------------------------------
  window.tailwind = window.tailwind || {};
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand, gold, neutral, ok, danger, info,

          // Legacy names -> brand palette
          navy:   { 900: brand[900], 800: brand[800], 700: brand[700] },
          ink:    { 900: neutral[900], 800: brand[800], 700: neutral[600] },
          paper:  { 50: neutral[50], 100: neutral[100] },
          line:   neutral[200],
          // amber-500 is used as TEXT on light backgrounds, so it uses the
          // readable dark gold; plain "amber" (bars, borders) uses logo yellow.
          amber:  { DEFAULT: gold[500], deep: gold[700], 100: gold[100], 500: gold[700] },
          copper: { 100: gold[100], 500: gold[700] },
          slate:  neutral,
          gray:   neutral,
        },
        fontFamily: {
          sans:    ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
          body:    ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
          display: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
          mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        },
        borderRadius: {
          DEFAULT: '6px',
          md: '6px',
          lg: '8px',
          xl: '10px',
          '2xl': '12px',
        },
      },
    },
  };

  // Expose the palette for page scripts (maps, charts, status colors)
  window.ZTheme = { brand, gold, neutral, ok, danger, info };

  // ---------------------------------------------------------------
  // 3. Fonts
  // ---------------------------------------------------------------
  if (!document.querySelector('link[data-ztheme-font]')) {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    font.setAttribute('data-ztheme-font', '');
    document.head.appendChild(font);
  }

  // ---------------------------------------------------------------
  // 4. Shared CSS (variables + base styles used by every page)
  // ---------------------------------------------------------------
  const css = `
    :root {
      --brand-50:${brand[50]}; --brand-100:${brand[100]}; --brand-700:${brand[700]};
      --brand-800:${brand[800]}; --brand-900:${brand[900]};
      --gold-50:${gold[50]}; --gold-100:${gold[100]}; --gold-400:${gold[400]};
      --gold-500:${gold[500]}; --gold-600:${gold[600]}; --gold-700:${gold[700]};
      --bg:${neutral[50]}; --surface:#FFFFFF; --line:${neutral[200]};
      --text:${neutral[900]}; --muted:${neutral[600]};
      --ok:${ok[600]}; --ok-bg:${ok[100]}; --danger:${danger[600]}; --danger-bg:${danger[100]};
    }
    body {
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    .num, .ticket-id {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-variant-numeric: tabular-nums;
    }
    /* Section title marker: logo yellow */
    .section-head { border-left: 3px solid var(--gold-500); padding-left: 12px; }
    /* Focus ring in brand blue */
    input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible {
      outline: 2px solid var(--brand-700);
      outline-offset: 1px;
    }
  `;
  const style = document.createElement('style');
  style.setAttribute('data-ztheme', '');
  style.textContent = css;
  document.head.appendChild(style);
})();
