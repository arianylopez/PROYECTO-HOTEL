using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Models;
using Supabase;

namespace HotelReservaAPI.Repositories
{
    public class HabitacionRepository : IHabitacionRepository
    {
        private readonly Client _client;

        public HabitacionRepository(Client client)
        {
            _client = client;
        }

        public List<Habitacion> ObtenerHabitaciones()
        {
            var response = _client.From<Habitacion>().Get().GetAwaiter().GetResult();
            return response.Models;
        }

        public List<TipoHabitacion> ObtenerTiposHabitacion()
        {
            var response = _client.From<TipoHabitacion>().Get().GetAwaiter().GetResult();
            return response.Models;
        }

        public Habitacion ObtenerHabitacionPorId(string id)
        {
            var response = _client.From<Habitacion>().Where(x => x.HabitacionId == id).Get().GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }

        public TipoHabitacion ObtenerTipoHabitacionPorId(string id)
        {
            var response = _client.From<TipoHabitacion>().Where(x => x.TipoHabitacionId == id).Get().GetAwaiter().GetResult();
            return response.Models.FirstOrDefault();
        }
    }
}