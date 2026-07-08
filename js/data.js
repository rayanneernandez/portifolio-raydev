/* ══════════ DADOS — projetos, certificações e skills ══════════ */

const IMG_BASE = 'https://raw.githubusercontent.com/rayanneernandez/portifolio/main/img/';

/* imagens do marquee (fileira A desliza p/ esquerda, B p/ direita) */
const MARQUEE_A = [
  { img: 'painel-operacoes.png', name: 'Painel de Operações' },
  { img: 'verysing.png', name: 'VerySing' },
  { img: 'irmaosteixeira.jpeg', name: 'Irmãos Teixeira' },
  { img: 'redehoteis.png', name: 'Rede de Hotéis' },
  { img: 'controleestoque.jpg', name: 'Controle de Estoque' },
  { img: 'base-conhecimento.png', name: 'Global IA' },
];

const MARQUEE_B = [
  { img: 'elemental.jpg', name: 'Elemental' },
  { img: 'vitalongis.png', name: 'Vitalongis' },
  { img: 'modelo1-elevador.png', name: 'VisionTech' },
  { img: 'sistemanotas.PNG', name: 'Sistema de Notas' },
  { img: 'gerenciamento-hotel.PNG', name: 'Gestão Hoteleira' },
  { img: 'Organizadoragenda.PNG', name: 'Organizador de Agenda' },
];

/* galeria de projetos — clique abre as fotos
   pra adicionar mais fotos de um projeto, é só acrescentar no array "images" */
const PROJECTS = [
  {
    name: 'Painel de Operações',
    desc: 'Painel centralizado para monitorar e apoiar a tomada de decisões operacionais em tempo real.',
    images: ['painel-operacoes.png'],
    tags: ['TypeScript', 'Python', 'PostgreSQL'],
  },
  {
    name: 'Atadiesel — Loja Autônoma',
    desc: 'App mobile com catálogo, QR Code e IA para reconhecimento de produtos em loja autônoma.',
    images: ['login.png', 'home.png', 'produtos.png', 'detalhes.png', 'autonoma.png', 'cartoes.png'],
    tags: ['React Native', 'TypeScript', 'IA'],
  },
  {
    name: 'VerySing — Assinador de Contratos',
    desc: 'Solução segura para assinatura digital de documentos com criptografia e suporte multilíngue.',
    images: ['verysing.png'],
    tags: ['TypeScript', 'Python', 'Criptografia'],
  },
  {
    name: 'Global IA — Base de Conhecimento',
    desc: 'Base de conhecimento com vídeos e guias para a plataforma Global IA.',
    images: ['base-conhecimento.png'],
    tags: ['TypeScript', 'React'],
  },
  {
    name: 'Elemental — Saúde Mental',
    desc: 'App para apoiar a criação de rotinas saudáveis e promover bem-estar mental.',
    images: ['elemental.jpg'],
    tags: ['Ionic', 'TypeScript', 'Mobile'],
  },
  {
    name: 'Serralheria Irmãos Teixeira',
    desc: 'Site institucional para serviços de serralheria, portões, grades e estruturas metálicas.',
    images: ['irmaosteixeira.jpeg'],
    tags: ['React', 'TypeScript', 'CSS3'],
  },
  {
    name: 'Vitalongis',
    desc: 'Site que conecta famílias a cuidadores qualificados para idosos.',
    images: ['vitalongis.png'],
    tags: ['React', 'Vite', 'TypeScript'],
  },
  {
    name: 'Controle de Estoque',
    desc: 'Solução mobile para gerenciamento de estoque com interface simples e rápida.',
    images: ['controleestoque.jpg'],
    tags: ['TypeScript', 'Tailwind', 'Mobile'],
  },
  {
    name: 'Sites para Elevadores',
    desc: 'Dois modelos de site moderno e responsivo para empresa de soluções de elevadores.',
    images: ['modelo1-elevador.png', 'modelo2-elevador.png'],
    tags: ['TypeScript', 'JavaScript', 'CSS'],
  },
  {
    name: 'Rede de Hotéis',
    desc: 'Site de divulgação de hotéis, quartos e serviços.',
    images: ['redehoteis.png'],
    tags: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'Gestão Hoteleira Interna',
    desc: 'Plataforma para gerenciar reservas, funcionários e operações hoteleiras.',
    images: ['gerenciamento-hotel.PNG'],
    tags: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'Sistema de Notas Universitário',
    desc: 'Aplicação para acompanhar desempenho estudantil com importação automática e análises.',
    images: ['sistemanotas.PNG'],
    tags: ['Python', 'TypeScript'],
  },
  {
    name: 'Organizador de Agenda',
    desc: 'Sistema para organizar a agenda de técnicos externos, integrado ao Google Agenda.',
    images: ['Organizadoragenda.PNG'],
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    name: 'Ranking de Técnicos',
    desc: 'Sistema de ranking para otimizar o acompanhamento de performance de técnicos.',
    images: ['rankingtecnicos.jpg'],
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    name: 'Controle de Solicitações',
    desc: 'Plataforma para gerenciar solicitações de melhorias em sistemas corporativos.',
    images: ['painel_de_solicitacoes.PNG'],
    tags: ['JavaScript', 'HTML', 'CSS'],
  },
];

/* certificações */
const CERTS = [
  { year: '2025', name: 'Looker Studio — Criando o primeiro relatório', inst: 'Alura · Análise de dados', link: 'https://cursos.alura.com.br/certificate/1dcf01b3-bdec-482e-8fed-71078dac2458' },
  { year: '2025', name: 'Linux I — Conhecendo o Terminal', inst: 'Alura', link: 'https://cursos.alura.com.br/certificate/111e30d8-904b-47a7-924a-2e2a42e30797' },
  { year: '2025', name: 'Oratória para Líderes', inst: 'Alura · Comunicação profissional', link: 'https://cursos.alura.com.br/certificate/b096ef72-93e5-4a8a-ac2f-6ac4ac6218ec' },
  { year: '2024', name: 'Fundamentos de Liderança', inst: 'Voitto · Comportamento', link: 'https://imagens-voitto.s3.amazonaws.com/certificados/UkE9NTA5MytSQj01MzAyMzU=.pdf' },
  { year: '2023', name: 'Fundamentos do Power BI', inst: 'Voitto · Análise de dados', link: 'https://imagens-voitto.s3.amazonaws.com/certificados/UkE9NDQ0NytSQj01MzAyMzU=.pdf' },
  { year: '2023', name: 'Fundamentos de Minitab', inst: 'Voitto · Análise de dados', link: 'https://imagens-voitto.s3.amazonaws.com/certificados/UkE9Mzc3NytSQj01MzAyMzU=.pdf' },
  { year: '2023', name: 'Empreendedorismo Digital', inst: 'Formação empreendedora' },
  { year: '2026', name: 'Análise de Dados com Python', inst: 'Em andamento', soon: true },
];

/* skills flutuantes — logos via simpleicons (slug + cor da marca)
   sz: tamanho da bolha em px */
const SKILL_ICONS = [
  { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E', sz: 92 },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6', sz: 96 },
  { name: 'Python', slug: 'python', color: '3776AB', sz: 100 },
  { name: 'React & React Native', slug: 'react', color: '61DAFB', sz: 104 },
  { name: 'Angular', slug: 'angular', color: 'DD0031', sz: 84 },
  { name: 'Ionic', slug: 'ionic', color: '3880FF', sz: 78 },
  { name: 'Node.js', slug: 'nodedotjs', color: '5FA04E', sz: 96 },
  { name: 'PHP', slug: 'php', color: '777BB4', sz: 80 },
  { name: 'Vite', slug: 'vite', color: '646CFF', sz: 70 },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4', sz: 82 },
  { name: 'HTML5', slug: 'html5', color: 'E34F26', sz: 76 },
  { name: 'CSS3', slug: 'css', color: '663399', sz: 74 },
  { name: 'MySQL', slug: 'mysql', color: '4479A1', sz: 88 },
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1', sz: 92 },
  { name: 'Visão Computacional (OpenCV)', slug: 'opencv', color: '5C3EE8', sz: 90 },
  { name: 'Looker Studio', slug: 'looker', color: '4285F4', sz: 72 },
  { name: 'Power BI', slug: null, fallback: 'BI', color: 'F2C811', sz: 78 },
  { name: 'Git & GitHub', slug: 'git', color: 'F05032', sz: 84 },
  { name: 'Linux', slug: 'linux', color: '000000', sz: 76 },
];
