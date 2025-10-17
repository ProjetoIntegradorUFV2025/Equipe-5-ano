// src/utils/constants.ts
import { ConfiguracaoNivel, Historia, PecaItem } from '../types';

// IMPORTS DE IMAGENS (garante que o bundler resolva os arquivos corretamente)
import ramonImg from '../assets/graphics/RAMon.png';
import monitorCinzaImg from '../assets/peças/monitor_cinza.png';
import tecladoCinzaImg from '../assets/peças/teclado_cinza.png';
import mouseCinzaImg from '../assets/peças/mouse_cinza.png';

// Configuração de níveis de dificuldade (RN10)
export const CONFIGURACAO_NIVEIS: ConfiguracaoNivel = {
  facil: {
    tentativas: [1, 2, 3, 4],
    penalidades: [0, 0, 20, 50], // Porcentagem de perda
    ajudas: [
      '',
      'Tente novamente!',
      'Dica: Verifique onde essa peça se conecta',
      'Local correto destacado'
    ]
  },
  medio: {
    tentativas: [1, 2, 3, 4, 5],
    penalidades: [0, 5, 10, 20, 30],
    ajudas: [
      '',
      '',
      '',
      'Atenção: Pense bem antes da próxima tentativa',
      'Dica: Lembre-se da história sobre esta peça'
    ]
  },
  dificil: {
    tentativas: [1, 2, 3, 4, 5],
    penalidades: [0, 10, 15, 25, 40],
    ajudas: [
      '',
      '',
      '',
      'Cuidado: Você está perdendo muitos pontos',
      'Última chance: Pense com calma'
    ]
  }
};

// Pontuação base por peça
export const PONTUACAO_BASE_PECA = 100;

// Tempo máximo para bônus (10 minutos = 600 segundos)
export const TEMPO_BONUS_MAX = 600;

// Peças do jogo (use a chave 'imagem' para ficar consistente com os componentes)
export const PECAS_INICIAIS: PecaItem[] = [
  {
    id: 'monitor',
    label: 'Monitor',
    color: 'cinza',
    imagem: monitorCinzaImg,
    descricao: 'Dispositivo de saída que exibe informações visuais'
  },
  {
    id: 'teclado',
    label: 'Teclado',
    color: 'cinza',
    imagem: tecladoCinzaImg,
    descricao: 'Dispositivo de entrada para digitação'
  },
  {
    id: 'mouse',
    label: 'Mouse',
    color: 'cinza',
    imagem: mouseCinzaImg,
    descricao: 'Dispositivo apontador para navegação'
  }
];

// Histórias do modo história
export const HISTORIAS: Historia[] = [
  {
    id: 'historia-monitor',
    pecaId: 'monitor',
    titulo: 'O Monitor',
    texto:
      'O monitor é responsável por exibir todas as informações do computador. Ele deve ser conectado na parte de trás do gabinete, onde fica a placa de vídeo. Sem o monitor, não conseguimos ver nada do que o computador está fazendo!',
    imagem: ramonImg
  },
  {
    id: 'historia-teclado',
    pecaId: 'teclado',
    titulo: 'O Teclado',
    texto:
      'O teclado é nossa principal forma de comunicação com o computador. Com ele, podemos escrever textos, comandos e até jogar! Ele se conecta nas portas USB, geralmente localizadas na frente ou atrás do gabinete.',
    imagem: ramonImg
  },
  {
    id: 'historia-mouse',
    pecaId: 'mouse',
    titulo: 'O Mouse',
    texto:
      'O mouse nos permite navegar pela tela do computador de forma intuitiva. Movendo-o, controlamos um cursor que aparece na tela. Ele também se conecta nas portas USB, podendo ficar ao lado do teclado.',
    imagem: ramonImg
  }

];

// Cores disponíveis para as peças
export const CORES_DISPONIVEIS = ['cinza', 'azul', 'rosa'];

// Mensagens do sistema
export const MENSAGENS = {
  erro_encaixe: 'Oops... A peça não se encaixa neste local! Tente novamente.',
  sucesso_encaixe: 'Parabéns! Você encaixou a peça corretamente!',
  conclusao: 'Parabéns! Você completou a montagem do computador!',
  erro_progresso: 'Não foi possível carregar seu progresso. Tente novamente mais tarde.',
  bloqueio_quiz: 'Você precisa concluir o Modo História antes de acessar o Modo Quiz.'
};

// Peças internas do computador (usadas na Montagem Interna)
import gabineteImg from '../assets/peças/gabinete.png';
import placaMaeImg from '../assets/peças/placa_video_modal.png';
import processadorImg from '../assets/peças/processador_modal.png';
import memoriaRamImg from '../assets/peças/ram_modal.png';
import ssdImg from '../assets/peças/ssd_modal.png';
import placaVideoImg from '../assets/peças/placa_video_modal.png';
import fanImg from '../assets/peças/fan.png';
import fonteImg from '../assets/peças/fonte_modal.png';

export const PECAS_INTERNAS: PecaItem[] = [
  { id: 'gabinete', label: 'Gabinete', color: 'padrão', imagem: gabineteImg, descricao: 'Estrutura que abriga todas as peças internas' },
  { id: 'placa_mae', label: 'Placa Mãe', color: 'padrão', imagem: placaMaeImg, descricao: 'Placa principal que conecta todos os componentes' },
  { id: 'processador', label: 'Processador (CPU)', color: 'padrão', imagem: processadorImg, descricao: 'Responsável por processar dados e executar tarefas' },
  { id: 'memoria_ram', label: 'Memória RAM', color: 'padrão', imagem: memoriaRamImg, descricao: 'Armazena temporariamente dados em uso' },
  { id: 'ssd', label: 'SSD', color: 'padrão', imagem: ssdImg, descricao: 'Armazena arquivos e programas permanentemente' },
  { id: 'placa_video', label: 'Placa de Vídeo', color: 'padrão', imagem: placaVideoImg, descricao: 'Cria imagens e vídeos para o monitor' },
  { id: 'fans', label: 'Fans', color: 'padrão', imagem: fanImg, descricao: 'Resfriam os componentes internos' },
  { id: 'fonte', label: 'Fonte', color: 'padrão', imagem: fonteImg, descricao: 'Distribui energia para todas as peças' },
];

