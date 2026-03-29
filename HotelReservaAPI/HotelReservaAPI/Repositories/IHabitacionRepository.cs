using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Repositories
{
    public interface IHabitacionRepository
    {
        List<Habitacion> ObtenerHabitaciones();
        List<TipoHabitacion> ObtenerTiposHabitacion();
        Habitacion ObtenerHabitacionPorId(string id);
        TipoHabitacion ObtenerTipoHabitacionPorId(string id);
    }
}