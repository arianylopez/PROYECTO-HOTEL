class HabitacionStrategy {
    obtenerResumen(habitacion, tipo) { 
        throw new Error('Debe implementarse'); 
    }
}

class SimpleStrategy extends HabitacionStrategy {
    obtenerResumen(habitacion, tipo) {
        return `🛏️ ${tipo.nombre} | Máx: ${tipo.capacidad} pers. | Ideal para viajeros solos.`;
    }
}

class DobleStrategy extends HabitacionStrategy {
    obtenerResumen(habitacion, tipo) {
        return `🛏️ ${tipo.nombre} | Máx: ${tipo.capacidad} pers. | Incluye beneficios compartidos.`;
    }
}

class SuiteStrategy extends HabitacionStrategy {
    obtenerResumen(habitacion, tipo) {
        return `👑 ${tipo.nombre} | Máx: ${tipo.capacidad} pers. | Amenidades premium y atención VIP.`;
    }
}

export class HabitacionUIFactory {
    static obtenerEstrategia(nombreTipo) {
        const nombre = nombreTipo.toLowerCase();
        if (nombre.includes('suite')) return new SuiteStrategy();
        if (nombre.includes('doble')) return new DobleStrategy();
        return new SimpleStrategy();
    }

    static generarResumen(habitacion, tipo) {
        const estrategia = this.obtenerEstrategia(tipo.nombre);
        return estrategia.obtenerResumen(habitacion, tipo);
    }
}