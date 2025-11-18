import React, { useState, useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import type { PecaItem } from "../types";
import "./DraggableItem.css";

import monitorCinza from "../assets/peças/monitor_cinza.png";
import monitorAzul from "../assets/peças/monitor_azul.png";
import monitorRosa from "../assets/peças/monitor_rosa.png";
import mouseCinza from "../assets/peças/mouse_cinza.png";
import mouseAzul from "../assets/peças/mouse_azul.png";
import mouseRosa from "../assets/peças/mouse_rosa.png";
import tecladoCinza from "../assets/peças/teclado_cinza.png";
import tecladoAzul from "../assets/peças/teclado_azul.png";
import tecladoRosa from "../assets/peças/teclado_rosa.png";
import caixaSomD from "../assets/peças/caixa_som_d.png";

interface DraggableItemProps {
  item: PecaItem;
  onColorChange: (itemId: string, color: string) => void;
  onSelect: (itemId: string) => void;
  placed?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
}

const imagensMap: Record<string, Record<string, string>> = {
  monitor: {
    cinza: monitorCinza,
    azul: monitorAzul,
    rosa: monitorRosa,
  },
  mouse: {
    cinza: mouseCinza,
    azul: mouseAzul,
    rosa: mouseRosa,
  },
  teclado: {
    cinza: tecladoCinza,
    azul: tecladoAzul,
    rosa: tecladoRosa,
  },
  caixa_som: {
    padrão: caixaSomD,
  },
};

const DraggableItem: React.FC<DraggableItemProps> = ({ 
  item, 
  onColorChange,
  onSelect,
  placed,
  isSelected = false,
  disabled = false
}) => {
  const [showColors, setShowColors] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "COMPONENT",
      item: { id: item.id, image: item.imagem },
      canDrag: !placed && !disabled,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [placed, disabled, item.imagem]
  );

  useEffect(() => {
    if (ref.current) drag(ref.current);
  }, [drag, ref]);

  const coresDisponiveis: Record<string, string[]> = {
    monitor: ["cinza", "azul", "rosa"],
    mouse: ["cinza", "azul", "rosa"],
    teclado: ["cinza", "azul", "rosa"],
    caixa_som: [],
    placa_mae: [],
    processador: [],
    ram: [],
    ssd: [],
    placa_video: [],
    fan: []
  };

  const pecaId = item.id.split("_")[0];
  const cores = coresDisponiveis[pecaId] || [];

  const handleItemClick = () => {
    if (!placed && !disabled) {
      onSelect(item.id);
      if (cores.length > 0) {
        setShowColors(!showColors);
      }
    }
  };

  const handleColorSelect = (cor: string) => {
    onColorChange(item.id, cor);
    setShowColors(false);
  };

  const obterImagemCor = (cor: string): string => {
    return imagensMap[pecaId]?.[cor] || item.imagem;
  };

  return (
    <div className={`draggable-item-wrapper ${isSelected ? "draggable-item-wrapper-selected" : ""} ${disabled ? "draggable-item-disabled" : ""}`}>
      <div
        ref={ref}
        onClick={handleItemClick}
        className={`draggable-item ${
          placed ? "draggable-item-placed" : ""
        } ${isDragging ? "draggable-item-dragging" : ""} ${
          isSelected && !placed ? "draggable-item-active" : ""
        } ${disabled ? "draggable-item-disabled" : ""}`}
      >
        <img
          src={item.imagem}
          alt={item.label}
          className="draggable-item-imagem"
        />
        {placed && <div className="draggable-item-checkmark">✓</div>}
        {isSelected && !placed && (
          <div className="draggable-item-badge">Selecionada</div>
        )}
        {disabled && !placed && (
          <div className="draggable-item-disabled-overlay"></div>
        )}
      </div>

      {showColors && !placed && !disabled && cores.length > 0 && (
        <div className="draggable-item-cores">
          {cores.map((cor) => {
            const colorImagePath = obterImagemCor(cor);
            
            return (
              <button
                key={cor}
                className="draggable-item-cor-opcao"
                onClick={() => handleColorSelect(cor)}
                title={`Cor ${cor}`}
              >
                <img
                  src={colorImagePath}
                  alt={cor}
                />
              </button>
            );
          })}
        </div>
      )}
      
      <p className="draggable-item-label">{item.label}</p>
    </div>
  );
};

export default DraggableItem;