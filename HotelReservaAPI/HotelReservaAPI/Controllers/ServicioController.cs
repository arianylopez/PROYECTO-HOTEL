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

                var contactos = areas.Select(area =>
                {
                    var asignacionEncargado = asignaciones.FirstOrDefault(a => a.AreaId == area.AreaId && a.EsEncargado);
                    var encargado = asignacionEncargado != null ? empleados.FirstOrDefault(e => e.EmpleadoId == asignacionEncargado.EmpleadoId) : null;

                    return new ContactoHotelDTO
                    {
                        NombreArea = area.NombreArea,
                        Descripcion = area.Descripcion,
                        HorarioAtencion = area.HorarioAtencion,
                        Ubicacion = area.Ubicacion,
                        EncargadoNombre = encargado != null ? encargado.NombreEmpleado : "Sin asignar",
                        EncargadoTelefono = encargado != null ? encargado.Telefono : "N/A",
                        EncargadoEmail = encargado != null ? encargado.Email : "N/A"
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