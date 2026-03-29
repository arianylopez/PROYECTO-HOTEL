using Postgrest.Attributes;
using Postgrest.Models;
using System;

namespace HotelReservaAPI.Models
{
    [Table("estadia")]
    public class Estadia : BaseModel
    {
        [PrimaryKey("estadia_id", false)]
        public string EstadiaId { get; set; }

        [Column("huesped_titular_id")]
        public string HuespedTitularId { get; set; }

        [Column("habitacion_id")]
        public string HabitacionId { get; set; }

        [Column("fecha_ingreso")]
        public DateTime FechaIngreso { get; set; }

        [Column("fecha_salida")]
        public DateTime FechaSalida { get; set; }

        [Column("cantidad_personas")]
        public int CantidadPersonas { get; set; }

        [Column("precio_aplicado")]
        public decimal PrecioAplicado { get; set; }

        [Column("estado")]
        public string Estado { get; set; }

        [Column("observaciones")]
        public string Observaciones { get; set; }

        [Column("fecha_hora_checkin")]
        public DateTime? FechaHoraCheckin { get; set; }

        [Column("fecha_hora_checkout")]
        public DateTime? FechaHoraCheckout { get; set; }

        [Column("mora")]
        public decimal Mora { get; set; }

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; }
    }
}