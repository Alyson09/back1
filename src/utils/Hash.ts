import * as bcrypt from 'bcryptjs'

export async function hash (s: string): Promise<string>{
    const rounds = Number(process.env.BCRYPT_COST);
    const salt = await bcrypt.genSalt(rounds);
    const cypherSenha = await bcrypt.hash(s, salt);
    return cypherSenha
}

export async function compare (s:string, hash:string){
    const result = await bcrypt.compare(s,hash);
    return result;
}