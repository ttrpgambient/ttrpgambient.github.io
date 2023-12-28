import { Authenticate } from "./auth_interface";
import { FileSystem } from "./fs_interface";

export interface System {
    getID(): string;
    getAuth(): Authenticate;
    getFileSystem(): FileSystem;
}