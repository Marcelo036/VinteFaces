// Fluxo do Diagrama de Sequência (UML 02) na página de salas:
//  1–4  Jogador pede a lista; o sistema consulta as salas e exibe os cards.
//  5–7  Jogador escolhe uma sala; o sistema chama verificarVagas().
//  alt [sala possui vagas]
//   8–10  entrarSala(usuario) registra a participação e a mesa é exibida.
//   11–15 Jogador pede um d20: rolarDado(20) e o resultado vai ao chat com enviarMensagem().
//  alt [sala lotada]
//   16    "Sala lotada — entrada negada".
// Também cria salas com usuario.criarSala() (decisão D4).
(function () {
    var vf = window.VinteFaces;
    var lista = document.querySelector('.listagem .salas');
    var mesa = document.getElementById('mesa');
    if (!vf || !vf.dominio || !vf.dados || !lista || !mesa) return;

    var d = vf.dominio;
    var usuario = vf.dados.usuarioAtual();
    var salas = vf.dados.carregarSalas();
    var salaAberta = null;

    var CAPAS_NOVAS = [
        { src: 'assets/capas/mapa-masmorra.jpg', alt: 'mapa de masmorra' },
        { src: 'assets/capas/mapa-tokens.jpg', alt: 'mapa de masmorra com tokens' },
        { src: 'assets/capas/mapa-problema.jpg', alt: 'mapa de masmorra com tokens dos jogadores' },
        { src: 'assets/capas/mapa-contato.jpg', alt: 'mapa de masmorra com tokens dos jogadores' }
    ];

    var el = {
        titulo: document.getElementById('mesa-titulo'),
        badges: document.getElementById('mesa-badges'),
        detalhes: document.getElementById('mesa-detalhes'),
        mapa: document.getElementById('mesa-mapa'),
        participantes: document.getElementById('mesa-participantes'),
        rolar: document.getElementById('mesa-rolar'),
        chat: document.getElementById('mesa-chat'),
        formChat: document.getElementById('mesa-form-chat'),
        sair: document.getElementById('mesa-sair'),
        formCriar: document.getElementById('form-criar'),
        abrirCriar: document.getElementById('abrir-criar'),
        cancelarCriar: document.getElementById('cancelar-criar'),
        usuarioCriar: document.getElementById('criar-usuario'),
        restaurar: document.getElementById('restaurar-salas')
    };

    function criar(tag, classe, texto) {
        var n = document.createElement(tag);
        if (classe) n.className = classe;
        if (texto !== undefined) n.textContent = texto;
        return n;
    }

    function buscarSala(id) {
        return salas.filter(function (s) { return s.id === id; })[0] || null;
    }

    function mestreDe(sala) {
        var p = sala.participacoes.filter(function (x) { return x.papel === 'mestre'; })[0];
        return p ? p.usuario.nome : '—';
    }

    function aoVivo(sala) {
        return Boolean(sala.live && sala.live.aoVivo);
    }

    function vagasTexto(sala) {
        return sala.jogadores().length + '/' + sala.limiteJogadores + ' jogadores';
    }

    function hora(data) {
        return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function salvar() {
        vf.dados.salvarSalas(salas);
    }

    // Lotada para este usuário: sem vaga e ele ainda não participa
    function lotada(sala) {
        return !sala.participacaoDe(usuario) && !sala.verificarVagas();
    }

    function badges(sala) {
        var box = criar('div', 'badges');
        box.appendChild(criar('span', 'btn-off', sala.publica ? 'Pública' : 'Privada'));
        if (aoVivo(sala)) box.appendChild(criar('span', 'btn-off badge-ao-vivo', 'Ao vivo'));
        if (lotada(sala)) box.appendChild(criar('span', 'btn-off badge-lotada', 'Lotada'));
        return box;
    }

    // Passos 1–4: consulta as salas e exibe os cards (mesmo HTML dos cards do Marcelo)
    function desenharCards() {
        lista.textContent = '';
        salas.forEach(function (sala) {
            var card = criar('article', 'card');
            card.dataset.publica = String(sala.publica);
            card.dataset.aoVivo = String(aoVivo(sala));
            card.dataset.sistema = sala.sistema;
            card.dataset.sala = sala.id;

            var capa = criar('img');
            capa.loading = 'lazy';
            capa.src = sala.capa.src;
            capa.alt = 'Capa da sala ' + sala.nome + ': ' + sala.capa.alt;
            card.appendChild(capa);

            var conteudo = criar('div', 'card-conteudo');
            conteudo.appendChild(badges(sala));
            conteudo.appendChild(criar('h3', '', sala.nome));
            conteudo.appendChild(criar('p', '', 'Mestre: ' + mestreDe(sala) + ' · Sistema: ' + sala.sistema));

            var rodape = criar('div', 'card-rodape');
            var info = criar('div', 'info');
            var icone = criar('img');
            icone.src = 'assets/icones/usuarios.svg';
            icone.alt = '';
            icone.width = 20;
            icone.height = 20;
            info.appendChild(icone);
            info.appendChild(criar('span', '', vagasTexto(sala)));
            rodape.appendChild(info);

            // A sala lotada continua clicável: o clique mostra o ramo "entrada negada" do UML 02
            var semVaga = lotada(sala);
            var entrar = criar('button', 'btn-card' + (semVaga ? ' lotada' : ''), semVaga ? 'LOTADA' : 'ENTRAR');
            entrar.type = 'button';
            entrar.dataset.entrar = sala.id;
            entrar.setAttribute('aria-label', semVaga ? 'Sala ' + sala.nome + ' lotada: ver detalhes' :
                'Entrar na sala ' + sala.nome);
            rodape.appendChild(entrar);
            conteudo.appendChild(rodape);

            // Passo 16 aparece aqui quando a sala está lotada
            var aviso = criar('p', 'mensagem-erro aviso-sala');
            aviso.setAttribute('role', 'alert');
            conteudo.appendChild(aviso);

            card.appendChild(conteudo);
            lista.appendChild(card);
        });
        if (vf.atualizarSalas) vf.atualizarSalas();
    }

    function limparAvisos() {
        lista.querySelectorAll('.aviso-sala').forEach(function (a) { a.textContent = ''; });
    }

    // Passos 5–10 e 16
    function entrar(id) {
        var sala = buscarSala(id);
        if (!sala) return;
        limparAvisos();
        // Trocar de mesa libera a vaga da mesa anterior
        if (salaAberta && salaAberta !== sala) sairDaMesaAtual();

        // 6–7: verificarVagas(). Quem já participa volta para a mesa sem ocupar outra vaga.
        var jaParticipa = Boolean(sala.participacaoDe(usuario));
        if (!jaParticipa && !sala.verificarVagas()) {
            negarEntrada(sala);
            return;
        }
        // 8–9: entrarSala(usuario) registra a participação
        if (!sala.entrarSala(usuario)) {
            negarEntrada(sala);
            return;
        }
        salvar();
        desenharCards();
        abrirMesa(sala); // 10
    }

    function negarEntrada(sala) {
        var card = lista.querySelector('[data-sala="' + sala.id + '"]');
        if (!card) return;
        // Se a sala estiver escondida pelos filtros, o aviso aparece mesmo assim
        card.hidden = false;
        card.querySelector('.aviso-sala').textContent = 'Sala lotada — entrada negada. ' +
            'Todas as ' + sala.limiteJogadores + ' vagas de jogador estão ocupadas. Escolha outra sala ou crie a sua.';
        card.scrollIntoView({ block: 'center' });
        card.querySelector('[data-entrar]').focus({ preventScroll: true });
    }

    function bolha(msg) {
        var item = criar('div', 'bolha');
        var ehMestre = salaAberta && salaAberta.participacoes.some(function (p) {
            return p.papel === 'mestre' && p.usuario.id === msg.autor.id;
        });
        if (ehMestre) item.classList.add('bolha-mestre');

        var autor = criar('p', 'autor', msg.autor.nome);
        if (ehMestre) autor.appendChild(criar('span', 'btn-off', 'Mestre'));
        item.appendChild(autor);

        if (msg.rolagem) {
            item.classList.add('cartao-rolagem');
            item.appendChild(criar('p', '', 'Rolou d' + msg.rolagem.faces));
            item.appendChild(criar('p', 'resultado', String(msg.rolagem.total)));
        } else {
            item.appendChild(criar('p', '', msg.conteudo));
        }
        var horario = criar('p', 'horario');
        var time = criar('time', '', hora(msg.horario));
        time.dateTime = new Date(msg.horario).toISOString();
        horario.appendChild(time);
        item.appendChild(horario);
        return item;
    }

    function rolarChatParaFim() {
        el.chat.scrollTop = el.chat.scrollHeight;
    }

    function desenharMesa(sala) {
        var minha = sala.participacaoDe(usuario);
        el.titulo.textContent = sala.nome;
        var novos = badges(sala);
        el.badges.textContent = '';
        while (novos.firstChild) el.badges.appendChild(novos.firstChild);
        el.detalhes.textContent = 'Mestre: ' + mestreDe(sala) + ' · Sistema: ' + sala.sistema + ' · ' +
            vagasTexto(sala) + ' · Você está como ' + (minha ? minha.papel : 'espectador') + '.';

        el.mapa.textContent = '';
        if (sala.mapas.length) {
            el.mapa.appendChild(sala.mapas[0].exibirMapa());
            el.mapa.appendChild(criar('figcaption', '', 'Mapa da sessão: ' + sala.mapas[0].nome));
        }

        el.participantes.textContent = '';
        sala.participacoes.filter(function (p) { return p.status === 'ativa'; }).forEach(function (p) {
            var li = criar('li');
            var avatar = criar('span', 'avatar' + (p.papel === 'mestre' ? ' avatar-ouro' : ''), p.usuario.nome.charAt(0));
            avatar.setAttribute('aria-hidden', 'true');
            li.appendChild(avatar);
            var nome = p.usuario.nome + (p.usuario.id === usuario.id ? ' (você)' : '');
            li.appendChild(criar('span', '', nome));
            li.appendChild(criar('span', 'papel', p.papel));
            el.participantes.appendChild(li);
        });

        el.chat.textContent = '';
        sala.mensagens.forEach(function (m) { el.chat.appendChild(bolha(m)); });
    }

    function abrirMesa(sala) {
        salaAberta = sala;
        desenharMesa(sala);
        mesa.hidden = false;
        rolarChatParaFim();
        mesa.scrollIntoView({ block: 'start' });
        el.titulo.focus({ preventScroll: true });
    }

    // O jogador libera a vaga ao sair; o mestre continua dono da sala
    function sairDaMesaAtual() {
        var minha = salaAberta && salaAberta.participacaoDe(usuario);
        if (minha && minha.papel === 'jogador') {
            minha.status = 'encerrada';
            salvar();
        }
        salaAberta = null;
    }

    function fecharMesa() {
        var id = salaAberta && salaAberta.id;
        sairDaMesaAtual();
        mesa.hidden = true;
        desenharCards();
        var botao = id && lista.querySelector('[data-entrar="' + id + '"]');
        if (botao && !botao.closest('.card').hidden) botao.focus();
        else lista.closest('.listagem').scrollIntoView({ block: 'start' });
    }

    function publicar(msg) {
        msg.enviarMensagem();
        salvar();
        el.chat.appendChild(bolha(msg));
        rolarChatParaFim();
    }

    // Passos 11–15
    el.rolar.addEventListener('click', function () {
        if (!salaAberta) return;
        var rolagem = new d.RolagemDado(null, 20, 0, usuario);
        rolagem.rolarDado(20); // 12–13
        salaAberta.rolagens.push(rolagem);

        var msg = new d.Mensagem(null, usuario.nome + ' rolou d20: ' + rolagem.total, new Date(), usuario, salaAberta);
        msg.rolagem = { faces: rolagem.faces, resultado: rolagem.resultado, total: rolagem.total };
        publicar(msg); // 14–15
    });

    el.formChat.addEventListener('submit', function (e) {
        e.preventDefault();
        var campo = el.formChat.elements.conteudo;
        var texto = campo.value.trim();
        if (!salaAberta || !texto) {
            campo.focus();
            return;
        }
        publicar(new d.Mensagem(null, texto, new Date(), usuario, salaAberta));
        campo.value = '';
    });

    el.sair.addEventListener('click', fecharMesa);

    mesa.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !mesa.hidden && e.target.tagName !== 'INPUT') fecharMesa();
    });

    lista.addEventListener('click', function (e) {
        var botao = e.target.closest('[data-entrar]');
        if (botao) entrar(botao.dataset.entrar);
    });

    // Criar sala (D4): usuario.criarSala(); quem cria entra como mestre
    function abrirFormCriar() {
        el.formCriar.hidden = false;
        el.abrirCriar.setAttribute('aria-expanded', 'true');
        el.formCriar.scrollIntoView({ block: 'start' });
        el.formCriar.elements.nome.focus({ preventScroll: true });
    }

    function fecharFormCriar() {
        el.formCriar.hidden = true;
        el.abrirCriar.setAttribute('aria-expanded', 'false');
    }

    el.usuarioCriar.textContent = usuario.id === 'visitante' ?
        'Você vai criar a sala como Visitante. ' : 'Você vai criar a sala como ' + usuario.nome + '.';
    if (usuario.id === 'visitante') {
        var login = criar('a', 'link', 'Entrar com seu nome');
        login.href = 'login.html';
        el.usuarioCriar.appendChild(login);
    }

    el.abrirCriar.addEventListener('click', function (e) {
        e.preventDefault();
        if (el.formCriar.hidden) abrirFormCriar();
        else fecharFormCriar();
    });

    el.cancelarCriar.addEventListener('click', function () {
        fecharFormCriar();
        el.abrirCriar.focus();
    });

    vf.validarFormulario(el.formCriar, {
        nome: function (v) { return v.trim().length >= 3; },
        sistema: function (v) { return v !== ''; },
        limiteJogadores: function (v) {
            var n = Number(v);
            return Number.isInteger(n) && n >= 2 && n <= 10;
        }
    }, function (form) {
        var sala = usuario.criarSala(form.elements.nome.value.trim(), form.elements.sistema.value,
            form.elements.publica.value === 'true', Number(form.elements.limiteJogadores.value));
        // Alterna entre os mapas disponíveis para as salas novas não ficarem iguais
        var capa = CAPAS_NOVAS[salas.length % CAPAS_NOVAS.length];
        sala.capa = { src: capa.src, alt: capa.alt };
        sala.mapas.push(new d.Mapa(null, sala.nome, capa.src));
        if (form.elements.aoVivo.checked) {
            sala.live = new d.Live(null, sala.nome + ' ao vivo', false);
            sala.live.iniciarLive();
        }
        new d.Mensagem(null, 'Sala criada. Chame seus jogadores!', new Date(), usuario, sala).enviarMensagem();
        salas.unshift(sala);
        salvar();
        form.reset();
        fecharFormCriar();
        desenharCards();
        abrirMesa(sala);
    });

    // Restaurar pede um segundo clique, porque apaga as salas criadas neste navegador
    var ROTULO_RESTAURAR = el.restaurar.textContent;
    var statusSalas = document.getElementById('salas-status');
    var confirmando = false;

    function cancelarRestaurar() {
        confirmando = false;
        el.restaurar.textContent = ROTULO_RESTAURAR;
    }

    el.restaurar.hidden = false;
    el.restaurar.addEventListener('click', function () {
        if (!confirmando) {
            confirmando = true;
            el.restaurar.textContent = 'Confirmar: apagar as salas criadas e voltar aos exemplos';
            return;
        }
        cancelarRestaurar();
        salas = vf.dados.restaurarExemplos();
        mesa.hidden = true;
        salaAberta = null;
        desenharCards();
        statusSalas.textContent = 'Salas de exemplo restauradas.';
    });
    el.restaurar.addEventListener('blur', cancelarRestaurar);

    function lerHash() {
        if (location.hash === '#criar' || location.hash === '#form-criar') abrirFormCriar();
    }
    window.addEventListener('hashchange', lerHash);

    desenharCards();

    // Links "ENTRAR" da home chegam como salas.html?entrar=<id>.
    // Espera o "load" porque o navegador rola até a âncora da URL depois dos scripts
    // e tiraria o foco que a mesa ou o formulário acabaram de receber.
    window.addEventListener('load', function () {
        var pedida = new URLSearchParams(location.search).get('entrar');
        if (pedida && buscarSala(pedida)) entrar(pedida);
        else lerHash();
    });
})();
