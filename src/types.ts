export type ScriptConfig = {
    framework: string,
    debugMode: boolean,
    health: number,

    respawns: Array<{
        name: string,
        coords: [number, number, number]
    }>,
    
    blips: {
        enabled: boolean,
        sprite: number,
        color: number,
        scale: number
    }
}
