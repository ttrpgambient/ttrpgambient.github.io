import { FileSystemStatus, FileUploadMode, UploadResult } from "../interfaces/system/fs_interface";
import { appGlobals } from "./appGlobals";
import { IDBObject, IDBObjectStoreHelper } from "./idb_core";

const DB_NAME = "/tagsImages.db"
const DB_VERSION = 1;
const DB_TAG_TO_IMAGE = 'TAG_TO_IMAGE_DB';
const DB_TAG_TO_IMAGE_STORE = 'TAG_TO_IMAGE_STORE';
const DB_TAG = 'TAG_ID';
const DB_IMAGE = 'IMAGE_ID';

export class TagImageRecord {
    tagName: string = '';
    imageName: string = '';
}

export class TagImageRecordWithID extends TagImageRecord {
    id: number = -1;
}

export class IDBTagsImages {

    private idb: IDBObject;

    constructor() {
        const objectStore: IDBObjectStoreHelper[] = [
            {
                name: DB_TAG_TO_IMAGE_STORE,
                options: { keyPath: "id", autoIncrement: true },
                indices: [
                    {
                        name: DB_TAG,
                        keyPath: "tagName",
                        options: { unique: false, multiEntry: false }
                    },
                    {
                        name: DB_IMAGE,
                        keyPath: "imageName",
                        options: { unique: false, multiEntry: false }
                    }
                ]
            }
        ];

        this.idb = new IDBObject(DB_TAG_TO_IMAGE, DB_VERSION, objectStore);
    }

    async loadDB() {
        const dbHash = window.localStorage.getItem(DB_NAME);
        if ( !!dbHash ) {
            const serverHash = await appGlobals.system?.getFileSystem().getFileHash(DB_NAME);
            if ( dbHash !== serverHash) {
                const result = await appGlobals.system?.getFileSystem().downloadFile(DB_NAME);
                if (!!!result) {
                    throw Error('loadDB tagsImages: no result from download');
                }
                if (result.status !== FileSystemStatus.Success) {
                    throw Error('Local hash exists. Couldnt download db, status: ' + result.status);
                }
                const dbJson = await result.file?.content?.text();
                if (!!!dbJson) {
                    throw Error('loadDB tagsImages: db downloaded but no text');
                }
                await this.idb.delete();
                await this.idb.import(dbJson);
            }
        } else {
            const result = await appGlobals.system?.getFileSystem().downloadFile(DB_NAME);
            if (!!!result) {
                throw Error('loadDB tagsImages: no result from download');
            }
            if (result.status === FileSystemStatus.Success) {
                if (!!!result.fileInfo?.hash)
                    throw Error('loadDB tagsImages: Local hash doesnt exists. No hash in downloaded db');

                window.localStorage.setItem(DB_NAME, result.fileInfo.hash);

                const dbJson = await result.file?.content?.text();
                if (!!!dbJson) {
                    throw Error('loadDB tagsImages: db downloaded but no text');
                }
                await this.idb.delete();
                await this.idb.import(dbJson);
            }
        }
    }

    private uploadDB() {
        this.idb.export().then( (jsonDB: string) => {
            appGlobals.system?.getFileSystem().uploadFile(DB_NAME, {content: new Blob([jsonDB])}, FileUploadMode.Replace).then((result: UploadResult) => {
                if (!!!result) throw Error('uploadDB tagsImages: no result');
                if (result.status !== FileSystemStatus.Success) throw Error('Couldnt upload db, status: ' + result.status);
                if (!!!result.fileInfo) throw Error('uploadDB tagsImages: No fileInfo');
                if (!!!result.fileInfo.hash) throw Error('uploadDB tagsImages: No hash');

                window.localStorage.setItem(DB_NAME, result.fileInfo.hash);
            });
        });
    }

    addRecord(tagName: string, imageName: string, callback?: ()=>void) {
        const index = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readonly')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_IMAGE);

        index.openCursor(IDBKeyRange.only(imageName)).onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
            if (cursor) {
                if (tagName === cursor.value.tagName) {
                    return;
                }
                cursor.continue();
            } else {
                let record = new TagImageRecord();
                record.tagName = tagName;
                record.imageName = imageName;

                this.idb.get()
                    .transaction(DB_TAG_TO_IMAGE_STORE, 'readwrite')
                    .objectStore(DB_TAG_TO_IMAGE_STORE)
                    .add(record).onsuccess = () => {
                        if (callback) callback()
                        this.uploadDB();
                    };
            }
        }
    }

    removeRecord(tagName: string, imageName: string) {
        const tags = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readwrite')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_TAG);

        tags.openCursor(IDBKeyRange.only(tagName)).onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
            if (cursor) {
                if (imageName === cursor.value.imageName) {
                    cursor.delete();
                    this.uploadDB();
                    return;
                }
                cursor.continue();
            }
        }
    }

    removeImage( imageName: string ) {
        const tags = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readwrite')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_IMAGE);

        tags.openCursor(IDBKeyRange.only(imageName)).onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            } else {
                this.uploadDB();
            }
        }
    }

    getAllTags(callback: (tagsList: string[]) => void) {
        const index = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readonly')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_TAG);

        let tagsList: Set<string> = new Set<string>();
        index.openCursor().onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
            if (cursor) {
                tagsList.add(cursor.value.tagName);
                cursor.continue();
            } else {
                callback(Array.from(tagsList));
            }
        }
    }

    getAllImagesWithTags(tagsList: string[], callback: (images: string[]) => void) {
        const index = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readonly')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_TAG);

        const tagsCount = tagsList.length;

        let cursors: Promise<string[]>[] = [];
        for (let tagID = 0; tagID < tagsCount; ++tagID) {
            const tag = tagsList[tagID];
            const cursor = new Promise<string[]>((resolve) => {
                let imagesList: string[] = [];
                index.openCursor(IDBKeyRange.only(tag)).onsuccess = function (e) {
                    const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (cursor) {
                        imagesList.push(cursor.value.imageName);
                        cursor.continue();
                    } else {
                        resolve(imagesList);
                    }
                }
            }
            )

            cursors.push(cursor);
        }

        Promise.all(cursors).then((allImages: string[][]) => {
            const imagesArrayCount = allImages.length
            let imagesList: string[] = [];

            if (imagesArrayCount > 0) {
                imagesList = allImages[0];

                for (let a = 1; a < imagesArrayCount; ++a) {
                    let tmpImageList: string[] = [];
                    tmpImageList = allImages[a].filter(image => imagesList.includes(image));

                    imagesList = tmpImageList;
                }
            }

            callback(imagesList);
        }
        )
    }

    getImagesExclusiveTag(tagName: string, callback: (images: string[]) => void) {
        const index = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readonly')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_IMAGE);

        let imagesMap: Map<string, { count: number, tag: boolean }> = new Map<string, { count: number, tag: boolean }>;
        index.openCursor().onsuccess = function (e) {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
            if (cursor) {
                const tagMatch = tagName === cursor.value.tagName;
                if (imagesMap.has(cursor.value.imageName)) {
                    let image = imagesMap.get(cursor.value.imageName) as { count: number, tag: boolean };
                    image.count += 1;
                    image.tag = image.tag || tagMatch;
                    imagesMap.set(cursor.value.imageName, image);
                } else {
                    imagesMap.set(cursor.value.imageName, { count: 1, tag: tagMatch });
                }
                cursor.continue();
            } else {
                let imagesList: string[] = [];
                for (let [key, value] of imagesMap) {
                    if (value.count === 1 && value.tag === true) {
                        imagesList.push(key);
                    }
                }
                callback(imagesList);
            }
        }
    }

    getImageTags(imageName: string, callback: (tags: string[]) => void) {
        const index = this.idb.get()
            .transaction(DB_TAG_TO_IMAGE_STORE, 'readonly')
            .objectStore(DB_TAG_TO_IMAGE_STORE)
            .index(DB_IMAGE);

            let tagsList: string[] = [];
            index.openCursor(IDBKeyRange.only(imageName)).onsuccess = function (e) {
                const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
                if ( cursor ) {
                    tagsList.push(cursor.value.tagName);
                    cursor.continue();
                } else {
                    callback(tagsList);
                }
        }
    }
}