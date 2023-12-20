//Indexed Database

import { IDBJSON } from './idb_json';

function IDBError(error: any) {
    return { system: 'IDB', error };
}

var idbExporter = new IDBJSON();

export class IDBIndexHelper {
    options: IDBIndexParameters | undefined = undefined;
    name: string = "";
    keyPath: string = "";
}

export class IDBObjectStoreHelper {
    options: IDBObjectStoreParameters | undefined = undefined;
    name: string = "";
    indices: IDBIndexHelper[] = [];
}

export class IDBObject {
    idb: IDBDatabase | null = null;
    idbName: string = "";
    idbVersion: number = -1;

    constructor(name: string, version: number, objectStores: IDBObjectStoreHelper[]) {
        if ( name === "") {
            throw IDBError("IDBObject constructor, no name for indexed database");
        }
        this.idbName = name;
        this.idbVersion = version;

        const openRequest = indexedDB.open(name, version);
        openRequest.onerror = function () {
            throw IDBError(openRequest.error);
        };

        openRequest.onupgradeneeded = function () {
            //gets called on create and version bump
            //openRequest.result stores new DB
            //here we create DB definition, values it stores etc
            let newDB = openRequest.result;
            for ( let objectStore of objectStores ){
                let idbObjectStore = newDB.createObjectStore( objectStore.name, objectStore.options );
                for ( let index of objectStore.indices ) {
                    idbObjectStore.createIndex( index.name, index.keyPath, index.options );
                }
            }
        };
    }

    public import(dbJson: string): Promise<void> {
        return idbExporter.import(this.get(), dbJson);
    }
    public export(): Promise<string> {
        return idbExporter.export(this.get());
    }

    public loaded(): boolean {
        return this.idb != null;
    }

    public get(): IDBDatabase {
        if (!this.loaded()) throw IDBError('idbGet, no db');
        
        return (this.idb as IDBDatabase);
    }

    delete(): Promise<void> {
        let idb = this.get();
        return new Promise<void>((resolve) => {
            const objectStores = Array.from(idb.objectStoreNames);
            const trn = idb.transaction(objectStores, 'readwrite');
            for (let storeName of objectStores) {
                let objectStore = trn.objectStore(storeName);
                objectStore.clear();
            }

            trn.oncomplete = () => resolve();
        });
    }
}