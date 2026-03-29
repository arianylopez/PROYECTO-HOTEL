using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Services;
using HotelReservaAPI.DTOs;

namespace HotelReservaAPI.Controllers
{
    [ApiController]
    [Route("api/habitacion")]
    public class HabitacionController : ControllerBase
    {
        private readonly IHabitacionService _habitacionService;

        public HabitacionController(IHabitacionService habitacionService)
        {
            _habitacionService = habitacionService;
        }

        [HttpGet]
        public ActionResult<List<HabitacionDTO>> ObtenerHabitaciones()
        {
            try
            {
                var habitaciones = _habitacionService.ObtenerHabitaciones();
                var habitacionesDTO = habitaciones.Select(h => new HabitacionDTO
                {
                    HabitacionId = h.HabitacionId,
                    NumeroHabitacion = h.NumeroHabitacion,
                    Piso = h.Piso,
                    TipoHabitacionId = h.TipoHabitacionId,
                    Estado = h.Estado
                }).ToList();

                return Ok(habitacionesDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("tipos")]
        public ActionResult<List<TipoHabitacionDTO>> ObtenerTiposHabitacion()
        {
            try
            {
                var tipos = _habitacionService.ObtenerTiposHabitacion();
                var tiposDTO = tipos.Select(t => new TipoHabitacionDTO
                {
                    TipoHabitacionId = t.TipoHabitacionId,
                    Nombre = t.Nombre,
                    Descripcion = t.Descripcion,
                    Capacidad = t.Capacidad,
                    PrecioBase = t.PrecioBase,
                    Amenidades = t.Amenidades
                }).ToList();

                return Ok(tiposDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}