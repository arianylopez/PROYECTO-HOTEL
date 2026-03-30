using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using HotelReservaAPI.Services;
using HotelReservaAPI.DTOs;

namespace HotelReservaAPI.Controllers
{
    [ApiController]
    [Route("api/servicio")]
    public class ServicioController : ControllerBase
    {
        private readonly IServicioService _servicioService;

        public ServicioController(IServicioService servicioService)
        {
            _servicioService = servicioService;
        }

        [HttpGet("contactos")]
        public ActionResult<List<ContactoHotelDTO>> ObtenerContactos()
        {
            try
            {
                var areas = _servicioService.ObtenerAreas();
                var empleados = _servicioService.ObtenerEmpleados();
                var asignaciones = _servicioService.ObtenerAsignaciones();

                var contactos = asignaciones.Select(a =>
                {
                    var area = areas.FirstOrDefault(ar => ar.AreaId == a.AreaId);
                    var empleado = empleados.FirstOrDefault(e => e.EmpleadoId == a.EmpleadoId);

                    return new ContactoHotelDTO
                    {
                        NombreArea = area?.NombreArea ?? "Área sin nombre",
                        Descripcion = area?.Descripcion ?? "",
                        HorarioAtencion = area?.HorarioAtencion ?? "No definido",
                        Ubicacion = area?.Ubicacion ?? "No definida",
                        EmpleadoNombre = empleado?.NombreEmpleado ?? "Empleado Desconocido",
                        EmpleadoTelefono = empleado?.Telefono ?? "S/N",
                        EmpleadoEmail = empleado?.Email ?? "S/C",
                        EsEncargado = a.EsEncargado
                    };
                }).ToList();

                return Ok(contactos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}