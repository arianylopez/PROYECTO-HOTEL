namespace HotelReservaAPI.DTOs
{
    public class ContactoHotelDTO
    {
        public string NombreArea { get; set; }
        public string Descripcion { get; set; }
        public string HorarioAtencion { get; set; }
        public string Ubicacion { get; set; }
        public string EmpleadoNombre { get; set; }
        public string EmpleadoTelefono { get; set; }
        public string EmpleadoEmail { get; set; }
        public bool EsEncargado { get; set; } 
    }
}