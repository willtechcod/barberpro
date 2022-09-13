export class AuthTokenError extends Error{
    constructor(){
        super('Erro token não autorizado!')
    }
}