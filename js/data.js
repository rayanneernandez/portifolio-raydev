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
   pra adicionar mais fotos de um projeto, é só acrescentar no array "images".
   Imagens que começam com "img/" ou "http" são usadas direto (locais);
   as demais vêm do repositório antigo (IMG_BASE).
   desc = português · desc_en = inglês · desc_es = espanhol */
const PROJECTS = [
  {
    name: 'Way — Bot Financeiro no Telegram',
    desc: 'Assistente de controle financeiro no Telegram com IA. Registra entradas, gastos, empréstimos, contas a pagar, cartão de crédito e transferências por texto, áudio (transcreve a voz) ou foto do comprovante (lê o valor sozinho). Reconhece o banco, responde saldos e "no que você mais gasta", controla metas, limites e orçamentos, gera relatório do mês em PDF e envia avisos automáticos de vencimento e saldo. Fala português e inglês.',
    desc_en: 'AI-powered personal finance assistant on Telegram. Logs income, expenses, loans, bills, credit card and transfers — via text, voice (transcribed) or a photo of the receipt (reads the amount automatically). Detects the bank, answers balances and "where you spend the most", tracks goals, limits and budgets, generates a monthly PDF report and sends automatic due-date and balance alerts. Speaks Portuguese and English.',
    desc_es: 'Asistente de finanzas personales en Telegram con IA. Registra ingresos, gastos, préstamos, cuentas por pagar, tarjeta de crédito y transferencias — por texto, audio (lo transcribe) o foto del comprobante (lee el importe solo). Reconoce el banco, responde saldos y "en qué gastas más", controla metas, límites y presupuestos, genera un informe mensual en PDF y envía avisos automáticos de vencimiento y saldo. Habla portugués e inglés.',
    images: ['img/way/way-1.png', 'img/way/way-2.png', 'img/way/way-3.png', 'img/way/way-4.png', 'img/way/way-5.png', 'img/way/way-6.png'],
    tags: ['Telegram Bot', 'IA', 'OCR', 'Voz', 'PDF'],
  },
  {
    name: 'Painel de Operações',
    desc: 'Painel centralizado para monitorar e apoiar a tomada de decisões operacionais em tempo real.',
    desc_en: 'Centralized panel to monitor and support operational decision-making in real time.',
    desc_es: 'Panel centralizado para monitorear y apoyar la toma de decisiones operativas en tiempo real.',
    images: ['painel-operacoes.png'],
    tags: ['TypeScript', 'Python', 'PostgreSQL'],
  },
  {
    name: 'Atadiesel — Loja Autônoma',
    desc: 'App mobile com catálogo, QR Code e IA para reconhecimento de produtos em loja autônoma.',
    desc_en: 'Mobile app with catalog, QR Code and AI for product recognition in an autonomous store.',
    desc_es: 'App móvil con catálogo, código QR e IA para reconocimiento de productos en tienda autónoma.',
    images: ['login.png', 'home.png', 'produtos.png', 'detalhes.png', 'autonoma.png', 'cartoes.png'],
    tags: ['React Native', 'TypeScript', 'IA'],
  },
  {
    name: 'VerySing — Assinador de Contratos',
    desc: 'Solução segura para assinatura digital de documentos com criptografia e suporte multilíngue.',
    desc_en: 'Secure solution for digital document signing with encryption and multilingual support.',
    desc_es: 'Solución segura para firma digital de documentos con cifrado y soporte multilingüe.',
    images: ['verysing.png'],
    tags: ['TypeScript', 'Python', 'Criptografia'],
  },
  {
    name: 'Global IA — Base de Conhecimento',
    desc: 'Base de conhecimento com vídeos e guias para a plataforma Global IA.',
    desc_en: 'Knowledge base with videos and guides for the Global IA platform.',
    desc_es: 'Base de conocimiento con videos y guías para la plataforma Global IA.',
    images: ['base-conhecimento.png'],
    tags: ['TypeScript', 'React'],
  },
  {
    name: 'Elemental — Saúde Mental',
    desc: 'App para apoiar a criação de rotinas saudáveis e promover bem-estar mental.',
    desc_en: 'App to help build healthy routines and promote mental well-being.',
    desc_es: 'App para apoyar la creación de rutinas saludables y promover el bienestar mental.',
    images: ['elemental.jpg'],
    tags: ['Ionic', 'TypeScript', 'Mobile'],
  },
  {
    name: 'Serralheria Irmãos Teixeira',
    desc: 'Site institucional para serviços de serralheria, portões, grades e estruturas metálicas.',
    desc_en: 'Institutional website for metalwork services, gates, railings and steel structures.',
    desc_es: 'Sitio institucional para servicios de herrería, portones, rejas y estructuras metálicas.',
    images: ['irmaosteixeira.jpeg'],
    tags: ['React', 'TypeScript', 'CSS3'],
  },
  {
    name: 'Vitalongis',
    desc: 'Site que conecta famílias a cuidadores qualificados para idosos.',
    desc_en: 'Website connecting families with qualified caregivers for the elderly.',
    desc_es: 'Sitio que conecta familias con cuidadores calificados para adultos mayores.',
    images: ['vitalongis.png'],
    tags: ['React', 'Vite', 'TypeScript'],
  },
  {
    name: 'Ranking de Técnicos',
    desc: 'Sistema de ranking para otimizar o acompanhamento de performance de técnicos.',
    desc_en: 'Ranking system to optimize technician performance tracking.',
    desc_es: 'Sistema de ranking para optimizar el seguimiento del desempeño de técnicos.',
    images: ['rankingtecnicos.jpg'],
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    name: 'Sites para Elevadores',
    desc: 'Dois modelos de site moderno e responsivo para empresa de soluções de elevadores.',
    desc_en: 'Two modern, responsive website models for an elevator solutions company.',
    desc_es: 'Dos modelos de sitio moderno y responsivo para una empresa de ascensores.',
    images: ['modelo1-elevador.png', 'modelo2-elevador.png'],
    tags: ['TypeScript', 'JavaScript', 'CSS'],
  },
  {
    name: 'Rede de Hotéis',
    desc: 'Site de divulgação de hotéis, quartos e serviços.',
    desc_en: 'Showcase website for hotels, rooms and services.',
    desc_es: 'Sitio de divulgación de hoteles, habitaciones y servicios.',
    images: ['redehoteis.png'],
    tags: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'Gestão Hoteleira Interna',
    desc: 'Plataforma para gerenciar reservas, funcionários e operações hoteleiras.',
    desc_en: 'Platform to manage reservations, staff and hotel operations.',
    desc_es: 'Plataforma para gestionar reservas, empleados y operaciones hoteleras.',
    images: ['gerenciamento-hotel.PNG'],
    tags: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'Sistema de Notas Universitário',
    desc: 'Aplicação para acompanhar desempenho estudantil com importação automática e análises.',
    desc_en: 'Application to track student performance with automatic import and analytics.',
    desc_es: 'Aplicación para seguir el rendimiento estudiantil con importación automática y análisis.',
    images: ['sistemanotas.PNG'],
    tags: ['Python', 'TypeScript'],
  },
  {
    name: 'Organizador de Agenda',
    desc: 'Sistema para organizar a agenda de técnicos externos, integrado ao Google Agenda.',
    desc_en: 'System to organize field technicians\' schedules, integrated with Google Calendar.',
    desc_es: 'Sistema para organizar la agenda de técnicos externos, integrado con Google Calendar.',
    images: ['Organizadoragenda.PNG'],
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    name: 'Controle de Solicitações',
    desc: 'Plataforma para gerenciar solicitações de melhorias em sistemas corporativos.',
    desc_en: 'Platform to manage improvement requests for corporate systems.',
    desc_es: 'Plataforma para gestionar solicitudes de mejoras en sistemas corporativos.',
    images: ['painel_de_solicitacoes.PNG'],
    tags: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'Controle de Estoque',
    desc: 'Solução mobile para gerenciamento de estoque com interface simples e rápida.',
    desc_en: 'Mobile solution for inventory management with a simple, fast interface.',
    desc_es: 'Solución móvil para gestión de inventario con una interfaz simple y rápida.',
    images: ['controleestoque.jpg'],
    tags: ['TypeScript', 'Tailwind', 'Mobile'],
  },
];

/* certificações — link pode ser uma foto do certificado (img/cert-*.jpg) ou uma URL */
const CERTS = [
<<<<<<< HEAD
  { year: '2026', name: 'Análise e Desenvolvimento de Sistemas', inst: 'UNISUAM · Graduação tecnológica', link: 'img/cert-ads.jpg' },
  { year: '2026', name: 'Análise de Dados com Python', inst: 'Em andamento', soon: true },
=======
  { year: '2026', name: 'Análise de Dados com Python', inst: 'Em andamento', soon: true },
  { year: '2026', name: 'Análise e Desenvolvimento de Sistemas', inst: 'UNISUAM · Graduação tecnológica', link: 'img/cert-ads.jpg' },
>>>>>>> cc7c677 (Atualizando tudo)
  { year: '2025', name: 'AWS Cloud Practitioner Essentials', inst: 'AWS Training & Certification · Cloud', link: 'img/cert-aws-cloud.jpg' },
  { year: '2025', name: 'Looker Studio — Criando o primeiro relatório', inst: 'Alura · Análise de dados', link: 'https://cursos.alura.com.br/certificate/1dcf01b3-bdec-482e-8fed-71078dac2458' },
  { year: '2025', name: 'Linux I — Conhecendo o Terminal', inst: 'Alura', link: 'https://cursos.alura.com.br/certificate/111e30d8-904b-47a7-924a-2e2a42e30797' },
  { year: '2025', name: 'Oratória para Líderes', inst: 'Alura · Comunicação profissional', link: 'https://cursos.alura.com.br/certificate/b096ef72-93e5-4a8a-ac2f-6ac4ac6218ec' },
  { year: '2024', name: 'Fundamentos de Liderança', inst: 'Voitto · Comportamento', link: 'img/cert-lideranca.jpg' },
  { year: '2023', name: 'Desenvolvimento Front-End para Web', inst: 'UNISUAM · Qualificação tecnológica', link: 'img/cert-front-end.jpg' },
  { year: '2023', name: 'Fundamentos do Power BI', inst: 'Voitto · Análise de dados' },
  { year: '2023', name: 'Fundamentos de Minitab', inst: 'Voitto · Análise de dados' },
  { year: '2023', name: 'Empreendedorismo Digital', inst: 'Formação empreendedora', link: 'img/cert-empreendedorismo.jpg' },
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
  { name: 'AWS Cloud', slug: null, fallback: 'AWS', color: 'FF9900', sz: 86 },
  { name: 'Looker Studio', slug: 'looker', color: '4285F4', sz: 72 },
  { name: 'Power BI', slug: null, fallback: 'BI', color: 'F2C811', sz: 78 },
  { name: 'Git & GitHub', slug: 'git', color: 'F05032', sz: 84 },
  { name: 'Linux', slug: 'linux', color: 'FCC624', sz: 76 }, /* amarelo do Tux — visível nos dois temas */
];
