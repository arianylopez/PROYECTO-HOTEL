using System.Collections.Generic;
using HotelReservaAPI.Models;

namespace HotelReservaAPI.Repositories
{
    public interface IServicioRepository
    {
        List<AreaServicio> ObtenerAreas();
        List<Empleado> ObtenerEmpleados();
        List<AsignacionArea> ObtenerAsignaciones();
    }
}