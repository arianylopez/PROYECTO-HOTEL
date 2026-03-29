using Postgrest.Attributes;
using Postgrest.Models;

namespace HotelReservaAPI.Models
{
    [Table("asignacionarea")]
    public class AsignacionArea : BaseModel
    {
        [PrimaryKey("asignacion_id", false)]
        public string AsignacionId { get; set; }

        [Column("area_id")]
        public string AreaId { get; set; }

        [Column("empleado_id")]
        public string EmpleadoId { get; set; }

        [Column("es_encargado")]
        public bool EsEncargado { get; set; }
    }
}