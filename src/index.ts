import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

class User {
    userId: string;
    email: string;
    senha: string;
    recados: Recado[] = [];

    constructor (userId: string, email: string, senha: string) {
        this.userId = userId;
        this.email = email
        this.senha = senha
    }
}

class Recado {
    recadoId: string;
    descricao: string;
    detalhe: string;

    constructor (recadoId: string, descricao: string, detalhe: string) {
        this.recadoId = recadoId;
        this.descricao = descricao,
        this.detalhe = detalhe
    }
}

const users: any[] = [];
app.post("/users", (request: Request, response: Response) => {
    const { email, senha } = request.body;
    let novoId = uuidv4();

    const user = new User(novoId, email, senha);
    const exist = users.find((f) => {
    return f.email === email
  });

  if(exist) {
    return response.status(400).json(`${email} já cadastrado.`);
  }
    users.push(user)

    return response.status(200).json({
        id: novoId,
        email: email,
        senha: senha
        }
    )
  })

  app.get("/users/", (request: Request, response: Response) => {

    return response.status(200).json({
        users: users
    })
  })

  app.get("/users/:userId", (request: Request, response: Response) => {
    const { userId }: { userId?: string } = request.params;
    const user = users.find((f) => {
      return f.userId === userId;
    });
    return response.status(200).json(user);
  });

  app.post("/users/:userId/recados", (request: Request, response: Response) => {
    const { userId }: { userId?: string } = request.params;
    const { descricao, detalhe}: { descricao: string, detalhe: string } = request.body;
    let novoId = uuidv4();

    const user = users.find((f) => {
        return f.userId === userId;
      });

    const recado = new Recado(novoId, descricao, detalhe);

    user.recados.push(recado);   

    return response.status(200).json({
        descricao: descricao,
        detalhe: detalhe
        }
    )
  })

  app.get("/users/:userId/recados", (request: Request, response: Response) => { 
    const { userId }: { userId?: string } = request.params;

      const user = users.find((f) => {
        return f.userId === userId;
      });
      
    return response.status(200).json({
          recados: user.recados
    })
  })

    app.delete("/users/:userId/recados/:recadoId", (request: Request, response: Response) => {
        const { userId, recadoId }: { userId?: string, recadoId?: string  } = request.params;
    
        const user = users.find((f) => {
          return f.userId === userId;
        });
           
          const indexRecado = user.recados.findIndex((f:any) => {
          return f.recadoId === recadoId;
         })    
      
        user.recados.splice(indexRecado, 1);
      
        return response.status(200).json(`Recado apagado`);
      });


  app.put("/users/:userId/recados/:recadoId", (request: Request, response: Response) => {
    const { userId, recadoId }: { userId?: string, recadoId?: string } = request.params;
    const { descricao, detalhe}: { descricao: string, detalhe: string } = request.body;
  
    const user = users.find((f) => {
      return f.userId === userId;
    });

    const recado = user.recados.find((f:any) => {
      return f.recadoId === recadoId;
    })

    if (!recado) {
      return response.status(404).json({
        msg: "recado não encontrado",
      });
    }
  
    recado.descricao = descricao;
    recado.detalhe = detalhe;
  
    return response.status(200).json({
      id: recadoId,
      descricao: descricao,
      detalhe: detalhe
      }
  )
})


  app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando...");
});
