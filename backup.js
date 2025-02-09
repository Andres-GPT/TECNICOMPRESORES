const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Configuración
const DB_USER = "root";
const DB_PASSWORD = "root";
const DB_NAME = "tecnicompresores";
const BACKUP_DIR = path.join(__dirname, "backups");
const MYSQLDUMP_PATH = path.join(
  "C:",
  "Program Files",
  "MySQL",
  "MySQL Server 9.2",
  "bin",
  "mysqldump.exe"
);

// Crear la carpeta si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function hacerBackup() {
  const date = new Date();
  const fecha = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const backupFile = path.join(BACKUP_DIR, `backup_${fecha}.sql`);
  const logFile = path.join(BACKUP_DIR, `backup_${fecha}.log`);

  // Comando con `spawn`
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
    const mensajeError = `Error: ${data.toString()}\n`;
    logStream.write(mensajeError);
    console.error(mensajeError);
  });

  dumpProcess.on("close", (code) => {
    if (code === 0) {
      const mensaje = `Backup exitoso: ${backupFile} - ${new Date().toISOString()}\n`;
      logStream.write(mensaje);
      console.log(mensaje);
    } else {
      const mensaje = `Proceso de backup falló con código: ${code}\n`;
      logStream.write(mensaje);
      console.error(mensaje);
    }
    logStream.end();
  });
}

// Ejecuta el backup
hacerBackup();
