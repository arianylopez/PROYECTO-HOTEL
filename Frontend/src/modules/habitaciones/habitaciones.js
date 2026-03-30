import { HabitacionService } from './HabitacionService.js';

let todasLasHabitaciones = [];
let todosLosTipos = [];

export async function initHabitaciones() {
    const btnTabHab = document.getElementById('tab-habitaciones');
    const btnTabTipos = document.getElementById('tab-tipos');
    const vistaHabitaciones = document.getElementById('vista-habitaciones');
    const vistaTipos = document.getElementById('vista-tipos');
    
    const filtroEstado = document.getElementById('filtro-estado');
    const filtroTipo = document.getElementById('filtro-tipo');
    
    const contenedorHab = document.getElementById('contenedor-habitaciones');
    const contenedorTipos = document.getElementById('contenedor-tipos');
    
    const templateHab = document.getElementById('template-card-habitacion').content;
    const templateTipo = document.getElementById('template-card-tipo').content;
    const templateAmenidad = document.getElementById('template-amenidad').content;

    const cambiarPestana = (mostrarHabitaciones) => {
        if (mostrarHabitaciones) {
            btnTabHab.classList.add('tabs-container__btn--active');
            btnTabTipos.classList.remove('tabs-container__btn--active');
            vistaHabitaciones.classList.add('habitaciones__view--active');
            vistaTipos.classList.remove('habitaciones__view--active');
        } else {
            btnTabTipos.classList.add('tabs-container__btn--active');
            btnTabHab.classList.remove('tabs-container__btn--active');
            vistaTipos.classList.add('habitaciones__view--active');
            vistaHabitaciones.classList.remove('habitaciones__view--active');
        }
    };

    btnTabHab.addEventListener('click', () => cambiarPestana(true));
    btnTabTipos.addEventListener('click', () => cambiarPestana(false));

    const inyectarTextoSeguro = (elementoPadre, selector, texto) => {
        const elemento = elementoPadre.querySelector(selector);
        if (elemento) elemento.textContent = texto || '';
    };

    const renderizarAmenidades = (contenedorAm, listaAmenidades) => {
        contenedorAm.textContent = '';
        if (!listaAmenidades) return;
        
        const arrayAmenidades = Array.isArray(listaAmenidades) ? listaAmenidades : listaAmenidades.split(',').map(a => a.trim());
        
        arrayAmenidades.forEach(am => {
            if(!am) return;
            const pastilla = templateAmenidad.cloneNode(true);
            inyectarTextoSeguro(pastilla, '.celda-amenidad-texto', am);
            contenedorAm.appendChild(pastilla);
        });
    };

    const renderizarHabitaciones = (listaFiltrada) => {
        contenedorHab.textContent = '';
        
        if(listaFiltrada.length === 0) {
            contenedorHab.textContent = 'No se encontraron habitaciones con estos filtros.';
            return;
        }

        listaFiltrada.forEach(hab => {
            const tarjeta = templateHab.cloneNode(true);
            const tipoObj = todosLosTipos.find(t => t.tipoHabitacionId === hab.tipoHabitacionId) || {};

            const numHabLimpio = String(hab.numeroHabitacion).replace(/Hab\.?\s*/i, '').trim();
            inyectarTextoSeguro(tarjeta, '.celda-hab-numero', `Hab. ${numHabLimpio}`);
            inyectarTextoSeguro(tarjeta, '.celda-hab-piso', `Piso ${hab.piso}`);
            inyectarTextoSeguro(tarjeta, '.celda-hab-tipo', tipoObj.nombre || 'Desconocido');
            inyectarTextoSeguro(tarjeta, '.celda-hab-capacidad', tipoObj.capacidad || '0');
            inyectarTextoSeguro(tarjeta, '.celda-hab-precio', `$${tipoObj.precioBase || '0'}`);

            const badgeEstado = tarjeta.querySelector('.celda-hab-estado');
            if (badgeEstado) {
                const estadoLimpio = hab.estado.trim();
                badgeEstado.textContent = estadoLimpio;
                badgeEstado.className = `badge-estado badge-estado--${estadoLimpio} celda-hab-estado`;
            }

            const contAmenidades = tarjeta.querySelector('.celda-hab-amenidades');
            if (contAmenidades) renderizarAmenidades(contAmenidades, tipoObj.amenidades);

            contenedorHab.appendChild(tarjeta);
        });
    };

    const renderizarTipos = () => {
        contenedorTipos.textContent = '';

        todosLosTipos.forEach(tipo => {
            const tarjeta = templateTipo.cloneNode(true);
            
            const habsDeEsteTipo = todasLasHabitaciones.filter(h => h.tipoHabitacionId === tipo.tipoHabitacionId);
            const disponibles = habsDeEsteTipo.filter(h => h.estado.toLowerCase() === 'disponible').length;
            const totalTipo = habsDeEsteTipo.length;

            inyectarTextoSeguro(tarjeta, '.celda-tipo-nombre', tipo.nombre);
            inyectarTextoSeguro(tarjeta, '.celda-tipo-desc', tipo.descripcion);
            inyectarTextoSeguro(tarjeta, '.celda-tipo-capacidad', tipo.capacidad);
            inyectarTextoSeguro(tarjeta, '.celda-tipo-precio', `$${tipo.precioBase}`);
            inyectarTextoSeguro(tarjeta, '.celda-tipo-disponibilidad', `${disponibles} de ${totalTipo} habitación(es) disponible(s)`);

            const contAmenidades = tarjeta.querySelector('.celda-tipo-amenidades');
            if (contAmenidades) renderizarAmenidades(contAmenidades, tipo.amenidades);

            contenedorTipos.appendChild(tarjeta);
        });
    };

    const actualizarDashboard = () => {
        document.getElementById('count-total').textContent = todasLasHabitaciones.length;
        document.getElementById('count-disponibles').textContent = todasLasHabitaciones.filter(h => h.estado.toLowerCase() === 'disponible').length;
        document.getElementById('count-ocupadas').textContent = todasLasHabitaciones.filter(h => h.estado.toLowerCase() === 'ocupada').length;
    };

    const poblarFiltros = () => {
        filtroTipo.innerHTML = '<option value="Todos">Todos los tipos</option>';
        todosLosTipos.forEach(tipo => {
            const opcion = document.createElement('option');
            opcion.value = tipo.tipoHabitacionId;
            opcion.textContent = tipo.nombre;
            filtroTipo.appendChild(opcion); 
        });
    };

    const aplicarFiltros = () => {
        const estadoSelect = filtroEstado.value;
        const tipoSelect = filtroTipo.value;

        let filtradas = todasLasHabitaciones;

        if (estadoSelect !== 'Todos') {
            filtradas = filtradas.filter(h => h.estado === estadoSelect);
        }
        if (tipoSelect !== 'Todos') {
            filtradas = filtradas.filter(h => h.tipoHabitacionId === tipoSelect);
        }

        renderizarHabitaciones(filtradas);
    };

    filtroEstado.addEventListener('change', aplicarFiltros);
    filtroTipo.addEventListener('change', aplicarFiltros);

    const cargarDatos = async () => {
        try {
            contenedorHab.textContent = 'Cargando datos del hotel...';
            
            const [habsData, tiposData] = await Promise.all([
                HabitacionService.obtenerHabitaciones(),
                HabitacionService.obtenerTipos()
            ]);

            todasLasHabitaciones = habsData;
            todosLosTipos = tiposData;

            actualizarDashboard();
            poblarFiltros();
            renderizarHabitaciones(todasLasHabitaciones);
            renderizarTipos();

        } catch (error) {
            console.error('Error al cargar habitaciones:', error);
            contenedorHab.textContent = 'Error de conexión al cargar las habitaciones.';
        }
    };

    await cargarDatos();
}