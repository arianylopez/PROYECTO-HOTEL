using System;
using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Models;
using HotelReservaAPI.Repositories;
using Supabase;

namespace HotelReservaAPI.Services
{
    public class EstadiaService : IEstadiaService
    {
        private readonly IEstadiaRepository _estadiaRepository;
        private readonly IHabitacionRepository _habitacionRepository;
        private readonly IPoliticaCancelacionRepository _politicaRepository;
        private readonly Client _supabase;

        public EstadiaService(
            IEstadiaRepository estadiaRepository,
            IHabitacionRepository habitacionRepository,
            IPoliticaCancelacionRepository politicaRepository,
            Client supabase)
        {
            _estadiaRepository = estadiaRepository;
            _habitacionRepository = habitacionRepository;
            _politicaRepository = politicaRepository;
            _supabase = supabase;
        }

        public Estadia CrearReserva(Estadia estadia)
        {
            if (estadia.FechaSalida <= estadia.FechaIngreso)
                throw new Exception("La fecha de salida debe ser posterior a la fecha de ingreso.");

            var habitacion = _habitacionRepository.ObtenerHabitacionPorId(estadia.HabitacionId);
            if (habitacion == null) throw new Exception("La habitación seleccionada no existe.");

            var tipoHabitacion = _habitacionRepository.ObtenerTipoHabitacionPorId(habitacion.TipoHabitacionId);
            if (estadia.CantidadPersonas > tipoHabitacion.Capacidad)
                throw new Exception("La cantidad de personas supera la capacidad de la habitación.");

            var reservasExistentes = _estadiaRepository.ObtenerTodas()
                .Where(r => r.HabitacionId == estadia.HabitacionId && r.Estado != "Cancelada" && r.Estado != "Finalizada")
                .ToList();

            foreach (var reserva in reservasExistentes)
            {
                if (estadia.FechaIngreso < reserva.FechaSalida && estadia.FechaSalida > reserva.FechaIngreso)
                    throw new Exception("La habitación ya está reservada en ese rango de fechas.");
            }

            estadia.Estado = "Reservada";
            estadia.PrecioAplicado = tipoHabitacion.PrecioBase;
            estadia.FechaCreacion = DateTime.UtcNow;
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

        public List<Estadia> ObtenerTodas()
        {
            return _estadiaRepository.ObtenerTodas().ToList();
        }

        public Estadia RegistrarCheckIn(string estadiaId, List<string> acompanantesIds)
        {
            var reserva = _estadiaRepository.ObtenerPorId(estadiaId);
            if (reserva == null) throw new Exception("La reserva no existe.");
            if (reserva.Estado == "Cancelada") throw new Exception("No se puede hacer check-in de una reserva cancelada.");
            if (reserva.Estado == "En curso") throw new Exception("El check-in ya fue realizado anteriormente.");
            if (reserva.Estado != "Reservada") throw new Exception("Estado inválido para registrar check-in.");

            reserva.Estado = "En curso";
            reserva.FechaHoraCheckin = DateTime.UtcNow;
            _estadiaRepository.Actualizar(reserva);

            if (acompanantesIds != null && acompanantesIds.Any())
            {
                foreach (var huespedId in acompanantesIds)
                {
                    var relacion = new EstadiaHuesped
                    {
                        EstadiaAcompananteId = Guid.NewGuid().ToString(),
                        EstadiaId = estadiaId,
                        HuespedId = huespedId
                    };

                    _supabase.From<EstadiaHuesped>().Insert(relacion).Wait();
                }
            }

            var habitacion = _habitacionRepository.ObtenerHabitacionPorId(reserva.HabitacionId);
            if (habitacion != null)
            {
                habitacion.Estado = "Ocupada";
                _supabase.From<Habitacion>().Update(habitacion).Wait();
            }

            return reserva;
        }

        public Estadia RegistrarCheckOut(string estadiaId)
        {
            var reserva = _estadiaRepository.ObtenerPorId(estadiaId);
            if (reserva == null) throw new Exception("La reserva no existe.");

            if (reserva.Estado != "En curso") throw new Exception("Solo se puede hacer check-out de una reserva 'En curso'.");

            reserva.Estado = "Finalizada";
            reserva.FechaHoraCheckout = DateTime.UtcNow;
            _estadiaRepository.Actualizar(reserva);

            var habitacion = _habitacionRepository.ObtenerHabitacionPorId(reserva.HabitacionId);
            if (habitacion != null)
            {
                habitacion.Estado = "Disponible";
                _supabase.From<Habitacion>().Update(habitacion).Wait();
            }

            return reserva;
        }

        public Estadia CancelarReserva(string estadiaId)
        {
            var reserva = _estadiaRepository.ObtenerPorId(estadiaId);
            if (reserva == null) throw new Exception("La reserva no existe.");
            if (reserva.Estado != "Reservada") throw new Exception("Solo se pueden cancelar reservas en estado 'Reservada'.");

            var politica = _politicaRepository.ObtenerPoliticaActiva();
            var diasAnticipacion = (reserva.FechaIngreso.Date - DateTime.UtcNow.Date).TotalDays;

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