import { Tooltip } from "react-tooltip";
import { dockApps } from "#constants";
import { gsap } from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window.js";

const Dock = () => {

  const { openWindow, closeWindow, windows } = useWindowStore();

  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");

    const animateIcon = (mouseX) => {
      const { left } = dock.getBoundingClientRect();
      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5) / 2000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animateIcon(e.clientX - left);
    };
    const handleMouseLeave = () => {
      icons.forEach((icon) => {
        gsap.to(icon, { scale: 1, y: 0, duration: 0.3, ease: "power1.out" });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const toogleApp = (app) => {
      if (!app.canOpen) return;

      const window = windows[app.id];

      if(!window) {
        console.error(`Window configuration for "${app.id}" not found.`);
        return;
      };

      if (window.isOpen) {
        closeWindow(app.id);
      } else {
        openWindow(app.id);
      }
  };

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map((app, index) => (
          <div key={app.id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={app.name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={app.name}
              data-tooltip-delay-show={150}
              disabled={!app.canOpen}
              onClick={() => toogleApp({ id: app.id, canOpen: app.canOpen })}
            >
              <img
                src={`/images/${app.icon}`}
                alt={app.name}
                loading="lazy"
                className={app.canOpen ? "" : "opacity-60"}
              />
            </button>
          </div>
        ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
