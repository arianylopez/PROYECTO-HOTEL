using System;
using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Models;
using HotelReservaAPI.Repositories;

namespace HotelReservaAPI.Services
{
    public class EstadiaService : IEstadiaService
    {
        private readonly IEstadiaRepository _estadiaRepository;
        private readonly IHabitacionRepository _habitacionRepository;
        private readonly IPoliticaCancelacionRepository _politicaRepository;

        public EstadiaService(
            IEstadiaRepository estadiaRepository,
            IHabitacionRepository habitacionRepository,
            IPoliticaCancelacionRepository politicaRepository)
        {
            _estadiaRepository = estadiaRepository;
            _habitacionRepository = habitacionRepository;
            _politicaRepository = politicaRepository;
        }

        public Estadia CrearReserva(Estadia estadia)
        {
            if (estadia.FechaSalida <= estadia.FechaIngreso)
            {
                throw new Exception("La fecha de salida debe ser posterior a la fecha de ingreso.");
            }

            var habitacion = _habitacionRepository.ObtenerHabitacionPorId(estadia.HabitacionId);
            if (habitacion == null) throw new Exception("La habitación seleccionada no existe.");

            var tipoHabitacion = _habitacionRepository.ObtenerTipoHabitacionPorId(habitacion.TipoHabitacionId);
            if (estadia.CantidadPersonas > tipoHabitacion.Capacidad)
            {
                throw new Exception("La cantidad de personas supera la capacidad de la habitación.");
            }

            var reservasExistentes = _estadiaRepository.ObtenerTodas()
                .Where(r => r.HabitacionId == estadia.HabitacionId && r.Estado != "Cancelada" && r.Estado != "Finalizada")
                .ToList();

            foreach (var reserva in reservasExistentes)
            {
                if (estadia.FechaIngreso < reserva.FechaSalida && estadia.FechaSalida > reserva.FechaIngreso)
                {
                    throw new Exception("La habitación ya está reservada en ese rango de fechas.");
                }
            }

            estadia.Estado = "Reservada";
            estadia.PrecioAplicado = tipoHabitacion.PrecioBase;
            estadia.FechaCreacion = DateTime.Now;
            estadia.Mora = 0;

            return _estadiaRepository.Insertar(estadia);
        }

        public List<Estadia> ObtenerReservasActivasYFuturas()
        {
            return _estadiaRepository.ObtenerTodas()
                .Where(r => r.Estado == "Reservada" || r.Estado == "En curso")
                .OrderBy(r => r.FechaIngreso)
                .ToList();
        }

        public Estadia RegistrarCheckIn(string estadiaId)
        {
            var reserva = _estadiaRepository.ObtenerPorId(estadiaId);
            if (reserva == null) throw new Exception("La reserva no existe.");

            if (reserva.Estado == "Cancelada") throw new Exception("No se puede hacer check-in de una reserva cancelada.");
            if (reserva.Estado == "En curso") throw new Exception("El check-in ya fue realizado anteriormente.");
            if (reserva.Estado != "Reservada") throw new Exception("Estado inválido para registrar check-in.");

            reserva.Estado = "En curso";
            reserva.FechaHoraCheckin = DateTime.Now;

            return _estadiaRepository.Actualizar(reserva);
        }

        public Estadia CancelarReserva(string estadiaId)
        {
            var reserva = _estadiaRepository.ObtenerPorId(estadiaId);
            if (reserva == null) throw new Exception("La reserva no existe.");
            if (reserva.Estado != "Reservada") throw new Exception("Solo se pueden cancelar reservas en estado 'Reservada'.");

            var politica = _politicaRepository.ObtenerPoliticaActiva();
            var diasAnticipacion = (reserva.FechaIngreso.Date - DateTime.Now.Date).TotalDays;

            if (politica != null && diasAnticipacion <= politica.DiasLimiteSinMora && diasAnticipacion >= 0)
            {
                reserva.Mora = reserva.PrecioAplicado * politica.PorcentajePenalidad;
            }
            else
            {
                reserva.Mora = 0;
            }

            reserva.Estado = "Cancelada";
            return _estadiaRepository.Actualizar(reserva);
        }
    }
}