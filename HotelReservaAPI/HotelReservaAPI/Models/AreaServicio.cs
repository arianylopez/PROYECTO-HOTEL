using Postgrest.Attributes;
using Postgrest.Models;

namespace HotelReservaAPI.Models
{
    [Table("areaservicio")]
    public class AreaServicio : BaseModel
    {
        [PrimaryKey("area_id", false)]
        public string AreaId { get; set; }

        [Column("nombre_area")]
        public string NombreArea { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Column("horario_atencion")]
        public string HorarioAtencion { get; set; }

        [Column("ubicacion")]
        public string Ubicacion { get; set; }
    }
}