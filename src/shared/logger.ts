import { debugMode } from "../config.json"

export class Logger {
    public async error(txt: string, bypass?: boolean) {
        if (debugMode || bypass) {
            console.log(`[ERROR] ${txt}`)
        }
    }
    public async success(txt: string, bypass?: boolean) {
        if (debugMode || bypass) {
            console.log(`[SUCCESS] ${txt}`)
        }
    }
    public async info(txt: string, bypass?: boolean) {
        if (debugMode || bypass) {
            console.log(`[INFO] ${txt}`)
        }
    }
}