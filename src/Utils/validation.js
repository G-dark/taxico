export class Validation{
    static validateUsername(username){
        if(!username) throw new Error("username mustn't be undefined")
        if (typeof username != 'string') throw new Error("username must be a string")
        if(username.length > 8) throw new Error("username must be eight characters long or least")
        if(username.includes('@') || username.includes('/')) throw new Error("username mustn't include special characters like @ or /")
    }

    static validatePassword(pw){
        if(!pw) throw new Error("password mustn't be undefined")
        if (typeof pw != 'string') throw new Error("password must be a string")
        if(pw.length < 8 || pw.length > 8) throw new Error("password must be eight characters long")
    }
}