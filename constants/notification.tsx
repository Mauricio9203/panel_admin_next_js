// @/constants/notifications.ts

// 1. Definimos la estructura de una notificación para tener autocompletado
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string; // Puede ser un string como "2m" o una fecha real
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

// 2. Datos ficticios para poblar la interfaz
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "¡Bienvenido al sistema!",
    description: "Gracias por unirte. Explora tu nuevo panel de control.",
    time: "Ahora",
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Pago Procesado",
    description: "Tu suscripción mensual se ha renovado exitosamente.",
    time: "25m",
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "Espacio en Disco",
    description: "Tu almacenamiento está al 85%. Considera liberar espacio.",
    time: "2h",
    type: "warning",
    read: false,
  },
  {
    id: "4",
    title: "Error de Sincronización",
    description: "No se pudo conectar con la base de datos externa.",
    time: "1d",
    type: "error",
    read: true,
  },
  {
    id: "5",
    title: "Actualización de Perfil",
    description: "Se han detectado cambios en tus credenciales de acceso.",
    time: "2d",
    type: "info",
    read: true,
  },
];
