import { ServicioService } from './ServicioService.js';

function crearTarjetaServicio(contacto) {
    const articulo = document.createElement('article');
    articulo.className = 'card-servicio';

    const rolTexto = contacto.esEncargado ? 'Encargado' : 'Empleado';
    const rolClase = contacto.esEncargado ? 'badge-rol badge-rol--encargado' : 'badge-rol badge-rol--empleado';

    const horario = contacto.horarioAtencion || '';
    const es24h = horario.toLowerCase().includes('24 horas');
    const tagTexto = es24h ? 'Disponible 24/7' : 'Horario laboral';
    const tagClase = es24h ? 'tag-estado tag-estado--green' : 'tag-estado tag-estado--blue';

    const esc = (str) => {
        if (!str) return 'N/A';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    articulo.innerHTML = `
        <header class="card-servicio__header">
            <div class="card-servicio__icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            </div>
            <div class="card-servicio__header-info">
                <h3 class="card-servicio__name">${esc(contacto.nombreArea)}</h3>
                <p class="card-servicio__desc">${esc(contacto.descripcion)}</p>
            </div>
        </header>

        <div class="card-servicio__body">
            <!-- Nombre + Badge de Rol -->
            <div class="info-block info-block--con-badge">
                <svg class="info-block__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div class="info-block__content">
                    <span class="info-block__label">Nombre</span>
                    <span class="info-block__value">${esc(contacto.empleadoNombre)}</span>
                </div>
                <span class="${rolClase}">${rolTexto}</span>
            </div>

            <!-- Teléfono -->
            <div class="info-block">
                <svg class="info-block__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div class="info-block__content">
                    <span class="info-block__label">Teléfono</span>
                    <span class="info-block__value">${esc(contacto.empleadoTelefono)}</span>
                </div>
            </div>

            <!-- Email -->
            <div class="info-block">
                <svg class="info-block__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div class="info-block__content">
                    <span class="info-block__label">Email</span>
                    <span class="info-block__value">${esc(contacto.empleadoEmail)}</span>
                </div>
            </div>

            <!-- Horario + Tag de estado -->
            <div class="info-block info-block--con-badge">
                <svg class="info-block__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div class="info-block__content">
                    <span class="info-block__label">Horario de atención</span>
                    <span class="info-block__value">${esc(contacto.horarioAtencion)}</span>
                </div>
                <span class="${tagClase}">${tagTexto}</span>
            </div>

            <!-- Ubicación -->
            <div class="info-block">
                <svg class="info-block__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div class="info-block__content">
                    <span class="info-block__label">Ubicación</span>
                    <span class="info-block__value">${esc(contacto.ubicacion)}</span>
                </div>
            </div>
        </div>
    `;

    return articulo;
}

export async function initServicios() {
    const contenedor = document.getElementById('contenedor-tarjetas-servicios');
    const contador = document.getElementById('contador-servicios');

    const cargarServicios = async () => {
        try {
            contenedor.textContent = 'Cargando servicios...';
            const contactos = await ServicioService.obtenerContactos();

            contenedor.textContent = '';

            if (!contactos || contactos.length === 0) {
                contenedor.innerHTML = '<p style="grid-column: 1/-1; color: var(--color-text-muted);">No hay contactos de servicios disponibles en este momento.</p>';
                if (contador) contador.textContent = '0';
                return;
            }

            if (contador) contador.textContent = contactos.length;

            contactos.forEach(contacto => {
                const tarjeta = crearTarjetaServicio(contacto);
                contenedor.appendChild(tarjeta);
            });

        } catch (error) {
            console.error('Error al cargar servicios:', error);
            contenedor.innerHTML = '<p style="grid-column: 1/-1; color: var(--color-error, #d32f2f);">Ocurrió un error al consultar los servicios. Intente nuevamente.</p>';
        }
    };

    await cargarServicios();
}