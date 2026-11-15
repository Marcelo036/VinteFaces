// Dados de exemplo e armazenamento local (protótipo acadêmico, sem servidor).
// As 6 salas vêm da tela "Salas" do Figma. Ficam salvas no localStorage deste
// navegador e são reconstruídas como objetos do dominio.js a cada leitura.
(function () {
    var d = window.VinteFaces && window.VinteFaces.dominio;
    if (!d) return;

    var CHAVE_SALAS = 'vinteFaces.salas';
    var CHAVE_USUARIO = 'vinteFaces.usuario';

    // [id, nome, sistema, publica, aoVivo, mestre, jogadores, limite, capa, alt da capa]
    var EXEMPLOS = [
        ['cripta', 'Cripta do Rei Cinza', '5e', true, true, 'Fernanda', 4, 6,
            'assets/card1.png', 'mapa de masmorra'],
        ['taverna', 'A Taverna do Corvo', 'Call of Cthulhu', false, false, 'Davi', 2, 5,
            'assets/capas/capa2.png', 'planta de uma taverna'],
        ['ruinas', 'Ruínas de Valdoria', '5e', true, false, 'Marina', 6, 6,
            'assets/card3.png', 'mesa de jogo com dados e cartas'],
        ['mercado', 'O Mercado das Sombras', 'Tormenta20', true, true, 'Rafael', 3, 6,
            'assets/capas/capa4.png', 'mapa de um mercado subterrâneo'],
        ['torre', 'Torre do Mago Louco', '5e', true, false, 'Ana', 1, 4,
            'assets/capas/capa5.png', 'planta de uma torre'],
        ['domingo', 'Mesa de Domingo', 'Ordem Paranormal', false, false, 'Lucas', 5, 5,
            'assets/capas/capa6.png', 'mesa de jogo com dados e cartas']
    ];

    var NOMES_JOGADORES = ['Caio', 'Bia', 'Theo', 'Luna', 'Igor', 'Nina'];

    function criarExemplos() {
        return EXEMPLOS.map(function (e) {
            var mestre = new d.Usuario('mestre-' + e[0], e[5], '');
            var sala = mestre.criarSala(e[1], e[2], e[3], e[7]);
            sala.id = e[0];
            sala.capa = { src: e[8], alt: e[9] };
            sala.mapas.push(new d.Mapa(null, e[1], e[8]));
            if (e[4]) {
                sala.live = new d.Live(null, e[1] + ' ao vivo', false);
                sala.live.iniciarLive();
            }
            for (var i = 0; i < e[6]; i++) {
                sala.entrarSala(new d.Usuario(e[0] + '-j' + i, NOMES_JOGADORES[i], ''));
            }
            new d.Mensagem(null, 'Sejam bem-vindos à mesa! A sessão começa às 20h.',
                null, mestre, sala).enviarMensagem();
            return sala;
        });
    }

    // Objetos do domínio → JSON simples (sem referências circulares)
    function pessoa(u) {
        return u ? { id: u.id, nome: u.nome, email: u.email || '' } : null;
    }

    function serializar(sala) {
        return {
            id: sala.id, nome: sala.nome, sistema: sala.sistema, publica: sala.publica,
            limiteJogadores: sala.limiteJogadores, capa: sala.capa,
            criador: pessoa(sala.criador),
            participacoes: sala.participacoes.map(function (p) {
                return { id: p.id, papel: p.papel, dataEntrada: p.dataEntrada, status: p.status, usuario: pessoa(p.usuario) };
            }),
            mensagens: sala.mensagens.map(function (m) {
                return { id: m.id, conteudo: m.conteudo, horario: m.horario, autor: pessoa(m.autor), rolagem: m.rolagem || null };
            }),
            rolagens: sala.rolagens.map(function (r) {
                return { id: r.id, faces: r.faces, resultado: r.resultado, modificador: r.modificador, total: r.total, autor: pessoa(r.autor) };
            }),
            mapas: sala.mapas.map(function (m) {
                return { id: m.id, nome: m.nome, imagemUrl: m.imagemUrl };
            }),
            live: sala.live ? { id: sala.live.id, titulo: sala.live.titulo, aoVivo: sala.live.aoVivo } : null
        };
    }

    // JSON simples → objetos do domínio
    function usuario(o) {
        return o ? new d.Usuario(o.id, o.nome, o.email) : null;
    }

    function reconstruir(o) {
        var sala = new d.Sala(o.id, o.nome, o.sistema, o.publica, o.limiteJogadores);
        sala.capa = o.capa;
        sala.criador = usuario(o.criador);
        sala.participacoes = o.participacoes.map(function (p) {
            return new d.Participacao(p.id, p.papel, new Date(p.dataEntrada), p.status, usuario(p.usuario));
        });
        sala.mensagens = o.mensagens.map(function (m) {
            var msg = new d.Mensagem(m.id, m.conteudo, new Date(m.horario), usuario(m.autor), sala);
            msg.rolagem = m.rolagem;
            return msg;
        });
        sala.rolagens = o.rolagens.map(function (r) {
            var rolagem = new d.RolagemDado(r.id, r.faces, r.modificador, usuario(r.autor));
            rolagem.resultado = r.resultado;
            rolagem.total = r.total;
            return rolagem;
        });
        sala.mapas = o.mapas.map(function (m) {
            return new d.Mapa(m.id, m.nome, m.imagemUrl);
        });
        sala.live = o.live ? new d.Live(o.live.id, o.live.titulo, o.live.aoVivo) : null;
        return sala;
    }

    function salvarSalas(salas) {
        try {
            localStorage.setItem(CHAVE_SALAS, JSON.stringify(salas.map(serializar)));
        } catch (e) {
            // Sem armazenamento (navegação privada): as mudanças valem só nesta visita
        }
    }

    function carregarSalas() {
        try {
            var salvas = JSON.parse(localStorage.getItem(CHAVE_SALAS));
            if (Array.isArray(salvas) && salvas.length) return salvas.map(reconstruir);
        } catch (e) {
            // Dados corrompidos ou indisponíveis: volta aos exemplos
        }
        var exemplos = criarExemplos();
        salvarSalas(exemplos);
        return exemplos;
    }

    function restaurarExemplos() {
        try {
            localStorage.removeItem(CHAVE_SALAS);
        } catch (e) {
            // nada a limpar
        }
        return carregarSalas();
    }

    // Usuário salvo pelo login (D9); sem login, entra como "Visitante"
    function usuarioAtual() {
        var o = null;
        try {
            o = JSON.parse(localStorage.getItem(CHAVE_USUARIO) || sessionStorage.getItem(CHAVE_USUARIO));
        } catch (e) {
            o = null;
        }
        if (!o || !o.nome) o = { id: 'visitante', nome: 'Visitante', email: '' };
        return new d.Usuario(o.id, o.nome, o.email);
    }

    window.VinteFaces.dados = {
        carregarSalas: carregarSalas,
        salvarSalas: salvarSalas,
        restaurarExemplos: restaurarExemplos,
        usuarioAtual: usuarioAtual
    };
})();
