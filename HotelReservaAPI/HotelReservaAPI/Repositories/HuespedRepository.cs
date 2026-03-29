using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Models;
using Supabase;

namespace HotelReservaAPI.Repositories
{
    public class HuespedRepository : IHuespedRepository
    {
        private readonly Client _client;

        public HuespedRepository(Client client)
        {
            _client = client;
        }

        public List<Huesped> ObtenerTodos()
        {
            var response = _client.From<Huesped>().Get().GetAwaiter().GetResult();
            return response.Models;
        }

        public Huesped ObtenerPorId(string id)
        {
            var response = _client.From<Huesped>().Where(x => x.HuespedId == id).Get().GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }

        public Huesped ObtenerPorDocumento(string documento)
        {
            var response = _client.From<Huesped>().Where(x => x.DocumentoIdentidad == documento).Get().GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }

        public Huesped Insertar(Huesped huesped)
        {
            var response = _client.From<Huesped>().Insert(huesped).GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }

        public Huesped Actualizar(Huesped huesped)
        {
            var response = _client.From<Huesped>().Upsert(huesped).GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }
    }
}