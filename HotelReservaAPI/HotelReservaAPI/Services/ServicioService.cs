using System.Collections.Generic;
using HotelReservaAPI.Models;
using HotelReservaAPI.Repositories;

namespace HotelReservaAPI.Services
{
    public class ServicioService : IServicioService
    {
        private readonly IServicioRepository _servicioRepository;

        public ServicioService(IServicioRepository servicioRepository)
        {
            _servicioRepository = servicioRepository;
        }

        public List<AreaServicio> ObtenerAreas()
        {
            return _servicioRepository.ObtenerAreas();
        }

        public List<Empleado> ObtenerEmpleados()
        {
            return _servicioRepository.ObtenerEmpleados();
        }

        public List<AsignacionArea> ObtenerAsignaciones()
        {
            return _servicioRepository.ObtenerAsignaciones();
        }
    }
}