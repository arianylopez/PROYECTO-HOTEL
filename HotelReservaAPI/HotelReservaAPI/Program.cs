
using DotNetEnv;
using Supabase;

namespace HotelReservaAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            Env.Load();

            var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_KEY");

            if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseKey))
            {
                throw new Exception("Faltan las credenciales de Supabase en el archivo .env");
            }

            var options = new SupabaseOptions
            {
                AutoRefreshToken = true,
                AutoConnectRealtime = true
            };

            builder.Services.AddSingleton(provider => new Supabase.Client(supabaseUrl, supabaseKey, options));

            // Inyección de Dependencias de Repositorios
            builder.Services.AddScoped<HotelReservaAPI.Repositories.IHuespedRepository, HotelReservaAPI.Repositories.HuespedRepository>();
            builder.Services.AddScoped<HotelReservaAPI.Repositories.IHabitacionRepository, HotelReservaAPI.Repositories.HabitacionRepository>();
            builder.Services.AddScoped<HotelReservaAPI.Repositories.IEstadiaRepository, HotelReservaAPI.Repositories.EstadiaRepository>();
            builder.Services.AddScoped<HotelReservaAPI.Repositories.IPoliticaCancelacionRepository, HotelReservaAPI.Repositories.PoliticaCancelacionRepository>();

            // Inyección de Dependencias de Servicios (los crearemos a continuación)
            builder.Services.AddScoped<HotelReservaAPI.Services.IHuespedService, HotelReservaAPI.Services.HuespedService>();
            builder.Services.AddScoped<HotelReservaAPI.Services.IEstadiaService, HotelReservaAPI.Services.EstadiaService>();

            builder.Services.AddScoped<HotelReservaAPI.Repositories.IServicioRepository, HotelReservaAPI.Repositories.ServicioRepository>();
            builder.Services.AddScoped<HotelReservaAPI.Services.IHabitacionService, HotelReservaAPI.Services.HabitacionService>();
            builder.Services.AddScoped<HotelReservaAPI.Services.IServicioService, HotelReservaAPI.Services.ServicioService>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
