// Validação de formulários com os estados do Figma: "Input (erro)" com borda
// Perigo e mensagem com ícone de alerta logo abaixo do campo. Sem alert().
// Uso: VinteFaces.validarFormulario(form, regras, aoEnviar)
//   regras: { nomeDoCampo: function (valor) { return true se válido } }
//   cada campo aponta para a sua mensagem com aria-describedby.
(function () {
    window.VinteFaces = window.VinteFaces || {};

    window.VinteFaces.validarFormulario = function (form, regras, aoEnviar) {
        var tentouEnviar = false;

        function campos() {
            return Object.keys(regras).map(function (nome) {
                return form.elements[nome];
            });
        }

        function validar(campo) {
            var valido = regras[campo.name](campo.value);
            var erro = document.getElementById(campo.getAttribute('aria-describedby'));
            if (valido) campo.removeAttribute('aria-invalid');
            else campo.setAttribute('aria-invalid', 'true');
            if (erro) erro.hidden = valido;
            return valido;
        }

        campos().forEach(function (campo) {
            // Depois da primeira tentativa, o erro some assim que o campo fica certo
            campo.addEventListener('input', function () {
                if (tentouEnviar) validar(campo);
            });
            campo.addEventListener('change', function () {
                if (tentouEnviar) validar(campo);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            tentouEnviar = true;
            var invalidos = campos().filter(function (campo) {
                return !validar(campo);
            });
            if (invalidos.length) {
                invalidos[0].focus();
                return;
            }
            tentouEnviar = false;
            aoEnviar(form);
        });
    };
})();
