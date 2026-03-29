using Postgrest.Attributes;
using Postgrest.Models;
using System.Collections.Generic;

namespace HotelReservaAPI.Models
{
    [Table("tipohabitacion")]
    public class TipoHabitacion : BaseModel
    {
        [PrimaryKey("tipo_habitacion_id", false)]
        public string TipoHabitacionId { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Column("capacidad")]
        public int Capacidad { get; set; }

        [Column("precio_base")]
        public decimal PrecioBase { get; set; }

        [Column("amenidades")]
        public List<string> Amenidades { get; set; }
    }
}