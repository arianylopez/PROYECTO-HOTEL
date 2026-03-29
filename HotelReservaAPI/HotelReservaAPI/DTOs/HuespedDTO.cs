using System;

namespace HotelReservaAPI.DTOs
{
    public class HuespedDTO
    {
        public string? HuespedId { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string TipoDocumento { get; set; }
        public string DocumentoIdentidad { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string Direccion { get; set; }
        public string Nacionalidad { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}