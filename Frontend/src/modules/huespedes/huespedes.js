import { HuespedService } from './HuespedService.js';

let todosLosHuespedes = [];
let huespedIdEnEdicion = null;

export async function initHuespedes() {
    const form = document.getElementById('form-registro-huesped');
    const tbody = document.getElementById('cuerpo-tabla-huespedes');
    const templateFila = document.getElementById('template-fila-huesped').content;
    const mensajeBox = document.getElementById('mensaje-formulario');
    const inputBusqueda = document.getElementById('input-busqueda');

    const modal = document.getElementById('modal-registro-huesped');
    const modalTitulo = document.getElementById('modal-titulo');
    const btnGuardarForm = document.getElementById('btn-guardar');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCerrarModalX = document.getElementById('btn-cerrar-modal-x');
    const modalOverlay = document.getElementById('modal-overlay');

    const renderizarTabla = (listaHuespedes) => {
        tbody.textContent = ''; 
        
        listaHuespedes.forEach(huesped => {
            const filaClonada = templateFila.cloneNode(true);

            filaClonada.querySelector('.celda-nombre').textContent = `${huesped.nombre} ${huesped.apellido}`;
            filaClonada.querySelector('.celda-email').textContent = huesped.correo || 'Sin correo';
            filaClonada.querySelector('.celda-tipo-doc').textContent = huesped.tipoDocumento;
            filaClonada.querySelector('.celda-doc').textContent = huesped.documentoIdentidad;
            filaClonada.querySelector('.celda-telefono').textContent = huesped.telefono || 'Sin teléfono';
            filaClonada.querySelector('.celda-direccion').textContent = huesped.direccion || 'Sin dirección';
            filaClonada.querySelector('.celda-nacionalidad').textContent = huesped.nacionalidad || '-';
            filaClonada.querySelector('.celda-fecha').textContent = new Date(huesped.fechaRegistro).toLocaleDateString();
            const btnEditar = filaClonada.querySelector('.celda-btn-editar');
            btnEditar.addEventListener('click', () => {
                abrirModalEdicion(huesped);
            });

            tbody.appendChild(filaClonada);
        });
    };

    const cargarDatosDesdeApi = async () => {
        try {
            tbody.textContent = 'Cargando...';
            todosLosHuespedes = await HuespedService.obtenerTodos();
            renderizarTabla(todosLosHuespedes);
        } catch (error) {
            console.error('Error:', error);
            tbody.textContent = 'Error al cargar huéspedes.';
        }
    };

    const abrirModalRegistro = () => {
        huespedIdEnEdicion = null; 
        modalTitulo.textContent = 'Registrar Nuevo Huésped';
        btnGuardarForm.textContent = 'Registrar';
        form.reset();
        mensajeBox.textContent = '';
        modal.classList.add('modal--open');
        document.body.classList.add('modal-open');
    };

    const abrirModalEdicion = (huesped) => {
        huespedIdEnEdicion = huesped.huespedId; 
        modalTitulo.textContent = 'Editar Huésped';
        btnGuardarForm.textContent = 'Actualizar Datos';
        mensajeBox.textContent = '';

        document.getElementById('nombre').value = huesped.nombre;
        document.getElementById('apellido').value = huesped.apellido;
        document.getElementById('tipoDocumento').value = huesped.tipoDocumento;
        document.getElementById('documentoIdentidad').value = huesped.documentoIdentidad;
        document.getElementById('telefono').value = huesped.telefono || '';
        document.getElementById('correo').value = huesped.correo || '';
        document.getElementById('nacionalidad').value = huesped.nacionalidad || '';
        document.getElementById('direccion').value = huesped.direccion || '';

        modal.classList.add('modal--open');
        document.body.classList.add('modal-open');
    };

    const cerrarModal = () => {
        modal.classList.remove('modal--open');
        document.body.classList.remove('modal-open');
        huespedIdEnEdicion = null;
    };

    const mostrarMensaje = (texto, tipo) => {
        mensajeBox.textContent = texto;
        mensajeBox.className = `modal__message modal__message--${tipo}`;
        if (tipo === 'exito') setTimeout(cerrarModal, 1500);
    };

    const ejecutarBusqueda = () => {
        const termino = inputBusqueda.value.trim().toLowerCase();
        
        if (!termino) {
            renderizarTabla(todosLosHuespedes);
            return;
        }

        const filtrados = todosLosHuespedes.filter(h => 
            h.nombre.toLowerCase().includes(termino) ||
            h.apellido.toLowerCase().includes(termino) ||
            h.documentoIdentidad.includes(termino) ||
            (h.correo && h.correo.toLowerCase().includes(termino))
        );

        renderizarTabla(filtrados);
    };

    btnAbrirModal.addEventListener('click', abrirModalRegistro);
    btnCerrarModal.addEventListener('click', cerrarModal);
    btnCerrarModalX.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', cerrarModal);
    inputBusqueda.addEventListener('input', ejecutarBusqueda);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datosHuesped = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            tipoDocumento: document.getElementById('tipoDocumento').value,
            documentoIdentidad: document.getElementById('documentoIdentidad').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim(),
            direccion: document.getElementById('direccion').value.trim()
        };

        try {
            if (huespedIdEnEdicion) {
                await HuespedService.actualizar(huespedIdEnEdicion, datosHuesped);
                mostrarMensaje('Huésped actualizado con éxito.', 'exito');
            } else {
                await HuespedService.registrar(datosHuesped);
                mostrarMensaje('Huésped registrado con éxito.', 'exito');
            }
            await cargarDatosDesdeApi();
        } catch (error) {
            mostrarMensaje(error.message || 'Error en la operación.', 'error');
        }
    });

    await cargarDatosDesdeApi();
}