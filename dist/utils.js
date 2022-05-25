"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEachFiles = void 0;
const fs_1 = require("fs");
// eslint-disable-next-line import/prefer-default-export
const onEachFiles = async (_a) => {
    var { rootDir, accumulatedPath = '/', onDirectoryFound = () => Promise.resolve({}), onFileFound = () => Promise.resolve({}) } = _a, args = __rest(_a, ["rootDir", "accumulatedPath", "onDirectoryFound", "onFileFound"]);
    try {
        const files = await fs_1.promises.readdir(`${rootDir}${accumulatedPath}`);
        return Promise.all(files.map(async (item) => {
            // File or directory found
            const element = await fs_1.promises.lstat(`${rootDir}${accumulatedPath}${item}`);
            if (!element.isDirectory()) {
                try {
                    await onFileFound(Object.assign({ item,
                        element,
                        rootDir,
                        accumulatedPath }, args));
                    return Promise.resolve(true);
                }
                catch (error) {
                    return Promise.reject(new Error('Sorry, an error occurred during the onFileFound function, contact the developer of the plugin'));
                }
            }
            try {
                const parameters = __rest(await onDirectoryFound(Object.assign({ item,
                    element,
                    rootDir,
                    accumulatedPath }, args)), []);
                return (0, exports.onEachFiles)(Object.assign(Object.assign({ rootDir, accumulatedPath: `${accumulatedPath}${item}/`, onDirectoryFound,
                    onFileFound }, args), parameters));
            }
            catch (error) {
                return Promise.reject(new Error('Sorry, an error occurred during the onDirectoryFound function, contact the developer of the plugin'));
            }
        }));
    }
    catch (error) {
        return Promise.reject(new Error(`Sorry, an error occurred reading: ${rootDir}${accumulatedPath}`));
    }
};
exports.onEachFiles = onEachFiles;
