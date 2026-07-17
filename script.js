document.addEventListener('DOMContentLoaded', function () {
    const pista = document.getElementById('pistaTrabajos');
    const botonAnterior = document.getElementById('trabajoAnterior');
    const botonSiguiente = document.getElementById('trabajoSiguiente');
    const numerosPagina = document.querySelectorAll('.numero-pagina');
    const tarjetas = pista ? pista.querySelectorAll('.trabajo-tarjeta') : [];

    if (pista && tarjetas.length > 0) {
        function pasoTarjeta() {
            const tarjeta = tarjetas[0];
            const estilo = window.getComputedStyle(pista);
            const espacio = parseFloat(estilo.columnGap || estilo.gap || 18);
            return tarjeta.getBoundingClientRect().width + espacio;
        }

        function desplazamientoMaximo() {
            return pista.scrollWidth - pista.clientWidth;
        }

        function activarNumero(indice) {
            numerosPagina.forEach((el) => el.classList.remove('active'));
            const objetivo = document.querySelector(`.numero-pagina[data-indice="${indice}"]`);
            if (objetivo) objetivo.classList.add('active');
        }

        function indiceSegunScroll() {
            const paso = pasoTarjeta();
            if (paso <= 0) return 0;
            const indice = Math.round(pista.scrollLeft / paso);
            return Math.min(indice, tarjetas.length - 1);
        }

        let indiceActivo = 0;
        let esScrollProgramado = false;

        function irATarjeta(indice) {
            indiceActivo = Math.max(0, Math.min(indice, tarjetas.length - 1));
            esScrollProgramado = true;
            const objetivo = Math.min(indiceActivo * pasoTarjeta(), desplazamientoMaximo());
            pista.scrollTo({ left: objetivo, behavior: 'smooth' });
            activarNumero(indiceActivo);
        }

        botonAnterior && botonAnterior.addEventListener('click', () => irATarjeta(indiceActivo - 1));

        botonSiguiente && botonSiguiente.addEventListener('click', () => irATarjeta(indiceActivo + 1));

        numerosPagina.forEach((el) => {
            el.addEventListener('click', () => irATarjeta(parseInt(el.dataset.indice, 10)));
        });

        let tiempoEsperaScroll;
        pista.addEventListener('scroll', () => {
            clearTimeout(tiempoEsperaScroll);
            tiempoEsperaScroll = setTimeout(() => {
                if (esScrollProgramado) {
                    esScrollProgramado = false;
                    return;
                }
                indiceActivo = indiceSegunScroll();
                activarNumero(indiceActivo);
            }, 80);
        });
    }


    const formulario = document.getElementById('formularioContacto');
    const elementoEstado = document.getElementById('estadoFormulario');
    const CLAVE_ALMACENAMIENTO = 'mensajesContactoPortafolio';

    if (formulario) {
        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();

            const registro = {
                nombre: formulario.nombre.value.trim(),
                correo: formulario.correo.value.trim(),
                mensaje: formulario.mensaje.value.trim(),
                fecha: new Date().toISOString()
            };

            if (!registro.nombre || !registro.correo || !registro.mensaje) {
                elementoEstado.textContent = 'Por favor completa todos los campos';
                elementoEstado.classList.remove('success');
                elementoEstado.classList.add('error');
                return;
            }

            let mensajesGuardados = [];
            try {
                mensajesGuardados = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO)) || [];
            } catch (error) {
                mensajesGuardados = [];
            }

            mensajesGuardados.push(registro);
            localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(mensajesGuardados));

            formulario.reset();
            elementoEstado.classList.remove('error');
            elementoEstado.classList.add('success');
            elementoEstado.textContent = 'Pronto me pondré en contacto contigo ¡Gracias por tu mensaje!';

            setTimeout(() => {
                elementoEstado.textContent = '';
                elementoEstado.classList.remove('success');
            }, 4000);
        });
    }
});