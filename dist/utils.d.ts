/// <reference types="node" />
import { Stats } from 'fs';
export declare type CallbackOnEachFileParams = {
    item: string;
    element: Stats;
    rootDir: string;
    accumulatedPath: string;
};
export declare type CallbackOnEachFile = (param: CallbackOnEachFileParams) => Promise<Record<string, unknown>>;
declare type OnEachFilesParams = {
    rootDir: string;
    accumulatedPath: string;
    onDirectoryFound: CallbackOnEachFile;
    onFileFound: CallbackOnEachFile;
    [key: string]: unknown;
};
export declare const onEachFiles: ({ rootDir, accumulatedPath, onDirectoryFound, onFileFound, ...args }: OnEachFilesParams) => Promise<unknown>;
export {};
