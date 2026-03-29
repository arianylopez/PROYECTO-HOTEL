using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Repositories
{
    public interface IEstadiaRepository
    {
        List<Estadia> ObtenerTodas();
        Estadia ObtenerPorId(string id);
        Estadia Insertar(Estadia estadia);
        Estadia Actualizar(Estadia estadia);
    }
}