// Menu mobile (Figma: "Navegação mobile" e "Menu aberto — Mobile").
// Sem este script, os links do header continuam visíveis em telas pequenas.
(function () {
    var header = document.querySelector('header');
    var botao = header && header.querySelector('.menu-btn');
    if (!botao) return;

    var telaPequena = window.matchMedia('(max-width: 1140px)');
    header.classList.add('menu-js');

    function focaveis() {
        return Array.prototype.filter.call(
            header.querySelectorAll('a[href], button'),
            function (el) { return el.offsetParent !== null; }
        );
    }

    function abrir() {
        header.classList.add('menu-aberto');
        document.documentElement.classList.add('menu-travado');
        botao.setAttribute('aria-expanded', 'true');
        botao.setAttribute('aria-label', 'Fechar menu');
    }

    function fechar(devolverFoco) {
        header.classList.remove('menu-aberto');
        document.documentElement.classList.remove('menu-travado');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
        if (devolverFoco) botao.focus();
    }

    botao.addEventListener('click', function () {
        if (header.classList.contains('menu-aberto')) fechar(false);
        else abrir();
    });

    // ESC fecha; Tab fica preso dentro do menu aberto
    document.addEventListener('keydown', function (e) {
        if (!header.classList.contains('menu-aberto')) return;
        if (e.key === 'Escape') {
            fechar(true);
            return;
        }
        if (e.key !== 'Tab') return;
        var itens = focaveis();
        var primeiro = itens[0];
        var ultimo = itens[itens.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
            e.preventDefault();
            ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primeiro.focus();
        }
    });

    // Link para âncora na mesma página (ex.: salas.html#criar) fecha o menu
    header.addEventListener('click', function (e) {
        if (e.target.closest('.navegacao a, .acoes-header a')) fechar(false);
    });

    telaPequena.addEventListener('change', function (e) {
        if (!e.matches) fechar(false);
    });
})();

// Usuário logado (D9): o botão ENTRAR do header passa a mostrar o primeiro nome
(function () {
    var link = document.querySelector('.acoes-header a[href="login.html"]');
    if (!link) return;

    function atualizar() {
        var usuario = null;
        try {
            usuario = JSON.parse(localStorage.getItem('vinteFaces.usuario') ||
                sessionStorage.getItem('vinteFaces.usuario'));
        } catch (e) {
            usuario = null;
        }
        if (!usuario || !usuario.nome) return;
        link.textContent = usuario.nome.split(' ')[0];
        link.setAttribute('aria-label', 'Você entrou como ' + usuario.nome + '. Ver ou trocar usuário');
    }

    window.VinteFaces = window.VinteFaces || {};
    window.VinteFaces.atualizarHeaderUsuario = atualizar;
    atualizar();
})();
