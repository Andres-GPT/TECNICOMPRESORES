# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TECNICOMPRESORES is a machine repair shop management system with a monorepo structure containing:
- **Backend**: Node.js/Express REST API with MySQL database (Sequelize ORM)
- **Frontend**: Vanilla JavaScript static HTML pages
- **Database**: MySQL for data persistence

The application manages the complete lifecycle of machine repairs: registration, technical review, client approval, work in progress, and final delivery with receipt generation.

## Development Commands

### Starting the Application

**Full stack (recommended):**
```bash
# From root directory - starts both backend and frontend servers
# Waits 15 seconds for MySQL to start, then launches both servers in separate windows
iniciar.bat
```

**Backend only:**
```bash
cd backend
npm run dev      # Development with hot reload (nodemon)
npm run start    # Production mode
```

**Frontend only:**
```bash
# From root directory
node server.js   # Serves frontend on port 8000 at http://192.168.101.9:8000/
```

### Database Backup

```bash
node backup.js   # Creates daily backup in backups/ directory
backup.bat       # Windows batch wrapper
```

### Environment Setup

Backend requires `.env` file in `backend/` directory:
```
PORT=8080
DB=tecnicompresores
DB_USERNAME=root
DB_PASSWORD=root
DB_HOST=localhost
```

## Architecture

### Backend Structure (backend/src/)

**MVC Architecture:**
- `index.js` - Express app entry point, middleware setup, route registration
- `database/db.js` - Sequelize connection configuration
- `models/` - Sequelize ORM models with relationships
- `controllers/` - Business logic for each entity
- `routes/` - Express route definitions
- `middlewares/upload.js` - Multer configuration for file uploads
- `uploads/` - Directory for uploaded images

**Core Models and Relationships:**
- `Cliente` (customers) - identified by cedula/documento
- `Maquina` (machines) - belongsTo Cliente, has estado (state machine)
- `Procedimiento` (procedures) - belongsTo Maquina and Tecnico, tracks repair work
- `Recibo` (receipts) - final delivery documentation
- `Tecnico` (technicians) - repair personnel
- `NotaLlamada` (call notes) - client communication log
- `Configuracion` - system settings (receipt config, etc.)

**Machine State Flow:**
```
pendiente por revisión → en espera de aprobación → en proceso → pendiente por recoger → terminado
```

State transitions are controlled by:
- Technical review creates Procedimiento
- Client approval changes estado_cliente in Procedimiento
- Process completion updates machine estado
- Physical location tracked via estante (shelf) and nivel (level)

### Frontend Structure (frontend/)

**Page-to-Feature Mapping:**
- `index.html` - Dashboard/home
- `registro.html` - Register new machine and client
- `maquinas_pendientes_revision.html` - Machines awaiting review (estado: 1)
- `revision_de_maquina.html` - Technical review form
- `confirmacion_procedimiento.html` - Client approval workflow
- `maquinas_en_proceso.html` - Active repairs (estado: 3)
- `confirmar_terminar_proceso.html` - Complete repair workflow
- `maquinas_pendientes_recoger.html` - Ready for pickup (estado: 4)
- `confirmar_entrega.html` - Delivery confirmation
- `generar_recibo_final.html` - Generate final receipt
- `recibo_final.html` - Full receipt view
- `recibo_final_pos.html` - POS-format receipt (80mm thermal)
- `recibo_registro.html` - Initial registration receipt
- `recibo-registro-pos.html` - POS-format registration receipt
- `tecnicos.html` - Technician management
- `configurar_recibo.html` - Receipt settings

**JavaScript Organization:**
Each HTML page has a corresponding JS file in `js/` directory with same name. All JS files use vanilla JavaScript with async/await for API calls.

**API Base URL:**
Configure in `js/config.js` - currently points to backend port 8080.

### Key Backend Endpoints

**Clientes:** `/clientes`
- POST `/` - Create/update cliente
- GET `/cedula/:cedula` - Get by cedula

**Maquinas:** `/maquinas`
- POST `/` - Register new machine
- GET `/estado/:estado` - Get by estado (1-5)
- GET `/:id` - Get single machine with full details
- PUT `/:id` - Update machine

**Procedimientos:** `/procedimientos`
- POST `/` - Create procedure (technical review)
- PUT `/:id` - Update procedure (client approval, tecnico assignment)
- GET `/maquina/:id_maquina` - Get procedures for machine

**Tecnicos:** `/tecnicos`
- GET `/` - List all technicians
- POST `/` - Create technician
- PUT `/:id` - Update technician

**Recibos:** `/recibos`
- POST `/` - Create receipt
- GET `/:id` - Get receipt details

**Configuraciones:** `/configuraciones`
- GET `/` - Get receipt configuration
- PUT `/:id` - Update configuration

## Important Patterns

### Client Registration Flow
1. Frontend validates cedula format (documento field, >10 digits allowed)
2. Check if cliente exists via GET `/clientes/cedula/:cedula`
3. If exists, use existing data; if not, create new cliente
4. Create maquina linked to cliente.cedula via id_cliente foreign key

### Technical Review Flow
1. Technician reviews machine (pendiente por revisión)
2. Creates Procedimiento with descripcion and costs
3. Machine estado changes to "en espera de aprobación"
4. Client approves/rejects via estado_cliente field
5. If approved, assign id_tecnico and change to "en proceso"

### Receipt Generation
Receipt data comes from Configuracion table and includes business info (name, NIT, address, etc.). Two formats supported:
- Standard (recibo_final.html)
- POS thermal 80mm (recibo_final_pos.html)

### File Uploads
Images handled via multer middleware in `/uploads` directory. Frontend serves these via root server.js static routing.

## Database Notes

- Sequelize configured with `timestamps: false` globally
- Uses MySQL `ENUM` types extensively for estado fields
- Foreign keys: id_cliente references cedula (not ID), id_maquina references maquina.id
- Decimal fields use DECIMAL(10,2) for currency
- Date fields use MySQL DATE and TIMESTAMP types

## Development Notes

- Backend runs on port 8080 (configurable via .env)
- Frontend static server runs on port 8000
- No build step required - vanilla JS and HTML
- CORS enabled with origin: '*' for development
- Morgan logging in dev mode
- The application assumes MySQL is running locally before backend starts
