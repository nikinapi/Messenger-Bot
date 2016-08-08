
interface BotOptions {
    pageToken: string
    verifyToken: string
} 

class Bot {

    constructor(options: BotOptions) {}

    handler(): Function {
        return () => { };
    }
}
