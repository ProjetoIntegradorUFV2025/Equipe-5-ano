import React, { useState } from "react";
import { useDrag } from "react-dnd";

interface Props {
  item: {
    id: string;
    label: string;
    color: string;
    image: string;
  };
  onColorChange: (itemId: string, color: string, image: string) => void;
  placed?: boolean;
}

const DraggableItem: React.FC<Props> = ({ item, onColorChange, placed }) => {
  const [showColors, setShowColors] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { id: item.id, image: item.image},
    canDrag: !placed,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [placed, item.image]);

  return (
    <div>
      <div
        ref={drag}
        onClick={() => {
          if (!placed) setShowColors(!showColors);
        }}
        style={{
          width: 100,
          height: 100,
          opacity: isDragging ? 0.5 : 1,
          cursor: placed ? "not-allowed" : "pointer",
          border: "1px solid #333",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={item.image}
          alt={item.label}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {showColors && (
        <div style={{ marginTop: 10, display: "flex", gap: 5 }}>
          {["cinza", "verde", "azul"].map((cor) => (
            <img
              key={cor}
              src={`src/assets/images/${item.id}-${cor}.png`}
              alt={cor}
              onClick={() => {
                const newImage = `src/assets/images/${item.id}-${cor}.png`;
                onColorChange(item.id, item.color, newImage);
                setShowColors(false);
              }}
              style={{
                width: 60,
                height: 60,
                cursor: "pointer",
                border: "1px solid #000",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableItem;
