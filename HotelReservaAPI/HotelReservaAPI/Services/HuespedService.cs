using System;
using System.Collections.Generic;
using HotelReservaAPI.Models;
using HotelReservaAPI.Repositories;

namespace HotelReservaAPI.Services
{
    public class HuespedService : IHuespedService
    {
        private readonly IHuespedRepository _huespedRepository;

        public HuespedService(IHuespedRepository huespedRepository)
        {
            _huespedRepository = huespedRepository;
        }

        public List<Huesped> ObtenerTodos()
        {
            return _huespedRepository.ObtenerTodos();
        }

        public Huesped RegistrarHuesped(Huesped huesped)
        {
            ValidarDatosBasicos(huesped);

            var existente = _huespedRepository.ObtenerPorDocumento(huesped.DocumentoIdentidad);
            if (existente != null)
            {
                throw new Exception("Ya existe un huésped registrado con este documento.");
            }

            huesped.FechaRegistro = DateTime.Now.Date;
            return _huespedRepository.Insertar(huesped);
        }

        public Huesped ActualizarHuesped(string id, Huesped huespedActualizado)
        {
            ValidarDatosBasicos(huespedActualizado);

            var huespedDb = _huespedRepository.ObtenerPorId(id);
            if (huespedDb == null)
            {
                throw new Exception("El huésped a actualizar no existe.");
            }

            if (huespedDb.DocumentoIdentidad != huespedActualizado.DocumentoIdentidad)
            {
                var conMismoDoc = _huespedRepository.ObtenerPorDocumento(huespedActualizado.DocumentoIdentidad);
                if (conMismoDoc != null)
                {
                    throw new Exception("Ya existe otro huésped con ese documento.");
                }
            }

            huespedDb.Nombre = huespedActualizado.Nombre;
            huespedDb.Apellido = huespedActualizado.Apellido;
            huespedDb.TipoDocumento = huespedActualizado.TipoDocumento;
            huespedDb.DocumentoIdentidad = huespedActualizado.DocumentoIdentidad;
            huespedDb.Telefono = huespedActualizado.Telefono;
            huespedDb.Correo = huespedActualizado.Correo;
            huespedDb.Nacionalidad = huespedActualizado.Nacionalidad;
            huespedDb.Direccion = huespedActualizado.Direccion;

            return _huespedRepository.Actualizar(huespedDb);
        }

        private void ValidarDatosBasicos(Huesped huesped)
        {
            if (string.IsNullOrWhiteSpace(huesped.Nombre) ||
                string.IsNullOrWhiteSpace(huesped.Apellido) ||
                string.IsNullOrWhiteSpace(huesped.DocumentoIdentidad))
            {
                throw new Exception("Nombre, Apellido y Documento son obligatorios.");
            }
        }
    }
}