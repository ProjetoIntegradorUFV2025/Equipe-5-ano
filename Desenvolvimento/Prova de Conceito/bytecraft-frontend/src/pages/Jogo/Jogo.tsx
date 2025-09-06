import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableItem from "../../components/DraggableItem";
import DropZone from "../../components/DropZone";
import "./Jogo.css"

type ItemType = {
  id: string;
  label: string;
  color: string;
  image: string;
};

const initialItems: ItemType[] = [
  { id: "monitor", label: "Monitor", color: "cinza", image: "src/assets/images/monitor-cinza.png" },
  { id: "teclado", label: "Teclado", color: "cinza", image: "src/assets/images/teclado-cinza.png" },
  { id: "mouse", label: "Mouse", color: "cinza", image: "src/assets/images/mouse-cinza.png" },
];

const Jogo: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [placedItems, setPlacedItems] = useState<Record<string, boolean>>({});
  const [droppedImages, setDroppedImages] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

  const Modal = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <img src="src/assets/images/ramon_pensativo.png" alt="Erro" className="modal-image" />
          <h1>Oops...  A resposta não é essa!</h1>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  };


  const handleDrop = (itemId: string, targetId: string, image: string) => {
    if (itemId === targetId) {
      setPlacedItems((prev) => ({ ...prev, [itemId]: true }));
      setDroppedImages((prev) => ({ ...prev, [itemId]: image }));
    } else {
      setShowModal(true);
    }
  };


  const handleColorChange = (itemId: string, color: string, image: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, color, image} : item
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend} >
      <div className="jogo-container">
        <h2></h2>
        <div className="drop-container">
          {["monitor", "teclado", "mouse"].map((target) => (
            <DropZone
              key={target}
              id={target}
              onDrop={handleDrop}
              placed={placedItems[target]}
              image={droppedImages[target]}
            />
          ))}
        </div>

        <div className="drag-container">
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onColorChange={handleColorChange}
              placed={placedItems[item.id]}
            />
          ))}
        </div>
      </div>
    {showModal && <Modal onClose={() => setShowModal(false)} />}
    </DndProvider>
  );
};

export default Jogo;
