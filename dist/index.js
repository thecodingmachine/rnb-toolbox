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
exports.RNBPlugin = void 0;
const child_process_1 = require("child_process");
const utils_1 = require("./utils");
class RNBPlugin {
    constructor({ organisation, packageName, version = 'latest', promptsOptions, applyIf, }) {
        this.templatePath = '.';
        this.templatePluginPath = './node_modules';
        this.lifecycle = {
            onInstall: () => Promise.resolve(),
            afterInstall: () => Promise.resolve(),
        };
        this.loopOnPluginFiles = async (_a) => {
            var { accumulatedPath = '/', onDirectoryFound = () => Promise.resolve({}), onFileFound = () => Promise.resolve({}) } = _a, args = __rest(_a, ["accumulatedPath", "onDirectoryFound", "onFileFound"]);
            return (0, utils_1.onEachFiles)(Object.assign({ rootDir: this.TEMPLATE_PLUGIN_PATH, accumulatedPath,
                onDirectoryFound,
                onFileFound }, args));
        };
        this.loopOnSourceFiles = async (_a) => {
            var { accumulatedPath = '/', onDirectoryFound = () => Promise.resolve({}), onFileFound = () => Promise.resolve({}) } = _a, args = __rest(_a, ["accumulatedPath", "onDirectoryFound", "onFileFound"]);
            return (0, utils_1.onEachFiles)(Object.assign({ rootDir: `${this.TEMPLATE_PATH}/src`, accumulatedPath,
                onDirectoryFound,
                onFileFound }, args));
        };
        this.helpers = {
            loopOnPluginFiles: this.loopOnPluginFiles,
            loopOnSourceFiles: this.loopOnSourceFiles,
        };
        this.conditionFunction = (v) => !!v;
        this.apply = async (value, previousValues) => {
            if (this.conditionFunction(value, previousValues)) {
                try {
                    await (0, child_process_1.execSync)(`yarn add -D ${this.packageUrl}${this.version}`, { stdio: 'pipe' });
                    await this.lifecycle.onInstall(value, previousValues);
                    await this.lifecycle.afterInstall(value, previousValues);
                    await (0, child_process_1.execSync)(`yarn remove ${this.packageUrl}`, { stdio: 'pipe' });
                }
                catch (e) {
                    console.error(e);
                }
            }
        };
        this.buildPromptsOptions = ({ type, color = 'white', text, initial, }) => ({
            type,
            name: 'value',
            message: `${text}`,
            onRender(k) {
                let msg = text;
                if (type === 'confirm') {
                    msg = `${msg} ${k.gray('(y/N)')} \n\n`;
                }
                else {
                    msg = `${msg} \n\n`;
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.msg = k[color](msg);
            },
            initial,
        });
        this.version = version === 'latest' ? '' : `@${version}`;
        this.packageUrl = `${organisation}/${packageName}`;
        this.name = `${organisation}/${packageName}`;
        this.templatePluginPath = `./node_modules/${organisation}/${packageName}/template`;
        if (applyIf) {
            this.conditionFunction = applyIf;
        }
        this.promptsOptions = this.buildPromptsOptions(promptsOptions);
    }
    get TEMPLATE_PATH() {
        return this.templatePath;
    }
    get TEMPLATE_PLUGIN_PATH() {
        return this.templatePluginPath;
    }
}
exports.RNBPlugin = RNBPlugin;
