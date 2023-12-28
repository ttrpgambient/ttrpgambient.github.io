import * as DropboxAPI from 'dropbox';
import { DropboxAuth } from './auth_dropbox';
import { DropboxFS } from './fs_dropbox';
import { System } from '../../interfaces/system/system_interface';
import { Authenticate } from '../../interfaces/system/auth_interface';
import { FileSystem } from '../../interfaces/system/fs_interface';
import { DROPBOX_APP } from './dropbox_common';

export class Dropbox implements System {
    private dbx: DropboxAPI.Dropbox = new DropboxAPI.Dropbox();
    auth: DropboxAuth;
    fs: DropboxFS;
    
    constructor() {
        this.auth = new DropboxAuth();
        this.dbx = new DropboxAPI.Dropbox({ auth: this.auth.GetDropboxAuth() });
        this.auth.SetDropbox(this.dbx);
        this.fs = new DropboxFS(this.dbx);
    }

    getID(): string {
        return DROPBOX_APP;
    }

    getAuth(): Authenticate {
        return this.auth;
    }

    getFileSystem(): FileSystem {
        return this.fs;
    }
}
