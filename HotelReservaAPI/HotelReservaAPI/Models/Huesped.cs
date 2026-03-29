using Postgrest.Attributes;
using Postgrest.Models;
using System;

namespace HotelReservaAPI.Models
{
    [Table("huesped")]
    public class Huesped : BaseModel
    {
        [PrimaryKey("huesped_id", false)]
        public string HuespedId { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("apellido")]
        public string Apellido { get; set; }

        [Column("tipo_documento")]
        public string TipoDocumento { get; set; }

        [Column("documento_identidad")]
        public string DocumentoIdentidad { get; set; }

        [Column("telefono")]
        public string Telefono { get; set; }

        [Column("correo")]
        public string Correo { get; set; }

        [Column("direccion")]
        public string Direccion { get; set; }

        [Column("nacionalidad")]
        public string Nacionalidad { get; set; }

        [Column("fecha_registro")]
        public DateTime FechaRegistro { get; set; }
    }
}