using System.Collections.Generic;
using HotelReservaAPI.Models;
using Supabase;

namespace HotelReservaAPI.Repositories
{
    public class ServicioRepository : IServicioRepository
    {
        private readonly Client _client;

        public ServicioRepository(Client client)
        {
            _client = client;
        }

        public List<AreaServicio> ObtenerAreas()
        {
            var response = _client.From<AreaServicio>().Get().GetAwaiter().GetResult();
            return response.Models;
        }

        public List<Empleado> ObtenerEmpleados()
        {
            var response = _client.From<Empleado>().Get().GetAwaiter().GetResult();
            return response.Models;
        }

        public List<AsignacionArea> ObtenerAsignaciones()
        {
            var response = _client.From<AsignacionArea>().Get().GetAwaiter().GetResult();
            return response.Models;
        }
    }
}