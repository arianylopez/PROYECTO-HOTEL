using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelReservaAPI.Models;
using HotelReservaAPI.Services;
using HotelReservaAPI.DTOs;
using Supabase;

namespace HotelReservaAPI.Controllers
{
    [ApiController]
    [Route("api/estadia")]
    public class EstadiaController : ControllerBase
    {
        private readonly IEstadiaService _estadiaService;
        private readonly Client _supabase;

        public EstadiaController(IEstadiaService estadiaService, Client supabase)
        {
            _estadiaService = estadiaService;
            _supabase = supabase;
        }

        [HttpGet("activas")]
        public ActionResult<List<EstadiaDTO>> ObtenerReservasActivas()
        {
            try
            {
                var reservas = _estadiaService.ObtenerReservasActivasYFuturas();
                var reservasDTO = reservas.Select(r => MapearAEstadiaDTO(r)).ToList();
                return Ok(reservasDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<EstadiaDTO>>> ObtenerTodas()
        {
            try
            {
                var estadias = _estadiaService.ObtenerTodas();

                var response = await _supabase.From<EstadiaHuesped>().Get();
                var relaciones = response.Models ?? new List<EstadiaHuesped>();

                var estadiasDTO = estadias.Select(e => {
                    var dto = MapearAEstadiaDTO(e);

                    dto.AcompanantesIds = relaciones
                        .Where(r => r.EstadiaId == e.EstadiaId)
                        .Select(r => r.HuespedId)
                        .ToList();

                    return dto;
                }).ToList();

                return Ok(estadiasDTO);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error en ObtenerTodas: " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public ActionResult<EstadiaDTO> CrearReserva([FromBody] EstadiaDTO estadiaDTO)
        {
            try
            {
                var estadia = new Estadia
                {
                    HuespedTitularId = estadiaDTO.HuespedTitularId,
                    HabitacionId = estadiaDTO.HabitacionId,
                    FechaIngreso = estadiaDTO.FechaIngreso,
                    FechaSalida = estadiaDTO.FechaSalida,
                    CantidadPersonas = estadiaDTO.CantidadPersonas,
                    Observaciones = estadiaDTO.Observaciones,
                    Estado = "Reservada",
                    FechaCreacion = DateTime.Now,
                    PrecioAplicado = 0,
                    Mora = 0
                };

                var creada = _estadiaService.CrearReserva(estadia);
                return Ok(MapearAEstadiaDTO(creada));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/checkin")]
        public ActionResult<EstadiaDTO> RegistrarCheckIn(string id, [FromBody] CheckInDTO checkInRequest)
        {
            try
            {
                var estadia = _estadiaService.RegistrarCheckIn(id, checkInRequest.AcompanantesIds ?? new List<string>());
                return Ok(MapearAEstadiaDTO(estadia));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/checkout")]
        public ActionResult<EstadiaDTO> RegistrarCheckOut(string id)
        {
            try
            {
                var estadia = _estadiaService.RegistrarCheckOut(id);
                return Ok(MapearAEstadiaDTO(estadia));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/cancelar")]
        public ActionResult<EstadiaDTO> CancelarReserva(string id)
        {
            try
            {
                var cancelada = _estadiaService.CancelarReserva(id);
                return Ok(MapearAEstadiaDTO(cancelada));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private EstadiaDTO MapearAEstadiaDTO(Estadia r)
        {
            return new EstadiaDTO
            {
                EstadiaId = r.EstadiaId,
                HuespedTitularId = r.HuespedTitularId,
                HabitacionId = r.HabitacionId,
                FechaIngreso = r.FechaIngreso,
                FechaSalida = r.FechaSalida,
                CantidadPersonas = r.CantidadPersonas,
                PrecioAplicado = r.PrecioAplicado,
                Estado = r.Estado,
                Observaciones = r.Observaciones,
                FechaHoraCheckin = r.FechaHoraCheckin,
                FechaHoraCheckout = r.FechaHoraCheckout,
                Mora = r.Mora,
                FechaCreacion = r.FechaCreacion
            };
        }
    }
}