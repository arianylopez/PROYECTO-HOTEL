import { api } from '../../core/api.js';

export const ReservaService = {
    obtenerTodas: async () => await api.get('/estadia'), 
    
    crearReserva: async (datos) => await api.post('/estadia', datos),
    registrarCheckIn: async (id, acompanantes = []) => await api.put(`/estadia/${id}/checkin`, { acompanantesIds: acompanantes }),
    registrarCheckOut: async (id) => await api.put(`/estadia/${id}/checkout`),
    cancelarReserva: async (id) => await api.put(`/estadia/${id}/cancelar`),
    
    obtenerHuespedes: async () => await api.get('/huesped'),
    obtenerHabitaciones: async () => await api.get('/habitacion'),
    obtenerTiposHabitacion: async () => await api.get('/habitacion/tipos')
};