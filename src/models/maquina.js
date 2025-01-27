import Sequelize from "sequelize";
import sequelize from "../database/db.js";
import Cliente from "./cliente.js";
//Modelo de maquinas

const Maquina = sequelize.define(
  "maquinas",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    descripcion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    observacion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    fecha_entrada: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    estado: {
      type: Sequelize.ENUM(
        "pendiente por revisión",
        "en espera de aprobación",
        "en proceso",
        "pendiente por recoger",
        "terminado"
      ),
      allowNull: false,
      defaultValue: "pendiente por revisión",
    },
    estante: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nivel: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_cliente: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "maquinas",
    timestamps: false,
  }
);

//Relacion con la id de cliente
Maquinas.belongsTo(Cliente, {
  foreignKey: "id_cliente", targetkey: "cedula", as: "cliente_maquina",
});

export default Maquina;
