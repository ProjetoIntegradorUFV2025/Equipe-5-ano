import { useState } from "react";
import api from "../api/api"; // <-- ajuste o caminho conforme sua estrutura

export default function ImportPage() {
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setArquivos(files);
  };

  const enviarArquivos = async () => {
    if (arquivos.length === 0) {
      setStatus("⚠️ Selecione pelo menos 1 arquivo CSV.");
      return;
    }

    setStatus("⏳ Enviando arquivos...");

    try {
      const resultado = await api.importarPerguntasCSV(arquivos);
      setStatus(`✅ ${resultado}`);
      setArquivos([]); // limpar seleção após sucesso
    } catch (erro: any) {
      setStatus(`❌ Erro: ${erro.message}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Importar Perguntas (CSV)</h1>
      <p>Selecione até 3 arquivos CSV contendo perguntas:</p>

      <input
        type="file"
        accept=".csv"
        multiple
        onChange={handleFileChange}
        style={{ margin: "20px 0" }}
      />

      {arquivos.length > 0 && (
        <ul style={{ textAlign: "left" }}>
          {arquivos.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={enviarArquivos}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        📤 Importar para o Banco
      </button>

      {status && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          {status}
        </p>
      )}
    </div>
  );
}
