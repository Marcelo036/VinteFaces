// Modelo de domínio do Vinte Faces, igual ao Diagrama de Classes (UML 01, Revisão 2).
// Os nomes de classes, atributos e métodos são os do diagrama, em português.
// Associações (UML 01):
//   Usuario 1 — cria — 0..* Sala            (sala.criador)
//   Usuario 1 — controla — 0..* Personagem  (personagem.usuario)
//   Sala 1 — 0..* Participacao              (sala.participacoes; participacao.usuario)
//   Sala 1 — contém — 0..* Personagem       (sala.personagens)
//   Personagem 1 — possui — 1 Ficha         (personagem.ficha)
//   Sala 1 — 0..* Mensagem, 0..* RolagemDado, 0..* Mapa, 0..1 Chamada, 0..1 Live
//   Mensagem e RolagemDado têm um autor (Usuario)
(function () {
    var contador = 0;

    function novoId(prefixo) {
        contador += 1;
        return prefixo + Date.now().toString(36) + contador;
    }

    function Usuario(id, nome, email) {
        this.id = id || novoId('u');
        this.nome = nome;
        this.email = email;
    }

    // criarSala(): Sala. O diagrama não lista parâmetros; aqui eles recebem os
    // atributos da Sala. Quem cria a sala entra nela como mestre.
    Usuario.prototype.criarSala = function (nome, sistema, publica, limiteJogadores) {
        var sala = new Sala(null, nome, sistema, publica, limiteJogadores);
        sala.criador = this;
        sala.participacoes.push(new Participacao(null, 'mestre', new Date(), 'ativa', this));
        return sala;
    };

    // papel: mestre | jogador | espectador
    function Participacao(id, papel, dataEntrada, status, usuario) {
        this.id = id || novoId('p');
        this.papel = papel;
        this.dataEntrada = dataEntrada || new Date();
        this.status = status || 'ativa';
        this.usuario = usuario;
    }

    function Sala(id, nome, sistema, publica, limiteJogadores) {
        this.id = id || novoId('s');
        this.nome = nome;
        this.sistema = sistema;
        this.publica = publica;
        this.limiteJogadores = limiteJogadores;
        this.criador = null;
        this.participacoes = [];
        this.personagens = [];
        this.mensagens = [];
        this.rolagens = [];
        this.mapas = [];
        this.chamada = null;
        this.live = null;
    }

    Sala.prototype.jogadores = function () {
        return this.participacoes.filter(function (p) {
            return p.papel === 'jogador' && p.status === 'ativa';
        });
    };

    Sala.prototype.participacaoDe = function (usuario) {
        return this.participacoes.filter(function (p) {
            return p.usuario.id === usuario.id && p.status === 'ativa';
        })[0] || null;
    };

    // verificarVagas(): boolean. O limite conta só os jogadores (o mestre não ocupa vaga).
    Sala.prototype.verificarVagas = function () {
        return this.jogadores().length < this.limiteJogadores;
    };

    // entrarSala(usuario): boolean. Registra a participação como jogador se houver vaga.
    // Pela decisão D6, sala privada também aceita a entrada quando há vaga.
    Sala.prototype.entrarSala = function (usuario) {
        if (this.participacaoDe(usuario)) return true;
        if (!this.verificarVagas()) return false;
        this.participacoes.push(new Participacao(null, 'jogador', new Date(), 'ativa', usuario));
        return true;
    };

    function Personagem(id, nome, classe, nivel, usuario) {
        this.id = id || novoId('pe');
        this.nome = nome;
        this.classe = classe;
        this.nivel = nivel;
        this.usuario = usuario;
        this.ficha = new Ficha(null, '{}');
    }

    // atributos: string (o diagrama define o tipo como string; aqui guarda JSON)
    function Ficha(id, atributos) {
        this.id = id || novoId('f');
        this.atributos = atributos;
    }

    Ficha.prototype.editarFicha = function (atributos) {
        this.atributos = typeof atributos === 'string' ? atributos : JSON.stringify(atributos);
        return this;
    };

    function Mensagem(id, conteudo, horario, autor, sala) {
        this.id = id || novoId('m');
        this.conteudo = conteudo;
        this.horario = horario || new Date();
        this.autor = autor;
        this.sala = sala;
    }

    // enviarMensagem(): publica a mensagem no chat da sala
    Mensagem.prototype.enviarMensagem = function () {
        this.sala.mensagens.push(this);
        return this;
    };

    function RolagemDado(id, faces, modificador, autor) {
        this.id = id || novoId('r');
        this.faces = faces;
        this.resultado = null;
        this.modificador = modificador || 0;
        this.total = null;
        this.autor = autor;
    }

    // rolarDado(faces): int. Sorteia de 1 a faces e soma o modificador no total.
    RolagemDado.prototype.rolarDado = function (faces) {
        this.faces = faces || this.faces;
        this.resultado = Math.floor(Math.random() * this.faces) + 1;
        this.total = this.resultado + this.modificador;
        return this.resultado;
    };

    function Mapa(id, nome, imagemUrl) {
        this.id = id || novoId('ma');
        this.nome = nome;
        this.imagemUrl = imagemUrl;
    }

    // exibirMapa(): devolve a imagem pronta para a mesa
    Mapa.prototype.exibirMapa = function () {
        var img = document.createElement('img');
        img.src = this.imagemUrl;
        img.alt = 'Mapa: ' + this.nome;
        return img;
    };

    function Chamada(id, ativa) {
        this.id = id || novoId('c');
        this.ativa = Boolean(ativa);
    }

    Chamada.prototype.iniciarChamada = function () {
        this.ativa = true;
    };

    Chamada.prototype.encerrarChamada = function () {
        this.ativa = false;
    };

    function Live(id, titulo, aoVivo) {
        this.id = id || novoId('l');
        this.titulo = titulo;
        this.aoVivo = Boolean(aoVivo);
    }

    Live.prototype.iniciarLive = function () {
        this.aoVivo = true;
    };

    Live.prototype.encerrarLive = function () {
        this.aoVivo = false;
    };

    window.VinteFaces = window.VinteFaces || {};
    window.VinteFaces.dominio = {
        Usuario: Usuario,
        Participacao: Participacao,
        Sala: Sala,
        Personagem: Personagem,
        Ficha: Ficha,
        Mensagem: Mensagem,
        RolagemDado: RolagemDado,
        Mapa: Mapa,
        Chamada: Chamada,
        Live: Live
    };
})();
