class HabitacionStrategy {
    obtenerResumen(tipo) { 
        throw new Error('El método obtenerResumen debe ser implementado por la estrategia concreta.'); 
    }
}

class SimpleStrategy extends HabitacionStrategy {
    obtenerResumen(tipo) {
        return `🛏️ Categoría Estándar: ${tipo.descripcion} Ideal para estadías cortas o viajes de negocios individuales.`;
    }
}

class DobleStrategy extends HabitacionStrategy {
    obtenerResumen(tipo) {
        return `👨‍👩‍👧 Categoría Familiar/Pareja: ${tipo.descripcion} Espacio optimizado para compartir cómodamente.`;
    }
}

class SuiteStrategy extends HabitacionStrategy {
    obtenerResumen(tipo) {
        return `👑 Categoría Premium: ${tipo.descripcion} Incluye atención preferencial, máxima comodidad garantizada y prioridad en servicios.`;
    }
}

export class TipoHabitacionContext {
    constructor(nombreTipo) {
        const nombre = (nombreTipo || '').toLowerCase();
        
        if (nombre.includes('suite')) {
            this.estrategia = new SuiteStrategy();
        } else if (nombre.includes('doble')) {
            this.estrategia = new DobleStrategy();
        } else {
            this.estrategia = new SimpleStrategy();
        }
    }

    ejecutarEstrategiaResumen(tipo) {
        return this.estrategia.obtenerResumen(tipo);
    }
}