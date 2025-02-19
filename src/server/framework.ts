abstract class Framework {
    static resourceName: string;
    abstract getIdentifier(id: number): string;

    static getResourceName(): string {
        throw new Error("getResourceName must be implemented by subclasses");
    }

    static isPresent(): boolean {
        return GetResourceState(this.resourceName) !== "missing";
    }
}
  
class EsxFramework extends Framework {
    static resourceName = "es_extxended";
    private ESX: any;

    constructor() {
        super();
        this.ESX = exports[EsxFramework.resourceName].getSharedObject();
    }

    public getIdentifier(id: number): string {
        return this.ESX.GetPlayerFromId(id).getIdentifier();
    }
}

// Framework detection logic
function getFramework(): Framework {
    const frameworks: ((new () => Framework) & typeof Framework)[] = [EsxFramework];

    for (const framework of frameworks) {
        if (framework.isPresent()) {
            return new framework();
        }
    }

    throw new Error("No supported framework is present");
}