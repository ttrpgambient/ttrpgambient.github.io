import { IDBObject, IDBObjectStoreHelper } from "./idb_core";

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

    addRecord(tagName: string, imageName: string) {
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
                    .add(record);
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
                    return;
                }
                cursor.continue();
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