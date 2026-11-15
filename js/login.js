// Entrar (decisão D9): o Usuario do UML 01 tem id, nome e email, sem senha.
// O usuário fica salvo só neste navegador: localStorage com "Lembrar de mim",
// sessionStorage sem. O mesmo e-mail recupera o mesmo id.
(function () {
    var form = document.getElementById('form-login');
    if (!form || !window.VinteFaces) return;

    var CHAVE = 'vinteFaces.usuario';
    var status = document.getElementById('login-status');

    function lerUsuario() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE) || sessionStorage.getItem(CHAVE));
        } catch (e) {
            return null;
        }
    }

    function mostrarBoasVindas(usuario) {
        status.textContent = 'Você entrou como ' + usuario.nome + '. ';
        var link = document.createElement('a');
        link.href = 'salas.html';
        link.textContent = 'Escolher uma sala';
        status.appendChild(link);
    }

    var atual = lerUsuario();
    if (atual) {
        form.elements.nome.value = atual.nome;
        form.elements.email.value = atual.email;
        mostrarBoasVindas(atual);
    }

    window.VinteFaces.validarFormulario(form, {
        nome: function (v) { return v.trim().length >= 2; },
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
    }, function () {
        var email = form.elements.email.value.trim().toLowerCase();
        var anterior = lerUsuario();
        var usuario = {
            id: anterior && anterior.email === email ? anterior.id : 'u' + Date.now(),
            nome: form.elements.nome.value.trim(),
            email: email
        };
        try {
            localStorage.removeItem(CHAVE);
            sessionStorage.removeItem(CHAVE);
            (form.elements.lembrar.checked ? localStorage : sessionStorage)
                .setItem(CHAVE, JSON.stringify(usuario));
        } catch (e) {
            // Navegação privada sem armazenamento: segue só nesta página
        }
        mostrarBoasVindas(usuario);
        if (window.VinteFaces.atualizarHeaderUsuario) window.VinteFaces.atualizarHeaderUsuario();
    });
})();
