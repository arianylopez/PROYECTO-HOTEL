import { api } from '../../core/api.js';

export const HabitacionService = {
    obtenerHabitaciones: async () => {
        return await api.get('/habitacion');
    },
    
    obtenerTipos: async () => {
        return await api.get('/habitacion/tipos');
    }
};