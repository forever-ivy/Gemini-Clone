import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import type { ChatMessage } from "../types/chat";

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
  // 为高度变化引入一个版本号，用来驱动 offsetMap/totalHeight 重算
  const [measureVersion, setMeasureVersion] = useState(0);

  // useMemo to avoid recalculating offsetMap and totalHeight on every render , only for variable
  const { offsetMap, totalHeight } = useMemo(() => {
    let offset = 0;
    const map = new Map();
    for (let i = 0; i < data.length; i++) {
      const height = heightMap.current.get(i)?.height ?? estimatedHeight; //only for null and undefined
      map.set(i, { height, offsetTop: offset });
      offset += height;
    }
    return { offsetMap: map, totalHeight: offset };
  }, [data, estimatedHeight, measureVersion]); // 关键：依赖 measureVersion，确保高度更新后重算

  //useCallback to avoid recalculating startIndex and endIndex on every render ,only for function
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
    const container = containerRef.current;
    if (!container) return;

    const updated = new Map(heightMap.current);
    let changed = false;

    // 记录当前的 topPadding，用于补偿计算
    const oldTopPadding = topPadding;

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

      // 立即重新计算新的 offsetMap
      let offset = 0;
      const newOffsetMap = new Map();
      for (let i = 0; i < data.length; i++) {
        const height = heightMap.current.get(i)?.height ?? estimatedHeight;
        newOffsetMap.set(i, { height, offsetTop: offset });
        offset += height;
      }

      // 计算新的 topPadding
      const newTopPadding = newOffsetMap.get(startIndex)?.offsetTop ?? 0;
      const delta = newTopPadding - oldTopPadding;

      // 立即补偿滚动位置，防止跳动
      if (delta !== 0) {
        container.scrollTop += delta;
      }

      // 触发重新渲染
      setMeasureVersion((v) => v + 1);
    }
  }, [startIndex, endIndex, topPadding, data, estimatedHeight]);

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
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
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
