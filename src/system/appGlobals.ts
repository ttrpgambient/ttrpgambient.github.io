import { System } from "../interfaces/system/system_interface"
import { IDBTagsImages } from "./idbTagsImages";

export const IMAGES_PATH = '/images/'
export const SUPPORTED_FORMATS = new Set(['image/png', 'image/jpeg']);

class AppGlobals {
    system: null | System = null; 
    idbTagsImages: IDBTagsImages = new IDBTagsImages();
    tags: string[] = [];
    imagesCache: Map<string, string> = new Map<string, string>();
}

export const appGlobals = new AppGlobals();