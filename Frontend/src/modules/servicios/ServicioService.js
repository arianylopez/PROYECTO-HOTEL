import { api } from '../../core/api.js';

export const ServicioService = {
    obtenerContactos: async () => {
        return await api.get('/servicio/contactos');
    }
};