import Sequelize from "sequelize";
import sequelize from "../database/db.js";
import Maquina from "./maquina.js";
import Configuracion from "./configuracion.js";

//Modelo de recibo

const Recibo = sequelize.define(
  "recibos",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    fecha_generacion: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    id_maquina: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_configuracion: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "recibos",
    timestamps: false,
  }
);

//Relacion con la id de maquina
Recibo.belongsTo(Maquina, {
  foreignKey: "id_maquina",
  targetkey: "id",
  as: "maquina_recibo",
});

//Relacion con la configuracion
Recibo.belongsTo(Configuracion, {
  foreignKey: "id_configuracion",
  targetkey: "id",
  as: "configuracion_recibo",
});

export default Recibo;