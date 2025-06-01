-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    foto_url TEXT,
    ubicacion VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    edad INTEGER,
    temperamento VARCHAR(50),
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    id_organizador INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    nombre_ubicacion VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    reglas TEXT,
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de asistencias a eventos
CREATE TABLE IF NOT EXISTS asistencias_eventos (
    id SERIAL PRIMARY KEY,
    id_evento INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
    id_usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    id_mascota INTEGER REFERENCES mascotas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_evento, id_usuario)
);

-- Crear tabla de mensajes de eventos
CREATE TABLE IF NOT EXISTS mensajes_eventos (
    id SERIAL PRIMARY KEY,
    id_evento INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
    id_remitente INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_mascotas_usuario ON mascotas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_eventos_organizador ON eventos(id_organizador);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_asistencias_evento ON asistencias_eventos(id_evento);
CREATE INDEX IF NOT EXISTS idx_asistencias_usuario ON asistencias_eventos(id_usuario);
CREATE INDEX IF NOT EXISTS idx_mensajes_evento ON mensajes_eventos(id_evento);
CREATE INDEX IF NOT EXISTS idx_mensajes_remitente ON mensajes_eventos(id_remitente); 