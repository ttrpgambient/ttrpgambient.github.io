import { System } from "../interfaces/system/system_interface"

class AppGlobals {
    system: null | System = null; 
}

export const appGlobals = new AppGlobals();