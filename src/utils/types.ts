export type user = {
    id: string
    nomeUsu: string
    senhaUsu: string
    role: USER_ROLES
 }
 
 export enum USER_ROLES{
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
 }