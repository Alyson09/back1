import * as jwt from 'jsonwebtoken'
import { USER_ROLES } from './types'

export type authenticationData = { 
    id: string 
    role: USER_ROLES
}

export class Autenticador {
    geradorToken = (input: authenticationData): string =>{
       return jwt.sign(
           input,
           String(process.env.JWT_KEY),
           { expiresIn: '1d'}
       )
    }

    buscarToken = (token: string): authenticationData =>{
        try{
            var vToken = jwt.verify(token, process.env.JWT_KEY as string)
            return vToken as authenticationData; 

        }catch(e: any){
            if(e.message.includes){
                throw new Error("Token inspirado");
            }
            throw new Error(e.message);
        }
    };
}