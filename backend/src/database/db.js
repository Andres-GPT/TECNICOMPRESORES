import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// const sequelize = new Sequelize(process.env.MYSQL_URL, {
//   define: { timestamps: false },
// });
const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  }
);

export default sequelize;
