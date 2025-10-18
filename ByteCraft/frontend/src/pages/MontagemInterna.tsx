import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DraggableItem from "../components/DraggableItem";
import DropZone from "../components/DropZone";
import SucessoModal from "../components/SucessoModal";
import ErroModal from "../components/ErroModal";
import HistoriaModal from "../components/HistoriaModal";
import ConclusaoModal from "../components/ConclusaoModal";
import PainelPontuacao from "../components/PainelPontuacao";
import Cronometro from "../components/Cronometro";
import { useCronometro } from "../hooks/useCronometro";
import { usePontuacao } from "../hooks/usePontuacao";
import api from "../api/api";
import type { 
  PecaItem, 
  NivelDificuldade,
  Aluno as AlunoType,
  DialogoHistoria
} from "../types";
import "./styles/MontagemInterna.css";

// Importar peças internas
import processador from "../assets/peças/processador (1).png";
import ram from "../assets/peças/ram (1).png";
import ssd from "../assets/peças/ssd (1).png";
import placaVideo from "../assets/peças/placa_video (1).png";
import fan from "../assets/peças/fan.png";
import fanAzul from "../assets/peças/fan_azul.png";
import gabinete from "../assets/peças/gabinete.png";

const SEQUENCIA_PECAS = ["processador_1", "ram_1", "ssd_1", "placa_video_1", "fan_1"];

const HISTORIAS_FIXAS: DialogoHistoria[] = [
  {
    id: "1",
    titulo: "O Processador",
    texto: "O processador é o cérebro do computador. Ele executa todas as instruções e cálculos necessários para o funcionamento do sistema.",
    pecaId: "processador_1"
  },
  {
    id: "2",
    titulo: "A Memória RAM",
    texto: "A memória RAM armazena temporariamente os dados que estão sendo usados. Quanto mais RAM, mais programas você pode executar ao mesmo tempo.",
    pecaId: "ram_1"
  },
  {
    id: "3",
    titulo: "O SSD",
    texto: "O SSD é o dispositivo de armazenamento que guarda todos os seus arquivos, programas e o sistema operacional de forma permanente.",
    pecaId: "ssd_1"
  },
  {
    id: "4",
    titulo: "A Placa de Vídeo",
    texto: "A placa de vídeo processa imagens e vídeos, sendo essencial para jogos e aplicações gráficas avançadas.",
    pecaId: "placa_video_1"
  },
  {
    id: "5",
    titulo: "O Cooler",
    texto: "O cooler mantém o computador refrigerado, evitando que os componentes superaqueçam durante o uso.",
    pecaId: "fan_1"
  }
];

const imagensMap: Record<string, Record<string, string>> = {
  fan: {
    padrao: fan,
    azul: fanAzul,
  },
};

const MENSAGENS_MODAIS = {
  facil: {
    sucesso: [
      "Parabéns! Você acertou!",
      "Muito bem! Continue assim!",
      "Excelente! Peça encaixada corretamente!",
      "Você é um expert em montagem!",
      "Que legal! Você conseguiu!",
      "Perfeito! Mais uma peça no lugar certo!"
    ],
    erro: [
      "Quase lá! Tente novamente.",
      "Dica: Observe com atenção o formato da peça.",
      "Não desista! Você consegue!",
      "Lembre-se: cada peça tem seu lugar específico.",
      "Opa! Vamos tentar de novo?",
      "Preste atenção onde as outras peças se encaixam."
    ]
  },
  medio: {
    sucesso: [
      "Ótimo trabalho! Conexão estabelecida.",
      "Perfeito! Componente instalado corretamente.",
      "Funcionamento ideal confirmado!",
      "Sistema reconheceu o hardware!",
      "Montagem precisa! Continue assim.",
      "Interface conectada com sucesso!"
    ],
    erro: [
      "Conexão inadequada. Verifique os encaixes.",
      "Ajuste necessário - tente outra posição.",
      "Compatibilidade não detectada.",
      "Refaça a conexão cuidadosamente.",
      "Verifique a orientação do componente.",
      "Reposicione e tente novamente."
    ]
  },
  dificil: {
    sucesso: [
      "Precisão técnica exemplar!",
      "Configuração otimizada alcançada!",
      "Interface periférica sincronizada!",
      "Performance máxima estabelecida!",
      "Subsistema integrado com eficiência!",
      "Fluxo de dados estabilizado!"
    ],
    erro: [
      "Falha na interface de comunicação.",
      "Análise: Verifique protocolos de conexão.",
      "Erro de compatibilidade de barramento.",
      "Requer recalibração do subsistema.",
      "Interferência no sinal de dados detectada.",
      "Configuração não atende aos parâmetros técnicos."
    ]
  }
};

const obterMensagemAleatoria = (nivel: NivelDificuldade, tipo: 'sucesso' | 'erro'): string => {
  const mensagens = MENSAGENS_MODAIS[nivel]?.[tipo] || MENSAGENS_MODAIS.medio[tipo];
  return mensagens[Math.floor(Math.random() * mensagens.length)];
};

const MAPEAMENTO_CORRETO: Record<string, string> = {
  "processador_1": "dropzone_processador",
  "ram_1": "dropzone_ram",
  "ssd_1": "dropzone_ssd",
  "placa_video_1": "dropzone_placa_video",
  "fan_1": "dropzone_fan"
};

const MontagemInterna: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperar dados do aluno do state ou localStorage
  const alunoState = location.state?.aluno as AlunoType | undefined;
  const alunoLocalStorage = localStorage.getItem("aluno") 
    ? JSON.parse(localStorage.getItem("aluno")!) as AlunoType 
    : null;
  
  const aluno = alunoState || alunoLocalStorage;
  const nivelDificuldade = (location.state?.nivel || localStorage.getItem("nivelSelecionado") || 'medio') as NivelDificuldade;
  
  const apelido = aluno?.apelido || localStorage.getItem("apelido") || "teste";
  const codigoSala = aluno?.codigoSala || Number(localStorage.getItem("codigoSala")) || 999;
  const nivel = nivelDificuldade;

  const [historiaAtual, setHistoriaAtual] = useState<DialogoHistoria | null>(null);
  const [mostrarHistoria, setMostrarHistoria] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const {
    pontuacaoTotal,
    registrarTentativa,
    calcularPontuacaoFinalComBonus,
    resetar: resetarPontuacao
  } = usePontuacao();

  const {
    tempo,
    iniciar: iniciarCronometro,
    pausar: pausarCronometro,
    resetar: resetarCronometro
  } = useCronometro();

  // Handler para o botão voltar do navegador
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      navigate('/fases', { 
        state: { aluno },
        replace: true 
      });
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, aluno]);

  useEffect(() => {
    iniciarCronometro();
    return () => pausarCronometro();
  }, []);

  const [pecas, setPecas] = useState<PecaItem[]>([
    { 
      id: "processador_1", 
      label: "Processador", 
      imagem: processador, 
      color: "padrao",
      descricao: "Cérebro do computador"
    },
    { 
      id: "ram_1", 
      label: "Memória RAM", 
      imagem: ram, 
      color: "padrao",
      descricao: "Memória temporária"
    },
    { 
      id: "ssd_1", 
      label: "SSD", 
      imagem: ssd, 
      color: "padrao",
      descricao: "Armazenamento permanente"
    },
    { 
      id: "placa_video_1", 
      label: "Placa de Vídeo", 
      imagem: placaVideo, 
      color: "padrao",
      descricao: "Processamento gráfico"
    },
    { 
      id: "fan_1", 
      label: "Cooler", 
      imagem: fan, 
      color: "padrao",
      descricao: "Refrigeração"
    },
  ]);

  const [pecasColocadas, setPecasColocadas] = useState<Set<string>>(new Set());
  const [pecaSelecionada, setPecaSelecionada] = useState<string | null>(null);
  
  const [dropZoneDestacada, setDropZoneDestacada] = useState<string | null>(null);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [dicaAtual, setDicaAtual] = useState("");
  
  const [showSucesso, setShowSucesso] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [showErro, setShowErro] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  
  const [historiaIndex, setHistoriaIndex] = useState(0);
  const [historiaAtualFluxo, setHistoriaAtualFluxo] = useState<DialogoHistoria | null>(HISTORIAS_FIXAS[0]);
  const [showHistoria, setShowHistoria] = useState(true);
  
  const [indicePecaAtual, setIndicePecaAtual] = useState(0);
  const [tentativasPeca, setTentativasPeca] = useState(0);

  const [showConclusao, setShowConclusao] = useState(false);
  const [pontuacaoFinal, setPontuacaoFinal] = useState(0);

  const pecaAtivaId = SEQUENCIA_PECAS[indicePecaAtual];

  useEffect(() => {
    console.log("Inicializando montagem interna...");
    console.log("Peça ativa inicial:", pecaAtivaId);
  }, []);

  useEffect(() => {
    if (!showHistoria && historiaAtualFluxo) {
      setTentativasPeca(0);
      const novoIndice = HISTORIAS_FIXAS.findIndex(h => h.pecaId === historiaAtualFluxo.pecaId);
      if (novoIndice !== -1) {
        setIndicePecaAtual(novoIndice);
        console.log("Índice atualizado para:", novoIndice, "Peça:", historiaAtualFluxo.pecaId);
      }
    }
  }, [showHistoria, historiaAtualFluxo]);

  const handleContinuarHistoria = () => {
    setShowHistoria(false);
  };

  const avancarHistoria = () => {
    const proximoIndex = historiaIndex + 1;

    if (proximoIndex < HISTORIAS_FIXAS.length) {
      const proximaHistoria = HISTORIAS_FIXAS[proximoIndex];
      setHistoriaIndex(proximoIndex);
      setHistoriaAtualFluxo(proximaHistoria);
      setShowHistoria(true);
      setIndicePecaAtual(proximoIndex);
    } else {
      finalizarMontagem();
    }
  };

  const handleColorChange = (itemId: string, color: string) => {
    const pecaType = itemId.split("_")[0];
    const novaImagem = imagensMap[pecaType]?.[color];

    if (novaImagem) {
      setPecas(pecas.map(p => 
        p.id === itemId ? { ...p, imagem: novaImagem, color } : p
      ));
    }
  };

  const handleSelectPeca = (itemId: string) => {
    if (!pecasColocadas.has(itemId)) {
      const novaSelecao = pecaSelecionada === itemId ? null : itemId;
      setPecaSelecionada(novaSelecao);
      setDropZoneDestacada(null);
      setMostrarDica(false);
    }
  };

  const aplicarAjudaVisual = (tentativasAtual: number) => {
    const dropZoneCorreta = MAPEAMENTO_CORRETO[pecaAtivaId];
    
    if (nivelDificuldade === 'facil') {
      if (tentativasAtual === 2) {
        setMostrarDica(false);
        setDropZoneDestacada(null);
      } else if (tentativasAtual === 3) {
        setDicaAtual("Observe a área destacada!");
        setMostrarDica(true);
        setDropZoneDestacada(dropZoneCorreta);
      } else if (tentativasAtual >= 4) {
        setDicaAtual("O local correto está brilhando!");
        setMostrarDica(true);
        setDropZoneDestacada(dropZoneCorreta);
      }
    } else if (nivelDificuldade === 'medio') {
      if (tentativasAtual <= 3) {
        setMostrarDica(false);
        setDropZoneDestacada(null);
      } else if (tentativasAtual === 4) {
        setMostrarDica(false);
        setDropZoneDestacada(null);
      } else if (tentativasAtual >= 5) {
        setDicaAtual("Lembre-se da história sobre esta peça!");
        setMostrarDica(true);
        setDropZoneDestacada(dropZoneCorreta);
      }
    }
  };

  const handleDrop = (itemId: string, targetId: string) => {
    console.log("Tentativa de drop:", { itemId, pecaAtivaId, targetId, ehPecaAtiva: itemId === pecaAtivaId });

    const ehPecaAtiva = itemId === pecaAtivaId;
    if (!ehPecaAtiva) {
      console.log(`Erro: Peça ${itemId} não está ativa. Ativa: ${pecaAtivaId}`);
      registrarTentativa(itemId, false, nivelDificuldade || "medio");
      setMensagemErro(obterMensagemAleatoria(nivel, 'erro'));
      setShowErro(true);
      return;
    }

    const dropZoneCorreta = MAPEAMENTO_CORRETO[pecaAtivaId];
    const acertouLocal = targetId === dropZoneCorreta;
    
    console.log(`Validação de posição: Esperado=${dropZoneCorreta}, Recebido=${targetId}, Acertou=${acertouLocal}`);
    
    if (!acertouLocal) {
      console.log(`Erro: Local incorreto para ${itemId}`);
      const novasTentativas = tentativasPeca + 1;
      setTentativasPeca(novasTentativas);
      registrarTentativa(itemId, false, nivelDificuldade || "medio");
      setMensagemErro(obterMensagemAleatoria(nivel, 'erro'));
      setShowErro(true);
      aplicarAjudaVisual(novasTentativas);
      return;
    }

    console.log(`Sucesso! ${itemId} encaixado em ${targetId}`);
    const pontosObtidos = registrarTentativa(itemId, true, nivelDificuldade || "medio");
    
    const novasPecasColocadas = new Set([...pecasColocadas, itemId]);
    setPecasColocadas(novasPecasColocadas);
    
    setPontosGanhos(pontosObtidos);
    setPecaSelecionada(null);
    setDropZoneDestacada(null);
    setMostrarDica(false);
    setMensagemSucesso(obterMensagemAleatoria(nivel, 'sucesso'));
    
    setShowSucesso(true);
    
    try {
      api.salvarProgresso(apelido, codigoSala, false);
    } catch (err) {
      console.warn("Falha ao salvar progresso:", err);
    }

    if (novasPecasColocadas.size === pecas.length) {
      setTimeout(() => {
        setShowSucesso(false);
        finalizarMontagem();
      }, 2000);
    } else {
      setTimeout(() => {
        setShowSucesso(false);
        avancarHistoria();
      }, 2000);
    }
  };

  async function finalizarMontagem() {
    pausarCronometro();
    
    // Recuperar pontuação da montagem externa
    const pontuacaoExterna = Number(localStorage.getItem("pontuacaoMontagem")) || 0;
    const tempoExterna = Number(localStorage.getItem("tempoMontagem")) || 0;
    
    // Calcular pontuação total (externa + interna)
    const pontuacaoInterna = calcularPontuacaoFinalComBonus(tempo);
    const pontuacaoFinalTotal = pontuacaoExterna + pontuacaoInterna;
    const tempoTotal = tempoExterna + tempo;
    
    setPontuacaoFinal(pontuacaoFinalTotal);
    
    try {
      await api.registraPontuacao(apelido, codigoSala, pontuacaoFinalTotal, tempoTotal);
      console.log("Pontuação final salva!");
      
      // Limpar dados temporários
      localStorage.removeItem("pontuacaoMontagem");
      localStorage.removeItem("tempoMontagem");
    } catch (err) {
      console.error("Erro ao salvar pontuação:", err);
    }
    
    setShowConclusao(true);
  }

  const handleErroClose = () => {
    setShowErro(false);
  };

  const handleVoltarFases = () => {
    resetarPontuacao();
    resetarCronometro();
    navigate('/fases', { 
      state: { aluno },
      replace: true 
    });
  };

  const obterImagemPeca = (pecaId: string): string | undefined => {
    return pecas.find(p => p.id === pecaId)?.imagem;
  };

  const obterLabelPecaAtiva = (): string => {
    const peca = pecas.find(p => p.id === pecaAtivaId);
    return peca?.label || "Processador";
  };

  if (!aluno?.apelido) {
    return (
      <div className="montagem-interna-container" style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Erro ao carregar dados do aluno</h2>
        <p>Faça login novamente</p>
        <button onClick={() => window.location.href = '/aluno'}>Voltar ao Login</button>
      </div>
    );
  }

  return (
    <div className="montagem-interna-container">
      <div className="montagem-interna-header">
        <PainelPontuacao 
          pontuacao={pontuacaoTotal}
          pecasRestantes={pecas.length - pecasColocadas.size}
          totalPecas={pecas.length}
        />
        <Cronometro tempo={tempo} />
      </div>

      {mostrarDica && (
        <div className="montagem-interna-dica-banner">
          {dicaAtual}
        </div>
      )}

      {!showHistoria && (
        <div className="montagem-interna-alerta-selecao">
          <span className="montagem-interna-alerta-icone">👆</span>
          <span>Arraste a peça <strong>{obterLabelPecaAtiva()}</strong> para o local correto!</span>
        </div>
      )}

      <div className="montagem-interna-content">
        <div className="montagem-interna-workspace">
          <div className="montagem-interna-central-wrapper">
            {historiaAtualFluxo && showHistoria && (
              <div className="montagem-interna-historia-balao">
                <h3>{historiaAtualFluxo.titulo}</h3>
                <p>{historiaAtualFluxo.texto}</p>
              </div>
            )}

            <div className="montagem-interna-gabinete-container">
              <div className="montagem-interna-gabinete">
                <img src={gabinete} alt="Gabinete" className="montagem-interna-gabinete-img" />
                
                <div className="montagem-interna-dropzone-processador">
                  <DropZone
                    id="dropzone_processador"
                    onDrop={handleDrop}
                    placed={pecasColocadas.has("processador_1")}
                    image={obterImagemPeca("processador_1")}
                    destacar={dropZoneDestacada === "dropzone_processador"}
                    nivel={nivelDificuldade}
                  />
                </div>

                <div className="montagem-interna-dropzone-ram">
                  <DropZone
                    id="dropzone_ram"
                    onDrop={handleDrop}
                    placed={pecasColocadas.has("ram_1")}
                    image={obterImagemPeca("ram_1")}
                    destacar={dropZoneDestacada === "dropzone_ram"}
                    nivel={nivelDificuldade}
                  />
                </div>

                <div className="montagem-interna-dropzone-ssd">
                  <DropZone
                    id="dropzone_ssd"
                    onDrop={handleDrop}
                    placed={pecasColocadas.has("ssd_1")}
                    image={obterImagemPeca("ssd_1")}
                    destacar={dropZoneDestacada === "dropzone_ssd"}
                    nivel={nivelDificuldade}
                  />
                </div>

                <div className="montagem-interna-dropzone-placa-video">
                  <DropZone
                    id="dropzone_placa_video"
                    onDrop={handleDrop}
                    placed={pecasColocadas.has("placa_video_1")}
                    image={obterImagemPeca("placa_video_1")}
                    destacar={dropZoneDestacada === "dropzone_placa_video"}
                    nivel={nivelDificuldade}
                  />
                </div>

                <div className="montagem-interna-dropzone-fan">
                  <DropZone
                    id="dropzone_fan"
                    onDrop={handleDrop}
                    placed={pecasColocadas.has("fan_1")}
                    image={obterImagemPeca("fan_1")}
                    destacar={dropZoneDestacada === "dropzone_fan"}
                    nivel={nivelDificuldade}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="montagem-interna-pecas-horizontal">
          <h3>Peças Disponíveis</h3>
          <div className="montagem-interna-pecas-lista-horizontal">
            {pecas.map((peca) => (
              <DraggableItem
                key={peca.id}
                item={peca}
                onColorChange={handleColorChange}
                onSelect={handleSelectPeca}
                placed={pecasColocadas.has(peca.id)}
                isSelected={pecaSelecionada === peca.id}
                disabled={pecasColocadas.has(peca.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {historiaAtualFluxo && (
        <HistoriaModal
          isOpen={showHistoria}
          historia={historiaAtualFluxo}
          onContinuar={handleContinuarHistoria}
        />
      )}

      <HistoriaModal
        isOpen={mostrarHistoria}
        historia={historiaAtual}
        onContinuar={() => {
          setMostrarHistoria(false);
          setHistoriaAtual(null);
        }}
      />

      <SucessoModal
        isOpen={showSucesso}
        onClose={() => setShowSucesso(false)}
        pontosGanhos={pontosGanhos}
        mensagem={mensagemSucesso}
      />

      <ErroModal
        isOpen={showErro}
        onClose={handleErroClose}
        mensagem={mensagemErro}
      />

      <ConclusaoModal
        isOpen={showConclusao}
        pontuacaoFinal={pontuacaoFinal}
        tempo={tempo}
        codigoSala={aluno?.codigoSala ?? codigoSala}
        alunoApelido={aluno?.apelido ?? apelido}
        onVoltarFases={handleVoltarFases}
      />
    </div>
  );
};

export default MontagemInterna;