import { System } from "../interfaces/system/system_interface"
import { IDBTagsImages } from "./idbTagsImages";

export const IMAGES_PATH = '/images/'

class AppGlobals {
    system: null | System = null; 
    idbTagsImages: IDBTagsImages = new IDBTagsImages();
    tags: string[] = [];
}

export const appGlobals = new AppGlobals();