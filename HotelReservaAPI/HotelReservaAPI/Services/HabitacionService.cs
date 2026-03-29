using System.Collections.Generic;
using HotelReservaAPI.Models;
using HotelReservaAPI.Repositories;

namespace HotelReservaAPI.Services
{
    public class HabitacionService : IHabitacionService
    {
        private readonly IHabitacionRepository _habitacionRepository;

        public HabitacionService(IHabitacionRepository habitacionRepository)
        {
            _habitacionRepository = habitacionRepository;
        }

        public List<Habitacion> ObtenerHabitaciones()
        {
            return _habitacionRepository.ObtenerHabitaciones();
        }

        public List<TipoHabitacion> ObtenerTiposHabitacion()
        {
            return _habitacionRepository.ObtenerTiposHabitacion();
        }
    }
}