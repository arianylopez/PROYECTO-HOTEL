using Postgrest.Attributes;
using Postgrest.Models;

namespace HotelReservaAPI.Models
{
    [Table("politicacancelacion")]
    public class PoliticaCancelacion : BaseModel
    {
        [PrimaryKey("politica_id", false)]
        public string PoliticaId { get; set; }

        [Column("dias_limite_sin_mora")]
        public int DiasLimiteSinMora { get; set; }

        [Column("porcentaje_penalidad")]
        public decimal PorcentajePenalidad { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Column("activa")]
        public bool Activa { get; set; }
    }
}