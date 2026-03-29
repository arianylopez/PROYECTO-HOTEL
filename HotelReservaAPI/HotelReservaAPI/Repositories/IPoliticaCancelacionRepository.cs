using HotelReservaAPI.Models;

namespace HotelReservaAPI.Repositories
{
    public interface IPoliticaCancelacionRepository
    {
        PoliticaCancelacion ObtenerPoliticaActiva();
    }
}