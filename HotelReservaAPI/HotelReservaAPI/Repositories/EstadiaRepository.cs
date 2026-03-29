using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Models;
using Supabase;

namespace HotelReservaAPI.Repositories
{
    public class EstadiaRepository : IEstadiaRepository
    {
        private readonly Client _client;

        public EstadiaRepository(Client client)
        {
            _client = client;
        }

        public List<Estadia> ObtenerTodas()
        {
            var response = _client.From<Estadia>().Get().GetAwaiter().GetResult();
            return response.Models;
        }

        public Estadia ObtenerPorId(string id)
        {
            var response = _client.From<Estadia>().Where(x => x.EstadiaId == id).Get().GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }

        public Estadia Insertar(Estadia estadia)
        {
            var response = _client.From<Estadia>().Insert(estadia).GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }

        public Estadia Actualizar(Estadia estadia)
        {
            var response = _client.From<Estadia>().Update(estadia).GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }
    }
}