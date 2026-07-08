# Portfólio — Rayanne Ernandez

Portfólio pessoal com animações de scroll avançadas. 100% estático: HTML + CSS + JavaScript puro.

## Estrutura

```
index.html          → toda a estrutura das seções
css/style.css       → design completo (tema, responsivo)
js/data.js          → DADOS: projetos, certificações, imagens do marquee
js/effects.js       → efeitos de canvas (partículas, terminal, boneco de visão computacional)
js/main.js          → animações de scroll (GSAP + Lenis), cursor, nav, loader
```

## Como editar o conteúdo

- **Projetos / certificações / imagens do marquee / skills** → tudo em `js/data.js`. As imagens vêm do repositório do portfólio antigo (`rayanneernandez/portifolio/img/`). Para usar imagens novas, crie uma pasta `img/` aqui e troque o `IMG_BASE` para `'img/'`.
- **Fotos de cada projeto**: cada projeto tem um array `images` — adicione mais nomes de arquivo ali e elas aparecem na galeria que abre ao clicar no card.
- **Ícones das skills**: array `SKILL_ICONS` em `js/data.js` (logos via cdn.simpleicons.org — `slug` é o nome no site simpleicons.org).
- **Textos das seções** (sobre, trajetória, experiências, contato) → direto no `index.html`.
- **Cores** → variáveis no topo de `css/style.css` (`--accent` é o roxo).
- **Código que aparece digitando no terminal** → array `CODE` em `js/effects.js`.


| Seção | Efeito | Inspiração |
|---|---|---|
| Hero | Partículas formando `</>` que se desfazem com o cursor e remontam | dobre.agency |
| Frame 2 | Terminal digitando código que cresce até tela cheia e encaixa na frase | wearemotto.com |
| Vitrine | Marquee duplo arrastável em direções opostas com bordas borradas | djectstudio.com |
| Transição | Bola preta que expande, frases no escuro, e pousa no ponto final | djectstudio.com |
| Trajetória | Linha do tempo horizontal desenhada à mão, com título fixo | danielsun.space |
| O que faço | Numeração 01–04; descrições entram/saem com o scroll | djectstudio.com |
| Projetos | Galeria de cards — clique abre modal com as fotos do projeto | — |
| Skills | Bolhas flutuantes com o logo de cada tecnologia | — |
| Experiência | Esqueleto de visão computacional que anda com o scroll (cabe em 1 tela) | mantis.works |
| Certificações | Cards estilo ticket com recorte e faixa de ano | — |
| Tudo | Cursor bolinha + loader 0→100% + scroll suave | djectstudio / oryzo |
