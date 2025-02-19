import { oxmysql as MySQL } from "@overextended/oxmysql"
import { Logger } from "../shared/logger"

export class DB {
    private logger = new Logger()

    public async setStatus(status: number, identifier: string) {
        await MySQL.update("UPDATE `users` SET `is_dead` = ? WHERE `identifier` = ?", [
            status, identifier
        ])
        this.logger.info(`Status [${status}] set for player [${identifier}]`)
    }

    public async getStatus(identifier: string) {
        const status = await MySQL.single("SELECT `is_dead` FROM `users` WHERE `identifier` = ? LIMIT 1", [
            identifier
        ])

        if (!status) {
            this.logger.error(`Couldn't retrieve status for player [${identifier}], defaulting to alive`, true)
            return 0
        }

        this.logger.info(`Retrieved status [${status}] for player [${identifier}]`)
        return status
    }
}