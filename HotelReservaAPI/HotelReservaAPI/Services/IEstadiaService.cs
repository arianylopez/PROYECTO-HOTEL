using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Services
{
    public interface IEstadiaService
    {
        Estadia CrearReserva(Estadia estadia);
        List<Estadia> ObtenerReservasActivasYFuturas();
        List<Estadia> ObtenerTodas();
        Estadia RegistrarCheckIn(string estadiaId, List<string> acompanantesIds);
        Estadia RegistrarCheckOut(string estadiaId);
        Estadia CancelarReserva(string estadiaId);
    }
}