using Postgrest.Attributes;
using Postgrest.Models;

namespace HotelReservaAPI.Models
{
    [Table("empleado")]
    public class Empleado : BaseModel
    {
        [PrimaryKey("empleado_id", false)]
        public string EmpleadoId { get; set; }

        [Column("nombre_empleado")]
        public string NombreEmpleado { get; set; }

        [Column("cargo")]
        public string Cargo { get; set; }

        [Column("telefono")]
        public string Telefono { get; set; }

        [Column("email")]
        public string Email { get; set; }
    }
}