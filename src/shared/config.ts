import type { ScriptConfig } from "../types"

const jsonData = LoadResourceFile(GetCurrentResourceName(), "./config.json")
export const Config: ScriptConfig = await JSON.parse(jsonData)