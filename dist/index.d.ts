import { PromptObject } from 'prompts';
import { Kleur } from 'kleur';
import { CallbackOnEachFile } from './utils';
export interface PromptsOptions extends PromptObject {
    name: 'value';
    onRender: (k: Kleur) => void;
}
export declare type PromptsOptionsWrapperParams = {
    type: PromptsOptions['type'];
    color: keyof Kleur;
    text: string | number;
    initial: PromptsOptions['initial'];
};
export declare type ApplyFunction = (value: unknown, previousValues: unknown[], callback: (v: unknown, pv: unknown[]) => Promise<unknown>, afterRemoveCallback: (v: unknown, pv: unknown[]) => Promise<unknown>) => Promise<boolean | unknown>;
export declare type Plugin = {
    name: string;
    promptsOptions: PromptsOptions;
    apply: ApplyFunction;
};
export declare type ConditionFunction = (value: unknown, previousValues: unknown[]) => boolean;
declare type InstallLifeCycle = {
    onInstall: (v: unknown, pv: unknown[]) => Promise<unknown>;
    afterInstall: (v: unknown, pv: unknown[]) => Promise<unknown>;
};
declare type Version<M extends number, P extends number, F extends number> = 'latest' | `${M}.${P}.${F}`;
declare type RNBPluginParams = {
    organisation: string;
    packageName: string;
    version: Version<number, number, number>;
    promptsOptions: PromptsOptionsWrapperParams;
    applyIf?: ConditionFunction;
};
declare type HelperFunctionParams = {
    accumulatedPath?: string;
    onDirectoryFound?: CallbackOnEachFile;
    onFileFound?: CallbackOnEachFile;
    [key: string]: unknown;
};
declare type Helpers = {
    loopOnPluginFiles: (params: HelperFunctionParams) => Promise<unknown>;
    loopOnSourceFiles: (params: HelperFunctionParams) => Promise<unknown>;
};
export declare class RNBPlugin {
    private readonly templatePath;
    private readonly templatePluginPath;
    private readonly version;
    packageUrl: string;
    name: string;
    promptsOptions?: PromptsOptions;
    lifecycle: InstallLifeCycle;
    get TEMPLATE_PATH(): string;
    get TEMPLATE_PLUGIN_PATH(): string;
    private loopOnPluginFiles;
    private loopOnSourceFiles;
    helpers: Helpers;
    conditionFunction: ConditionFunction;
    apply: ApplyFunction;
    private buildPromptsOptions;
    constructor({ organisation, packageName, version, promptsOptions, applyIf, }: RNBPluginParams);
}
export {};
