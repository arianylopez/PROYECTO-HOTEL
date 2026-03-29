using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Services
{
    public interface IEstadiaService
    {
        Estadia CrearReserva(Estadia estadia);
        List<Estadia> ObtenerReservasActivasYFuturas();
        Estadia RegistrarCheckIn(string estadiaId);
        Estadia CancelarReserva(string estadiaId);
    }
}