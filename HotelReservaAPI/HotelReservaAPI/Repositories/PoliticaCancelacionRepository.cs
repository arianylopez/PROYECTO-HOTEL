using System.Linq;
using HotelReservaAPI.Models;
using Supabase;

namespace HotelReservaAPI.Repositories
{
    public class PoliticaCancelacionRepository : IPoliticaCancelacionRepository
    {
        private readonly Client _client;

        public PoliticaCancelacionRepository(Client client)
        {
            _client = client;
        }

        public PoliticaCancelacion ObtenerPoliticaActiva()
        {
            var response = _client.From<PoliticaCancelacion>().Where(x => x.Activa == true).Get().GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }
    }
}