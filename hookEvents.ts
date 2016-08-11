export class HookEventBase {
    sender: string
    recipient: string

    constructor(rawData: any) {
        this.sender = rawData.sender.id
        this.recipient = rawData.recipient.id
    }
}

export interface IMessagePayload {

}

export class HookMessage extends HookEventBase {

    constructor(rawData: any) {
        super(rawData)
    }
}

export class HookPostback extends HookEventBase {

}

export class HookAuthentication extends HookEventBase {

}

export class HookAccountLinking extends HookEventBase {

}

export class HookMessageDelivered extends HookEventBase {

}

export class HookMessageRead extends HookEventBase {

}

export class HookMessageEcho extends HookMessage {
    
}