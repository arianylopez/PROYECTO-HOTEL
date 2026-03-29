namespace HotelReservaAPI.DTOs
{
    public class PoliticaCancelacionDTO
    {
        public string PoliticaId { get; set; }
        public int DiasLimiteSinMora { get; set; }
        public decimal PorcentajePenalidad { get; set; }
        public string Descripcion { get; set; }
        public bool Activa { get; set; }
    }
}