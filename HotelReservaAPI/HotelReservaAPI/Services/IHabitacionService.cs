using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Services
{
    public interface IHabitacionService
    {
        List<Habitacion> ObtenerHabitaciones();
        List<TipoHabitacion> ObtenerTiposHabitacion();
    }
}