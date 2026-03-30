using Postgrest.Attributes;
using Postgrest.Models;

namespace HotelReservaAPI.Models
{
    [Table("estadiahuesped")]
    public class EstadiaHuesped : BaseModel
    {
        [PrimaryKey("estadia_acompañante_id", false)]
        public string EstadiaAcompananteId { get; set; }

        [Column("estadia_id")]
        public string EstadiaId { get; set; }

        [Column("huesped_id")]
        public string HuespedId { get; set; }
    }
}