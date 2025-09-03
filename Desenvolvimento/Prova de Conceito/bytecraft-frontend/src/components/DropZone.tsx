import React from "react";
import { useDrop } from "react-dnd";

interface Props {
  id: string;
  onDrop: (itemId: string, targetId: string, image: string) => void;
  placed?: boolean;
  positionStyle?: React.CSSProperties;
  image: string;
}

const DropZone: React.FC<Props> = ({ id, image, onDrop, placed }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item: { id: string, image: string}) => onDrop(item.id, id, item.image),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const getBackgroundColor = () => {
    if (placed) return "lightgreen";
    if (isOver && canDrop) return "lightyellow";
    return "lightgray";
  };

  return (
    <div
      ref={drop}
      style={{
        width: 100,
        height: 100,
        backgroundColor: getBackgroundColor(),
        border: "2px dashed #555",
        borderRadius: 10,
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {placed && (
        <img
          src={image}          
          alt={id}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  );
};

export default DropZone;
