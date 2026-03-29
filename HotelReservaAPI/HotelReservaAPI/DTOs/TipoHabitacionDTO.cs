using System.Collections.Generic;

namespace HotelReservaAPI.DTOs
{
    public class TipoHabitacionDTO
    {
        public string TipoHabitacionId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Capacidad { get; set; }
        public decimal PrecioBase { get; set; }
        public List<string> Amenidades { get; set; }
    }
}