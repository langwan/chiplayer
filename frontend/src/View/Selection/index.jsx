import { useEffect, useRef, useState } from "react";
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

const pointInItem = (point, el) => {
  const itemRect = el.getBoundingClientRect();
  if (
    point.x >= itemRect.left &&
    point.x <= itemRect.right &&
    point.y >= itemRect.top &&
    point.y <= itemRect.bottom
  ) {
    return true;
  } else {
    return false;
  }
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

export const ChihuoSelection = ({
  getItemElement,
  selectionModel,
  setRect,
  rect,
  itemsRef,
  onSelectionModelChange,
  children,
}) => {
  const [selectionRect, setSelectionRect] = useState(null);
  const ref = useRef();
  const onMouseDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    startPoint = null;
    setSelectionRect(null);

    let find = null;
    for (let el of itemsRef.current.children) {
      let key = el.getAttribute("data-key");
      let result = pointInItem(
        {
          x: event.clientX,
          y: event.clientY,
        },
        el
      );
      if (result) {
        find = key;
        break;
      }
    }
    console.log("onSelectionModelChange", find);
    if (find == null) {
      onSelectionModelChange([]);
    } else {
      onSelectionModelChange([find]);
    }
  };

  const onMouseMove = (event) => {
    if (event.which != 1) {
      if (startPoint != null) {
        startPoint = null;
        setSelectionRect(null);
      }
    } else {
      event.stopPropagation();
      event.preventDefault();
      if (startPoint == null) {
        startPoint = {
          x: event.clientX,
          y: event.clientY,
        };
      }

      let rect = calculateSelectionBox(
        startPoint,
        {
          x: event.clientX,
          y: event.clientY,
        },
        ref.current
      );
      setSelectionRect(rect);
      var models = [];
      for (let el of itemsRef.current.children) {
        let key = el.getAttribute("data-key");
        let result = itemInBox(rect, el);
        if (result) {
          find = key;
          models.push(key);
        }
      }
      onSelectionModelChange(models);
    }
  };

  const onMouseUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    startPoint = null;
    setSelectionRect(null);
    //setRect(null);
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
    if (selectionRect == null) {
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
      left: selectionRect.left,
      top: selectionRect.top,
      width: selectionRect.width,
      height: selectionRect.height,
    };

    return <div style={style}></div>;
  };

  return (
    <div style={{ height: "100%" }} onMouseDown={onMouseDown} ref={ref}>
      {children}
      {renderSelectionBox()}
    </div>
  );
};

ChihuoSelection.defaultProps = {
  onSelectionModelChange: (models) => {},
};
