using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Services
{
    public interface IServicioService
    {
        List<AreaServicio> ObtenerAreas();
        List<Empleado> ObtenerEmpleados();
        List<AsignacionArea> ObtenerAsignaciones();
    }
}