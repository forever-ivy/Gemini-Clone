import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import type { ChatMessage } from "./chatmessage";

interface VirtualListDynamicProps {
  data: ChatMessage[];
  estimatedHeight?: number;
  containerHeight?: number;
  overscan?: number;
  renderItem?: (item: ChatMessage, index: number) => React.ReactNode;
}

const VirtualListDynamic = ({
  data = [],
  estimatedHeight = 120,
  containerHeight,
  overscan = 3,
  renderItem,
}: VirtualListDynamicProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const heightMap = useRef(
    new Map<number, { height: number; offsetTop: number }>()
  );

  const [scrollTop, setScrollTop] = useState(0);

  const { offsetMap, totalHeight } = useMemo(() => {
    let offset = 0;
    const map = new Map();
    for (let i = 0; i < data.length; i++) {
      const height = heightMap.current.get(i)?.height ?? estimatedHeight;
      map.set(i, { height, offsetTop: offset });
      offset += height;
    }
    return { offsetMap: map, totalHeight: offset };
  }, [data, estimatedHeight, scrollTop]);

  const getStartIndex = useCallback(() => {
    let i = 0;
    while (i < data.length) {
      const item = offsetMap.get(i);
      if (!item) break;
      const { offsetTop, height } = item;
      if (offsetTop + height > scrollTop) break;
      i++;
    }
    return Math.max(0, i);
  }, [data, offsetMap, scrollTop]);

  const startIndex = getStartIndex();
  const endIndex = Math.min(data.length, startIndex + overscan + 20);

  const topPadding = offsetMap.get(startIndex)?.offsetTop ?? 0;
  const bottomPadding =
    totalHeight - (offsetMap.get(endIndex)?.offsetTop ?? totalHeight);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    const updated = new Map(heightMap.current);
    let changed = false;

    for (let i = startIndex; i < endIndex; i++) {
      const element = itemRefs.current[i];
      if (element) {
        const height = element.getBoundingClientRect().height;
        if (!updated.has(i) || updated.get(i)?.height !== height) {
          updated.set(i, {
            height,
            offsetTop: 0,
          });
          changed = true;
        }
      }
    }

    if (changed) {
      heightMap.current = updated;
      setScrollTop((prev) => prev! + 0.001);
    }
  }, [startIndex, endIndex]);

  const FADE = 90;

  return (
    <div
      ref={containerRef}
      style={{
        width: 800,
        height: containerHeight ?? "100%",
        overflowY: "auto",
        WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,1) ${FADE}px, rgba(0,0,0,1) calc(100% - ${FADE}px), rgba(0,0,0,0) 100%)`,
      }}
      onScroll={onScroll}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            paddingTop: topPadding + 40,
            paddingBottom: bottomPadding + 40,
            paddingRight: 0,
          }}
        >
          {data.slice(startIndex, endIndex).map((item, i) => {
            const index = startIndex + i;
            return (
              <div
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                className="mb-1"
              >
                {renderItem?.(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualListDynamic;
