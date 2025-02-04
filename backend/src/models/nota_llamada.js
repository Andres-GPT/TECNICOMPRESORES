import Sequelize from "sequelize";
import sequelize from "../database/db.js";
import Maquina from "./maquina.js";

//Modelo de nota llamada

const NotaLlamada = sequelize.define(
  "notas_llamadas",
  {
    id_nota: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    nota: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    fecha_registro: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    id_maquina: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "notas_llamadas",
    timestamps: false,
  }
);

//Relacion con la id de maquina
NotaLlamada.belongsTo(Maquina, {
  foreignKey: "id_maquina",
  targetkey: "id",
  as: "maquina_nota_llamada",
});

export default NotaLlamada;
