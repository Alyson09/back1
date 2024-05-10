import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";
import {Autenticador} from './utils/autenticador'
import {idGenerator} from './utils/GeradarID'
import { USER_ROLES, user } from './utils/types';

import { AddressInfo } from "net";
import connection from "./connection";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  try {
    res.send("Hello, world!");
  } catch (e: any) {
    res.send(e.sqlMessage || e.message);
  }
});

app.post('/user/login', async (req:Request, res:Response)=>{
  const {nomeusu , senhausu, emailusu} = req.body
  const idusu = idGenerator();

  if(!nomeusu || !senhausu || !emailusu){
    res.status(422).send("Faltam informações");
  }

  const usuID = await connection("usuario")
  .where({emailusu});

  const autenticador = new Autenticador();
  const tokenusu = autenticador.geradorToken({id:idusu, role: USER_ROLES.NORMAL})
  
  if(!usuID){
    res.status(404).send("usuario inexistente")
  } 
    await connection("usuario")
    .insert({
      idusu, 
      nomeusu,
      senhausu, 
      emailusu,
      tokenusu,
      roleusu:USER_ROLES.NORMAL
    })
    res.status(200).send(tokenusu);
})

app.get('/user/nome', async (req:Request, res:Response)=>{
  const {nomeusu} = req.query

  const usuario = await connection('usuario')
  .where({nomeusu});

  res.send(usuario);
})

const server = app.listen(3003, () => {
  if (server) {
    console.log(`Server is running in http://localhost:3003`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
