// ========================================
// MOTOCONTROL
// FASE 3 - INICIAR JORNADA
// ========================================


// ========================================
// 1. ELEMENTOS DEL HTML
// ========================================

const btnIniciar = document.getElementById("btnIniciar");

const btnNuevaJornada = document.getElementById("btnNuevaJornada");

const modalJornada = document.getElementById("modalJornada");

const btnCerrarModal = document.getElementById("btnCerrarModal");

const formJornada = document.getElementById("formJornada");

const kmInicial = document.getElementById("kmInicial");

const estadoJornada = document.getElementById("estadoJornada");

const modalFinalizarJornada = document.getElementById("modalFinalizarJornada");

const btnCerrarFinalizar = document.getElementById("btnCerrarFinalizar");

const formFinalizarJornada = document.getElementById("formFinalizarJornada");

const kmFinal = document.getElementById("kmFinal");

const mostrarKmInicial = document.getElementById("mostrarKmInicial");

const resultadoKm = document.getElementById("resultadoKm");


// ========================================
// 2. CLAVES DE LOCALSTORAGE
// ========================================

const CLAVE_JORNADA = "jornadaActual";

const CLAVE_KILOMETRAJE = "kilometrajeActual";

const CLAVE_HISTORIAL = "historialJornadas";


// ========================================
// 3. ABRIR MODAL
// ========================================

function abrirModal() {

    // Comprobar si ya existe una jornada activa

    const jornadaGuardada = localStorage.getItem(CLAVE_JORNADA);

    if (jornadaGuardada) {

        alert("⚠️ Ya tienes una jornada activa.");

        return;
    }


    // Obtener el último kilometraje conocido

    const kilometrajeGuardado =
        localStorage.getItem(CLAVE_KILOMETRAJE);


    // Si existe, colocarlo automáticamente
    // dentro del campo

    if (kilometrajeGuardado) {

        kmInicial.value = kilometrajeGuardado;

    }


    // Mostrar modal

    modalJornada.style.display = "flex";

}


// ========================================
// 4. CERRAR MODAL
// ========================================

function cerrarModal() {

    modalJornada.style.display = "none";

}

// ========================================
// ABRIR MODAL FINALIZAR JORNADA
// ========================================

function abrirModalFinalizar() {

    const jornadaGuardada =
        localStorage.getItem(CLAVE_JORNADA);


    if (!jornadaGuardada) {

        alert("⚠️ No existe una jornada activa.");

        return;
    }


    const jornada =
        JSON.parse(jornadaGuardada);


    // Mostrar kilometraje inicial

    mostrarKmInicial.textContent =
        jornada.kmInicial.toLocaleString("es-CO") + " km";


    // Limpiar campo anterior

    kmFinal.value = "";


    // Mostrar modal

    modalFinalizarJornada.style.display = "flex";

}


// ========================================
// CERRAR MODAL FINALIZAR
// ========================================

function cerrarModalFinalizar() {

    modalFinalizarJornada.style.display = "none";

}

// ========================================
// FINALIZAR JORNADA
// ========================================

function finalizarJornada(event) {

    event.preventDefault();


    // Obtener jornada actual

    const jornadaGuardada =
        localStorage.getItem(CLAVE_JORNADA);


    if (!jornadaGuardada) {

        alert("⚠️ No existe una jornada activa.");

        return;
    }


    const jornada =
        JSON.parse(jornadaGuardada);


    // Obtener kilometraje final

    const kilometrajeFinal =
        Number(kmFinal.value);


    // ====================================
    // VALIDACIÓN
    // ====================================

    if (
        isNaN(kilometrajeFinal) ||
        kilometrajeFinal < 0
    ) {

        alert(
            "⚠️ Introduce un kilometraje válido."
        );

        return;
    }


    // ====================================
    // VALIDAR QUE NO SEA MENOR
    // ====================================

    if (
        kilometrajeFinal < jornada.kmInicial
    ) {

        alert(
            "⚠️ El kilometraje final no puede ser menor que el inicial."
        );

        return;
    }


    // ====================================
    // CALCULAR KILÓMETROS
    // ====================================

    const kilometrosRecorridos =
        kilometrajeFinal - jornada.kmInicial;


    // ====================================
    // FECHA Y HORA DE FINALIZACIÓN
    // ====================================

    const ahora = new Date();


    const horaFin =
        ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // ====================================
    // ACTUALIZAR JORNADA
    // ====================================

    jornada.estado = "finalizada";

    jornada.horaFin = horaFin;

    jornada.kmFinal = kilometrajeFinal;

    jornada.kmRecorridos = kilometrosRecorridos;


    // ====================================
// GUARDAR JORNADA FINALIZADA
// ====================================

// Por ahora dejamos la jornada finalizada
// preparada para el siguiente paso: historial.

localStorage.setItem(
    CLAVE_JORNADA,
    JSON.stringify(jornada)
);


    // ====================================
    // ACTUALIZAR KILOMETRAJE ACTUAL
    // ====================================

    localStorage.setItem(
        CLAVE_KILOMETRAJE,
        kilometrajeFinal
    );

    

    // ====================================
        // GUARDAR EN EL HISTORIAL
    // ====================================

    const historialGuardado =
    localStorage.getItem(CLAVE_HISTORIAL);

    const historial =
    historialGuardado
        ? JSON.parse(historialGuardado)
        : [];

    historial.push(jornada);

    localStorage.setItem(
    CLAVE_HISTORIAL,
    JSON.stringify(historial)
    );

    // ====================================
    // LIBERAR JORNADA ACTIVA
    // ====================================

    localStorage.removeItem(CLAVE_JORNADA);


    // Cerrar modal

    cerrarModalFinalizar();


    // Actualizar pantalla

    actualizarPantalla();
    mostrarHistorial();


    // Mostrar resultado

    alert(
        `🏁 Jornada finalizada.\n\n` +
        `🏍️ Kilómetros recorridos: ` +
        `${kilometrosRecorridos} km`
    );

}


// ========================================
// 5. INICIAR JORNADA
// ========================================

function iniciarJornada(event) {

    // Evita que el formulario recargue la página

    event.preventDefault();


    // Obtener kilometraje

    const kilometraje = Number(kmInicial.value);


    // Validar kilometraje

    if (kilometraje < 0 || isNaN(kilometraje)) {

        alert("⚠️ Introduce un kilometraje válido.");

        return;
    }


    // Comprobar nuevamente que no exista
    // una jornada activa

    const jornadaExistente =
        localStorage.getItem(CLAVE_JORNADA);


    if (jornadaExistente) {

        alert("⚠️ Ya tienes una jornada activa.");

        cerrarModal();

        actualizarPantalla();

        return;
    }


    // Obtener fecha y hora actuales

    const ahora = new Date();


    // Crear objeto de jornada

    const jornada = {

        estado: "activa",

        fecha: ahora.toLocaleDateString("es-CO"),

        horaInicio: ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ),

        kmInicial: kilometraje

    };


    // Guardar jornada

    localStorage.setItem(
        CLAVE_JORNADA,
        JSON.stringify(jornada)
    );


    // Guardar también el kilometraje actual

    localStorage.setItem(
        CLAVE_KILOMETRAJE,
        kilometraje
    );


    // Cerrar modal

    cerrarModal();


    // Actualizar pantalla

    actualizarPantalla();


    // Mostrar confirmación

    alert("🏍️ ¡Jornada iniciada correctamente!");
}


// ========================================
// 6. ACTUALIZAR PANTALLA
// ========================================

function actualizarPantalla() {

    // ====================================
    // OBTENER KILOMETRAJE ACTUAL
    // ====================================

    const kilometrajeGuardado =
        localStorage.getItem(CLAVE_KILOMETRAJE);


    if (kilometrajeGuardado) {

        const kilometraje =
            Number(kilometrajeGuardado);

        document.getElementById(
            "kilometrajeActual"
        ).textContent =
            kilometraje.toLocaleString("es-CO") + " km";

    } else {

        document.getElementById(
            "kilometrajeActual"
        ).textContent = "0 km";

    }

    // ====================================
    // KILÓMETROS DEL MES
    // ====================================

    const historialGuardado =
        localStorage.getItem(CLAVE_HISTORIAL);

    if (historialGuardado) {

        const historial =
            JSON.parse(historialGuardado);

        const mesActual = new Date().getMonth();
        const añoActual = new Date().getFullYear();

        let kilometrosMes = 0;

        historial.forEach(function (jornada) {

            const partesFecha =
                jornada.fecha.split("/");

            
            const mes = Number(partesFecha[1]) - 1;
            const año = Number(partesFecha[2]);

            if (
                mes === mesActual &&
                año === añoActual
            ) {
                kilometrosMes += jornada.kmRecorridos;
            }
        });

        document.getElementById(
            "kilometrosMes"
        ).textContent =
            kilometrosMes.toLocaleString("es-CO") + " km";

    } else {

        document.getElementById(
            "kilometrosMes"
        ).textContent = "0 km";
    }


    // ====================================
    // OBTENER JORNADA
    // ====================================

    const jornadaGuardada =
        localStorage.getItem(CLAVE_JORNADA);


    // ====================================
    // SI NO HAY JORNADA
    // ====================================

    if (!jornadaGuardada) {

        estadoJornada.innerHTML = `

            <p>
                No tienes una jornada activa.
            </p>

            <button id="btnNuevaJornada">
                ➕ Nueva jornada
            </button>

        `;


        // Conectar nuevamente el botón

        document
            .getElementById("btnNuevaJornada")
            .addEventListener(
                "click",
                abrirModal
            );


        return;
    }


    // ====================================
    // CONVERTIR JSON A OBJETO
    // ====================================

    const jornada =
        JSON.parse(jornadaGuardada);


    // ====================================
    // MOSTRAR JORNADA ACTIVA
    // ====================================

    estadoJornada.innerHTML = `

        <div class="jornada-activa">

            <p>
                🟢 Jornada en curso
            </p>

            <br>

            <p>
                📅 Fecha:
                <strong>${jornada.fecha}</strong>
            </p>

            <p>
                🕐 Inicio:
                <strong>${jornada.horaInicio}</strong>
            </p>

            <p>
                🏍️ Kilometraje inicial:
                <strong>
                    ${jornada.kmInicial.toLocaleString("es-CO")} km
                </strong>
            </p>


            <button
                id="btnFinalizarJornada"
                class="btn-finalizar">

                🏁 Finalizar jornada

            </button>

        </div>

    `;

    const btnFinalizarJornada =
    document.getElementById(
        "btnFinalizarJornada"
    );


    btnFinalizarJornada.addEventListener(
        "click",
        abrirModalFinalizar
    );

    

}

// ========================================
// MOSTRAR HISTORIAL
// ========================================

function mostrarHistorial() {

    const listaHistorial =
        document.getElementById("listaHistorial");

    const historialGuardado =
        localStorage.getItem(CLAVE_HISTORIAL);

    // Si no existe historial
    if (!historialGuardado) {

        listaHistorial.innerHTML = `
            <p class="historial-vacio">
                Todavía no tienes jornadas registradas.
            </p>
        `;

        return;
    }

    const historial =
        JSON.parse(historialGuardado);

    // Si el historial está vacío
    if (historial.length === 0) {

        listaHistorial.innerHTML = `
            <p class="historial-vacio">
                Todavía no tienes jornadas registradas.
            </p>
        `;

        return;
    }

    // Limpiar contenido anterior
    listaHistorial.innerHTML = "";

    // Recorrer todas las jornadas
    historial.forEach(function (jornada) {

        const tarjeta =
            document.createElement("div");

        tarjeta.classList.add("tarjeta-historial");

        tarjeta.innerHTML = `
            <div class="historial-cabecera">

                <strong>
                    📅 ${jornada.fecha}
                </strong>

                <span>
                    🏍️ ${jornada.kmRecorridos} km
                </span>

            </div>

            <div class="historial-datos">

                <p>
                    🕐 Inicio:
                    <strong>${jornada.horaInicio}</strong>
                </p>

                <p>
                    🕐 Fin:
                    <strong>${jornada.horaFin}</strong>
                </p>

                <p>
                    🟢 Odómetro inicial:
                    <strong>
                        ${jornada.kmInicial.toLocaleString("es-CO")} km
                    </strong>
                </p>

                <p>
                    🔴 Odómetro final:
                    <strong>
                        ${jornada.kmFinal.toLocaleString("es-CO")} km
                    </strong>
                </p>

            </div>
        `;

        listaHistorial.appendChild(tarjeta);

    });

}

// ========================================
// 7. EVENTOS
// ========================================

btnIniciar.addEventListener(
    "click",
    abrirModal
);


btnNuevaJornada.addEventListener(
    "click",
    abrirModal
);


btnCerrarModal.addEventListener(
    "click",
    cerrarModal
);


formJornada.addEventListener(
    "submit",
    iniciarJornada
);

btnCerrarFinalizar.addEventListener(
    "click",
    cerrarModalFinalizar
);


formFinalizarJornada.addEventListener(
    "submit",
    finalizarJornada
);


modalFinalizarJornada.addEventListener(
    "click",
    function (event) {

        if (event.target === modalFinalizarJornada) {

            cerrarModalFinalizar();

        }

    }
);


// ========================================
// 8. CERRAR MODAL AL HACER CLIC
//    FUERA DE LA VENTANA
// ========================================

modalJornada.addEventListener(
    "click",
    function (event) {

        if (event.target === modalJornada) {

            cerrarModal();

        }

    }
);


// ========================================
// 9. CARGAR ESTADO AL ABRIR LA APP
// ========================================

actualizarPantalla();
mostrarHistorial();

