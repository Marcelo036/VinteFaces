// Formulário de contato (demonstrativo: nada é enviado de verdade).
(function () {
    var form = document.getElementById('form-contato');
    if (!form || !window.VinteFaces) return;

    var sucesso = document.getElementById('contato-sucesso');

    window.VinteFaces.validarFormulario(form, {
        nome: function (v) { return v.trim().length >= 2; },
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
        assunto: function (v) { return v !== ''; },
        mensagem: function (v) { return v.trim().length >= 10; }
    }, function () {
        var nome = form.elements.nome.value.trim().split(' ')[0];
        sucesso.textContent = 'Tudo certo, ' + nome + '! Como este formulário é demonstrativo, ' +
            'a mensagem não foi enviada de verdade.';
        form.reset();
    });

    // A mensagem de sucesso some quando a pessoa começa uma nova mensagem
    form.addEventListener('input', function () {
        sucesso.textContent = '';
    });
})();
