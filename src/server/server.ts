import "@citizenfx/server"
import { DB } from "./database"
import { Logger } from "../shared/logger"
import { Framework } from "./framework"
import * as Config from "../../public/config.json"

const db = new DB()
const framework = new Framework()

class Main {
    private logger = new Logger()

    private revivePlayer(id: number, health: number) {
        this.logger.info(`Reviving player [${id}] to [${health}] hp`)
        emitNet("br_death:revive", id, health)
    }
    
    private fullyRevivePlayer(id: number) {
        this.logger.info(`Reviving player [${id}] to max hp`)
        emitNet("br_death:revive", id, Config.health)
    }

    private async playerDied(id: number) {
        db.setStatus(1, await framework.getIdentifier(id))
    }
}

on("br_death:playerDeath", () => {
    console.log(source)
})