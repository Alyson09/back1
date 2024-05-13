import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";
import {Autenticador} from './utils/autenticador';
import {idGenerator} from './utils/GeradorID';
import { USER_ROLES } from './utils/types';
import {hash, compare} from '../src/utils/Hash';


import connection from "./connection";

const app = express();

app.use(express.json());
app.use(cors());


app.post('/user/signup', async (req:Request, res:Response)=>{
  try{
    const {nomeusu , senhaUsu, emailusu} = req.body
    const idusu = idGenerator();
    const autenticador = new Autenticador();
    
    const tokenusu = autenticador.geradorToken({id:idusu, role: USER_ROLES.ADMIN})

    if(!nomeusu || !senhaUsu || !emailusu){
      res.status(422).send("Faltam informações");
    };

    const usuID = await connection("usuario")
    .where({emailusu});
    
    if(!usuID){
      res.status(404).send("usuario já cadastrado")
    };

    const senhausu = await hash(senhaUsu);

    await connection("usuario")
      .insert({
        idusu, 
        nomeusu,
        senhausu, 
        emailusu,
        tokenusu,
        roleusu:USER_ROLES.ADMIN
    })
      res.status(200).send(`Usuário criado com sucesso, seu token:${tokenusu}`);
  }catch(e){
    res.status(500).send(e.message);
  }
});

app.post('/usuario/login', async (req:Request, res:Response)=>{
  try{
    const {emailusu, senhaUsu} = req.body

    if(!emailusu || !senhaUsu){
      res.status(422).send("Faltam informações");
    };
    const [senhausu] = await connection("usuario")
    .where({emailusu});

    const compaSenha = await compare(senhaUsu, senhausu.senhausu);

    if(compaSenha){
      res.status(200).send("Login realizado com sucesso");
    }
  }catch(e){
    res.status(500).send("erro no servidor");
  }
});

app.post('/partida', async (req:Request, res:Response)=>{
  try{
    const {ppassada, ppresente, pfutura} = req.body;
    const idpartida = idGenerator();
    
    if(!ppassada || !ppresente || !pfutura){
      res.status(404).send("Faltam informações");
    };
    await connection ("partida")
    .insert({
      idpartida, 
      ppassada, 
      ppresente, 
      pfutura
    });
    res.status(200).send("Partida criada com sucesso");
    }catch(e) {
      res.status(500).send(e.message);
    }
});

app.post('/time', async (req:Request, res:Response)=>{
  try{
    const {nometime, logotime, idpartida} = req.body;
    const idtime = idGenerator();

    if(!nometime || !logotime || !idpartida){
      res.status(422).send("Faltam informações");
    }

    const getTime = await connection("time")
    .where({nometime});

    if(!getTime){
      res.status(404).send("time inexistente");
    }

    await connection("time")
    .insert({
      idtime,
      nometime,
      logotime,
      idpartida
    });
    res.status(200).send("Time criado com sucesso!");

  }catch(e){
    res.status(500).send(e.message || e.sqlMessage)
  }
});

app.post('/jogador', async (req:Request, res:Response)=>{
  try{
    const {nomejog, numero, posicao, idtime} = req.body;
    const idjogador = idGenerator();

    if(!nomejog || !numero || !posicao || !idtime){
      res.status(422).send("Faltam informações");
    };

    const getTime = await connection("time")
    .where({idtime});

    if(!getTime){
      res.status(404).send("Time referenciado não existe")
    };
    
    await connection("jogador")
    .insert({
      idjogador,
      nomejog,
      numero,
      posicao,
      idtime
    })

    res.status(200).send("jogador criado com sucesso!");

  }catch(e){
    res.status(500).send(e.message || e.sqlMessage)
  }
});

app.get('/partida/:id', async (req:Request, res: Response)=>{
  try{
    const idpartida = req.params.id;

    if(!idpartida){
      res.status(404).send("Informe o id");
    }

    const bucasrTime = await connection ("partida")
    .where({idpartida});

    if(!bucasrTime){
      res.status(404).send("partida não encontrada");
    }
    res.status(200).send(bucasrTime);
  }catch(e){
    res.status(500).send(e.message);
  }
});

app.get('/user/nome', async (req:Request, res:Response)=>{
  const {nomeusu} = req.query

  const usuario = await connection('usuario')
  .where({nomeusu});

  res.send(usuario);
});

app.put('/partida/:id', async (req:Request, res:Response)=>{
  try{
    const idpartida = req.params.id;
    const {ppresente, pfutura} = req.body;

    if(!idpartida){
      res.status(404).send("id invalido");
    }
    if(!ppresente || !pfutura){
      res.status(404).send("Faltam informações");
    };

    await connection ("partida")
    .update({ 
      ppresente, 
      pfutura
    })
    .where({idpartida});

    res.status(200).send("partida atualizada com sucesso!");
  }catch(e){
    res.status(500).send(e.message);
  }
});

app.put('/time/:id', async (req:Request, res:Response)=>{
  try{
    const {logotime} = req.body;
    const idtime = req.params.id;

    if(!idtime){
      res.status(404).send("id invalido");
    }

    if(!logotime){
      res.status(422).send("Faltam informações");
    }

    await connection("time")
    .update({
      logotime,
    })
    .where({idtime});
    res.status(200).send("Time atualizado com sucesso!");
  }catch(e){
    res.status(500).send(e.message);
  }

});

app.put('/jogador/:id', async (req:Request, res:Response)=>{
  try{
    const {nomejog, numero, posicao, idtime} = req.body;
    const idjogador = req.params.id;

    if(!idjogador){
      res.status(404).send("id invalido");
    }

    if(!nomejog || !numero || !posicao || !idtime){
      res.status(422).send("Faltam informações");
    }
    await connection("jogador")
    .update({
      nomejog,
      numero,
      posicao,
      idtime
    })
    .where({idjogador});
    res.status(200).send("Jogador atualizado com sucesso!");
  }catch(e){
    res.status(500).send(e.message);
  }
});

app.delete('/partida/:id', async(req:Request, res:Response)=>{
  try{
    const idpartida = req.params.id;

    if(!idpartida){
      res.status(404).send("id invalido");
    }

    await connection("partida")
    .where({idpartida})
    .del();

    res.status(200).send("Partida deletado com sucesso!");

  }catch(e){
    res.status(500).send(e.message);
  }
});

app.delete('/time/:id', async(req:Request, res:Response)=>{
  try{
    const idtime = req.params.id;

    if(!idtime){
      res.status(404).send("id invalido");
    }
    await connection("time")
    .where({idtime})
    .del()
    
    res.status(200).send("Time deletado com sucesso!");

  }catch(e){
    res.status(500).send(e.message);
  }
});

app.delete('/jogador/:id', async(req:Request, res:Response)=>{
  try{
    const idjogador = req.params.id;

    if(!idjogador){
      res.status(404).send("id invalido");
    }
    await connection("jogador")
    .where({idjogador})
    .del();
    
    res.status(200).send("Jogador deletado com sucesso!");
  }catch(e){
    res.status(500).send(e.message);
  }
});

const server = app.listen(3003, () => {
  if (server) {
    console.log(`Server is running in http://localhost:3003`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});