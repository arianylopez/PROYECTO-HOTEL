using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Services
{
    public interface IHuespedService
    {
        List<Huesped> ObtenerTodos();
        Huesped RegistrarHuesped(Huesped huesped);
        Huesped ActualizarHuesped(string id, Huesped huespedActualizado); 
    }
}