import { Blip, Fading, Ped, Player, Sprite, Vector3 } from "@nativewrappers/fivem"
import type { ScriptConfig } from "../types"
import { Logger } from "../shared/logger"

const jsonData = LoadResourceFile(GetCurrentResourceName(), "./config.json")
const Config: ScriptConfig = JSON.parse(jsonData)

const logger = new Logger()

class Main {
    
    private isDead: number = 0

    constructor() {
        this.createBlips()
        onNet("br_death:sync", (status: number) => {
            this.isDead = status
        })
        onNet("br_death:revive", this.revive)
        onNet("br_death:kill", this.died)
        emitNet("br_death:requestSync")

        this.init()
    }

    private died() {
        this.isDead = 1
        emitNet("br_death:playerDied")
    }

    private revive(health: number) {
        new Player().Character.Health = 1000 + health
        this.isDead = 0
    }

    private createBlips() {
        if (!Config.blips.enabled) { return }

        for (let i = 0; i < Config.respawns.length; i++) {
            const blip = new Blip(i)
            blip.Sprite = Config.blips.sprite
            blip.Color = Config.blips.color
            blip.Scale = Config.blips.scale
        }
    }

    private getClosestRespawnPoint(coords: Vector3): Vector3 {

        let closestPoint: Vector3 = coords // Defaulting to the current coords in case something breaks
        let closestDist = Infinity

        for (const respawn of Config.respawns) {

            const respawnVec: Vector3 = new Vector3(respawn.coords[0], respawn.coords[1], respawn.coords[2])
            const dist = coords.distance(respawnVec)

            if (dist < closestDist) {
                closestDist = dist
                closestPoint = respawnVec
            }
        }

        return closestPoint
    }

    private async respawn() {
        const playerPed = new Player().Character
        const coords = playerPed.Position

        const respawnCoords = this.getClosestRespawnPoint(coords)

        await Fading.fadeOut(1500).catch(() => {
            logger.error(`Error detected while trying to fade out the screen, skipping to the next action`, true)
        })

        playerPed.Position = respawnCoords
        this.revive(Config.health + 1000)

        await Fading.fadeIn(1500).catch(() => {
            logger.error(`Error detected while trying to fade in the screen, skipping to the next action`, true)
        })
    }

    private async init() {
        while (true) {
            const playerPed = new Player().Character
            playerPed.MaxHealth = 1000 + Config.health

            if (playerPed.Health <= 1000) {
                if (this.isDead) {
                    playerPed.ragdoll(1000, 0)
                } else {
                    this.died()
                }
            }
        }
    }
}