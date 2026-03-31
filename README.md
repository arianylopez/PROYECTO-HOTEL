# Sistema de Gestión de Reservas para Hotel Pequeño
## Descripción General de la Solución

El presente proyecto consiste en un **Sistema de Gestión Hotelera**, diseñado para centralizar, automatizar y optimizar las operaciones diarias y administrativas de un establecimiento hotelero. La solución está compuesta por una robusta API backend desarrollada en C# (.NET) y una interfaz de usuario frontend ágil construida con tecnologías web estándar (HTML, CSS y JavaScript Vanilla).

### ¿Qué propósito tiene y qué problemas resuelve?

Tradicionalmente, la administración de reservas, el control de disponibilidad de habitaciones y el seguimiento de huéspedes en hoteles pequeños a medianos se ha realizado mediante herramientas fragmentadas o procesos manuales (libros de registro, hojas de cálculo). Esto genera ineficiencias críticas como:

**- Overbooking (Sobreventa):** Riesgo de reservar la misma habitación a múltiples clientes por falta de sincronización en tiempo real.

**- Descontrol en el estado de las habitaciones:** Dificultad para saber instantáneamente si una habitación está disponible u ocupada

**- Experiencia del cliente deficiente:** Tiempos de espera prolongados durante los procesos de Check-in y Check-out debido a la lenta recuperación de datos.

### Propósito y Alcance del Proyecto

Este sistema resuelve estas deficiencias enfocándose en un subconjunto realista y altamente funcional del problema. A través de esta plataforma, el personal de recepción puede:

1. Gestionar un directorio validado de Huéspedes.

2. Crear Reservas inteligentes que validan automáticamente la capacidad de las personas y bloquean fechas ya ocupadas.

3. Implementar variaciones dinámicas de Tipos de Habitación (Simple, Suite, Doble, etc.) asignando sus características base automáticamente.

4. Controlar el flujo de la estadía mediante el registro de Check-in.

5. Gestionar anulaciones aplicando mora simple dependiendo de la anticipación de la cancelación.

6. Acceder a un directorio interno de Contactos de Servicios del hotel.

## Arquitectura Utilizada

El proyecto implementa una arquitectura Cliente-Servidor fuertemente desacoplada, dividida en dos aplicaciones principales: un Frontend (interfaz de usuario) y un Backend (API REST). En el lado del servidor, se ha aplicado una arquitectura en capas (N-Tier) basada en el patrón MVC (Modelo-Vista-Controlador) adaptado para APIs, integrando además los patrones de diseño Repository y Service  para garantizar un código limpio, escalable y mantenible.

<img width="1718" height="492" alt="Diagrama" src="https://github.com/user-attachments/assets/2bfe44e7-3319-4be5-8479-eee233be0304" />

### 1. Capa de Presentación (Frontend / Cliente)

Desarrollada de forma nativa utilizando HTML5, CSS3 y Vanilla JavaScript. Esta capa es responsable de la interacción directa con el usuario final (recepcionista). Se comunica con el servidor exclusivamente a través de peticiones HTTP asíncronas hacia los endpoints expuestos por la API REST. Al prescindir de frameworks pesados de frontend, se garantiza un rendimiento rápido, ligero y fácil de auditar académicamente.

### 2. Capa de Aplicación y Lógica (Backend - C# .NET API)

Constituye el núcleo del sistema y procesa todas las reglas de negocio, garantizando la integridad de los datos antes de su persistencia. Está subdividida lógicamente en:

**- Controladores (Controllers):** Son los puntos de entrada de la API REST. Reciben las peticiones HTTP del Frontend, realizan validaciones superficiales de los datos de entrada mediante DTOs (Data Transfer Objects) y delegan la ejecución a la capa de servicios.

**- Servicios (Services):** Contienen la lógica de negocio pura. Aquí se ejecutan las reglas y validaciones complejas, tales como: verificar que una reserva no se solape con otra , calcular moras de cancelación o instanciar variaciones de tipos de habitaciones.

**- Repositorios (Repositories):** Implementan el patrón Repository para abstraer y encapsular toda la lógica de acceso a la base de datos. Los servicios no interactúan directamente con la base de datos, sino a través de las interfaces de los repositorios, lo que facilita el desacoplamiento de los componentes.

**- Modelos (Models):** Representan las entidades estructurales del sistema (Huéspedes, Reservas, Habitaciones) y se mapean directamente con las tablas de la base de datos.

### 3. Capa de Persistencia (Base de Datos)

Encargada de almacenar de forma persistente y estructurada toda la información operativa del hotel. Esta capa recibe las instrucciones procesadas por los Repositorios para ejecutar las operaciones CRUD correspondientes.

**Flujo de Interacción (Ejemplo de Creación de Reserva)**

1. El usuario interactúa con la interfaz visual y envía un formulario de reserva (Frontend).

2. El Frontend emite una petición HTTP POST enviando un objeto JSON hacia el Backend.

3. El EstadiaController (o Reserva) intercepta la petición, recibe el DTO y llama al EstadiaService.

4. El EstadiaService aplica las reglas de negocio (ej. validar disponibilidad de fechas). Si todo es correcto, invoca al EstadiaRepository.

5. El EstadiaRepository ejecuta la inserción en la Base de Datos y confirma la transacción.

6. Una respuesta HTTP (ej. 200 OK o 201 Created) viaja de vuelta por las capas hasta llegar al Frontend, el cual actualiza el DOM dinámicamente para mostrar el éxito de la operación al usuario.

## Modelo de Base de Datos

El sistema utiliza un **Modelo Relacional** robusto, diseñado para garantizar la integridad referencial de los datos, evitar redundancias y facilitar el crecimiento futuro del sistema. A través de este diseño, se soporta todo el flujo transaccional del hotel, desde el registro inicial del cliente hasta la facturación de penalidades por cancelación.

<img width="640" height="861" alt="BDD" src="https://github.com/user-attachments/assets/980ba63c-928b-4607-b5db-7d78ea1edb3d" />

### 1. Entidades Principales y su Propósito

El esquema de la base de datos se agrupa lógicamente en los siguientes dominios:

**Dominio de Alojamiento (Habitaciones)**
- `TipoHabitacion:` Tabla paramétrica pre-cargada. Define las categorías o variaciones de las habitaciones (Simple, Doble, Suite, etc.). Almacena características base como la capacidad máxima de personas y el precio referencial.

- `Habitacion:` Representa el inventario físico del hotel. Cada habitación tiene un número o identificador único y está obligatoriamente vinculada a un TipoHabitacion.

**Dominio de Clientes (Huéspedes)**
- `Huesped:` Directorio central de clientes. Almacena información personal y de contacto obligatoria (Documento de Identidad, Nombre, Teléfono, Correo). El documento de identidad actúa como un campo único (Unique) para evitar registros duplicados.

**Dominio Transaccional (Reservas y Estadías)**
- `Estadia (Reserva):` Es la tabla núcleo del sistema. Registra la transacción comercial que vincula a un huésped con una habitación en un rango de fechas específico. Controla:

  - Fechas proyectadas (Fecha Ingreso, Fecha Salida).

  - Registro de auditoría real (Fecha Check-in, Fecha Check-out).

  - El estado de la reserva (Pendiente, En Curso, Cancelada, Finalizada).

  - Montos totales y cargos por Late Check-out o Mora de cancelación.

- `EstadiaHuesped:` Tabla intermedia o de resolución (Relación Muchos a Muchos). Permite registrar a los acompañantes de una reserva principal, vinculando múltiples perfiles de Huesped a una misma Estadia.

- `PoliticaCancelacion:` Tabla paramétrica que define las reglas para el cálculo de penalidades (mora simple) dependiendo de la anticipación con la que se anule una estadía.

**Dominio de Servicios Internos (Staff y Contactos)**
- `Empleado / AreaServicio / AsignacionArea:` Tablas destinadas a cumplir el requerimiento de "Contactos de Servicios del Hotel". Sirven como un directorio interno pre-cargado donde la recepcionista puede consultar los responsables, teléfonos y áreas de soporte (ej. Limpieza, Mantenimiento).

### 2. Relaciones Clave e Integridad
El modelo garantiza la consistencia de la información mediante las siguientes relaciones y restricciones (Foreign Keys):

**- 1 a Muchos (1:N) entre TipoHabitacion y Habitacion:** Permite que al seleccionar una habitación durante la reserva, el sistema herede automáticamente el precio y valide que la cantidad de personas no supere la capacidad definida en su tipo.

**- 1 a Muchos (1:N) entre Habitacion y Estadia:** Una habitación tiene un historial de múltiples estadías en el tiempo. Esta relación es la que el Backend consulta para prevenir el solapamiento (verificar que no existan registros cruzados en las mismas fechas para un ID de Habitación).

**- 1 a Muchos (1:N) entre Huesped y Estadia:** Un cliente puede ser titular de múltiples reservas a lo largo del tiempo, facilitando la creación de historiales de lealtad en el futuro.

### 3. Consideraciones del MVP (Datos Pre-cargados)
Para mantener el alcance del prototipo, entidades estructurales como Habitacion, TipoHabitacion, AreaServicio y PoliticaCancelacion funcionan como catálogos pre-cargados. No poseen un módulo CRUD en el Frontend en esta primera fase, operando como datos de solo lectura que alimentan las vistas de creación de reservas y el directorio de servicios.

## Listado de Funcionalidades Implementadas
El prototipo actual cubre el flujo principal de operación de la recepción del hotel. A continuación se detallan las funcionalidades desarrolladas y su contribución directa a los objetivos del negocio:

### 1. Gestión y Registro de Huéspedes
  - **Funcionalidad:** Permite a la recepcionista registrar los datos personales y de contacto de nuevos clientes, aplicando validaciones de campos obligatorios e impidiendo la creación de perfiles duplicados (mediante la validación del documento de identidad).

  - **Contribución al objetivo:** Centraliza la información de los clientes en una base de datos estructurada, eliminando el uso de libretas de papel y agilizando drásticamente el proceso de toma de futuras reservas.

### 2. Creación Inteligente de Reservas (Anti-Overbooking)
  - **Funcionalidad:** Módulo para registrar nuevas estadías vinculando a un huésped con una habitación específica en un rango de fechas. El sistema valida lógicamente que la fecha de salida sea posterior a la de ingreso, que la cantidad de personas no supere la capacidad máxima de la habitación, y bloquea la operación si detecta un solapamiento de fechas para la misma habitación.

  - **Contribución al objetivo:** Resuelve el problema más crítico del hotel: la sobreventa o overbooking. Garantiza que el inventario de habitaciones sea preciso y confiable al 100%.

### 3. Asignación Dinámica de Tipos de Habitación (Patrón de Diseño)
  - **Funcionalidad:** Al momento de crear una reserva, el sistema permite seleccionar variaciones de habitación (ej. Simple, Doble, Suite). El backend aplica un patrón de diseño estructural para asignar automáticamente las características base (capacidad, precio referencial y descripciones) según la categoría elegida.

  - **Contribución al objetivo:** Otorga flexibilidad y escalabilidad al sistema. Permite al hotel administrar diferentes gamas de servicios sin tener que reprogramar la lógica de reservas, estandarizando la oferta al cliente.

### 4. Monitor de Reservas Activas y Futuras
  - **Funcionalidad:** Un panel o listado general que extrae y muestra todas las reservas vigentes ordenadas cronológicamente por su fecha de ingreso. Si no hay reservas, el sistema gestiona visualmente el estado vacío (empty state).

  - **Contribución al objetivo:** Brinda al personal de recepción una visión panorámica e inmediata de la agenda del hotel, permitiéndoles anticipar la carga de trabajo de los próximos días de un solo vistazo.

### 5. Control de Ingreso (Check-in)
  - **Funcionalidad:** Permite marcar la llegada física del cliente al hotel. El sistema registra la fecha y hora exacta del ingreso y actualiza automáticamente el estado de la reserva a "En Curso", bloqueando la posibilidad de hacer check-in duplicados o sobre reservas canceladas.

  - **Contribución al objetivo:** Sincroniza el estado virtual de la habitación con la realidad física. Ayuda al personal de limpieza y administración a saber exactamente qué habitaciones están actualmente ocupadas.

### 6. Cancelación de Reservas con Cálculo de Mora Simple
  - **Funcionalidad:** Permite anular una reserva vigente tras una confirmación de seguridad. El sistema evalúa la fecha actual contra la fecha proyectada de ingreso; si la cancelación ocurre dentro de un margen considerado "tardío" (según las políticas de cancelación pre-cargadas), calcula y registra automáticamente una mora o penalidad financiera.

  - **Contribución al objetivo:** Protege los ingresos del hotel frente a cancelaciones de última hora, aplicando reglas de negocio automatizadas que evitan confrontaciones o cálculos manuales erróneos por parte del personal.

### 7. Directorio Interno de Servicios del Hotel
  - **Funcionalidad:** Una vista de solo lectura que lista los contactos clave del staff y áreas de apoyo operativo del hotel (ej. Encargados de Mantenimiento, Limpieza o Seguridad) junto con sus números de teléfono.

  - **Contribución al objetivo:** Mejora la comunicación interna. La recepcionista tiene acceso inmediato a los canales de soporte para resolver cualquier incidencia del huésped sin tener que abandonar el sistema.

## Estructura del Proyecto 
El código fuente de este proyecto ha sido organizado siguiendo el principio de Separación de Responsabilidades (Separation of Concerns). Esta estructura modular no solo facilita la lectura y el mantenimiento del código, sino que permite escalar la aplicación en el futuro sin generar dependencias cruzadas ("código espagueti").

El repositorio se divide en dos grandes bloques principales: **Frontend** y **HotelReservaAPI** (Backend).

### Estructura del Frontend (Vanilla JS)
El cliente web está diseñado bajo una arquitectura basada en Módulos, donde cada dominio del negocio tiene su propia carpeta encapsulando su vista (HTML), sus estilos específicos (CSS) y su lógica (JS).

```
Frontend/
├── assets/                  # Recursos globales
│   └── css/                 # Estilos globales y variables de diseño (variables.css, global.css)
├── src/                     # Código fuente principal
│   ├── core/                # Configuraciones nucleares
│   │   └── api.js           # Cliente HTTP centralizado (Manejo de peticiones al Backend)
│   ├── modules/             # Módulos funcionales de la aplicación
│   │   ├── habitaciones/    # Lógica, vista y estilos de la gestión de habitaciones
│   │   ├── huespedes/       # CRUD de huéspedes (HuespedService.js, huespedes.html, etc.)
│   │   ├── reservas/        # Motor de creación y visualización de reservas/estadías
│   │   └── servicios/       # Directorio de áreas y personal del hotel
│   └── patterns/            # Implementación de Patrones de Diseño en JS
│       └── TipoHabitacionStrategy.js  # Lógica dinámica para la variación de habitaciones
├── index.html               # Punto de entrada principal (Contenedor de la SPA)
└── app.js                   # Enrutador y controlador principal de inicialización
```

### Estructura del Backend (API C# .NET)
La API sigue estrictamente una arquitectura en Capas (N-Tier) aplicando los patrones MVC, Repository y Service.

```
HotelReservaAPI/
├── Controllers/             # Controladores (Capa de Presentación de la API)
│   ├── EstadiaController.cs # Expone los endpoints para Reservas, Check-in y Cancelaciones
│   ├── HuespedController.cs # Expone los endpoints para el registro y búsqueda de clientes
│   └── ...
├── Services/                # Capa de Lógica de Negocio (Reglas, Validaciones y Patrones)
│   ├── IEstadiaService.cs   # Interfaces (Contratos)
│   ├── EstadiaService.cs    # Implementación (Validación de solapamientos, cálculo de mora)
│   └── ...
├── Repositories/            # Capa de Acceso a Datos (Consultas SQL/Entity Framework)
│   ├── IEstadiaRepository.cs
│   ├── EstadiaRepository.cs # Ejecuta las operaciones directamente contra Supabase
│   └── ...
├── Models/                  # Entidades de Dominio (Mapeo exacto con las tablas de BD)
│   ├── Estadia.cs
│   ├── Huesped.cs
│   └── ...
├── DTOs/                    # Data Transfer Objects (Objetos de Transferencia de Datos)
│   ├── EstadiaDTO.cs        # Define y filtra la información exacta que entra/sale de la API
│   └── ...
├── .env                     # Archivo de configuración global (Cadenas de conexión a BD)
└── Program.cs               # Archivo de arranque (Configuración de Inyección de Dependencias y CORS)
```

## Instrucciones para ejecutar el sistema desde cero
A continuación, se detallan los pasos necesarios para clonar, configurar y ejecutar este proyecto en tu entorno local.

### Prerrequisitos
Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu computadora:

- **Git:** Para clonar el repositorio.

- **.NET SDK (v7.0 u 8.0):** Necesario para compilar y ejecutar la API backend en C#.

- **Visual Studio 2022 o Visual Studio Code:** Entorno de desarrollo recomendado.

- **Cuenta en Supabase:** Para alojar y gestionar la base de datos PostgreSQL en la nube.

**Paso 1: Clonar el repositorio**
Abre tu terminal o línea de comandos y ejecuta la siguiente instrucción para descargar el código fuente en tu equipo:

```
git clone https://github.com/arianylopez/PROYECTO-HOTEL.git
cd PROYECTO-HOTEL
```

**Paso 2: Configurar la Base de Datos (Supabase)**
Este sistema utiliza Supabase como proveedor de base de datos relacional (PostgreSQL).

1. Ingresa a Supabase y crea un nuevo proyecto.

2. Ve al apartado "SQL Editor", copia y pega el contenido del archivo que se encuentra en el archivo BDD

3. Ve a la configuración de la base de datos (Connect) y copia tu Connection String (Cadena de conexión) o tus claves de acceso (URL y API Key), dependiendo de cómo esté configurada la conexión en el proyecto.

**Paso 3: Configurar y Levantar el Backend (API REST)**
El motor principal del sistema está construido en C# .NET. Debes conectar la API con tu base de datos recién creada.

1. Navega hacia la carpeta del backend desde tu terminal:

```
cd HotelReservaAPI/HotelReservaAPI
```

2. **Configurar credenciales:** Abre el proyecto en tu editor de código. Busca el archivo .env y reemplaza los valores de conexión con las credenciales de tu proyecto de Supabase:

```
SUPABASE_URL= XXXXX
SUPABASE_KEY= XXXXX
```

3. **Restaurar dependencias y ejecutar:** En la terminal, ejecuta los siguientes comandos para descargar los paquetes NuGet necesarios y levantar el servidor:

```
dotnet restore
dotnet build
dotnet run
```

4. La API se iniciará y la consola te indicará en qué puerto está escuchando `(usualmente http://localhost:5000 o https://localhost:5001)`. *Deja esta terminal abierta.*

**Paso 4: Configurar y Levantar el Frontend**
La interfaz de usuario está construida en Vanilla JS y se comunica directamente con la API que acabas de encender.

1. Abre una nueva terminal y navega hacia la carpeta del frontend:

```
cd Frontend
```

2. **Conectar el Frontend a la API:** Abre el archivo de configuración de llamadas HTTP (ubicado en Frontend/src/core/api.js). Verifica que la constante de la URL base apunte al puerto local donde se está ejecutando tu API en .NET:

```
const API_BASE_URL = 'https://localhost:5001/api'; // Ajusta el puerto si es necesario
```

3. **Ejecutar la interfaz:** Dado que es un proyecto HTML/JS puro, no necesitas compilar nada. Simplemente levanta un servidor estático.

  - Si usas VS Code, haz clic derecho sobre el archivo index.html y selecciona "Open with Live Server".

4. Abre tu navegador web en la dirección que te indique el servidor `(ej. http://127.0.0.1:5500)` y ya podrás interactuar con el Sistema de Gestión Hotelera.
