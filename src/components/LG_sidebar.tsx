import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";

const Sidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string>("home");

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Handle mouse movement over glass elements
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sidebar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update filter turbulence based on mouse position
      const filter = sidebar.querySelector("feDisplacementMap");
      if (filter) {
        const scaleX = (x / rect.width) * 100;
        const scaleY = (y / rect.height) * 100;
        filter.setAttribute("scale", Math.min(scaleX, scaleY).toString());
      }

      // Add highlight effect
      const specular = specularRef.current;
      if (specular) {
        specular.style.background = `radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255,255,255,0.15) 0%,
          rgba(255,255,255,0.05) 30%,
          rgba(255,255,255,0) 60%
        )`;
      }
    };

    // Reset effects when mouse leaves
    const handleMouseLeave = () => {
      const filter = sidebar.querySelector("feDisplacementMap");
      if (filter) {
        filter.setAttribute("scale", "77");
      }

      const specular = specularRef.current;
      if (specular) {
        specular.style.background = "none";
      }
    };

    // Add event listeners
    sidebar.addEventListener("mousemove", handleMouseMove);
    sidebar.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      sidebar.removeEventListener("mousemove", handleMouseMove);
      sidebar.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Handle nav item click
  const handleNavItemClick = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveItem(itemId);
  };

  return (
    <>
      {/* SVG Filter for Glass Distortion */}
      <svg className="hidden">
        <filter id="glass-distortion">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008"
            numOctaves={2}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div
        ref={sidebarRef}
        className="glass-sidebar relative w-[220px] h-full rounded-r-[20px] overflow-hidden shadow-glass "
      >
        {/* Glass Filter Layer */}
        <div className="glass-filter absolute inset-0 rounded-r-[20px] z-10 backdrop-blur-glass saturate-[120%] brightness-[115%] [filter:url(#glass-distortion)]" />

        {/* Glass Overlay Layer */}
        <div className="glass-overlay absolute inset-0 rounded-r-[20px] z-20 bg-glass-bg dark:bg-glass-dark-bg" />

        {/* Glass Specular Layer */}
        <div
          ref={specularRef}
          className="glass-specular absolute inset-0 rounded-r-[20px] z-30 shadow-glass-inset"
        />

        {/* Content Layer */}
        <div className="glass-content relative z-40 text-white h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="sidebar-header p-5 border-b border-glass-border">
            <h3 className="m-0 text-2xl font-semibold">Menu</h3>
          </div>

          {/* Sidebar Navigation */}
          <nav className="sidebar-nav py-5 flex-1">
            <a
              href="#"
              onClick={(e) => handleNavItemClick("home", e)}
              className={`nav-item flex items-center px-5 py-3 text-white no-underline transition-all duration-[400ms] cubic-bezier-[0.4,0,0.2,1] gap-3 hover:bg-glass-overlay ${
                activeItem === "home" ? "bg-glass-overlay" : ""
              }`}
            >
              <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
              <span className="text-base opacity-90">Home</span>
            </a>

            <a
              href="#"
              onClick={(e) => handleNavItemClick("profile", e)}
              className={`nav-item flex items-center px-5 py-3 text-white no-underline transition-all duration-[400ms] cubic-bezier-[0.4,0,0.2,1] gap-3 hover:bg-glass-overlay ${
                activeItem === "profile" ? "bg-glass-overlay" : ""
              }`}
            >
              <img src={assets.plus_icon} alt="plus" className="w-6 h-6" />
              <span className="text-base opacity-90">Profile</span>
            </a>

            <a
              href="#"
              onClick={(e) => handleNavItemClick("settings", e)}
              className={`nav-item flex items-center px-5 py-3 text-white no-underline transition-all duration-[400ms] cubic-bezier-[0.4,0,0.2,1] gap-3 hover:bg-glass-overlay ${
                activeItem === "settings" ? "bg-glass-overlay" : ""
              }`}
            >
              <img
                src={assets.message_icon}
                alt="message"
                className="w-6 h-6"
              />
              <span className="text-base opacity-90">Messages</span>
            </a>

            <a
              href="#"
              onClick={(e) => handleNavItemClick("analytics", e)}
              className={`nav-item flex items-center px-5 py-3 text-white no-underline transition-all duration-[400ms] cubic-bezier-[0.4,0,0.2,1] gap-3 hover:bg-glass-overlay ${
                activeItem === "analytics" ? "bg-glass-overlay" : ""
              }`}
            >
              <img
                src={assets.question_icon}
                alt="analytics"
                className="w-6 h-6"
              />
              <span className="text-base opacity-90">Analytics</span>
            </a>

            <a
              href="#"
              onClick={(e) => handleNavItemClick("messages", e)}
              className={`nav-item flex items-center px-5 py-3 text-white no-underline transition-all duration-[400ms] cubic-bezier-[0.4,0,0.2,1] gap-3 hover:bg-glass-overlay ${
                activeItem === "messages" ? "bg-glass-overlay" : ""
              }`}
            >
              <img
                src={assets.setting_icon}
                alt="settings"
                className="w-6 h-6"
              />
              <span className="text-base opacity-90">Settings</span>
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
