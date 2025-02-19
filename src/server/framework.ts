import { Server as ESXServer } from 'esx.js'

interface FrameworkInterface {
    getIdentifier(id: number): string
}

class EsxFramework implements FrameworkInterface {
    private ESX: ESXServer

    constructor() {
        this.ESX = exports["es_extended"].getSharedObject()
    }

    public getIdentifier(id: number): string {
        return this.ESX.GetPlayerFromId(id).getIdentifier()
    }
}

export function getFramework(): FrameworkInterface {
    if (GetResourceState("es_extended") != "missing") {
        return new EsxFramework()
    } else {
        throw Error("No supported framework ")
    }
}