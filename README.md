# DSM
Repositório para guardar atividades do curso de Desenvolvimento de Software Multiplataforma

## Vinte Faces

Site do **Vinte Faces**, plataforma de RPG de mesa online, feito para o Projeto Integrador do 1º ciclo de
Desenvolvimento de Software Multiplataforma da FATEC Praia Grande.

A Vinte Faces junta em uma sala só o que a mesa costuma espalhar em várias ferramentas: dados, mapas, fichas,
chat, chamada e live. O site apresenta a plataforma e traz um protótipo navegável do fluxo principal do
Diagrama de Sequência: **buscar sala → entrar → rolar d20 → resultado no chat**.

> Protótipo acadêmico: as salas, os nomes, os horários e os números são exemplos. Não há servidor; o login, as
> salas criadas e o chat ficam salvos apenas no navegador (`localStorage`).

### Como abrir

Basta abrir o `index.html` no navegador. O site é HTML, CSS e JavaScript puros, sem framework e sem build.

Se quiser servir a pasta (o mesmo jeito usado nos testes):

```bash
python3 -m http.server
# depois abra http://localhost:8000
```

### Estrutura

```
index.html            Início
salas.html            Lista de salas, mesa da sala (UML 02) e formulário "Criar sala"
como-funciona.html    Passo a passo, perfis e FAQ
recursos.html         Dados, mapas, fichas, chat e chamadas
lives.html            Live em destaque e mesas ao vivo
sobre.html            Problema, princípios, identidade e equipe
contato.html          Formulário de contato (demonstrativo)
login.html            Entrar com nome e e-mail (sem senha, como o Usuario do UML)
Style/style.css       Todo o CSS; tokens do Figma em :root
js/
  menu.js             Menu mobile e nome do usuário logado no header
  formulario.js       Validação compartilhada dos formulários
  contato.js          Formulário de contato
  login.js            Login (guarda o Usuario no navegador)
  salas.js            Busca, filtros e paginação das salas
  dominio.js          Classes do Diagrama de Classes (UML 01)
  dados.js            Salas de exemplo e armazenamento local
  mesa.js             Fluxo do Diagrama de Sequência (UML 02) e "Criar sala"
assets/               Logo, ilustrações, capas (assets/capas) e ícones (assets/icones)
docs/DIAGRAMAS.pdf    Diagramas UML (Revisão 2)
docs/AUDITORIA.md     Auditoria e registro de cada etapa das mudanças
```

### Como testar o fluxo do UML 02

1. Abra **Salas** e clique em **ENTRAR** em uma sala com vaga (ex.: *Torre do Mago Louco*).
   O site chama `verificarVagas()` e `entrarSala(usuario)` e abre a mesa.
2. Clique em **ROLAR D20**: `rolarDado(20)` sorteia o resultado e `enviarMensagem()` publica no chat.
3. Volte à lista e clique em **LOTADA** em *Ruínas de Valdoria* (6/6) ou *Mesa de Domingo* (5/5):
   aparece "Sala lotada — entrada negada".
4. Em **CRIAR MINHA SALA**, preencha o formulário: `usuario.criarSala()` cria a sala e você entra como mestre.
5. "Restaurar salas de exemplo", no fim da lista, volta tudo ao estado inicial (pede um segundo clique para
   confirmar).

Entrando pelo **Login** antes, o seu nome aparece no header, na mesa e no chat. Sem login, você joga como
"Visitante".

### Equipe

- Pedro Henrique Rodrigues Bastos
- Marcelo Nascimento dos Santos
- Cauã Vitor Silva Santos

### O que mudou nesta versão

A base é a primeira versão do site, feita pelo Marcelo. As mudanças mantiveram as páginas, os nomes de arquivo,
as classes e as imagens existentes, e aproximaram o site do Figma
("Vinte Faces — Site (Alta Fidelidade)") e dos diagramas UML. O detalhe de cada etapa está em
`docs/AUDITORIA.md`.

- **Base visual:** tokens do Figma (cores Grafite, Ouro, Pergaminho, Couro, Vinho; Cinzel e Inter; espaçamento
  em múltiplos de 4; raios 8/12/20) em `:root`, sem cor solta fora deles.
- **Componentes:** header de 80px com menu mobile acessível, botões nos tamanhos e tipos do Figma, cards de sala,
  badges ("Pública", "Privada", "Ao vivo", "Lotada") e rodapé com os textos do Figma.
- **Páginas:** as 8 páginas seguem o layout do Figma no desktop, tablet e celular; textos trocados pelos do
  Figma onde eram diferentes.
- **Interações:** busca, filtros e paginação de salas; FAQ em acordeão; validação de formulários sem `alert()`,
  com mensagens junto do campo; login com nome e e-mail (sem senha, como no UML).
- **UML no código:** `js/dominio.js` usa os nomes do Diagrama de Classes; a página de salas executa os dois
  ramos do Diagrama de Sequência (sala com vaga e sala lotada).
- **Acessibilidade:** navegação por teclado com foco visível, `alt` nas imagens de conteúdo, contraste AA,
  respeito a `prefers-reduced-motion` e layout sem rolagem lateral até 320px.

### Pendências para o grupo

- **Sala privada:** pela decisão D6 (seguindo o UML), sala privada aceita entrada quando há vaga. O texto da
  página de salas foi ajustado para dizer isso; um convite de verdade ainda não existe.
- **Dados do Figma:** as telas Salas e Lives do Figma têm números diferentes para "Torre do Mago Louco" e
  "Mesa de Domingo". O protótipo segue a tela Salas; `lives.html` mostra a tela Lives como vitrine estática.
- **Rótulos acima dos títulos:** o detector `impeccable` aponta os "overlines" (texto pequeno em caixa alta
  acima dos títulos). Eles fazem parte do estilo "Texto/Overline" do Figma e foram mantidos.
