using Postgrest.Attributes;
using Postgrest.Models;

namespace HotelReservaAPI.Models
{
    [Table("habitacion")]
    public class Habitacion : BaseModel
    {
        [PrimaryKey("habitacion_id", false)]
        public string HabitacionId { get; set; }

        [Column("numero_habitacion")]
        public string NumeroHabitacion { get; set; }

        [Column("piso")]
        public int Piso { get; set; }

        [Column("tipo_habitacion_id")]
        public string TipoHabitacionId { get; set; }

        [Column("estado")]
        public string Estado { get; set; }
    }
}