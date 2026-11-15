# Auditoria — Vinte Faces (etapa 1)

Branch `ajustes-figma-uml`, criada a partir da `main` (`a06d787`). Nenhum arquivo do site foi alterado nesta etapa.

**Fontes comparadas**
- Figma "Vinte Faces — Site (Alta Fidelidade)", `TcdjCbSVA7RMexyzS1R66O`. Páginas: Componentes `0:1`, Desktop `2:5`, Mobile `22:2157`. Telas lidas com `get_metadata`, `get_screenshot`, `get_variable_defs` e `get_design_context` (componentes Botão, Navegação, Card de sala, Rodapé, seções Recursos e Chamada final da home).
- Código: as 8 páginas HTML e o `Style/style.css` (783 linhas).
- Prints do Playwright das 8 páginas em 1440, 768 e 390 px (servidas com `python3 -m http.server`).
- Diagramas: `docs/DIAGRAMAS.pdf` (UML 01, 02 e 03, Revisão 2).

**Legenda**
- **P0**: quebra o design ou um requisito (PI, critérios de aceite, UML).
- **P1**: diferença visível.
- **P2**: detalhe.

---

## 0. Resumo

1. **O Figma não é um ajuste visual do site do Marcelo: é um redesenho com texto novo.** A estrutura geral bate (nav, intro, seções, CTA, rodapé), e as classes dele servem para quase tudo. Mas em todas as 7 telas o Figma traz títulos, textos, ordem das seções e várias seções que não existem no código: filtros e paginação em Salas, FAQ e "Para quem é" em Como funciona, quatro blocos alternados em Recursos, live em destaque em Lives, problema, princípios, identidade e equipe em Sobre. Seguir a regra "o Figma vence" significa trocar a maior parte do texto das páginas. A lista completa está na seção (a). Preciso do seu ok antes da etapa 4 (dúvida D1).
2. **A tela Contato não existe no desktop do Figma**, só na versão mobile (`22:3122`). O desktop vai ser derivado do mobile (dúvida D2).
3. **Os tokens de cor e de tipo estão bem definidos no Figma** e confirmam o que o prompt já tinha observado. Há ainda dois tokens que o prompt não citava: **Grafite/700 `#322B25`** e **Feedback/Perigo `#C4473A`**.
4. **O fundo da página no Figma é Grafite/900.** As seções alternam 900 e 800, e cards e superfícies usam 800 (ou 900 sobre fundo 800). O código usa 800 no `body` e 600 nos cards.
5. **A fonte do corpo é Inter, que nem é carregada hoje.** O `@import` traz só Cinzel e Lora. Todo o texto de interface do Figma (nav, botões, overline, labels) é Inter, inclusive em maiúsculas com tracking.
6. **Três ilustrações do Marcelo já são as mesmas do Figma.** `card1.png` (masmorra), `card2.png` (masmorra 2) e `card3.png` (mesa com dados) são as capas 1–3 do card de sala. `card2` e `card3` estão no repositório sem uso.
7. **`lives.html` não tem nenhuma imagem**, o que descumpre a exigência do PI (P0).
8. **No mobile não há menu.** A nav quebra em duas linhas e o cabeçalho chega a 253 px de altura em 390 px. O Figma pede uma barra de 64 px com hambúrguer e um menu em tela cheia.
9. **Não há overflow horizontal em nenhuma página** em 1440, 768 ou 390 px, e o console não mostrou erros. Todas as `<img>` têm `alt`.
10. **Diagramas:** há quatro casos de uso sem método que os sustente. O UML 02 chama uma consulta de salas que não existe no UML 01. As multiplicidades 0..1 de Live e Chamada brigam com o site ("Sessão 12"). O site promete coisas que os diagramas não modelam (tokens, convite, chat da plateia). O login com senha contradiz o Usuario. Detalhes na seção (b).

---

## (a) Design: Figma × código, página por página

### a.0 Base e componentes compartilhados (valem para todas as páginas)

| # | Item | Figma | Código hoje | Prioridade |
|---|---|---|---|---|
| B1 | Fonte do corpo | Inter (Body 16/24, Body L 18/28, Small 14/20, Label 13/16 500, Nav 15/20 500, Button 14/16 600 +1px caixa alta, Overline 12/16 600 +2px caixa alta) | Lora em tudo; Inter não é carregada | **P0** |
| B2 | Títulos | Cinzel **Bold 700**, em caixa mista (o efeito de versalete é da própria Cinzel). Display 64/72, H1 48/56, H2 36/44, H3 24/32, H4 18/28 +0.5. Mobile: Display 36/44, H1 32/40, H2 28/36, H3 20/28 | Cinzel com peso padrão; `h1` com `clamp(2rem,4vw,3.3rem)`, `h2` com `clamp(1.5rem,3vw,2.2rem)`, `h3` 1.15rem; textos escritos em CAIXA ALTA no HTML | **P0** (escala) / P1 (caixa) |
| B3 | Tokens que faltam | Couro/500 `#6B4226`, Vinho/500 `#7B1F2E`, Feedback/Sucesso `#5E9E6B`, **Feedback/Perigo `#C4473A`**, **Grafite/700 `#322B25`** | Não existem no `:root` | **P0** |
| B4 | Cores soltas | Só tokens | `#211c18` (`.salas-d`), `#51463b` (`.bloco`, `.painel`, `.login-layout`), `#665747` (inputs), `#8a7136` (`.conteudo`), `#40372f` repetido em 3 bordas (em vez de `var(--grafite-600)`), `rgba(28,24,20,…)` e `rgba(201,162,39,.15)` no login | **P0** (critério de aceite) |
| B5 | Fundo da página | Grafite/900; seções alternam 900 e 800 (ex.: na home, Hero 900, Recursos 800, Como funciona 900, Salas 800, Lives 900, CTA 900) | `body` em Grafite/800 | P1 |
| B6 | Container e grid | 1200 px úteis (margem de 120 px em 1440), 12 colunas, gutter de 24 px; margem de 16 px no mobile | `.container` com `min(1160px, 90%)`; `.sessao` com `min(1200px, 92%)`; `.salas-d` e `.footerGrid` com `padding 5%`; header com `4%` | P1 |
| B7 | Ritmo vertical | Seções com `padding: 96px 0`; 56 px entre o cabeçalho da seção e o conteúdo; gaps de 16, 24 e 32 | `.section` 48 px, `.page-intro` 76/42, `.sessao` 55; valores fora da escala de 4 (18, 22, 35, 38, 45, 55, 65) | P1 |
| B8 | Raios | Botão 8, card 12, banner CTA 20, badge 999 | Botão 6, `.card` 16, `.bloco` 14, `.etapa` 12, `.cta` 18 | P1 |
| B9 | Navegação desktop | Altura 80, padding lateral de 120, fundo 900 e borda inferior 600. Logo: d20 de 36 px + "VINTE FACES" Cinzel 18 com tracking de 3 px. Links Inter 500 15 px com 28 px de gap; o ativo fica em ouro com borda inferior de 2 px. Ações: botão **Fantasma** "ENTRAR" (borda 600, texto pergaminho-100) e **Primário** "CRIAR SALA" | Altura 92, `.LogoTipo.png` com 190 px, gap de 4 px; "ENTRAR" com borda **ouro** e fundo 800 | P1 |
| B10 | Texto da nav | "Início" | "Inicio" sem acento em 7 páginas (só a `login.html` tem acento) | P1 |
| B11 | Navegação mobile | Barra de 64 px: logo à esquerda, ícone de menu à direita. **Menu aberto** em tela cheia (fundo 900): links Cinzel 20 com chevron e divisória, item ativo em ouro, botões ENTRAR (Fantasma G) e CRIAR SALA (Primário G) com largura total no rodapé do menu | Não existe: a nav quebra em linhas e o header mede 145 px (768) e 253 px (390) | **P0** |
| B12 | Botões | Três tipos (Primário: fundo ouro, texto 900; Secundário: borda ouro de 1,5 px, texto ouro; Fantasma: borda 600, texto 100) e dois tamanhos (M: padding 16/24; G: 20/36). Texto Inter 600 14 px, caixa alta, tracking de 1 px | `.m-btn`, `.h2-btn` e `.btn-card` com borda ouro de 1 px, padding 10/16 e 13/18, Lora sem tracking. As cores vêm de classes utilitárias (`.ouro-500`, `.ouro-500-border`, `.grafite-800`) | P1 |
| B13 | Card de sala | Fundo 800, borda 1 px 600, raio 12. Capa de 200 px. Conteúdo com padding 20 e gap 16. Badges em pílula (Overline 12, tracking 2): visibilidade com borda ouro e "● AO VIVO" com fundo **Vinho**. Título Cinzel H4. Uma linha "Mestre: X · Sistema: Y" em Small. Rodapé com ícone de usuários de 20 px + "x/y jogadores" e botão Secundário M "ENTRAR" | Fundo 600, raio 16, capa de 190 px, título com `style="margin-top:15px"` inline, Mestre e Sistema em duas linhas, nenhum badge "ao vivo", sempre "PÚBLICA" | P1 (+ **P0** pelo inline, ver B16) |
| B14 | Capas dos cards | 6 capas (`3:251`–`3:573`): capa 1 = `card1.png`, capa 2 = `card2.png`, capa 3 = `card3.png`; as capas 4–6 são variações das mesmas ilustrações | `card1.png` repetido nos 3 cards; `card2` e `card3` sem uso | P1 |
| B15 | Rodapé | Fundo **800**. Colunas: marca (384 px) + 3 colunas flex. Padding 64/48 e 120 nas laterais. Títulos em Overline. "EXPLORAR", "**EMPRESA**" (Sobre, Contato, **Termos de uso**, **Política de privacidade**), "**FALE COM A GENTE**" (e-mail, **@vintefaces nas redes**, FATEC). Descrição: "Salas de RPG de mesa online, sem gambiarra: dados, mapas, fichas e chamadas em um só lugar." Barra inferior com borda 600 e padding 24 | Fundo 900, "PROJETO" e "FALE CONOSCO", sem Termos/Política/redes, outra descrição, `margin-top: 65px` | P1 |
| B16 | `style` inline | Proibido pelo critério de aceite | 6 `<h3 style="margin-top:15px">` (index, salas), 1 `<p style="margin-top:14px">` (sobre) | **P0** |
| B17 | `alert()` e JS inline | Estados do Figma (input com foco, input com erro e mensagem com ícone de alerta) | `onclick="alert(…)"` no contato; `onsubmit`/`onclick` com `alert` no login (3×) | **P0** |
| B18 | Links `#` | Nenhum sem função | "ENTRAR" do header com `href="#"` em 6 páginas; "ENTRAR" dos cards em salas (3×); "CRIAR MINHA SALA" em salas; `action="#"` no contato; "Esqueceu a senha?" e "Cadastre-se" no login | **P0** |
| B19 | Destino de "CRIAR SALA" | Um destino único | `salas.html` no index, `login.html` nas outras 6 páginas | P1 |
| B20 | Foco visível | Não desenhado no Figma (só o "Input (foco)", com borda ouro) | Sem `:focus-visible`; `.login-form input` usa `outline: none` | **P0** (critério de aceite) |
| B21 | Hover | Não desenhado no Figma | `filter: brightness(1.12)` + `translateY(-1px)` com `transition`, sem `prefers-reduced-motion` | P2 |
| B22 | Ícones | Ícones de linha (dice, map, sheet, video, users, check, chevron, arrow, search, play, eye, mail, clock, globe, chat, send, close, menu, alert, plus) em ouro, num círculo Couro de 52–64 px | PNGs de 24 px sem fundo e **emojis** em `recursos.html` | P1 |
| B23 | Breadcrumb | Em todas as páginas internas: "Início › Página" (Small; página atual em ouro) | Não existe | P1 |
| B24 | Banner CTA final | Fundo **Couro**, raio 20, padding 64, centralizado; H2 + Body L em pergaminho-100; botões Primário G + Fantasma G; **sem imagem** | `.cta`: fundo 900, imagem `rodape.jpg` à esquerda, um botão `.btn-card` | P1 |

### a.1 Início (`index.html` × `5:22` / mobile `22:2158`)

| # | Diferença | Prioridade |
|---|---|---|
| I1 | **Ordem das seções.** Figma: Hero → Recursos ("Tudo que a mesa precisa") → Como funciona → Salas em destaque → **Lives** → Chamada final. Código: Hero → Salas → Ferramentas → 3 passos → CTA (não tem a seção Lives) | **P0** |
| I2 | **Hero (texto).** Overline "RPG DE MESA ONLINE", Display "Sua mesa de RPG, sem gambiarra.", Body L "Dados, mapas, fichas e chamadas de vídeo em um só lugar. Crie salas públicas ou privadas, jogue com seus amigos e transmita suas aventuras ao vivo.", botões **CRIAR MINHA SALA** (Primário G) e **EXPLORAR SALAS** (Secundário G), linha de 3 diferenciais com check (Públicas e privadas · Lives para assistir · Dados e fichas). Código: "SUA AVENTURA COMEÇA AQUI.", outro texto, botões na ordem inversa, sem diferenciais | **P0** (texto trocado) |
| I3 | **Hero (imagem).** Mapa de masmorra (576×540, raio 12, borda) com dois cartões flutuantes: "● AO VIVO · Cripta do Rei Cinza · 4/6" e "Caio rolou d20 · Destreza / 17 + 3 = 20 · Sucesso" (verde Sucesso). Código: `dados.jpg` (dragão) | **P0** (ilustração trocada) |
| I4 | Recursos: 4 cards em linha (fundo 900 sobre seção 800, ícone num círculo Couro, H4, Small, link "Saiba mais →"): Dados, Mapas, Fichas, Chamadas e lives. Código: grade 2×2 de `.bloco` (Rolagem de dados, Fichas personalizadas, Mapas e cenários, Sessões personalizadas), sem link | P1 |
| I5 | Como funciona: duas colunas. À esquerda, Overline, H2 "Do convite ao primeiro d20 em três passos", texto e botão Secundário "VER PASSO A PASSO"; à direita, 3 passos (número 01/02/03 num círculo com borda ouro): Crie sua sala / Convide a mesa / Jogue e transmita. Código: título centralizado na coluna e passos "Crie ou encontre uma sala / Prepare seu personagem / Reúna seus amigos e jogue!" | P1 |
| I6 | Salas em destaque: cabeçalho com botão "VER TODAS AS SALAS" à direita; cards Cripta do Rei Cinza (Pública + Ao vivo, 4/6), **A Taverna do Corvo** (Privada, Call of Cthulhu, 2/5), **Ruínas de Valdoria** (Pública, 5e, **6/6**). Código: Cripta, Floresta Esquecida, Sombras de Astra | P1 |
| I7 | Seção Lives (não existe no código): imagem da mesa com badge "AO VIVO" e botão play, H2 "Assista aventuras ao vivo", texto, 3 checks, botão Primário M "VER LIVES" | **P0** |
| I8 | Chamada final: "Pronto para rolar o dado?" + CRIAR MINHA SALA / FALAR COM A GENTE. Código: "O DESTINO DA AVENTURA ESTÁ NAS SUAS MÃOS." com `rodape.jpg` | P1 |
| I9 | Mobile: ordem igual; hero empilhado com a imagem abaixo; cards de recurso em coluna; botões com largura total | P1 |

### a.2 Salas (`salas.html` × `6:270` / `22:2380`)

| # | Diferença | Prioridade |
|---|---|---|
| S1 | Cabeçalho: breadcrumb, H1 "Salas abertas", texto "Escolha uma mesa para entrar ou crie a sua. Salas públicas aceitam qualquer jogador; as privadas só entram por convite.", botão Primário G "CRIAR SALA" à direita. Código: intro centralizada "SALAS DE AVENTURA" + uma segunda seção "SALAS EM DESTAQUE" com aviso de exemplos | P1 |
| S2 | **Barra de filtros** (painel 800, raio 12): busca "Buscar sala...", chips Todas (ativo, fundo ouro) / Públicas / Privadas / Ao vivo, select "Sistema: todos". No mobile: busca + chips, sem o select. Não existe no código | **P0** (requisito da etapa 5) |
| S3 | 6 cards em 2 linhas: Cripta do Rei Cinza (Púb + Ao vivo, 5e, 4/6), A Taverna do Corvo (Priv, CoC, 2/5), Ruínas de Valdoria (Púb, 5e, 6/6), O Mercado das Sombras (Púb + Ao vivo, Tormenta20, 3/6), Torre do Mago Louco (Púb, 5e, 1/4), Mesa de Domingo (Priv, Ordem Paranormal, 5/5). Código: 3 cards com descrição | P1 |
| S4 | Paginação ‹ 1 2 3 › (botões de 40 px, página ativa em ouro) | P1 (ver D5) |
| S5 | Faixa final: painel 800 "Não achou a mesa ideal?" + botão Secundário G "CRIAR MINHA SALA". Código: `.cta` com imagem | P1 |
| S6 | "ENTRAR" dos cards e "CRIAR MINHA SALA" apontam para `#` | **P0** |

### a.3 Como funciona (`como-funciona.html` × `6:759` / `22:2429`)

| # | Diferença | Prioridade |
|---|---|---|
| C1 | Cabeçalho em duas colunas: breadcrumb, H1 "Do convite ao primeiro d20", texto, botões CRIAR MINHA SALA / VER RECURSOS; à direita, ilustração da mesa (`card3.png`). Código: intro centralizada "COMO FUNCIONA?" sem imagem | P1 |
| C2 | "Quatro passos até a aventura": grade 2×2 de cards (ícone num círculo Couro, "PASSO 01" em Overline, H3, texto): Crie sua sala / Convide a mesa / Monte a cena / Jogue e transmita. Código: 4 `.etapa` em coluna com outros textos ("Crie sua conta…", "Monte sua ficha") | P1 |
| C3 | Seção **"Para quem é"** (não existe): 3 perfis com checks (Mestres, Jogadores, Espectadores) | **P0** (mostra os papéis do UML) |
| C4 | Seção **FAQ** (não existe): coluna com H2 "Perguntas frequentes" e link para contato; 4 perguntas em acordeão (a aberta tem borda ouro e chevron para baixo). O Figma só traz a resposta da 1ª pergunta | **P0** (requisito da etapa 5) |
| C5 | Chamada final "Pronto para rolar o dado?" + CRIAR MINHA SALA / VER SALAS ABERTAS. Código: "PRONTO PARA COMEÇAR?" com imagem | P1 |

### a.4 Recursos (`recursos.html` × `7:757` / `22:2600`)

| # | Diferença | Prioridade |
|---|---|---|
| R1 | Cabeçalho centralizado: breadcrumb, H1 "Tudo que a mesa precisa", texto. Código: "RECURSOS" | P1 |
| R2 | 4 blocos alternados (texto e imagem trocam de lado, fundos 800/900): **Dados** "Role à vista de todos" (ilustração da mesa + cartão de rolagem); **Mapas** "Do mapa ao token, sem sair da sala" (masmorra + barra de ferramentas); **Fichas** "Ficha sempre à mão" (**mock de ficha** em HTML: Aldric, o Errante · Guerreiro · Nível 5, atributos FOR–CAR, barra de vida 32/40, perícias); **Chat e chamadas** "Conversem como numa mesa de verdade" (**mock de chat**: presença, bolhas, badge Mestre, rolagem no chat, campo de mensagem). Cada bloco tem ícone, Overline, H2, texto e 3 checks. Código: grade 2×3 de `.painel.feature` com **emojis**, incluindo "Organização da campanha" e "Lives" | **P0** (nenhuma imagem real na página hoje, e emojis no lugar de ícones) |
| R3 | Seção de texto final do Marcelo ("MAIS TEMPO PARA A HISTÓRIA…") vira a Chamada final "Monte sua mesa agora" + CRIAR MINHA SALA / VER COMO FUNCIONA | P1 |

### a.5 Lives (`lives.html` × `7:1101` / `22:2854`)

| # | Diferença | Prioridade |
|---|---|---|
| L1 | **A página não tem imagem** (exigência do PI) | **P0** |
| L2 | Conceito: o código diz "AS LIVES ESTÃO CHEGANDO!" (em breve); o Figma mostra a página funcionando: cabeçalho com "INICIAR UMA LIVE", **live em destaque** (1200×480, badge AO VIVO, "128 assistindo", play, "Cripta do Rei Cinza — Sessão 12", meta), "Mesas ao vivo" (3 cards com "x assistindo" e botão "ASSISTIR"), "Transmita sua mesa em três passos" (01/02/03 grandes em ouro) e a Chamada final "Sua aventura merece plateia" | **P0** |

### a.6 Sobre (`sobre.html` × `8:1066` / `22:2950`)

| # | Diferença | Prioridade |
|---|---|---|
| O1 | Cabeçalho em duas colunas: breadcrumb, H1 "Feita por quem joga RPG", texto, CONHECER OS RECURSOS / FALE COM A GENTE, ilustração da mesa. Código: "SOBRE O VINTE FACES" centralizado + `.duas-colunas` com `dados.jpg` | P1 |
| O2 | "O problema": masmorra à esquerda + "Dez abas abertas para uma mesa de RPG" e dois parágrafos. Substitui "NOSSA IDEIA" | P1 |
| O3 | "Nossos princípios": 3 cards com ícone (Sem gambiarra, Mesa para todos, Narrativa em primeiro lugar). Substitui os 2 `.bloco` (Objetivo / Valores) | P1 |
| O4 | **"Couro, ouro e vinho"** (identidade visual com 3 amostras de cor e os hex): não existe | P1 |
| O5 | **"A equipe"**: 3 cards com avatar de inicial (P em Couro, M em Vinho, C em Ouro), nome e "Integrante da equipe". Hoje o site não cita os integrantes | **P0** (identificação do PI) |
| O6 | Chamada final "Venha jogar com a gente" + CRIAR MINHA SALA / VER SALAS. O bloco "DESENVOLVIDO NA FATEC PRAIA GRANDE" do Marcelo some no Figma (o texto vira o subtítulo da equipe) | P1 |

### a.7 Contato (`contato.html` × **só mobile** `22:3122`)

| # | Diferença | Prioridade |
|---|---|---|
| T1 | **Não há tela desktop no Figma.** Proposta: manter o `.contato-grid` do Marcelo em duas colunas, com o formulário à esquerda e a coluna de informações à direita, usando os componentes do mobile | P1 (ver D2) |
| T2 | Cabeçalho: breadcrumb, H1 "Fale com a mesa", "Dúvidas, sugestões ou parcerias? Envie uma mensagem e responderemos o quanto antes." Código: "CONTATO" | P1 |
| T3 | Formulário (painel 800, raio 12): título "Envie uma mensagem"; campos Nome, E-mail, **Assunto como select** ("Selecione um assunto") e Mensagem; botão Primário G com largura total. **Estados:** foco (borda ouro) e erro (borda Perigo + ícone de alerta + "Informe um e-mail válido.") | **P0** (substitui o `alert()`) |
| T4 | Coluna de informações: ilustração da masmorra; 3 cartões com ícone (E-mail, Atendimento "Segunda a sexta, das 9h às 18h", Redes sociais "@vintefaces"); link "Dúvidas rápidas? Veja o FAQ em Como funciona." Código: `aside.painel` com e-mail e "Projeto" | P1 |
| T5 | Placeholders de exemplo do Figma ("Pedro Bastos", "pedro@email") mostram o estado preenchido; no código, viram só exemplos de estado | P2 |

### a.8 Login (`login.html`, fora do Figma)

Recebe só os ajustes de base e componentes (tokens, Inter, nav, rodapé, botões, foco). As cores soltas (`#51463b`, `#665747`, `rgba(…)`) também viram variáveis. A contradição com o UML está na seção (b.3).

### a.9 Responsivo (768 px)

Não há overflow em nenhuma página. A 768 px, a única quebra é a nav em duas linhas (header de 145 px), que se resolve com o menu mobile (B11). O Figma não tem tela de 768: vou usar o layout mobile até ~1023 px para nav e rodapé, e a grade de 2 colunas para os cards entre 640 e 1023 px.

### a.10 Contraste (WCAG AA) com os tokens do Figma

| Par | Razão | Resultado |
|---|---|---|
| Pergaminho/400 sobre 800 / 900 | 6,62 / 7,42 | ok |
| Pergaminho/400 sobre Grafite/600 (fundo de card atual) | 4,89 | ok (deixa de existir com fundo 800) |
| Ouro sobre 900 / 800 | 7,29 / 6,51 | ok |
| Grafite/900 sobre Ouro (botão primário) | 7,29 | ok |
| Pergaminho/100 sobre Vinho (badge Ao vivo) | 8,22 | ok |
| Pergaminho/100 sobre Couro (banner CTA) | 7,02 | ok |
| Sucesso sobre 800 / 900 ("17 + 3 = 20") | 4,93 / 5,53 | ok |
| **Perigo `#C4473A` sobre 900 / 800** (texto de erro, 14 px) | **3,62 / 3,23** | **falha AA para texto normal** (ver D8) |
| Pergaminho/400 sobre Couro | 3,63 | falha; o Figma usa Pergaminho/100 no banner, então não ocorre |

---

## (b) Coerência dos diagramas

### b.1 Os diagramas entre si

**Casos de uso (UML 03) × classes e métodos (UML 01)**

| Caso de uso | Ator | Suporte no UML 01 | Situação |
|---|---|---|---|
| Buscar sala | Jogador | — (não há método de listar/filtrar; o UML 02 chama "Consulta salas disponíveis" sem nome de método) | **Falta** |
| Entrar na sala | Jogador | `Sala.entrarSala(usuario)` + `verificarVagas()` | ok |
| Visualizar mapa | Jogador | `Mapa.exibirMapa()` | ok |
| Editar sua ficha | Jogador | `Ficha.editarFicha()` | ok |
| Enviar mensagens | Jogador | `Mensagem.enviarMensagem()` | ok |
| Rolar dados | Jogador | `RolagemDado.rolarDado(faces)` | ok |
| Participar de chamada | Jogador | — (Chamada só tem `iniciarChamada`/`encerrarChamada`) | **Falta** (ex.: `Chamada.entrarChamada(usuario)`) |
| Criar sala | Mestre | `Usuario.criarSala(): Sala` | ok |
| Gerenciar sala | Mestre | — | **Falta** (ex.: `Sala.editarSala()`) |
| Controlar jogadores | Mestre | — (só a associação "controla", que liga Usuario a **Personagem**, não a jogadores) | **Falta** (ex.: `Sala.removerParticipante(usuario)`) |
| Gerenciar fichas | Mestre | `Ficha.editarFicha()` (o mesmo método do jogador) | Parcial |
| Iniciar chamada | Mestre | `Chamada.iniciarChamada()` | ok |
| Transmitir Live | Mestre | `Live.iniciarLive()` / `encerrarLive()` | ok |
| Assistir à Live | Espectador | — (o papel `espectador` existe em Participacao, mas não há método) | **Falta** (ex.: `Live.assistir(usuario)`) |

**Sequência (UML 02) × classes (UML 01)**
1. **`:Sistema` não é uma classe do UML 01.** Pode ficar como fronteira/controlador, mas é bom marcar com o estereótipo `«boundary»` ou `«control»` ou citá-lo numa nota. P2.
2. **Passo 2, "Consulta salas disponíveis":** não há método correspondente (é o mesmo buraco do "Buscar sala"). Sugestão: `Sala.listarSalas(filtro)` ou um `Sistema.buscarSalas()`. P1.
3. **Passo 12, `rolarDado(20)`:** está declarado como método de instância de `RolagemDado`, que já tem o atributo `faces`. Funciona, mas o método preenche `faces`, `resultado` e `total` de um objeto que nasce vazio. Sugestão: deixar claro que `rolarDado(faces)` cria e preenche a rolagem, ou mover para `Sala.rolarDado(faces, autor)`. P2.
4. **Passo 14, `enviarMensagem()`:** a mensagem parte de `:RolagemDado` para `:Mensagem`, mas não há associação RolagemDado → Mensagem e o método não recebe o conteúdo. Sugestão: `enviarMensagem(conteudo)` chamado pelo Sistema ou pela Sala com o texto da rolagem. P1.
5. **`entrarSala(usuario)` não recebe o papel.** Participacao precisa de `papel`, então o UML 02 assume `jogador` implicitamente. Sugestão: `entrarSala(usuario, papel)` ou uma nota "entra como jogador". P2.
6. **`verificarVagas()`:** o diagrama não diz quem conta para o limite. Mestre e espectadores contam? Sugestão: nota "conta só Participacao com papel = jogador e status = ativo". P1.

**Multiplicidades e notas**
1. **Live 0..1 e Chamada 0..1 por Sala** impedem histórico. O site fala em "Sessão 12" e "Transmita sua mesa" como coisa recorrente. Sugestão: 0..*, com a regra "no máximo uma `aoVivo`/`ativa` por vez". P1.
2. **"cria" (Usuario 1 — 0..* Sala) duplica Participacao(papel = mestre).** Se o criador sair, quem é o mestre? Sugestão: `criarSala()` cria também a Participacao de mestre e a associação vira "criador", ou é removida. P2.
3. **`Participacao.status: string` sem valores definidos.** O site fala em "online, offline e vez do jogador". Sugestão: listar os valores numa nota (ex.: `ativo | saiu | removido`) e separar presença, se for o caso. P2.
4. **`Ficha.atributos: string`** é pobre para o que o site mostra (FOR–CAR, vida, perícias). Serve para o protótipo; sugestão opcional: `atributos: Map<string,int>`, `vidaAtual`, `vidaMax`. P2.
5. As demais multiplicidades batem com as notas: Personagem 1–1 Ficha; Mensagem e RolagemDado com autor Usuario 1–0..*; recursos com associação própria com Sala.
6. A generalização Mestre → Jogador no UML 03 é coerente com Participacao.papel no UML 01.

### b.2 Diagramas × site (texto do Figma, que vai substituir o atual)

**O que o site promete e os diagramas não modelam**

| Promessa no site | Onde | No UML? | Sugestão |
|---|---|---|---|
| Tokens no mapa, grade ajustável, "controle do que cada jogador enxerga" | Recursos/Mapas, Início, Como funciona | Não (Mapa só tem `nome` e `imagemUrl`) | Classe `Token` ou nota de escopo futuro; ou suavizar o texto |
| Vantagem/desvantagem | Recursos/Dados | Não | Atributo em RolagemDado, ou tirar o texto |
| Convite por link; privadas "só entram por convite" | Salas, Como funciona | Não (nada sobre convite; `entrarSala` não diferencia pública/privada) | Classe/atributo `Convite` ou nota; decidir o comportamento de "Entrar" numa privada (D6) |
| "Permitir espectadores (live)" como opção da sala | Lives, passo 01 | Não (Sala não tem esse atributo) | `Sala.permiteEspectadores: boolean` |
| **Chat separado para a plateia** / espectadores "participam do chat da plateia" | Início/Lives, Como funciona | **Contradiz o UML 03** (Espectador só "Assistir à Live") e Mensagem não tem canal | Adicionar o caso "Enviar mensagem na plateia" ao Espectador + `Mensagem.canal`, ou tirar do site |
| "128 assistindo", "86 assistindo" | Lives | Derivável (contar Participacao com papel espectador) | ok, como dado de exemplo |
| Presença online/offline/vez do jogador | Recursos/Chat | Indefinido (`status`?) | Ver b.1-3 |
| Histórico de rolagens | Recursos/Dados | Sim (Sala 0..* RolagemDado) | ok |
| Badge "Mestre" no chat | Recursos/Chat | Sim (Participacao.papel) | ok |
| Ficha: nome, classe, nível | Recursos/Fichas | Sim (Personagem) | ok |

**O que os diagramas têm e o site não mostra:** "Controlar jogadores" e "Gerenciar fichas" aparecem só de leve ("Criam e controlam a sala"). Não é incoerência; o Figma cobre o suficiente.

**Papéis.** Mestre, jogador e espectador são descritos do mesmo jeito em "Para quem é" (Figma) e no UML 03. A exceção é o chat da plateia, citado acima. Hoje o site do Marcelo não fala de papéis em lugar nenhum.

**Dados dos cards × atributos**

| Dado no card | Origem no UML |
|---|---|
| Título | `Sala.nome` |
| Sistema | `Sala.sistema` |
| PÚBLICA / PRIVADA | `Sala.publica` |
| "x/y jogadores" | x = contagem de `Participacao` (papel jogador, status ativo); y = `Sala.limiteJogadores` |
| "Mestre: Fernanda" | `Usuario.nome` da `Participacao` com papel mestre |
| ● AO VIVO | `Sala → Live.aoVivo` |
| "x assistindo" | contagem de `Participacao` com papel espectador |
| Descrição da sala (cards atuais do Marcelo) | **não existe** em Sala (o Figma também tirou) |
| Capa | não existe em Sala (decoração; pode virar `capaUrl` no JS sem tocar no UML, ou ficar só no HTML) |

Os cards "Ruínas de Valdoria 6/6" e "Mesa de Domingo 5/5" do Figma servem de exemplo pronto para o ramo **[sala lotada]** do UML 02.

### b.3 Diagramas × código

| # | Contradição | Prioridade |
|---|---|---|
| U1 | **`login.html` pede senha.** `Usuario {id, nome, email}` não tem senha. Também não há UML para "Lembrar de mim", "Esqueceu a senha?" nem "Cadastre-se" | **P0** |
| U2 | O site atual não tem nenhuma das classes nem métodos (não há JS) | **P0** (etapas 5–6) |
| U3 | `lives.html` diz que as lives "estão chegando", mas `Live` existe no UML e o Mestre tem "Transmitir Live" | P1 |
| U4 | Os cards são todos "PÚBLICA" e nenhum está ao vivo, então `publica` e `aoVivo` não variam | P1 |
| U5 | Recursos cita "Organização da campanha", que não tem classe | P2 (sai com o texto do Figma) |
| U6 | Como funciona passo 01 "Crie sua conta": não há caso de uso de cadastro | P2 (sai com o texto do Figma) |

---

## (c) Plano de mudança por arquivo

Princípio geral: **manter o esqueleto HTML e as classes do Marcelo, trocar os valores no CSS e o texto onde o Figma manda.** Classes novas só onde nenhuma existente serve.

### `Style/style.css`

**Mantido:** a ordem das regras, a indentação de 4 espaços, todos os nomes de classe e o bloco do login.

**Ajustado:**
- Etapa 2:
  - `:root` ganha os tokens que faltam: Couro, Vinho, Sucesso, Perigo, Grafite/700, mais escala de espaço, raios e container.
  - O `@import` passa a carregar Cinzel 700 + **Inter** 400/500/600 no lugar de Lora.
  - `body`: fundo 900, fonte Inter 16/24.
  - `h1`–`h4` e `.eyebrow` recebem os valores do Figma (com a escala mobile num `@media`).
  - `.container`: 1200 px + 16 px de margem.
  - `.section`: 96 px de padding.
  - Cores soltas trocadas por variáveis; os `rgba(…)` do login viram `color-mix()` ou tokens.
- Etapa 3:
  - Botões `.m-btn`, `.h2-btn` e `.btn-card` com padding, raio 8, Inter 600 e tracking do Figma.
  - `.card`, `.btn-off`, header, `.navegacao`, `.h-btn`, `.btn-ativo`, `footer`, `.footerGrid` e `.cta` ajustados aos valores do Figma.

**Acrescentado (classes novas, porque nenhuma existente serve):**
- Etapa 2: `.mt-4` ou similar só se o inline não puder ir para uma regra do componente. A ideia é **não** criar utilitário e pôr a margem no `.card-conteudo h3`.
- Etapa 3:
  - `.btn-fantasma` e `.btn-g` (variante Fantasma e tamanho G do botão). A outra opção seria reaproveitar `.grafite-800` e `.m-btn`; ver D7.
  - `.badge-ao-vivo` (variante de `.btn-off`).
  - `.menu-toggle` e `.menu-mobile` (menu mobile).
  - `.breadcrumb`.
  - `.icone-circulo` (círculo Couro dos ícones).
- Etapa 4: `.filtros`, `.chip`, `.paginacao`, `.faq` (+ `details`/`summary`), `.lista-check` (ou ajuste da `.lista-simples` existente, que é o preferido), `.live-destaque`, `.amostras-cor`, `.equipe`, `.mock-ficha`, `.mock-chat`, `.cartao-flutuante`, `.info-contato`.
- Etapa 5: `.campo-erro` e `.mensagem-erro` (estados do formulário).
- Etapa 6: `.mesa` (painel da sala).
- Também: `:focus-visible` global (anel ouro de 2 px) e `@media (prefers-reduced-motion: reduce)` desligando o `translateY`/`transition` dos botões.

### HTML: igual nas 8 páginas (etapas 2 e 3)

**Mantido:** `<header>`, `<nav class="navegacao">`, `.acoes-header`, `<footer class="footerGrid">`, `LogoTipo.png` e `Icon.png`.

**Ajustado:**
- "Inicio" → "Início".
- "ENTRAR" do header → `login.html`.
- "CRIAR SALA" → um destino único (D4).
- Rodapé com o texto e as colunas do Figma (D3 sobre Termos/Política).
- `aria-current="page"` no link ativo.

**Acrescentado:**
- Botão `.menu-toggle` (`aria-expanded`, `aria-controls`) + o contêiner do menu mobile reaproveitando os mesmos links (sem duplicar a `<nav>` se der para resolver só com CSS).
- `<script defer src="js/menu.js">`.

### HTML: página por página (etapa 4)

| Arquivo | Mantido | Ajustado | Acrescentado |
|---|---|---|---|
| `index.html` | `.sessao` (hero), `.salas-d` + `.salas` + `.card`, `.sec2` + `.bloco` (recursos), `.etapas` + `.etapa` (passos), `.cta` | Texto do Figma; ordem das seções; hero com `card1.png` no lugar de `dados.jpg`; capas card1/card2/card3; `.bloco` com o ícone num círculo e o link "Saiba mais" | Seção Lives (reaproveitando `.duas-colunas` + `.ilustracao` com `card3.png`); diferenciais do hero; 2 cartões flutuantes do hero (HTML, não imagem) |
| `salas.html` | `.page-intro`, `.salas`, `.card`, `.cta` (vira a faixa) | Texto do Figma; 6 cards; tirar a 2ª seção "SALAS EM DESTAQUE" com o aviso (o aviso de "exemplos" passa para uma linha de rodapé da listagem, de acordo com o PRODUCT.md) | Breadcrumb, barra de filtros, paginação |
| `como-funciona.html` | `.page-intro` (vira duas colunas), `.etapas`/`.etapa` (vira grade 2×2), `.cta` | Texto do Figma; `card3.png` no cabeçalho | "Para quem é" (`.sec2`/`.painel` com `.lista-simples`), FAQ |
| `recursos.html` | `.page-intro`, `.duas-colunas` (cada bloco), `.feature`/`.painel` | Os 6 painéis com emoji viram 4 blocos alternados; ícones em SVG/PNG no lugar dos emojis | Mocks de ficha e de chat em HTML/CSS; cartão de rolagem |
| `lives.html` | `.page-intro`, `.em-breve` (o selo `.aviso` pode virar o badge Ao vivo) | Sai o conteúdo "em breve" | Live em destaque (`card3.png`), "Mesas ao vivo" (`.salas` + `.card`), 3 passos (`.etapa`), CTA → resolve **L1** (imagem) |
| `sobre.html` | `.duas-colunas`, `.ilustracao`, `.sec2`/`.bloco`, a seção FATEC (vira o subtítulo da equipe) | Texto do Figma; `card3.png` no cabeçalho e `card2.png` em "O problema"; `style` inline removido | Princípios (3 `.bloco` com ícone), Identidade (amostras), Equipe |
| `contato.html` | `.contato-grid`, `.formulario`, `.painel`, `.contato-info` | Texto do Figma; assunto vira `<select>`; `onclick="alert"` sai; `action="#"` sai | Cartões de informação com ícone, ilustração (`card1.png` ou `card2.png`), link para o FAQ, `<p class="mensagem-erro">` por campo (`aria-describedby`) |
| `login.html` | Layout, textos e imagens do Marcelo | Base + componentes; JS inline e `alert` saem | Ver D9 sobre a senha |

### `assets/`

**Mantido:** todos os arquivos. `dados.jpg` e `rodape.jpg` continuam em uso no login. `dados2.png` (dados em wireframe) fica sem uso; listo isso aqui em vez de apagar.

**Passa a ser usado:** `card2.png` e `card3.png`.

**Acrescentado:** os ícones de linha do Figma exportados como SVG em `assets/icones/` (pasta nova; nada é movido). Os `*_icn.png` atuais ficam no repositório e deixam de ser usados onde o Figma pede outro ícone.

### `js/` (novo, etapas 5 e 6)

| Arquivo | Conteúdo |
|---|---|
| `js/menu.js` | Abre e fecha o menu, prende o foco, fecha com ESC e devolve o foco ao botão |
| `js/faq.js` | Opcional: com `<details>`/`<summary>` o acordeão já funciona e é acessível sem JS; o JS só garante um item aberto por vez, se você quiser |
| `js/salas.js` | Busca + chips + select filtrando os `.card` por `data-*` (`data-publica`, `data-ao-vivo`, `data-sistema`) |
| `js/contato.js` | Validação no `submit` e no `blur`, estados de erro do Figma, mensagem de sucesso em `role="status"` |
| `js/dominio.js` | Classes do UML 01 com os mesmos nomes: `Usuario`, `Participacao`, `Sala`, `Personagem`, `Ficha`, `Mensagem`, `RolagemDado`, `Mapa`, `Chamada`, `Live`, e os métodos `criarSala`, `entrarSala`, `verificarVagas`, `editarFicha`, `enviarMensagem`, `rolarDado`, `exibirMapa`, `iniciarChamada`/`encerrarChamada`, `iniciarLive`/`encerrarLive` |
| `js/dados.js` | As 6 salas do Figma como dados de exemplo; grava no `localStorage` na primeira visita |
| `js/mesa.js` | O fluxo do UML 02 |

**Proposta para encaixar o UML 02 (etapa 6), a forma mais simples:**
- Os cards de `salas.html` passam a ser renderizados a partir do `localStorage` (os 6 do Figma).
- "ENTRAR" chama `sala.verificarVagas()`:
  - `true` → `sala.entrarSala(usuario)`, e abre na própria `salas.html` um **painel da sala** (`<section class="painel mesa" id="mesa" hidden>`, abaixo da listagem). O painel mostra nome, sistema, participantes, um botão "Rolar d20" e o chat (`<ol aria-live="polite">`). O botão chama `new RolagemDado().rolarDado(20)` e publica com `new Mensagem(...).enviarMensagem()`; o resultado aparece no chat.
  - `false` → o próprio card mostra "Sala lotada — entrada negada" em `role="alert"` e o fluxo termina.
- Ruínas de Valdoria (6/6) e Mesa de Domingo (5/5) testam o ramo lotado.
- Assim não nasce página nova (continuam as 8), não há navegação extra e o "exibe a sala" do UML acontece na mesma tela.
- Os cards da home levam para `salas.html#sala-<id>`.
- A alternativa é uma `sala.html` nova (mais fiel a "exibir a sala", mas é uma 9ª página com nav e rodapé duplicados). Ver D10.

**O que fazer com a `login.html` (U1).** Recomendo trocar a senha por **Nome + E-mail**, que são os atributos do Usuario:
- "Acessar conta" cria ou recupera o `Usuario` no `localStorage`, e esse é o `usuario` passado a `entrarSala(usuario)`.
- Saem "Esqueceu a senha?" e "Cadastre-se" (a entrada já cria o usuário). "Lembrar de mim" pode sair ou virar só a escolha de guardar no `localStorage`.
- O texto e o layout do Marcelo ficam; o aviso "Página demonstrativa…" fica.
- Se ninguém entrou, entrar numa sala usa um usuário convidado ("Visitante") para o fluxo rodar sem passar pelo login.

### `README.md` (etapa 7)

Reescrever o conteúdo, porque o atual é do repositório do curso: o que é o projeto, como abrir, estrutura, integrantes (os 3 da tela Sobre) e o que mudou em relação à primeira versão.

### Outros arquivos

- `PRODUCT.md`: criado nesta etapa pelo `/impeccable init`, com o contexto do produto para as próximas skills. Entra no commit.
- `PROMPT.md`: não foi tocado e está fora do git (`??`). Fica a seu critério versionar.

---

## (d) Dúvidas para você

**D1. Quanto do texto do Marcelo trocar?** O Figma reescreve praticamente todo o texto das 7 páginas (lista na seção a). Pela regra "o Figma vence", troco tudo e mantenho o HTML e as classes dele. A alternativa é manter os textos dele onde a seção existe nos dois e só acrescentar as seções novas, mas aí as telas não "batem com o Figma" (critério de aceite). **Recomendo trocar**, registrando cada troca no diff da etapa 4.

**D2. Contato no desktop.** O Figma só tem o mobile. Posso montar o desktop com o `.contato-grid` do Marcelo em duas colunas: formulário à esquerda; ilustração, cartões de contato e link do FAQ à direita. Ok?

**D3. "Termos de uso" e "Política de privacidade" no rodapé.** As páginas não existem e o critério proíbe link sem função. As opções são (a) não incluir esses dois itens, (b) criar duas páginas curtas ou (c) mostrar como texto sem link. **Recomendo (a)**, deixando registrado como divergência do Figma.

**D4. Destino de "CRIAR SALA" / "CRIAR MINHA SALA".** Hoje alterna entre `salas.html` e `login.html`. Com o UML (`Usuario.criarSala()`), as opções são:
- (a) `salas.html#criar`, com um pequeno formulário (nome, sistema, pública, limite: exatamente os atributos de Sala) que cria a sala no `localStorage` e a mostra na lista;
- (b) `login.html`, como "precisa entrar primeiro".

**Recomendo (a)**, porque fecha o caso de uso "Criar sala" com pouco código. Mas é escopo a mais na etapa 6.

**D5. Paginação de Salas.** Com 6 salas de exemplo, as páginas 2 e 3 ficariam vazias. Opções:
- (a) paginação real calculada sobre os dados, mostrando "1" só enquanto houver até 6 salas;
- (b) acrescentar salas de exemplo até encher 3 páginas;
- (c) desenhar a paginação estática com as páginas 2 e 3 desabilitadas.

**Recomendo (a).**

**D6. "Entrar" numa sala privada.** O Figma diz que privadas "só entram por convite", mas o UML 02 não tem esse ramo. Sigo o UML à risca (privada entra se houver vaga) ou mostro "Sala privada — entrada só por convite" como um terceiro desfecho? **Recomendo seguir o UML** e levar a sugestão de convite para o grupo (b.2).

**D7. Variantes de botão.** Para Fantasma e tamanho G, prefiro criar `.btn-fantasma` e `.btn-g` a reaproveitar as utilitárias `.grafite-800` e `.ouro-500-border`. As utilitárias continuam onde já estão. Ok, ou prefere que eu só reajuste as utilitárias existentes?

**D8. Contraste do vermelho de erro.** `#C4473A` sobre o fundo dá 3,62:1 e falha o AA para texto de 14 px. Isso conflita com o critério "contraste AA". Opções:
- (a) manter a borda em Perigo e escrever a mensagem de erro em Pergaminho/100, com o ícone em Perigo;
- (b) usar um tom mais claro só para o texto, por exemplo `#E0705F`, que é cor fora do Figma.

**Recomendo (a)**, que não cria cor nova.

**D9. Login.** Posso trocar Senha por Nome + E-mail e tirar "Esqueceu a senha?" e "Cadastre-se" (proposta na seção c)? Ou o grupo prefere acrescentar `senha` ao Usuario no UML e manter o formulário?

**D10. Onde roda o fluxo do UML 02.** Painel na própria `salas.html` (recomendado) ou uma `sala.html` nova?

**D11. Imagens do Figma.** As ilustrações do Figma são as mesmas que o Marcelo já tem (`card1`–`card3`). Vou usá-las em vez de exportar novas. Os **ícones** de linha eu exporto do Figma como SVG para `assets/icones/`. Ok criar essa subpasta?

**D12. Incoerências dos diagramas (seção b).** Ficam só registradas para o grupo, e o JS segue o UML como está. Para os casos de uso sem método (Buscar sala, Participar de chamada, Gerenciar sala, Controlar jogadores, Assistir à Live), **não** vou inventar métodos no `dominio.js`. A busca de salas fica em `salas.js`, fora do domínio. Ok?

---

## (e) Registro da execução

### Etapa 3: componentes compartilhados

**Mantido:** a estrutura do header (logo → `.navegacao` → `.acoes-header`), as classes `.h-btn`, `.btn-ativo`, `.h2-btn`, `.m-btn`, `.btn-card`, `.btn-off`, `.card`, `.card-conteudo`, `.card-rodape`, `.info`, `.footerGrid`, `.coluna`, `.footer-bottom` e `.ouro-500p`, o hover dos botões (brilho e 1px para cima) e o rodapé curto do login. Nenhuma classe foi renomeada.

**Ajustado (o Figma prevalece):**

- Header:
  - 80px de altura, alinhado ao container de 1200px.
  - Links em Inter 500 15/20 com espaço de 28px; logo com 36px de altura.
- Texto e links:
  - "Inicio" virou "Início" em 7 páginas.
  - O link ativo ganhou `aria-current="page"`.
  - "ENTRAR" no header aponta para `login.html` (antes era `href="#"` em 6 páginas).
  - "CRIAR SALA" aponta para `salas.html#criar` (decisão D4; antes ia para `login.html` ou `salas.html`).
- Botões:
  - Raio 8, padding 16/24, texto Inter 600 14/16 com tracking de 1px e caixa alta.
  - `.ouro-500-border` e `.btn-card` agora seguem o tipo Secundário: borda ouro de 1.5px e texto ouro.
- Card de sala:
  - Fundo 800, borda 600, raio 12 e capa de 200px.
  - Conteúdo em coluna com 16px de espaço entre os itens.
  - Os dois `<p>` "Mestre"/"Sistema" viraram uma linha só: "Mestre: X · Sistema: Y".
  - O badge agora tem o estilo Overline em pílula e fica dentro de `.badges`.
  - O ícone `group-icon.png` foi trocado pelo SVG do Figma.
- Rodapé (fundo 800, colunas 384px + 3):
  - Textos novos: a descrição "sem gambiarra", "EMPRESA" no lugar de "PROJETO", "FALE COM A GENTE" no lugar de "FALE CONOSCO" e a linha "@vintefaces nas redes".
  - Termos e Política ficaram fora (decisão D3).
  - No mobile: marca e contato ocupam a linha inteira; Explorar e Empresa ficam lado a lado.

**Adicionado:**

- Classes:
  - `.btn-fantasma` e `.btn-g` (decisão D7).
  - `.badge-ao-vivo`, para usar junto com `.btn-off`.
  - `.badges`.
  - `.menu-btn` (com `.icone-abrir` e `.icone-fechar`).
  - `header.menu-js` e `header.menu-aberto`.
  - `html.menu-travado`.
- `@media (prefers-reduced-motion: reduce)` desliga a transição e o deslocamento do hover.
- `js/menu.js`, antecipado da etapa 5 para o menu mobile não ficar quebrado entre as etapas. Ele cuida de:
  - `aria-expanded` e do rótulo do botão;
  - prender o foco com Tab dentro do menu aberto;
  - fechar com ESC, devolvendo o foco ao botão;
  - travar a rolagem da página.
  - Sem JS, os links continuam visíveis e quebram linha, como na versão original.
- Ícones do Figma: `assets/icones/{menu,fechar,chevron,chevron-ouro,usuarios}.svg`.

**Desvios conscientes:**

- O menu mobile entra abaixo de 1140px, e não a partir de 768px. O header desktop precisa de cerca de 1075px de largura.
- No mobile, a barra inferior do rodapé mantém a linha "Desenvolvimento de Software Multiplataforma · FATEC". No Figma mobile ela some.
- `assets/group-icon.png` ficou sem uso, mas não foi apagado.

### Etapa 4: páginas

Em todas as páginas, o conteúdo do `<main>` passou a seguir o Figma: textos (D1), ordem das seções e imagens. Header, rodapé e scripts ficaram como na etapa 3. Os títulos agora estão em caixa mista, como no Figma; a Cinzel cuida do efeito de versalete.

**Classes do Marcelo reaproveitadas:** `.sessao`, `.imgsec1`, `.page-intro`, `.section`, `.section-title`, `.salas-d`, `.salas`, `.card`, `.sec2`, `.bloco`, `.painel`, `.etapas`/`.etapa`/`.numero`/`.conteudo`, `.duas-colunas`, `.ilustracao`, `.cta`, `.botoes`, `.formulario`, `.contato-grid`, `.contato-info`. Nenhuma foi renomeada.

**Ajustes em regras existentes (o Figma prevalece):**

- `.imgsec1`: largura total, altura de 540px, borda 600 e raio 12.
- `.sec2`: passou a usar `auto-fit`, para comportar 2, 3 ou 4 cards.
- `.etapa`: fundo 800 com borda. O `.numero` virou um círculo de 52px com borda ouro, e o `.conteudo` perdeu a borda Couro à esquerda, que não existe no Figma.
- `.cta`: banner Couro centralizado, com padding de 64px e sem imagem.
- `.formulario`: ganhou estados de foco (borda ouro) e de erro (borda Perigo; mensagem em Pergaminho/100 com ícone de alerta, conforme D8). Também ganhou um `<select>` e o botão com largura total.
- `.contato-grid`: o formulário fica à esquerda e as informações à direita (D2).
- `.contato-info p`: a margem passou a 0.

**Classes novas:**

- Gerais: `.fundo-800`, `.texto-l`, `.lista-check`, `.icone-circulo`, `.saiba-mais`, `.visualmente-oculto`, `.link`, `.nota`.
- Home: `.diferenciais`, `.hero-imagem`, `.cartao-flutuante`, `.cartao-ao-vivo`, `.cartao-rolagem`, `.avatar` (e as variações `-g`, `-xg`, `-couro`, `-ouro`), `.section-topo`, `.section-title.centro`, `.live-imagem`, `.play`, `.chamada`.
- Salas: `.page-intro.topo`, `.breadcrumb`, `.listagem`, `.filtros`, `.busca`, `.chips`/`.chip`, `.select-sistema`, `.paginacao`/`.pagina`, `.faixa`.
- Como funciona: `.sessao.interna`, `.etapas.grade`, `.perfis`, `.faq`/`.faq-lista`/`.faq-item` (acordeão com `<details>`).
- Recursos: `.recurso`, `.recurso-midia`, `.ferramentas`, `.ficha` e partes (`.ficha-topo`, `.atributos`, `.vida`, `.barra`, `.pericias`), `.chat-mock` e partes (`.presenca`, `.bolha`, `.bolha-mestre`, `.campo-mensagem`).
- Lives: `.live-destaque`, `.espectadores`, `.live-titulo`, `.play-g`, `.passos-live`, `.numero-g`.
- Sobre: `.principios`, `.identidade`, `.amostras`/`.amostra` (com `-couro`, `-ouro` e `-vinho`), `.equipe`.
- Contato: `.contato-secao`, `.contato-card`, `.faq-link`, `.mensagem-erro`.

**Imagens:**

- `card1.png` e `card2.png` são o mesmo arquivo (mesmo md5). Por isso exportei do Figma as capas 2, 4, 5 e 6 e as ilustrações próprias de cada tela para a nova pasta `assets/capas/`:
  - `capa2.png`, `capa4.png`, `capa5.png`, `capa6.png`
  - `mapa-masmorra.jpg` (hero da home)
  - `mapa-tokens.jpg` (Recursos)
  - `mesa-ao-vivo.jpg` (Lives)
  - `mesa-rpg.jpg` (Como funciona e Sobre)
  - `mapa-problema.jpg` (Sobre)
  - `mapa-contato.jpg` (Contato)
- `card1.png` e `card3.png` continuam em uso.
- Ícones novos em `assets/icones/`: `dado`, `mapa`, `ficha`, `video`, `seta`, `check`, `play`, `busca`, `chevron-baixo`, `usuarios-ouro`, `mais`, `olho`, `chat`, `enviar`, `alerta`, `email`, `relogio`, `globo`.
- Ficaram sem uso, mas não foram apagados: `dados.jpg` (só o login usa), `dados2.png`, `group-icon.png` e os `*_icn.png`.

**Texto do Marcelo que saiu, porque o Figma o substitui:**

- Home: "SUA AVENTURA COMEÇA AQUI.", a seção "Tudo em um só lugar" com 2×2 blocos e os 3 passos antigos.
- Salas: as descrições curtas dos 3 cards e as salas "A Floresta Esquecida" e "Sombras de Astra".
- Como funciona: os 4 passos antigos ("Crie sua conta…").
- Recursos: os 6 painéis com emoji e o bloco "MAIS TEMPO PARA A HISTÓRIA…".
- Lives: o "em breve".
- Sobre: "NOSSA IDEIA", "Nosso objetivo / O que valorizamos" e o bloco "DESENVOLVIDO NA FATEC". O texto da FATEC virou o subtítulo da equipe.

**Textos que não estão no Figma e que eu escrevi:**

- As respostas das perguntas 2, 3 e 4 do FAQ. O Figma só traz a resposta da primeira. Escrevi as outras a partir dos textos do próprio Figma (Salas, Lives, Como funciona).
- As opções do select de Assunto (Dúvida, Sugestão, Parceria, Outro), tiradas do subtítulo da página.
- Três avisos de protótipo:
  - Salas: "As salas desta página são exemplos do protótipo acadêmico."
  - Lives: "Demonstração do protótipo…"
  - Contato: mantido o aviso do Marcelo.

**Pendências que dependem das etapas 5 e 6:**

- Salas:
  - Os filtros e a busca já estão na página, mas ainda não filtram.
  - A paginação mostra só a página 1 (D5: ela será calculada a partir dos dados).
  - O "ENTRAR" dos cards aponta para `#mesa` e o "CRIAR MINHA SALA" para `#form-criar`. Esse painel e esse formulário entram na etapa 6.
- O formulário do Contato ainda não valida.
- O login mantém os `alert()` e os `href="#"`, que serão resolvidos na etapa 5 junto com D9.

**Incoerência no próprio Figma:** na tela Lives, "Torre do Mago Louco" e "Mesa de Domingo" aparecem como Pública + Ao vivo. Na tela Salas, a Torre é Pública sem live e a Mesa de Domingo é Privada. Segui o Figma em cada tela. Na etapa 6, os dados de exemplo terão uma única fonte, então essa diferença precisa de uma decisão.

### Etapa 5: JavaScript

Novos arquivos em `js/`, todos pequenos e carregados com `<script defer>`:

| Arquivo | Páginas | O que faz |
|---|---|---|
| `menu.js` | todas | Menu mobile, feito na etapa 3: `aria-expanded`, foco preso com Tab, ESC fecha e devolve o foco, rolagem travada. |
| `salas.js` | salas | Busca por nome, mestre ou sistema (sem diferenciar acentos). Filtros: chips Todas/Públicas/Privadas/Ao vivo (`aria-pressed`) e select de sistema. Paginação calculada a partir dos cards visíveis, 6 por página (D5). Estado vazio com link para criar sala. Contagem anunciada por `role="status"`. Também aceita `?filtro=ao-vivo` (link "Ver todas as lives") e `?busca=`. Expõe `VinteFaces.atualizarSalas()` para a etapa 6. |
| `formulario.js` | contato, login | Validação compartilhada: `aria-invalid`, mensagem por campo ligada por `aria-describedby`, foco no primeiro campo com erro e correção ao vivo depois da primeira tentativa. |
| `contato.js` | contato | Regras: nome (2+ letras), e-mail, assunto e mensagem (10+ caracteres). Ao enviar, mostra a mensagem de sucesso em `role="status"`, avisando que o envio é demonstrativo. |
| `login.js` | login | D9: guarda o Usuario `{id, nome, email}` na chave `vinteFaces.usuario`, em `localStorage` com "Lembrar de mim" ou em `sessionStorage` sem. O mesmo e-mail recupera o mesmo id. Na volta à página, preenche o formulário e mostra "Você entrou como…". |

O FAQ continua com `<details>`/`<summary>`, que já abre e fecha pelo teclado e é anunciado por leitores de tela sem JS. Por isso não criei `js/faq.js`.

**HTML:**

- `login.html`:
  - Saíram o campo Senha, "Esqueceu a senha?", "Cadastre-se" e os três `alert()`/`onclick`/`onsubmit`.
  - Entraram o campo Nome e as mensagens de erro.
  - O botão virou "ENTRAR".
  - O aviso de demonstração foi atualizado.
- `contato.html`: entraram o parágrafo de sucesso (`.mensagem-sucesso`) e o texto de erro da mensagem com o mínimo de caracteres.
- `salas.html`: entraram o estado vazio (`#salas-vazio`) e o status escondido (`#salas-status`).

**CSS:**

- Classes novas: `.mensagem-sucesso` (borda Sucesso, texto Pergaminho/100, ícone de check) e `.login-cadastro:empty`.
- `.login-form [aria-invalid="true"]` ganhou a borda Perigo.
- Escolha de design: quando um campo com erro recebe foco, a borda fica ouro, para o foco continuar visível. Sem foco, a borda é Perigo.

**Resultado:** não há mais nenhum `alert()`, `onclick` ou `href="#"` no site.

**Ainda pendente (etapa 6):** em salas, os links `#mesa` e `#form-criar`.

### Etapa 6: fluxo do UML 02 em JS

**Arquivos novos (carregados com `defer`, só em `salas.html`):**

| Arquivo | O que faz |
|---|---|
| `js/dominio.js` | As 10 classes do UML 01 com os mesmos nomes: `Usuario`, `Participacao`, `Sala`, `Personagem`, `Ficha`, `Mensagem`, `RolagemDado`, `Mapa`, `Chamada` e `Live`. Atributos e métodos seguem o diagrama: `criarSala()`, `verificarVagas()`, `entrarSala(usuario)`, `editarFicha()`, `enviarMensagem()`, `rolarDado(faces)`, `exibirMapa()`, `iniciarChamada()`/`encerrarChamada()`, `iniciarLive()`/`encerrarLive()`. As associações viram propriedades: `sala.participacoes`, `sala.mensagens`, `sala.rolagens`, `sala.mapas`, `sala.live`, `autor`. Há também dois auxiliares de leitura, `jogadores()` e `participacaoDe()`, que não são casos de uso novos. |
| `js/dados.js` | Cria as 6 salas da tela Salas do Figma usando o próprio domínio: `criarSala()` e depois `entrarSala()` para cada jogador de exemplo. Guarda tudo em `localStorage` (`vinteFaces.salas`) e reconstrói os objetos na leitura. `usuarioAtual()` lê o usuário do login, ou usa "Visitante" (D9). |
| `js/mesa.js` | O fluxo da sequência UML 02, descrito abaixo. |

**Como o UML 02 aparece na tela:**

- **Passos 1–4:** os cards são desenhados a partir dos dados, com o mesmo HTML e os mesmos `data-*` de antes, e `salas.js` reaplica busca, filtros e paginação.
- **Passos 5–7:** ENTRAR, agora um `<button>`, chama `sala.verificarVagas()`.
- **[sala possui vagas]:**
  - Passos 8–10: `sala.entrarSala(usuario)` registra a participação e abre o painel `#mesa` com nome, badges, mestre, sistema, vagas e papel. O painel mostra o mapa (`exibirMapa()`), os participantes e o chat. O foco vai para o título.
  - Passos 11–15: ROLAR D20 cria uma `RolagemDado` e chama `rolarDado(20)`. O resultado vai para uma `Mensagem` e é publicado com `enviarMensagem()`, aparecendo no chat (`role="log"`).
- **[sala lotada], passo 16:** no próprio card aparece, em `role="alert"`, "Sala lotada — entrada negada. Todas as N vagas de jogador estão ocupadas." O foco fica no botão.
  - Para testar: Ruínas de Valdoria (6/6) e Mesa de Domingo (5/5).
  - Pela D6, uma sala privada com vaga aceita a entrada.

**Extras dentro do UML:**

- Chat de texto com `enviarMensagem()`.
- SAIR DA SALA: o jogador passa a `status = 'encerrada'` e libera a vaga; o mestre continua. ESC também fecha.
- O estado fica salvo entre visitas.
- Botão "Restaurar salas de exemplo".

**Criar sala (D4):**

- "CRIAR MINHA SALA" abre o formulário `#form-criar`. Ele também abre ao chegar por `salas.html#criar`, como no CRIAR SALA do cabeçalho.
- Campos: nome, sistema, visibilidade (`publica`), `limiteJogadores` (2–10) e "Transmitir ao vivo" (`Live.iniciarLive()`).
- A validação usa `formulario.js`.
- O envio chama `usuario.criarSala()`, que coloca o criador como mestre, e abre a mesa da sala nova.

**Outras mudanças:**

- `index.html`: os ENTRAR de "Salas em destaque" apontam para `salas.html?entrar=cripta|taverna|ruinas` e entram direto na sala. Ruínas mostra o ramo de sala lotada.
- CSS novo:
  - `.mesa`, `.mesa-topo`, `.mesa-grade`, `.mesa-mapa`, `.mesa-lateral`, `.participantes`, `.mesa-conversa`, `.mesa-chat`, `.bolha .horario`, `.campo-mensagem` (input e botão), `.aviso-sala`.
  - `button.link`, `button.btn-card`, `.criar-sala` (com `color-scheme: dark`), `.criar-usuario`, `.opcoes`, `.opcao`.
  - Regras para 1000px e 700px.
  - Tudo reaproveita `.painel`, `.bolha`, `.bolha-mestre`, `.cartao-rolagem`, `.avatar`, `.badges`, `.formulario` e `.mensagem-erro`.

**Testado com Playwright em 1440, 768 e 390:**

- Os dois ramos do UML 02 funcionam.
- Rolagem e chat persistem depois de recarregar.
- Os botões funcionam por teclado.
- O foco vai para o lugar certo em cada caso.
- Validação do formulário de criar sala: campos vazios e limite 11.
- A sala criada aparece nos filtros e na paginação.
- Nas 8 páginas: nenhum erro no console, nenhum `dialog`, nenhum overflow, nenhuma âncora morta e nenhum `style` inline.
- O texto novo passa em contraste AA.

**Pendente / decisões para revisar:**

- O texto do Figma em salas.html diz "as privadas só entram por convite", mas pela D6 uma sala privada aceita entrada quando tem vaga. O texto não foi alterado.
- O Figma tem dados diferentes para Torre e Mesa de Domingo nas telas Salas e Lives. Fiz o seguinte: `dados.js` segue a tela Salas, e lives.html continua uma vitrine estática com os dados da tela Lives.

### Etapa 7: revisão final

**`/impeccable critique`:**

- Rodou com duas avaliações isoladas: uma revisão de design no navegador e uma rodada do detector com overlay.
- Nota 26/40 (Aceitável). Nenhum P0, três P1.
- O relatório completo está em `.impeccable/critique/`.

Corrigido:

| Prioridade | Problema | Correção |
|---|---|---|
| P1 | Sala lotada parecia aberta | Badge "Lotada" (borda Perigo) e botão "LOTADA" mais discreto. O botão continua clicável e mostra o ramo "entrada negada" do UML 02, agora com o próximo passo: "Escolha outra sala ou crie a sua." |
| P1 | O texto "as privadas só entram por convite" contradizia a D6 | Texto ajustado: "Neste protótipo, salas públicas e privadas aceitam jogadores enquanto houver vaga; o convite das privadas ainda é simulado." Era um texto do Figma; foi trocado para não prometer algo que o site não faz. |
| P1 | Placeholder do login com contraste 3.8:1 | `.login-form input::placeholder` em Pergaminho/400. |
| P2 | Login invisível no resto do site | `menu.js` troca ENTRAR do header pelo primeiro nome do usuário, com `aria-label`. `login.js` atualiza o header na hora. |
| P2 | "Restaurar salas de exemplo" apagava sem confirmar | Pede um segundo clique ("Confirmar: apagar as salas criadas…"), cancela ao perder o foco e anuncia "Salas de exemplo restauradas." em `#salas-status`. |
| P3 | Trocar de sala mantinha a vaga antiga | `sairDaMesaAtual()` libera a vaga ao trocar de sala. |
| P3 | Rolagem suave ignorava `prefers-reduced-motion` | `html { scroll-behavior: auto }` dentro do bloco de reduced-motion. |
| P3 | Salto de h1 para h3 em salas | `<h2 class="visualmente-oculto">Lista de salas</h2>`. |

**`/impeccable audit`** (medido com Playwright nas 8 páginas):

- Contraste AA sem falhas.
- Todos os campos têm label.
- Um h1 por página, sem saltos de título.
- Landmarks presentes.
- Corrigido:
  - **Reflow a 320px (WCAG 1.4.10):**
    - Salas: os filtros usavam `flex-wrap` em coluna, e os chips alargavam a busca. Correção: `nowrap` e `min-width: 0`.
    - Contato: um card passava 2px da tela. Correção: `minmax(0, 1fr)` e `overflow-wrap` no e-mail.
  - **Checkbox "Lembrar de mim":** tinha 13px. Agora tem 20px, em tema escuro.
  - **Imagens abaixo da dobra:** passaram a usar `loading="lazy"` (cards da home e das lives, ilustrações, capas geradas pelo `mesa.js`).
- Os links do menu e do rodapé têm 20px de altura, mas passam no critério de espaçamento do WCAG 2.5.8.

**`npx impeccable detect`:** 29 avisos, todos mantidos de propósito.

| Regra | Avisos | Por que foi mantido |
|---|---|---|
| `kicker-above-heading` | 20 | É o estilo "Texto/Overline" do Figma, e o Figma decide a tipografia. |
| `cramped-padding` | 9 | Falso positivo: seções de fundo largo cujo `.container` interno já dá o recuo. |

**Prints finais:** em `docs/capturas/`, com as 8 páginas em 1440, 768 e 390px (página inteira) e o fluxo do UML 02 (`mesa-*` e `sala-lotada-*`).

**Verificação final** (1440, 768, 390 e 320px):

- Sem overflow, sem `style` inline, sem `alt` faltando, sem `href="#"` e sem âncora morta.
- Nenhum erro no console e nenhum diálogo.
- Fluxo UML 02 conferido nos dois ramos.

**README.md:** reescrito com o que é o projeto, como abrir, a estrutura, como testar o fluxo, a equipe, o que mudou e as pendências. As duas linhas originais foram mantidas no topo.

**Ficou para o grupo:**

- Os dados das telas Salas e Lives são diferentes no Figma.
- Não existe convite de verdade para salas privadas.
- A frase "Bem-vindo de volta" no login aparece até para quem nunca entrou.
- Chips e paginação têm entre 33 e 40px de altura no celular, o que passa no AA mas não no alvo ideal de 44px.

### Depois da etapa 7: limpeza de assets e melhorias pequenas

**Assets:** a pasta caiu de cerca de 6 MB para 2 MB.

Apagados por não terem nenhuma referência em HTML, CSS ou JS:

- `card2.png`, cópia idêntica de `card1.png`;
- `dados2.png`;
- os ícones PNG antigos `dice_icn`, `ficha_icn`, `group_icn`, `group-icon` e `map_icn`, que foram substituídos pelos SVG do Figma em `assets/icones/`.

Comprimidos, com os mesmos nomes de arquivo:

| Arquivo | Antes | Depois | Como |
|---|---|---|---|
| `dados.jpg` (fundo do login) | 1,8 MB, 4096 px | 244 KB, 1920 px | JPEG 78, progressivo |
| `rodape.jpg` (fundo do login) | 1,4 MB, 6000 px | 88 KB, 1920 px | JPEG 78, progressivo |
| `card1.png`, `card3.png` e capas 2, 4, 5 e 6 | 216–268 KB | 168–224 KB | Recompressão sem perda |

**Melhorias:**

- **Alvos de toque no celular (≤ 700px):** chips com 44px de altura e botões de página com 44×44px.
- **Texto do login:** "BEM-VINDO DE VOLTA, AVENTUREIRO" virou "BEM-VINDO, AVENTUREIRO", e "Entre na sua conta… continue de onde parou" virou "Diga seu nome, reúna seu grupo e comece (ou continue) a sua aventura". Como não existem contas, o texto agora serve também para quem entra pela primeira vez. A tela de login não tem versão no Figma; o texto original era do Marcelo.
- **Capas de salas novas:** passam a alternar entre os 4 mapas de `assets/capas/` (masmorra, tokens, problema, contato), em vez de repetir sempre o mesmo.
- **Capas das salas de exemplo:** não foram trocadas. Elas vêm do Figma, e algumas se parecem entre si. Mudar seria contrariar o Figma.

**Verificado:**

- As 8 páginas em 1440, 768, 390 e 320px: nenhuma imagem quebrada, nenhuma requisição com erro, nenhum overflow e nenhum erro no console.
- Os prints de `login` e `salas` em `docs/capturas/` foram refeitos.
