import { useEffect, useRef } from "react";
let startPoint = null;

export const itemInBox = (rect, itemDom) => {
  if (rect == null) return false;
  const itemRect = itemDom.getBoundingClientRect();

  if (
    rect.left <= itemRect.left + itemRect.width &&
    rect.left + rect.width >= itemRect.left &&
    rect.top <= itemRect.top + itemRect.height &&
    rect.top + rect.height >= itemRect.top
  ) {
    return true;
  }
  return false;
};

const calculateSelectionBox = (startPoint, endPoint, current) => {
  if (startPoint == null) {
    return null;
  }
  var left = Math.min(startPoint.x, endPoint.x);
  left = Math.max(left, current.offsetLeft);
  var top = Math.min(startPoint.y, endPoint.y) + current.scrollTop;
  top = Math.max(top, current.offsetTop);
  var bottom = Math.max(startPoint.y, endPoint.y) + current.scrollTop;
  let currentRect = current.getBoundingClientRect();
  var right = Math.max(startPoint.x, endPoint.x);
  right = Math.min(right, currentRect.right);
  var width = Math.abs(right - left);
  var height = Math.abs(bottom - top);
  let rect = {
    left: left,
    top: top,
    width: width,
    height: height,
  };
  return rect;
};

export const ChihuoSelection = ({ setRect, rect, children }) => {
  const ref = useRef();
  const onMouseDown = (event) => {
    if (startPoint == null) {
      console.log("onMouseDown", "setStartPoint");
      startPoint = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  const onMouseMove = (event) => {
    if (startPoint) {
      let result = calculateSelectionBox(
        startPoint,
        {
          x: event.clientX,
          y: event.clientY,
        },
        ref.current
      );
      setRect(result);
    }
  };

  const onMouseUp = (event) => {
    startPoint = null;
    setRect(null);
  };

  useEffect(() => {
    window.document.addEventListener("mousemove", onMouseMove);
    window.document.addEventListener("mouseup", onMouseUp);
    return () => {
      window.document.removeEventListener("mousemove", onMouseMove);
      window.document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const renderSelectionBox = () => {
    if (!rect) {
      return null;
    }

    const style = {
      zIndex: 2,
      position: "absolute",
      pointerEvents: "none",
      backgroundColor: "rgba(0, 162, 255, 0.4)",
      borderRadius: "3px",
      willChange: "transform",

      cursor: "zoom-in",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    return <div style={style}></div>;
  };

  return (
    <div onMouseDown={onMouseDown} ref={ref}>
      {children}
      {renderSelectionBox()}
    </div>
  );
};
