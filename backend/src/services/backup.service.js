import cron from "node-cron";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración desde variables de entorno
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "root";
const DB_NAME = process.env.DB_NAME || "tecnicompresores";
const BACKUP_DIR = path.resolve(__dirname, process.env.BACKUP_DIR || "../../../backups");
const MYSQLDUMP_PATH =
  process.env.MYSQLDUMP_PATH ||
  path.join("C:", "Program Files", "MySQL", "MySQL Server 9.2", "bin", "mysqldump.exe");
const BACKUP_ENABLED = process.env.BACKUP_ENABLED === "true";
const BACKUP_CRON_SCHEDULE = process.env.BACKUP_CRON_SCHEDULE || "30 17 * * *"; // 5:30 PM diario

// Crear la carpeta de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Ejecuta el backup de la base de datos
 */
function ejecutarBackup() {
  const date = new Date();
  const fecha = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const hora = `${date.getHours().toString().padStart(2, "0")}-${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const backupFile = path.join(BACKUP_DIR, `backup_${fecha}_${hora}.sql`);
  const logFile = path.join(BACKUP_DIR, `backup_${fecha}.log`);

  console.log(`[BACKUP] Iniciando backup de base de datos: ${backupFile}`);

  // Comando con spawn
  const dumpProcess = spawn(MYSQLDUMP_PATH, [
    "-u",
    DB_USER,
    `--password=${DB_PASSWORD}`,
    DB_NAME,
  ]);

  // Redirigir salida a archivo SQL
  const fileStream = fs.createWriteStream(backupFile);
  dumpProcess.stdout.pipe(fileStream);

  // Redirigir errores al archivo log
  const logStream = fs.createWriteStream(logFile, { flags: "a" });

  dumpProcess.stderr.on("data", (data) => {
    const mensajeError = `[${new Date().toISOString()}] Error: ${data.toString()}\n`;
    logStream.write(mensajeError);
    console.error(mensajeError);
  });

  dumpProcess.on("close", (code) => {
    if (code === 0) {
      const mensaje = `[${new Date().toISOString()}] Backup exitoso: ${backupFile}\n`;
      logStream.write(mensaje);
      console.log(`[BACKUP] ${mensaje}`);
    } else {
      const mensaje = `[${new Date().toISOString()}] Proceso de backup falló con código: ${code}\n`;
      logStream.write(mensaje);
      console.error(`[BACKUP] ${mensaje}`);
    }
    logStream.end();
  });
}

/**
 * Inicia el cron job para backups automáticos
 */
export function iniciarBackupCron() {
  if (!BACKUP_ENABLED) {
    console.log("[BACKUP] Backup automático deshabilitado (BACKUP_ENABLED=false)");
    return;
  }

  // Validar que el schedule sea válido
  if (!cron.validate(BACKUP_CRON_SCHEDULE)) {
    console.error(
      `[BACKUP] Error: Schedule inválido '${BACKUP_CRON_SCHEDULE}'. Backup automático deshabilitado.`
    );
    return;
  }

  // Programar el cron job
  cron.schedule(BACKUP_CRON_SCHEDULE, () => {
    ejecutarBackup();
  });

  console.log(
    `[BACKUP] ✓ Backup automático programado con schedule: '${BACKUP_CRON_SCHEDULE}'`
  );
  console.log(`[BACKUP]   Directorio de backups: ${BACKUP_DIR}`);
}

/**
 * Ejecuta un backup manual (para testing)
 */
export function ejecutarBackupManual() {
  ejecutarBackup();
}
