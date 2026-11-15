// Busca, filtros e paginação da lista de salas (salas.html).
// Os filtros leem os atributos dos cards: data-publica, data-ao-vivo e data-sistema.
// Aceita ?filtro=ao-vivo (link "Ver todas as lives") e ?busca=texto na URL.
(function () {
    var form = document.querySelector('.filtros');
    var lista = document.querySelector('.listagem .salas');
    if (!form || !lista) return;

    var POR_PAGINA = 6;
    var busca = form.elements.busca;
    var sistema = form.elements.sistema;
    var chips = form.querySelectorAll('.chip');
    var paginacao = document.querySelector('.paginacao');
    var vazio = document.getElementById('salas-vazio');
    var status = document.getElementById('salas-status');

    var filtro = 'todas';
    var pagina = 1;

    var params = new URLSearchParams(location.search);
    if (form.querySelector('.chip[data-filtro="' + params.get('filtro') + '"]')) {
        filtro = params.get('filtro');
    }
    if (params.get('busca')) busca.value = params.get('busca');

    function normalizar(texto) {
        return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    }

    function combina(card) {
        var termo = normalizar(busca.value);
        var texto = normalizar(card.querySelector('h3').textContent + ' ' +
            card.querySelector('.card-conteudo > p').textContent);
        if (termo && texto.indexOf(termo) === -1) return false;
        if (filtro === 'publicas' && card.dataset.publica !== 'true') return false;
        if (filtro === 'privadas' && card.dataset.publica !== 'false') return false;
        if (filtro === 'ao-vivo' && card.dataset.aoVivo !== 'true') return false;
        if (sistema.value && card.dataset.sistema !== sistema.value) return false;
        return true;
    }

    function botaoPagina(rotulo, destino, opcoes) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pagina';
        b.textContent = rotulo;
        b.dataset.pagina = destino;
        if (opcoes.label) b.setAttribute('aria-label', opcoes.label);
        if (opcoes.atual) b.setAttribute('aria-current', 'page');
        if (opcoes.desativado) b.disabled = true;
        return b;
    }

    function desenharPaginacao(total) {
        paginacao.textContent = '';
        paginacao.appendChild(botaoPagina('‹', pagina - 1, { label: 'Página anterior', desativado: pagina === 1 }));
        for (var i = 1; i <= total; i++) {
            paginacao.appendChild(botaoPagina(String(i), i, { label: 'Página ' + i, atual: i === pagina }));
        }
        paginacao.appendChild(botaoPagina('›', pagina + 1, { label: 'Próxima página', desativado: pagina === total }));
    }

    function atualizar() {
        var cards = Array.prototype.slice.call(lista.querySelectorAll('.card'));
        var visiveis = cards.filter(combina);
        var total = Math.max(1, Math.ceil(visiveis.length / POR_PAGINA));
        if (pagina > total) pagina = total;

        cards.forEach(function (card) { card.hidden = true; });
        visiveis.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA).forEach(function (card) {
            card.hidden = false;
        });

        chips.forEach(function (chip) {
            chip.setAttribute('aria-pressed', String(chip.dataset.filtro === filtro));
        });
        desenharPaginacao(total);
        vazio.hidden = visiveis.length > 0;
        status.textContent = visiveis.length === 1 ? '1 sala encontrada.' :
            visiveis.length + ' salas encontradas.';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });
    busca.addEventListener('input', function () {
        pagina = 1;
        atualizar();
    });
    sistema.addEventListener('change', function () {
        pagina = 1;
        atualizar();
    });
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            filtro = chip.dataset.filtro;
            pagina = 1;
            atualizar();
        });
    });
    paginacao.addEventListener('click', function (e) {
        var b = e.target.closest('.pagina');
        if (!b || b.disabled) return;
        pagina = Number(b.dataset.pagina);
        atualizar();
        lista.scrollIntoView({ block: 'start' });
    });

    // A etapa 6 redesenha os cards a partir dos dados e chama de novo
    window.VinteFaces = window.VinteFaces || {};
    window.VinteFaces.atualizarSalas = atualizar;

    atualizar();
})();
