using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Models;
using HotelReservaAPI.Services;
using HotelReservaAPI.DTOs;

namespace HotelReservaAPI.Controllers
{
    [ApiController]
    [Route("api/estadia")]
    public class EstadiaController : ControllerBase
    {
        private readonly IEstadiaService _estadiaService;

        public EstadiaController(IEstadiaService estadiaService)
        {
            _estadiaService = estadiaService;
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
                    Observaciones = estadiaDTO.Observaciones
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
        public ActionResult<EstadiaDTO> RegistrarCheckIn(string id)
        {
            try
            {
                var actualizada = _estadiaService.RegistrarCheckIn(id);
                return Ok(MapearAEstadiaDTO(actualizada));
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