import { Config } from "../shared/config"
import { Logger } from "../shared/logger"
import { getFramework } from "./framework"
import { DB } from "./database"

const db = new DB()
const framework = getFramework()
const logger = new Logger()

class Main {

    constructor() {
        onNet("br_death:requestSync", () => {
            this.requestSync(source)
        })

        onNet("br_death:playerDeath", () => {
            this.playerDied(source)
        })

        RegisterCommand("revive", (source: number, args: Array<string>) => {
            if (!this.isAllowed(source)) { return }

            this.fullyRevivePlayer(parseInt(args[0]))
        }, false)

        exports("revive", this.revivePlayer)
    }

    private isAllowed(id: number): boolean {
        return true // TODO: Write an actual function
    }

    private revivePlayer(id: number, health: number) {
        logger.info(`Reviving player [${id}] to [${health}] hp`)
        emitNet("br_death:revive", id, health)
    }
    
    private fullyRevivePlayer(id: number) {
        logger.info(`Reviving player [${id}] to max hp`)
        emitNet("br_death:revive", id, Config.health)
    }

    private killPlayer(id: number) {
        logger.info(`Killing player [${id}]`)
        emitNet("br_death:kill", id)
    }

    private async playerDied(id: number) {
        logger.info(`Player [${id}] has died`)
        db.setStatus(1, framework.getIdentifier(id))
    }

    private async requestSync(id: number) {
        const status = await db.getStatus(framework.getIdentifier(id))
        emitNet("br_death:deliverSync", id, status)
    }
}

function init() {
    return new Main()
}

init()