const { PrismaClient } = require('@prisma/client');

// Crear una única instancia de Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Manejar la desconexión cuando la aplicación se cierre
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma; 