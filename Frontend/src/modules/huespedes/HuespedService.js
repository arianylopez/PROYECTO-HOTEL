import { api } from '../../core/api.js';

export const HuespedService = {
    obtenerTodos: async () => {
        return await api.get('/huesped');
    },
    
    registrar: async (huespedData) => {
        return await api.post('/huesped', huespedData);
    },

    actualizar: async (id, huespedData) => { 
        return await api.put(`/huesped/${id}`, huespedData);
    }
};