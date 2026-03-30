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
    [Route("api/huesped")]
    public class HuespedController : ControllerBase
    {
        private readonly IHuespedService _huespedService;

        public HuespedController(IHuespedService huespedService)
        {
            _huespedService = huespedService;
        }

        [HttpGet]
        public ActionResult<List<HuespedDTO>> ObtenerTodos()
        {
            try
            {
                var huespedes = _huespedService.ObtenerTodos();
                var huespedesDTO = huespedes.Select(h => MapearAModeloDTO(h)).ToList();
                return Ok(huespedesDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public ActionResult<HuespedDTO> RegistrarHuesped([FromBody] HuespedDTO huespedDTO)
        {
            try
            {
                var huesped = MapearADominio(huespedDTO);
                var registrado = _huespedService.RegistrarHuesped(huesped);
                return Ok(MapearAModeloDTO(registrado));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")] 
        public ActionResult<HuespedDTO> ActualizarHuesped(string id, [FromBody] HuespedDTO huespedDTO)
        {
            try
            {
                var huesped = MapearADominio(huespedDTO);
                var actualizado = _huespedService.ActualizarHuesped(id, huesped);
                return Ok(MapearAModeloDTO(actualizado));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private Huesped MapearADominio(HuespedDTO dto)
        {
            return new Huesped
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                TipoDocumento = dto.TipoDocumento,
                DocumentoIdentidad = dto.DocumentoIdentidad,
                Telefono = dto.Telefono,
                Correo = dto.Correo,
                Direccion = dto.Direccion,
                Nacionalidad = dto.Nacionalidad
            };
        }

        private HuespedDTO MapearAModeloDTO(Huesped h)
        {
            return new HuespedDTO
            {
                HuespedId = h.HuespedId,
                Nombre = h.Nombre,
                Apellido = h.Apellido,
                TipoDocumento = h.TipoDocumento,
                DocumentoIdentidad = h.DocumentoIdentidad,
                Telefono = h.Telefono,
                Correo = h.Correo,
                Direccion = h.Direccion,
                Nacionalidad = h.Nacionalidad,
                FechaRegistro = h.FechaRegistro
            };
        }
    }
}