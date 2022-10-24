import { useCallback, useEffect, useRef, useState } from "react";
let startPoint = null;
let shift = false;
let globalSelectionModel = [];
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

const pointInItems = (point, ref) => {
  let find = null;
  for (let el of ref.current.children) {
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
  return find;
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
  selectionModel,
  itemsRef,
  onSelectionModelChange,
  children,
  disableEvent,
}) => {
  const [selectionRect, setSelectionRect] = useState(null);
  const ref = useRef();
  const onMouseDown = useCallback((event) => {
    if (
      !pointInItem(
        {
          x: event.clientX,
          y: event.clientY,
        },
        itemsRef.current
      )
    ) {
      return;
    }

    startPoint = null;
    setSelectionRect(null);

    if (event.shiftKey || shift) {
      let point = {
        x: event.clientX,
        y: event.clientY,
      };
      let find = pointInItems(point, itemsRef);
      var sels = globalSelectionModel;

      if (find != null) {
        let index = sels.indexOf(find);

        if (index !== -1) {
          sels.splice(index, 1);
        } else {
          sels.push(find);
        }

        onSelectionModelChange([...sels]);
      }
    } else {
      let find = pointInItems(
        {
          x: event.clientX,
          y: event.clientY,
        },
        itemsRef
      );

      if (find == null) {
        onSelectionModelChange([]);
      } else {
        onSelectionModelChange([find]);
      }
    }
  }, []);

  const onMouseMove = useCallback((event) => {
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
      if (!event.shiftKey) {
        onSelectionModelChange(models);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      window.document.removeEventListener("mousemove", onMouseMove, true);
      window.document.removeEventListener("mousedown", onMouseDown, true);
    };
  }, []);

  useEffect(() => {
    if (disableEvent) {
      window.document.removeEventListener("mousemove", onMouseMove, true);
      window.document.removeEventListener("mousedown", onMouseDown, true);
    } else {
      window.document.addEventListener("mousemove", onMouseMove, true);
      window.document.addEventListener("mousedown", onMouseDown, true);
    }
  }, [disableEvent]);

  useEffect(() => {
    globalSelectionModel = [...selectionModel];
  }, [selectionModel]);

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
    <div style={{ height: "100%" }} ref={ref}>
      {children}
      {renderSelectionBox()}
    </div>
  );
};
