import { System } from "../interfaces/system/system_interface"
import { IDBTagsImages } from "./idbTagsImages";

class AppGlobals {
    system: null | System = null; 
    idbTagsImages: IDBTagsImages = new IDBTagsImages();
    tags: string[] = [];
}

export const appGlobals = new AppGlobals();