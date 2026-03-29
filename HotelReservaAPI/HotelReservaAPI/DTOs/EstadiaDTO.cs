using System;

namespace HotelReservaAPI.DTOs
{
    public class EstadiaDTO
    {
        public string? EstadiaId { get; set; }
        public string HuespedTitularId { get; set; }
        public string HabitacionId { get; set; }
        public DateTime FechaIngreso { get; set; }
        public DateTime FechaSalida { get; set; }
        public int CantidadPersonas { get; set; }
        public decimal PrecioAplicado { get; set; }
        public string Estado { get; set; }
        public string Observaciones { get; set; }
        public DateTime? FechaHoraCheckin { get; set; }
        public DateTime? FechaHoraCheckout { get; set; }
        public decimal Mora { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}