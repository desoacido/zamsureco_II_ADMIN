/* ============================================================
   ZAMSURECO II — Persistent Collapsible Sidebar Controller
   ============================================================ */

(function () {
  // 1. I-check agad ang localStorage bago mag-render para walang layout flicker
  let isCollapsed = false;
  try { isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true'; } catch (e) {}
  if (isCollapsed) {
    document.documentElement.classList.add('sidebar-collapsed');
  }

  const NAV_ITEMS = [
    {
      href: "admin_dashboard.html",
      label: "Dashboard",
      icon: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    },
    {
      href: "admin_announcements.html",
      label: "Announcements",
      icon: '<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11 13v6a2 2 0 002 2h1"/>',
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
      href: "admin_inquiries.html",
      label: "Service Inquiries",
      icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    },
    {
      href: "admin_billing_upload.html",
      label: "Billing Statements",
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h2"/><path d="M8 17h5"/>',
    },
  ];

  const currentPage = window.location.pathname.split("/").pop() || "admin_dashboard.html";

  const navHtml = NAV_ITEMS.map((item, i) => {
    const isActive = item.href === currentPage;
    const num = String(i + 1).padStart(2, "0");
    return `
      <a href="${item.href}" class="nav-link${isActive ? " active" : ""}" title="${item.label}"${isActive ? ' aria-current="page"' : ""}>
        <span class="nav-tick"></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
        <span class="nav-label">${item.label}</span>
      </a>`;
  }).join("");

  const sidebarHtml = `
    <aside class="sidebar" id="appSidebar" aria-label="Navigation menu">
      <div class="brand">
        <svg class="brand-mark" viewBox="0 0 40 40" fill="none">
          <path d="M22 4 L10 22 H18 L16 36 L30 16 H21 L22 4Z" fill="#F2A93B"/>
        </svg>
        <div class="brand-text">
          <div class="brand-title">ZAMSURECO II</div>
          <div class="brand-sub">Admin Panel</div>
        </div>
      </div>

      <div class="nav-items-container">
        ${navHtml}
      </div>

      <div class="sidebar-bottom">
        <a href="admin_login.html" id="logoutBtn" class="logout-btn" title="Sign Out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <path d="M16 17l5-5-5-5"/>
            <path d="M21 12H9"/>
          </svg>
          <span class="nav-label">Sign Out</span>
        </a>
        <div class="sidebar-footer">Zamboanga del Sur II Electric Cooperative</div>
      </div>
    </aside>`;

  const hamburgerHtml = `
    <button class="hamburger-btn" id="sidebarToggle" aria-label="Toggle navigation menu">
      <span class="bar bar1"></span>
      <span class="bar bar2"></span>
      <span class="bar bar3"></span>
    </button>`;

  // ---- CSS: navy + amber, with an active-item edge marker instead of a generic tinted pill ----
  const styleTag = document.createElement("style");
  styleTag.id = "sidebar-shared-styles";
  styleTag.textContent = `
    :root {
      --sidebar-width-expanded: 256px;
      --sidebar-width-collapsed: 68px;
      --navy-900: #081D45;
      --navy-800: #0D2E63;
      --amber: #F2A93B;
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
      background: var(--navy-900);
      color: #fff;
      font-family: 'Inter', system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      padding: 18px 10px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100vh;
      z-index: 200;
      border-right: 1px solid rgba(242, 169, 59, 0.15);
      transition: width var(--transition-speed);
      overflow-x: hidden;
      overflow-y: auto;
    }

    /* Main content */
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width-expanded);
      min-width: 0;
      padding: 32px;
      transition: margin-left var(--transition-speed);
      background: var(--bg, #F8FAFC);
      min-height: 100vh;
    }

    /* Collapsed */
    html.sidebar-collapsed .sidebar {
      width: var(--sidebar-width-collapsed);
      padding: 18px 6px;
    }
    html.sidebar-collapsed .main-content {
      margin-left: var(--sidebar-width-collapsed);
    }
    html.sidebar-collapsed .sidebar .brand-text,
    html.sidebar-collapsed .sidebar .nav-label,
    html.sidebar-collapsed .sidebar .sidebar-footer {
      display: none !important;
    }
    html.sidebar-collapsed .sidebar .brand {
      justify-content: center;
      padding: 6px 0 16px 0;
    }
    html.sidebar-collapsed .sidebar .nav-link,
    html.sidebar-collapsed .sidebar .logout-btn {
      justify-content: center;
      padding: 11px 0;
    }
    html.sidebar-collapsed .sidebar .nav-tick { left: 0; }

    /* Hamburger */
    .hamburger-btn {
      background: #fff;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      width: 36px;
      height: 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .hamburger-btn:hover { background: #F1F5F9; }
    .hamburger-btn .bar {
      display: block;
      width: 16px;
      height: 2px;
      background: #475569;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 10px 20px 10px;
      margin-bottom: 12px;
      position: relative;
    }
    .brand::after {
      content: "";
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--amber) 0 28px, rgba(255,255,255,0.08) 28px 100%);
    }
    .brand-mark { width: 28px; height: 28px; flex-shrink: 0; }
    .brand-text .brand-title {
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.3px;
      line-height: 1.2;
    }
    .brand-text .brand-sub {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 400;
      margin-top: 2px;
    }

    /* Nav */
    .nav-items-container {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .nav-link, .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255, 255, 255, 0.68);
      text-decoration: none;
      padding: 10px 10px 10px 14px;
      margin-left: -10px;
      margin-right: -10px;
      padding-left: 24px;
      font-size: 13.5px;
      font-weight: 500;
      position: relative;
      transition: color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .nav-tick {
      position: absolute;
      left: 0;
      top: 4px;
      bottom: 4px;
      width: 5px;
      border-radius: 0 3px 3px 0;
      background: transparent;
      transition: background 0.15s;
    }
    .nav-link svg, .logout-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .nav-link:hover {
      color: #fff;
    }
    .nav-link:hover .nav-tick {
      background: rgba(242, 169, 59, 0.4);
    }
    .nav-link.active {
      color: #fff;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.04);
    }
    .nav-link.active .nav-tick {
      background: var(--amber);
    }

    /* Bottom: sign out + footer */
    .sidebar-bottom {
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .logout-btn {
      width: 100%;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.55);
    }
    .logout-btn:hover {
      color: #fff;
    }
    .sidebar-footer {
      padding: 10px 10px 4px 14px;
      font-size: 10.5px;
      color: rgba(255, 255, 255, 0.32);
      line-height: 1.4;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.25s ease, width 0.25s ease;
      }
      html.sidebar-open-mobile .sidebar {
        transform: translateX(0);
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

    // 5. Sentralisadong Logout Handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Ang "const _supabase" sa page dili makita sa window._supabase,
        // mao nga gi-check nato ang global nga variable direkta.
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
