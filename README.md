Una aplicación de redes sociales para que los dueños de mascotas encuentren y organicen eventos relacionados con sus mascotas en su zona. Características
Perfiles de usuario y mascota
Descubrimiento y creación de eventos
Chat en tiempo real para eventos
Búsqueda de eventos basada en la ubicación
Notificaciones push
Funciones sociales para dueños de mascotas
Tecnología
Frontend: React Native (Expo)
Backend: Node.js + Express
Base de datos: PostgreSQL
Autenticación: Firebase Auth
Mapas: Google Maps
Notificaciones push: Expo Notifications
Estructura del proyecto
DogSocial/
├── móvil/ # Aplicación React Native (Expo)
├── backend/ # Servidor Node.js + Express
└── docs/ # Documentación
Introducción
Requisitos previos
Node.js (v18 o superior)
npm o yarn
CLI de Expo
PostgreSQL
Cuenta de Firebase
Instalación
Clonar el repositorio

Instalar dependencias:

# Instalar dependencias del backend
cd Backend
npm install

# Instalar las dependencias de la aplicación móvil
cd ../mobile
npm install
Configurar las variables de entorno:

Copiar .env.example a .env en los directorios backend y mobile
Introducir los valores de configuración
Iniciar los servidores de desarrollo:

# Iniciar el servidor backend
cd backend
npm run dev

# Iniciar la aplicación móvil
cd ../mobile
npm start
Contribuyendo
Bifurcar el repositorio
Crear la rama de funciones
Confirmar los cambios
Subir a la rama
Crear una nueva solicitud de extracción
Licencia
Este proyecto está licenciado bajo la licencia MIT; consulte el archivo de licencia para obtener más información.
