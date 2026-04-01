import { ReservaService } from './ReservaService.js';
import { TipoHabitacionContext } from '../../patterns/TipoHabitacionStrategy.js';

export async function initReservas() {
    let reservas = [];
    let huespedes = [];
    let habitaciones = [];
    let tiposHabitacion = [];
    let reservaSeleccionada = null;
    let acompanantesSeleccionados = [];

    const tbody = document.getElementById('cuerpo-tabla-reservas');
    if (!tbody) return;

    const msgReserva = document.getElementById('msg-reserva');
    const inputIngreso = document.getElementById('res-ingreso');
    const inputSalida = document.getElementById('res-salida');
    const selectHab = document.getElementById('res-habitacion');
    const inputPersonas = document.getElementById('res-personas');

    const esc = (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const abrirModal = (id) => {
        const modal = document.getElementById(id);
        if(modal) {
            modal.classList.add('modal--open');
            document.body.classList.add('modal-open');
        }
    };

    const cerrarModales = () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('modal--open'));
        document.body.classList.remove('modal-open');
        reservaSeleccionada = null;
    };

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', cerrarModales);
    });

    const cargarDatosInit = async () => {
        try {
            tbody.innerHTML = '<tr><td colspan="7">Cargando datos...</td></tr>';
            
            const [resData, hueData, habData, tiposData] = await Promise.all([
                ReservaService.obtenerTodas().catch(() => []), 
                ReservaService.obtenerHuespedes().catch(() => []),
                ReservaService.obtenerHabitaciones().catch(() => []),
                ReservaService.obtenerTiposHabitacion().catch(() => [])
            ]);
            
            reservas = resData.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));
            huespedes = hueData;
            habitaciones = habData;
            tiposHabitacion = tiposData;

            actualizarDashboard();
            poblarSelectHuespedes();
            ejecutarFiltros(); 
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="7">Error al cargar reservas.</td></tr>';
        }
    };

    const actualizarDashboard = () => {
        const countActivas = document.getElementById('count-activas');
        if (!countActivas) return;

        countActivas.textContent = reservas.filter(r => {
            const est = (r.estado || '').toLowerCase().trim();
            return est === 'reservada' || est === 'en curso';
        }).length;
        
        document.getElementById('count-reservadas').textContent = reservas.filter(r => (r.estado || '').toLowerCase().trim() === 'reservada').length;
        document.getElementById('count-encurso').textContent = reservas.filter(r => (r.estado || '').toLowerCase().trim() === 'en curso').length;
        document.getElementById('count-canceladas').textContent = reservas.filter(r => (r.estado || '').toLowerCase().trim() === 'cancelada').length;
    };

    const ejecutarFiltros = () => {
        const busqueda = (document.getElementById('res-busqueda')?.value || '').toLowerCase();
        const filtroEst = (document.getElementById('res-filtro-estado')?.value || 'Activas').toLowerCase().trim();

        let filtradas = reservas.filter(res => {
            const estadoDB = (res.estado || '').toLowerCase().trim();

            if (filtroEst === 'activas') {
                if (estadoDB !== 'reservada' && estadoDB !== 'en curso') return false;
            } else if (filtroEst !== 'todas') {
                if (estadoDB !== filtroEst) return false;
            }

            if (busqueda) {
                const huesped = huespedes.find(h => h.huespedId === res.huespedTitularId);
                const hab = habitaciones.find(h => h.habitacionId === res.habitacionId);
                const strHuesped = huesped ? `${huesped.nombre} ${huesped.apellido}`.toLowerCase() : '';
                const strHab = hab ? `Hab. ${hab.numeroHabitacion}`.toLowerCase() : '';
                
                if (!strHuesped.includes(busqueda) && !strHab.includes(busqueda)) return false;
            }
            return true;
        });

        renderizarTabla(filtradas);
    };

    const renderizarTabla = (lista) => {
        tbody.innerHTML = ''; 
        const contFilas = document.getElementById('total-filas');
        if (contFilas) contFilas.textContent = lista.length;

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No hay reservas para mostrar con estos filtros.</td></tr>';
            return;
        }

        lista.forEach(res => {
            const tr = document.createElement('tr');
            
            tr.className = 'tr-clickable';
            tr.addEventListener('click', (e) => {
                if (e.target.closest('button')) return; 
                abrirDetalleReserva(res);
            });
            
            const huesped = huespedes.find(h => h.huespedId === res.huespedTitularId);
            const hab = habitaciones.find(h => h.habitacionId === res.habitacionId);
            const tipo = tiposHabitacion.find(t => t.tipoHabitacionId === hab?.tipoHabitacionId);

            const nombreHue = huesped ? `${huesped.nombre} ${huesped.apellido}` : 'Desconocido';

            const numHab = hab ? String(hab.numeroHabitacion).replace(/Hab\.?\s*/i, '').trim() : 'N/A';
            const nombreTipo = tipo ? tipo.nombre : 'Desconocido';
            
            const fIngreso = new Date(res.fechaIngreso).toLocaleDateString();
            const fSalida = new Date(res.fechaSalida).toLocaleDateString();
            
            const estadoStr = res.estado || 'Desconocido';
            const estadoClean = estadoStr.replace(/\s+/g, '').toLowerCase(); 

            const formatearHoraCheckin = (fechaCsharp) => {
                if (!fechaCsharp) return '';
                const fechaUTC = fechaCsharp.endsWith('Z') ? fechaCsharp : fechaCsharp + 'Z';
                return new Date(fechaUTC).toLocaleString(); 
            };

            const checkinTime = (estadoClean === 'encurso' && res.fechaHoraCheckin) 
                ? `<span class="checkin-label">Check-in: ${formatearHoraCheckin(res.fechaHoraCheckin)}</span>` 
                : '';

            const dias = Math.ceil((new Date(res.fechaSalida) - new Date(res.fechaIngreso)) / (1000 * 60 * 60 * 24));
            const total = (tipo ? tipo.precioBase : 0) * (dias > 0 ? dias : 1);

            let acompanantesHTML = '';
            if (estadoClean === 'encurso' && res.cantidadPersonas > 1) {
                
                let nombresAcompanantes = [];

                if (res.acompanantesIds && res.acompanantesIds.length > 0) {
                    nombresAcompanantes = res.acompanantesIds.map(id => {
                        const h = huespedes.find(hue => hue.huespedId === id);
                        return h ? `${h.nombre} ${h.apellido}` : 'Desconocido';
                    });
                } else if (res.acompanantes && res.acompanantes.length > 0) {
                    nombresAcompanantes = res.acompanantes.map(a => typeof a === 'object' ? `${a.nombre} ${a.apellido}` : a);
                }

                if (nombresAcompanantes.length > 0) {
                    acompanantesHTML = `
                        <div class="text-muted" style="font-size: 0.75rem; margin-top: 4px;">
                            + ${nombresAcompanantes.length} acompañante(s):<br>
                            ${nombresAcompanantes.map(nombre => `• ${esc(nombre)}`).join('<br>')}
                        </div>
                    `;
                } else {
                    acompanantesHTML = `
                        <div class="text-muted" style="font-size: 0.75rem; margin-top: 4px;">
                            + ${res.cantidadPersonas - 1} acompañante(s)
                        </div>
                    `;
                }
            }

            const svgUser = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
            const svgCheck = `<svg class="icon-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            const svgCross = `<svg class="icon-cross" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

            tr.innerHTML = `
                <td>
                    <div class="perfil-info">
                        <div class="perfil-info__avatar">${svgUser}</div>
                        <div class="perfil-info__textos">
                            <span class="perfil-info__nombre">${esc(nombreHue)}</span>
                            <span class="text-muted">Titular</span>
                        </div>
                    </div>
                </td>
                <td>
                    <strong>Hab. ${esc(numHab)}</strong>
                    <div class="text-muted">${esc(nombreTipo)}</div>
                </td>
                <td>
                    <div class="fecha-linea">${svgCheck} ${esc(fIngreso)}</div>
                    <div class="fecha-linea">${svgCross} ${esc(fSalida)}</div>
                    ${checkinTime}
                </td>
                <td>
                    <span class="badge-estado badge-estado--${esc(estadoClean)}">${esc(estadoStr)}</span>
                </td>
                <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="color:#9aa0a6;">👥</span> <strong>${esc(res.cantidadPersonas)} persona(s)</strong>
                    </div>
                    ${acompanantesHTML}
                </td>
                <td>
                    <strong>$${total.toFixed(2)}</strong>
                    <div class="text-muted">${esc(dias)} días</div>
                </td>
                <td class="td-acciones"></td>
            `;

            const tdAcc = tr.querySelector('.td-acciones');
            
            if (estadoClean === 'reservada') {
                const btnCheckin = document.createElement('button');
                btnCheckin.className = 'btn-outline';
                btnCheckin.innerHTML = '→] Check-in';
                btnCheckin.onclick = () => prepararCheckIn(res);
                
                const btnCancelar = document.createElement('button');
                btnCancelar.className = 'btn-danger';
                btnCancelar.innerHTML = '⊗ Cancelar';
                btnCancelar.onclick = () => prepararCancelar(res);
                
                tdAcc.appendChild(btnCheckin);
                tdAcc.appendChild(btnCancelar);
            } else if (estadoClean === 'encurso') {
                const btnCheckout = document.createElement('button');
                btnCheckout.className = 'btn-outline';
                btnCheckout.innerHTML = '[→ Check-out';
                btnCheckout.onclick = () => prepararCheckOut(res);
                tdAcc.appendChild(btnCheckout);
            }

            tbody.appendChild(tr);
        });
    };

    document.getElementById('res-busqueda')?.addEventListener('input', ejecutarFiltros);
    document.getElementById('res-filtro-estado')?.addEventListener('change', ejecutarFiltros);

    const btnNueva = document.getElementById('btn-nueva-reserva');
    if (btnNueva) {
        btnNueva.addEventListener('click', () => {
            document.getElementById('form-reserva').reset();
            selectHab.disabled = true;
            document.getElementById('res-resumen-box').style.display = 'none';
            document.getElementById('res-capacidad-helper').style.display = 'none';
            msgReserva.textContent = '';
            abrirModal('modal-reserva');
        });
    }

    const poblarSelectHuespedes = () => {
        const select = document.getElementById('res-huesped');
        if(!select) return;
        select.innerHTML = '<option value="">Seleccione un huésped titular</option>';
        huespedes.forEach(h => {
            const opt = document.createElement('option');
            opt.textContent = `${h.nombre} ${h.apellido} - ${h.tipoDocumento}: ${h.documentoIdentidad}`;
            opt.value = h.huespedId;
            select.appendChild(opt);
        });
    };

    const validarDisponibilidad = () => {
        const dIngreso = new Date(inputIngreso.value);
        const dSalida = new Date(inputSalida.value);

        document.getElementById('res-resumen-box').style.display = 'none';
        document.getElementById('res-capacidad-helper').style.display = 'none';

        if (!inputIngreso.value || !inputSalida.value) return;

        if (dSalida <= dIngreso) {
            msgReserva.textContent = 'La fecha de salida debe ser posterior a la de ingreso.';
            msgReserva.className = 'modal__message modal__message--error';
            selectHab.disabled = true;
            return;
        }

        msgReserva.textContent = '';
        selectHab.disabled = false;
        selectHab.innerHTML = '<option value="">Seleccionar habitación</option>';

        const habsDisponibles = habitaciones.filter(h => h.estado === 'Disponible');
        
        habsDisponibles.forEach(h => {
            const tipo = tiposHabitacion.find(t => t.tipoHabitacionId === h.tipoHabitacionId);
            if (tipo) {
                const opt = document.createElement('option');
                opt.textContent = `Hab. ${h.numeroHabitacion} - ${tipo.nombre} (Cap: ${tipo.capacidad}, $${tipo.precioBase}/noche)`;
                opt.value = h.habitacionId;
                opt.dataset.capacidad = tipo.capacidad; 
                opt.dataset.precio = tipo.precioBase; 
                opt.dataset.nombreTipo = tipo.nombre; 
                selectHab.appendChild(opt);
            }
        });
    };

    inputIngreso?.addEventListener('change', validarDisponibilidad);
    inputSalida?.addEventListener('change', validarDisponibilidad);

    selectHab?.addEventListener('change', (e) => {
        const habId = e.target.value;
        const boxResumen = document.getElementById('res-resumen-box');
        const helperCapacidad = document.getElementById('res-capacidad-helper');
        
        if (!habId) { 
            boxResumen.style.display = 'none'; 
            helperCapacidad.style.display = 'none';
            return; 
        }
        
        const habOpcion = selectHab.options[selectHab.selectedIndex];
        const precioNoche = parseFloat(habOpcion.dataset.precio);
        const capacidad = habOpcion.dataset.capacidad;
        const nombreTipo = habOpcion.dataset.nombreTipo;

        const dIngreso = new Date(inputIngreso.value);
        const dSalida = new Date(inputSalida.value);
        const diasEstadia = Math.ceil((dSalida - dIngreso) / (1000 * 60 * 60 * 24));
        const total = precioNoche * diasEstadia;

        document.getElementById('res-sum-tipo').textContent = nombreTipo;
        document.getElementById('res-sum-precio').textContent = `$${precioNoche}`;
        document.getElementById('res-sum-dias').textContent = diasEstadia;
        document.getElementById('res-sum-total').textContent = `$${total.toFixed(2)}`;
        
        document.getElementById('res-cap-max').textContent = capacidad;
        
        boxResumen.style.display = 'flex';
        helperCapacidad.style.display = 'block';
    });

    document.getElementById('form-reserva')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const habOpcion = selectHab.options[selectHab.selectedIndex];
        const capMaxima = parseInt(habOpcion.dataset.capacidad);
        const persIngresadas = parseInt(inputPersonas.value);

        if (persIngresadas > capMaxima) {
            msgReserva.textContent = `Error: La habitación seleccionada permite máximo ${capMaxima} persona(s).`;
            msgReserva.className = 'modal__message modal__message--error';
            return;
        }

        const nuevaReserva = {
            huespedTitularId: document.getElementById('res-huesped').value,
            habitacionId: selectHab.value,
            fechaIngreso: new Date(inputIngreso.value).toISOString(),
            fechaSalida: new Date(inputSalida.value).toISOString(),
            cantidadPersonas: persIngresadas,
            observaciones: document.getElementById('res-obs').value
        };

        try {
            await ReservaService.crearReserva(nuevaReserva);
            cerrarModales();
            await cargarDatosInit(); 
        } catch (error) {
            msgReserva.textContent = error.message || 'Error al guardar la reserva.';
            msgReserva.className = 'modal__message modal__message--error';
        }
    });

    const prepararCheckIn = (reserva) => {
        reservaSeleccionada = reserva;
        const huesped = huespedes.find(h => h.huespedId === reserva.huespedTitularId);
        const hab = habitaciones.find(h => h.habitacionId === reserva.habitacionId);

        document.getElementById('chk-titular').textContent = huesped ? `${huesped.nombre} ${huesped.apellido}` : 'N/A';
        document.getElementById('chk-hab').textContent = hab ? `Hab. ${hab.numeroHabitacion}` : 'N/A';
        document.getElementById('chk-personas').textContent = `${reserva.cantidadPersonas} persona(s)`;
        document.getElementById('chk-fecha-ingreso').textContent = new Date(reserva.fechaIngreso).toLocaleDateString();

        const contenedorAcomp = document.getElementById('contenedor-acompanantes');
        
        const maxAcompanantes = reserva.cantidadPersonas - 1;
        
        acompanantesSeleccionados = []; 

        if (maxAcompanantes > 0) {
            contenedorAcomp.style.display = 'block';
            const lista = document.getElementById('lista-acompanantes-inputs');
            const contadorText = document.getElementById('chk-contador');
            lista.innerHTML = '';
            
            const actualizarContador = () => {
                contadorText.textContent = `Acompañantes seleccionados: ${acompanantesSeleccionados.length} / ${maxAcompanantes}`;
            };
            actualizarContador();

            huespedes.filter(h => h.huespedId !== reserva.huespedTitularId).forEach(h => {
                const divFila = document.createElement('div');
                divFila.className = 'companion-item';
                
                const spanNombre = document.createElement('span');
                spanNombre.className = 'companion-item__name';
                spanNombre.textContent = `${h.nombre} ${h.apellido}`;
                
                const spanDoc = document.createElement('span');
                spanDoc.className = 'companion-item__doc';
                spanDoc.textContent = `${h.tipoDocumento}: ${h.documentoIdentidad}`;
                
                divFila.appendChild(spanNombre);
                divFila.appendChild(spanDoc);
                
                divFila.addEventListener('click', () => {
                    const index = acompanantesSeleccionados.indexOf(h.huespedId);
                    
                    if (index > -1) {
                        acompanantesSeleccionados.splice(index, 1);
                        divFila.classList.remove('companion-item--selected');
                    } else {
                        if (acompanantesSeleccionados.length < maxAcompanantes) {
                            acompanantesSeleccionados.push(h.huespedId);
                            divFila.classList.add('companion-item--selected');
                        } else {
                            alert(`Solo puedes seleccionar hasta ${maxAcompanantes} acompañante(s) para esta estadía.`);
                        }
                    }
                    actualizarContador();
                });
                
                lista.appendChild(divFila);
            });
        } else {
            contenedorAcomp.style.display = 'none';
        }

        abrirModal('modal-checkin');
    };

    document.getElementById('btn-confirmar-checkin')?.addEventListener('click', async () => {
        try {
            await ReservaService.registrarCheckIn(reservaSeleccionada.estadiaId, acompanantesSeleccionados);
            cerrarModales();
            await cargarDatosInit();
        } catch (error) {
            document.getElementById('msg-checkin').textContent = 'Error al procesar check-in.';
            document.getElementById('msg-checkin').className = 'modal__message modal__message--error';
        }
    });

    const prepararCheckOut = (reserva) => {
        reservaSeleccionada = reserva; 
        const huesped = huespedes.find(h => h.huespedId === reserva.huespedTitularId);
        const hab = habitaciones.find(h => h.habitacionId === reserva.habitacionId);

        const numHabLimpio = hab ? String(hab.numeroHabitacion).replace(/Hab\.?\s*/i, '').trim() : 'N/A';
        document.getElementById('chkout-titular').textContent = huesped ? `${huesped.nombre} ${huesped.apellido}` : 'Desconocido';
        document.getElementById('chkout-hab').textContent = `Hab. ${numHabLimpio}`;
        
        document.getElementById('msg-checkout').textContent = '';

        abrirModal('modal-checkout');
    };

    document.getElementById('btn-confirmar-checkout')?.addEventListener('click', async () => {
        try {
            await ReservaService.registrarCheckOut(reservaSeleccionada.estadiaId);
            cerrarModales();
            await cargarDatosInit();
        } catch (error) {
            document.getElementById('msg-checkout').textContent = 'Error al realizar el check-out.';
            document.getElementById('msg-checkout').className = 'modal__message modal__message--error';
        }
    });

    const prepararCancelar = async (reserva) => {
        reservaSeleccionada = reserva;
        const huesped = huespedes.find(h => h.huespedId === reserva.huespedTitularId);
        const hab = habitaciones.find(h => h.habitacionId === reserva.habitacionId);
        const tipo = tiposHabitacion.find(t => t.tipoHabitacionId === hab?.tipoHabitacionId);
        
        const numHabLimpio = hab ? String(hab.numeroHabitacion).replace(/Hab\.?\s*/i, '').trim() : 'N/A';
        document.getElementById('cnc-titular').textContent = huesped ? `${huesped.nombre} ${huesped.apellido}` : 'N/A';
        document.getElementById('cnc-hab').textContent = `Hab. ${numHabLimpio}`;
        document.getElementById('cnc-fecha').textContent = new Date(reserva.fechaIngreso).toLocaleDateString();

        const diasEstadia = Math.ceil((new Date(reserva.fechaSalida) - new Date(reserva.fechaIngreso)) / (1000 * 60 * 60 * 24));
        const precioTotal = (tipo ? tipo.precioBase : 0) * (diasEstadia > 0 ? diasEstadia : 1);
        document.getElementById('cnc-total').textContent = `$${precioTotal.toFixed(2)}`;

        const diasAnticipacion = Math.ceil((new Date(reserva.fechaIngreso) - new Date()) / (1000 * 60 * 60 * 24));
        const alertaMora = document.getElementById('alerta-mora');

        const politicas = await ReservaService.obtenerPoliticaCancelacion();
        const politica = politicas && politicas.length > 0 ? politicas[0] : null;

        if (politica && diasAnticipacion <= politica.diasLimiteSinMora && diasAnticipacion >= 0) {
            const moraEstimada = precioTotal * politica.porcentajePenalidad; 
            document.getElementById('cnc-monto-mora').textContent = `$${moraEstimada.toFixed(2)}`;
            alertaMora.style.display = 'block';
        } else if (!politica && diasAnticipacion <= 7) {
            alertaMora.style.display = 'block';
        } else {
            alertaMora.style.display = 'none';
        }

        document.getElementById('cnc-motivo').value = '';
        document.getElementById('cnc-obs').value = '';
        document.getElementById('msg-cancelar').textContent = '';

        abrirModal('modal-cancelar');
    };

    const abrirDetalleReserva = (reserva) => {
        const huesped = huespedes.find(h => h.huespedId === reserva.huespedTitularId);
        const hab = habitaciones.find(h => h.habitacionId === reserva.habitacionId);
        const tipo = tiposHabitacion.find(t => t.tipoHabitacionId === hab?.tipoHabitacionId);

        const estadoClean = (reserva.estado || '').replace(/\s+/g, '').toLowerCase();
        const badge = document.getElementById('det-badge-estado');
        badge.textContent = reserva.estado;
        badge.className = `badge-estado badge-estado--${estadoClean}`;

        document.getElementById('det-titular').textContent = huesped ? `${huesped.nombre} ${huesped.apellido}` : 'Desconocido';
        document.getElementById('det-doc').textContent = huesped ? `${huesped.tipoDocumento}: ${huesped.documentoIdentidad}` : 'N/A';

        const contAcomp = document.getElementById('det-acompanantes');
        if (reserva.acompanantesIds && reserva.acompanantesIds.length > 0) {
            const nombres = reserva.acompanantesIds.map(id => {
                const h = huespedes.find(hue => hue.huespedId === id);
                return h ? `• ${h.nombre} ${h.apellido} (${h.documentoIdentidad})` : '• Desconocido';
            });
            contAcomp.innerHTML = nombres.join('<br>');
        } else {
            contAcomp.innerHTML = `<em>Sin acompañantes registrados (Reserva para ${reserva.cantidadPersonas} persona/s)</em>`;
        }

        const formatFecha = (f) => f ? new Date(f.endsWith('Z') ? f : f+'Z').toLocaleString() : 'Pendiente';
        const formatSoloFecha = (f) => f ? new Date(f).toLocaleDateString() : 'N/A';
        
        document.getElementById('det-creacion').textContent = formatFecha(reserva.fechaCreacion);
        document.getElementById('det-ingreso').textContent = formatSoloFecha(reserva.fechaIngreso);
        document.getElementById('det-salida').textContent = formatSoloFecha(reserva.fechaSalida);
        document.getElementById('det-checkin').textContent = formatFecha(reserva.fechaHoraCheckin);
        document.getElementById('det-checkout').textContent = formatFecha(reserva.fechaHoraCheckout);

        document.getElementById('det-hab').textContent = hab ? `Habitación ${hab.numeroHabitacion}` : 'N/A';
        document.getElementById('det-tipo-nombre').textContent = tipo ? tipo.nombre : 'Desconocido';

        if (tipo) {
            const contextoStrategy = new TipoHabitacionContext(tipo.nombre);
            document.getElementById('det-tipo-desc').textContent = contextoStrategy.ejecutarEstrategiaResumen(tipo);
        } else {
            document.getElementById('det-tipo-desc').textContent = 'Sin descripción de la variación.';
        }
        
        document.getElementById('det-capacidad').textContent = tipo ? `${tipo.capacidad} persona(s)` : 'N/A';
        document.getElementById('det-precio-base').textContent = tipo ? `$${tipo.precioBase}/noche` : 'N/A';

        const diasEstadia = Math.ceil((new Date(reserva.fechaSalida) - new Date(reserva.fechaIngreso)) / (1000 * 60 * 60 * 24));
        const noches = diasEstadia > 0 ? diasEstadia : 1;
        const subtotal = (reserva.precioAplicado || (tipo ? tipo.precioBase : 0)) * noches;
        
        document.getElementById('det-noches').textContent = noches;
        document.getElementById('det-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        
        const moraInfo = document.getElementById('row-mora');
        if (reserva.mora && reserva.mora > 0) {
            moraInfo.style.display = 'flex';
            document.getElementById('det-mora').textContent = `+$${reserva.mora.toFixed(2)}`;
            document.getElementById('det-total-final').textContent = `$${(subtotal + reserva.mora).toFixed(2)}`;
        } else {
            moraInfo.style.display = 'none';
            document.getElementById('det-total-final').textContent = `$${subtotal.toFixed(2)}`;
        }

        const obsBox = document.getElementById('box-observaciones');
        if (reserva.observaciones && reserva.observaciones.trim() !== '') {
            obsBox.style.display = 'block';
            document.getElementById('det-obs').textContent = reserva.observaciones;
        } else {
            obsBox.style.display = 'none';
        }

        abrirModal('modal-detalle');
    };

    document.getElementById('btn-confirmar-cancelar')?.addEventListener('click', async () => {
        try {
            await ReservaService.cancelarReserva(reservaSeleccionada.estadiaId);
            cerrarModales();
            await cargarDatosInit();
        } catch (error) {
            document.getElementById('msg-cancelar').textContent = 'Error al cancelar.';
        }
    });

    await cargarDatosInit();
}