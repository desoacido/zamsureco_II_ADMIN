/* ============================================================
   ZAMSURECO II — Persistent Collapsible Sidebar Controller
   ------------------------------------------------------------
   Colors are taken from the official ZAMSURECO II logo:
     - Logo blue (text & center): deepened to #0B1555 for the sidebar
     - Logo yellow (gear): #F7E21A for the active item and accents
   The same values are in theme.js, so the sidebar and the pages match.
   ============================================================ */

(function () {
  // 1. I-check agad ang localStorage bago mag-render para walang layout flicker
  let isCollapsed = false;
  try { isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true'; } catch (e) {}
  if (isCollapsed) {
    document.documentElement.classList.add('sidebar-collapsed');
  }

  // Load the shared font once (pages that already load it are not affected)
  if (!document.querySelector('link[data-ztheme-font]')) {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
    font.setAttribute('data-ztheme-font', '');
    document.head.appendChild(font);
  }

  // Menu, grouped so related pages sit together
  const NAV_GROUPS = [
    {
      title: null,
      items: [
        {
          href: "admin_dashboard.html",
          label: "Dashboard",
          icon: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
        },
      ],
    },
    {
      title: "Grid & Service",
      items: [
        {
          href: "admin_poles.html",
          label: "Grid & Poles",
          icon: '<path d="M12 2v20"/><path d="M5 6h14"/><path d="M7 10h10"/><circle cx="5" cy="6" r="1.5"/><circle cx="19" cy="6" r="1.5"/>',
        },
        {
          href: "admin_application.html",
          label: "Applications",
          icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
        },
        {
          href: "admin_incidents.html",
          label: "Incident Reports",
          icon: '<path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z"/>',
        },
        {
          href: "manage_linemen.html",
          label: "Manage Linemen",
          icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/>',
        },
      ],
    },
    {
      title: "Members",
      items: [
        {
          href: "admin_announcements.html",
          label: "Announcements",
          icon: '<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11 13v6a2 2 0 002 2h1"/>',
        },
        {
          href: "admin_billing_upload.html",
          label: "Billing Statements",
          icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h2"/><path d="M8 17h5"/>',
        },
        {
          href: "admin_inquiries.html",
          label: "Service Inquiries",
          icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        },
      ],
    },
  ];

  const currentPage = window.location.pathname.split("/").pop() || "admin_dashboard.html";

  const navHtml = NAV_GROUPS.map(group => {
    const links = group.items.map(item => {
      const isActive = item.href === currentPage;
      return `
        <a href="${item.href}" class="nav-link${isActive ? " active" : ""}" title="${item.label}"${isActive ? ' aria-current="page"' : ""}>
          <span class="nav-tick"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
          <span class="nav-label">${item.label}</span>
        </a>`;
    }).join("");
    const heading = group.title ? `<div class="nav-group-title">${group.title}</div>` : "";
    return `<div class="nav-group">${heading}${links}</div>`;
  }).join("");

  const sidebarHtml = `
    <aside class="sidebar" id="appSidebar" aria-label="Navigation menu">
      <div class="brand">
        <div class="brand-badge">
          <svg class="brand-mark" viewBox="0 0 40 40" fill="none">
            <path d="M22 4 L10 22 H18 L16 36 L30 16 H21 L22 4Z" fill="#F7E21A"/>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-title">ZAMSURECO II</div>
          <div class="brand-sub">Admin Panel</div>
        </div>
      </div>

      <nav class="nav-items-container">
        ${navHtml}
      </nav>

      <div class="sidebar-bottom">
        <a href="admin_login.html" id="logoutBtn" class="logout-btn" title="Sign Out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <path d="M16 17l5-5-5-5"/>
            <path d="M21 12H9"/>
          </svg>
          <span class="nav-label">Sign Out</span>
        </a>
        <div class="sidebar-footer">Zamboanga del Sur II Electric Cooperative, Inc.</div>
      </div>
    </aside>
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>`;

  const hamburgerHtml = `
    <button class="hamburger-btn" id="sidebarToggle" aria-label="Toggle navigation menu">
      <span class="bar bar1"></span>
      <span class="bar bar2"></span>
      <span class="bar bar3"></span>
    </button>`;

  // ---- CSS: logo blue sidebar + logo yellow accents ----
  const styleTag = document.createElement("style");
  styleTag.id = "sidebar-shared-styles";
  styleTag.textContent = `
    :root {
      --sidebar-width-expanded: 256px;
      --sidebar-width-collapsed: 68px;
      --sb-bg: #0B1555;            /* logo blue, deepened */
      --sb-bg-deep: #070E3A;
      --sb-hover: rgba(255, 255, 255, 0.06);
      --sb-active: rgba(247, 226, 26, 0.10);
      --sb-text: rgba(255, 255, 255, 0.72);
      --sb-muted: rgba(255, 255, 255, 0.40);
      --sb-yellow: #F7E21A;        /* logo yellow */
      --page-bg: #F5F6FA;
      --transition-speed: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
      display: flex;
      min-height: 100vh;
      overflow-x: hidden;
      margin: 0;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width-expanded);
      background: linear-gradient(180deg, var(--sb-bg) 0%, var(--sb-bg-deep) 100%);
      color: #fff;
      font-family: 'IBM Plex Sans', system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      padding: 18px 12px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100vh;
      z-index: 200;
      box-shadow: 1px 0 0 rgba(247, 226, 26, 0.12);
      transition: width var(--transition-speed), transform var(--transition-speed);
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
    }

    /* Main content */
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width-expanded);
      min-width: 0;
      padding: 32px;
      transition: margin-left var(--transition-speed);
      background: var(--page-bg);
      min-height: 100vh;
    }

    /* Collapsed */
    html.sidebar-collapsed .sidebar {
      width: var(--sidebar-width-collapsed);
      padding: 18px 8px;
    }
    html.sidebar-collapsed .main-content {
      margin-left: var(--sidebar-width-collapsed);
    }
    html.sidebar-collapsed .sidebar .brand-text,
    html.sidebar-collapsed .sidebar .nav-label,
    html.sidebar-collapsed .sidebar .nav-group-title,
    html.sidebar-collapsed .sidebar .sidebar-footer {
      display: none !important;
    }
    html.sidebar-collapsed .sidebar .brand {
      justify-content: center;
      padding: 4px 0 16px 0;
    }
    html.sidebar-collapsed .sidebar .brand::after { left: 14px; right: 14px; }
    html.sidebar-collapsed .sidebar .nav-group { margin-top: 10px; }
    html.sidebar-collapsed .sidebar .nav-link,
    html.sidebar-collapsed .sidebar .logout-btn {
      justify-content: center;
      padding: 11px 0;
    }

    /* Hamburger */
    .hamburger-btn {
      background: #fff;
      border: 1px solid #DFE3EE;
      border-radius: 6px;
      width: 38px;
      height: 38px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      flex-shrink: 0;
    }
    .hamburger-btn:hover { background: #F3F5FD; border-color: #C3CBF4; }
    .hamburger-btn .bar,
    .hamburger-btn span {
      display: block;
      width: 16px;
      height: 2px;
      background: #1A2B9E !important;
      border-radius: 2px;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 8px 18px 8px;
      margin-bottom: 6px;
      position: relative;
    }
    .brand::after {
      content: "";
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--sb-yellow) 0 32px, rgba(255,255,255,0.08) 32px 100%);
    }
    .brand-badge {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(247, 226, 26, 0.12);
      border: 1px solid rgba(247, 226, 26, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .brand-mark { width: 24px; height: 24px; }
    .brand-text .brand-title {
      font-weight: 700;
      font-size: 14.5px;
      letter-spacing: 0.4px;
      line-height: 1.2;
    }
    .brand-text .brand-sub {
      font-size: 11px;
      color: var(--sb-muted);
      font-weight: 500;
      margin-top: 2px;
      letter-spacing: 0.3px;
    }

    /* Nav */
    .nav-items-container {
      display: flex;
      flex-direction: column;
    }
    .nav-group { margin-top: 14px; display: flex; flex-direction: column; gap: 2px; }
    .nav-group-title {
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--sb-muted);
      padding: 0 12px 6px 12px;
    }
    .nav-link, .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--sb-text);
      text-decoration: none;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 500;
      position: relative;
      transition: color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .nav-tick {
      position: absolute;
      left: -12px;
      top: 6px;
      bottom: 6px;
      width: 4px;
      border-radius: 0 4px 4px 0;
      background: transparent;
      transition: background 0.15s;
    }
    html.sidebar-collapsed .nav-tick { left: -8px; }
    .nav-link svg, .logout-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .nav-link:hover {
      color: #fff;
      background: var(--sb-hover);
    }
    .nav-link.active {
      color: #fff;
      font-weight: 600;
      background: var(--sb-active);
    }
    .nav-link.active svg { color: var(--sb-yellow); }
    .nav-link.active .nav-tick {
      background: var(--sb-yellow);
    }

    /* Bottom: sign out + footer */
    .sidebar-bottom {
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .logout-btn {
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      color: var(--sb-muted);
    }
    .logout-btn:hover {
      color: #fff;
      background: rgba(179, 38, 30, 0.25);
    }
    .sidebar-footer {
      padding: 10px 12px 4px 12px;
      font-size: 10.5px;
      color: rgba(255, 255, 255, 0.32);
      line-height: 1.4;
    }

    /* Mobile */
    .sidebar-backdrop { display: none; }
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      html.sidebar-open-mobile .sidebar {
        transform: translateX(0);
      }
      html.sidebar-open-mobile .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(7, 14, 58, 0.45);
        z-index: 150;
      }
      .main-content {
        margin-left: 0 !important;
        padding: 16px;
      }
    }
  `;
  document.head.appendChild(styleTag);

  document.addEventListener("DOMContentLoaded", () => {
    // 2. I-inject ang sidebar sa root div
    const root = document.getElementById("sidebar-root");
    if (root) {
      root.outerHTML = sidebarHtml;
    } else {
      document.body.insertAdjacentHTML("afterbegin", sidebarHtml);
    }

    // 3. Isingit ang hamburger sa topbar kung wala pa
    const topbar = document.querySelector('.topbar');
    if (topbar && !document.getElementById('sidebarToggle')) {
      topbar.insertAdjacentHTML('afterbegin', hamburgerHtml);
    }

    // 4. Toggle handler + localStorage persistence
    const toggleBtn = document.getElementById("sidebarToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          document.documentElement.classList.toggle("sidebar-open-mobile");
        } else {
          document.documentElement.classList.toggle("sidebar-collapsed");
          const collapsed = document.documentElement.classList.contains("sidebar-collapsed");
          try { localStorage.setItem("sidebar_collapsed", collapsed); } catch (e) {}
        }
      });
    }

    // Close the mobile menu when tapping outside it
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        document.documentElement.classList.remove("sidebar-open-mobile");
      });
    }

    // 5. Sentralisadong Logout Handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        let client = window.supabaseClient || window._supabase || null;
        if (!client && typeof _supabase !== "undefined") client = _supabase;

        if (client && client.auth) {
          try {
            await client.auth.signOut();
          } catch (err) {
            console.error("Logout error:", err);
          }
        }

        window.location.href = "admin_login.html";
      });
    }
  });
})();
