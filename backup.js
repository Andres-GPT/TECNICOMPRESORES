/**
 * Script de Backup Unificado
 * Este archivo actúa como un puente para ejecutar la misma lógica de backup
 * que utiliza el servidor backend de manera automática.
 */
import('./backend/src/services/backup.service.js')
  .then(module => {
    console.log("[SISTEMA] Iniciando backup manual con la lógica del backend...");
    module.ejecutarBackupManual();
  })
  .catch(err => {
    console.error("[ERROR] No se pudo cargar el servicio de backup del backend:");
    console.error(err);
    process.exit(1);
  });
