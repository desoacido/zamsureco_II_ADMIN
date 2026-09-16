/* ============================================================
   ZAMSURECO II — Persistent Collapsible Sidebar Controller
   ============================================================ */

(function () {
  // 1. Agad na i-check ang localStorage bago mag-render para walang layout flicker
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) {
    document.documentElement.classList.add('sidebar-collapsed');
  }

  const NAV_ITEMS = [
    {
      href: "admin_dashboard.html",
      label: "Dashboard Overview",
      icon: '<path d="M3 11l18-5v12L3 13v-2z"/><path d="M11 13v6a2 2 0 002 2h1"/>',
    },
    {
      href: "admin_announcements.html",
      label: "Announcements",
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
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
  ];

  const currentPage = window.location.pathname.split("/").pop() || "admin_dashboard.html";

  const navHtml = NAV_ITEMS.map((item) => {
    const isActive = item.href === currentPage;
    return `
      <a href="${item.href}" class="nav-link${isActive ? " active" : ""}" title="${item.label}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg>
        <span class="nav-label">${item.label}</span>
      </a>`;
  }).join("");

  const sidebarHtml = `
    <aside class="sidebar" id="appSidebar" aria-label="Navigation menu">
      <div class="brand">
        <svg class="brand-mark" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="#F2A93B" stroke-width="1.4" opacity="0.5"/>
          <path d="M22 4 L10 22 H18 L16 36 L30 16 H21 L22 4Z" fill="#F2A93B"/>
        </svg>
        <div class="brand-text">
          <div class="brand-title">ZAMSURECO II</div>
          <div class="brand-sub">Grid Control Panel</div>
        </div>
      </div>

      <div class="nav-group-label">Operations</div>
      <div class="nav-items-container">
        ${navHtml}
      </div>

      <!-- Sign Out / Logout Button -->
      <div class="mt-auto pt-4" style="margin-top: auto; padding-top: 16px;">
        <a href="logout.php" id="logoutBtn" class="logout-btn" title="Sign Out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span class="nav-label">Sign Out</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <div class="grid-pulse">
          <span class="pulse-dot"></span> 
          <span class="footer-text">System operational</span>
        </div>
        <span class="footer-text">Zamboanga del Sur II<br>Electric Cooperative</span>
      </div>
    </aside>`;

  const hamburgerHtml = `
    <button class="hamburger-btn" id="sidebarToggle" aria-label="Toggle navigation menu">
      <span class="bar bar1"></span>
      <span class="bar bar2"></span>
      <span class="bar bar3"></span>
    </button>`;

  // ---- CSS Styles para sa Persistent Layout at Push-Content ----
  const styleTag = document.createElement("style");
  styleTag.id = "sidebar-shared-styles";
  styleTag.textContent = `
    :root {
      --sidebar-width-expanded: 272px;
      --sidebar-width-collapsed: 72px;
      --navy-900: #081D45;
      --navy-800: #0D2E63;
      --amber: #F2A93B;
      --green: #1E9E64;
      --transition-speed: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Page Layout Container */
    body {
      display: flex;
      min-height: 100vh;
      overflow-x: hidden;
      margin: 0;
    }

    /* Sidebar Base Style */
    .sidebar {
      width: var(--sidebar-width-expanded);
      background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-800) 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      padding: 20px 14px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100vh;
      z-index: 200;
      transition: width var(--transition-speed);
      box-shadow: 4px 0 20px rgba(8, 15, 35, 0.15);
      overflow-x: hidden;
      overflow-y: auto;
    }

    /* Main Content Layout - Kusang umaadjust ang margin-left depende sa sidebar */
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width-expanded);
      min-width: 0;
      padding: 32px;
      transition: margin-left var(--transition-speed);
      background: var(--bg, #EEF1F6);
      min-height: 100vh;
    }

    /* Kapag naka-collapse ang sidebar */
    html.sidebar-collapsed .sidebar {
      width: var(--sidebar-width-collapsed);
      padding: 20px 10px;
    }
    html.sidebar-collapsed .main-content {
      margin-left: var(--sidebar-width-collapsed);
    }

    /* Itago ang mga text labels kapag naka-collapse */
    html.sidebar-collapsed .sidebar .brand-text,
    html.sidebar-collapsed .sidebar .nav-label,
    html.sidebar-collapsed .sidebar .nav-group-label,
    html.sidebar-collapsed .sidebar .sidebar-footer {
      display: none !important;
    }

    html.sidebar-collapsed .sidebar .brand {
      justify-content: center;
      padding: 10px 0 20px 0;
    }
    html.sidebar-collapsed .sidebar .nav-link,
    html.sidebar-collapsed .sidebar .logout-btn {
      justify-content: center;
      padding: 12px 0;
    }

    /* Hamburger Button Style sa loob ng Dashboard */
    .hamburger-btn {
      background: var(--card, #FFFFFF);
      border: 1px solid var(--border, #E2E6ED);
      border-radius: 10px;
      width: 42px;
      height: 42px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(16,24,50,0.04);
      transition: background 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }
    .hamburger-btn:hover {
      background: #f8fafc;
      border-color: var(--amber);
    }
    .hamburger-btn .bar {
      display: block;
      width: 18px;
      height: 2px;
      background: var(--navy-900);
      border-radius: 2px;
    }

    /* Brand / Logo Design */
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 8px 20px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;
    }
    .brand-mark { width: 36px; height: 36px; flex-shrink: 0; }
    .brand-text .brand-title {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 15px;
      line-height: 1.2;
    }
    .brand-text .brand-sub {
      font-size: 9.5px;
      color: var(--amber);
      letter-spacing: 1.2px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 3px;
    }

    /* Nav Links */
    .nav-group-label {
      font-size: 9.5px;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
      padding: 10px 8px 6px;
      font-weight: 600;
    }
    .nav-items-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-link, .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255, 255, 255, 0.78);
      text-decoration: none;
      padding: 11px 12px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-link svg, .logout-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      opacity: 0.8;
    }
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    .nav-link:hover svg { opacity: 1; }
    .nav-link.active {
      background: rgba(242, 169, 59, 0.15);
      color: #fff;
      font-weight: 600;
      border-left: 3px solid var(--amber);
    }
    .nav-link.active svg { opacity: 1; color: var(--amber); }

    /* Logout button style */
    .logout-btn {
      background: rgba(220, 53, 69, 0.12);
      border: 1px solid rgba(220, 53, 69, 0.25);
      color: #fca5a5;
      width: 100%;
      cursor: pointer;
    }
    .logout-btn:hover {
      background: rgba(220, 53, 69, 0.25);
      color: #fff;
    }

    /* Footer Info */
    .sidebar-footer {
      margin-top: 16px;
      padding: 12px 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.4;
    }
    .grid-pulse {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 6px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--green);
      flex-shrink: 0;
    }

    /* Mobile Responsive Support */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease, width 0.3s ease;
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

    // 3. Hanapin ang topbar para awtomatikong isingit ang hamburger button sa tabi ng page title kung gusto mo, 
    // o hayaan ang user na ilagay ito sa topbar. Ilalagay natin ito sa simula ng topbar kung available.
    const topbar = document.querySelector('.topbar');
    if (topbar && !document.getElementById('sidebarToggle')) {
      topbar.insertAdjacentHTML('afterbegin', hamburgerHtml);
    }

    // 4. Toggle Event Handler gamit ang localStorage persistence
    const toggleBtn = document.getElementById("sidebarToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          document.documentElement.classList.toggle("sidebar-open-mobile");
        } else {
          document.documentElement.classList.toggle("sidebar-collapsed");
          const collapsed = document.documentElement.classList.contains("sidebar-collapsed");
          localStorage.setItem("sidebar_collapsed", collapsed);
        }
      });
    }
  });
})();