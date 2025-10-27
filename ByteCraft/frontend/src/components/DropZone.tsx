import React, { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import type { NivelDificuldade } from "../types";
import "./DropZone.css";

interface DropZoneProps {
  id: string;
  onDrop: (itemId: string, targetId: string) => void;
  placed?: boolean;
  image?: string;
  destacar?: boolean;
  nivel?: NivelDificuldade;
}

/**
 * DropZone com fundo transparente mostrando apenas bordas dos encaixes
 */
const DropZone: React.FC<DropZoneProps> = ({
  id,
  image,
  onDrop,
  placed,
  destacar = false,
  nivel = "medio",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "COMPONENT",
      drop: (item: { id: string; image: string }) => {
        console.log("DropZone.tsx: Drop recebido -", {
          itemId: item.id,
          dropZoneId: id,
        });
        onDrop(item.id, id);
        return { success: true };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [id, onDrop]
  );

  useEffect(() => {
    if (ref.current) drop(ref.current);
  }, [drop, id]);

  // Mapear o ID para o tipo de área e label
  const getAreaInfo = () => {
    switch (id) {
      case "dropzone_monitor":
        return { tipo: "monitor", label: "Monitor", icone: "🖥️" };
      case "dropzone_teclado":
        return { tipo: "teclado", label: "Teclado", icone: "⌨️" };
      case "dropzone_mouse":
        return { tipo: "mouse", label: "Mouse", icone: "🖱️" };
      case "dropzone_som":
        return { tipo: "som", label: "Caixa de Som", icone: "🔊" };
      default:
        return { tipo: "", label: "", icone: "" };
    }
  };

  const { tipo, label, icone } = getAreaInfo();

  const getClassName = () => {
    const classes = ["dropzone-area", tipo];
    if (placed) classes.push("dropzone-placed");
    else if (destacar) classes.push("dropzone-iluminado");
    else if (isOver && canDrop) classes.push("dropzone-hover");
    return classes.join(" ");
  };

  return (
    <div ref={ref} className={getClassName()} data-label={label}>
      {/* Ícone de fundo sutil */}
      {!placed && <span className="dropzone-icone">{icone}</span>}

      {/* Se a peça foi colocada, mostra a imagem */}
      {placed && image && (
        <img src={image} alt={label} className="dropzone-imagem" />
      )}

      {/* Brilho temporário de destaque */}
      {!placed && destacar && (
        <div className="dropzone-placeholder">
          <div className="dropzone-brilho-container">
            <span className="dropzone-brilho-texto">✨ Aqui! ✨</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;