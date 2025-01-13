import { config} from "dotenv";

config();
export let PORT;
export let HOST;
export let USER;
export let PASSWORD;
export let DATABASE;
export let DB_PORT;
export let SALT_OR_ROUNDS
export let SECRET_KEY;
export let ENDPOINT;
export let FE;
if(process.env.ENV == "development"){
     PORT = process.env.PORT;
     HOST = process.env.HOST;
     USER = process.env.USER;
     PASSWORD = process.env.PASSWORD;
     DATABASE = process.env.DATABASE;
     DB_PORT =  Number(process.env.DB_PORT);
     SALT_OR_ROUNDS = Number(process.env.SALT_OR_ROUNDS)
     ENDPOINT = process.env.ENDPOINT;
     FE = process.env.ENDPOINT_FE
     SECRET_KEY = process.env.SECRET_KEY;
}

export const config2 = {
    user: USER,
    password: PASSWORD,
    server: HOST,
    database: DATABASE, // Nombre de la base de datos
    port: DB_PORT,
    options: {
      encrypt: true, // Para Azure, en servidores locales puede ser false
      trustServerCertificate: true, // Para servidores locales en desarrollo
    },
    requestTimeout: 30000, // 30 segundos
    connectionTimeout: 30000 // 30 segundos
  };