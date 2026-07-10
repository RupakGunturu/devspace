import { useRef, useEffect } from "react";
import "./LineSidebar.css";

type LineSidebarItem = {
  label: string;
  slug: string;
  icon: string;
};

type LineSidebarProps = {
  items: LineSidebarItem[];
  activeIndex?: number | null;
  onItemClick?: (index: number, slug: string) => void;
  className?: string;
};

export function LineSidebar({ items, activeIndex, onItemClick, className = "" }: LineSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemEls = container.querySelectorAll<HTMLElement>(".line-sidebar-item");
    if (itemEls.length === 0) return;

    const onPointerMove = (e: PointerEvent) => {
      let minDist = Infinity;
      let minIdx = -1;
      itemEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(e.clientY - mid);
        if (dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
      });
      itemEls.forEach((el, i) => {
        const d = i === minIdx ? 1 : Math.max(0, 1 - Math.abs(i - minIdx) * 0.25);
        el.style.setProperty("--effect", String(d));
      });
    };

    container.addEventListener("pointermove", onPointerMove);
    return () => container.removeEventListener("pointermove", onPointerMove);
  }, [items.length]);

  return (
    <nav ref={containerRef} className={`line-sidebar ${className}`}>
      {items.map((item, i) => (
        <button
          key={item.slug}
          className={`line-sidebar-item ${i === activeIndex ? "active" : ""}`}
          onClick={() => onItemClick?.(i, item.slug)}
        >
          <span className="line-sidebar-index">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="line-sidebar-label">
            {item.icon} {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
