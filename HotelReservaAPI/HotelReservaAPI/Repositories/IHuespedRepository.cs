using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Repositories
{
    public interface IHuespedRepository
    {
        List<Huesped> ObtenerTodos();
        Huesped ObtenerPorId(string id); 
        Huesped ObtenerPorDocumento(string documento);
        Huesped Insertar(Huesped huesped);
        Huesped Actualizar(Huesped huesped);
    }
}