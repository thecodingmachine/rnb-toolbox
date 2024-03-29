import { execSync } from 'child_process';
import { PromptObject } from 'prompts';
import { Kleur } from 'kleur';
import { CallbackOnEachFile, onEachFiles } from './utils';

export interface PromptsOptions extends PromptObject {
    name: 'value',
    onRender: (k: Kleur) => void,
}

export type PromptsOptionsWrapperParams = {
    type: PromptsOptions['type'],
    color: keyof Kleur,
    text: string | number,
    initial: PromptsOptions['initial']
}

export type ApplyFunction = (
    value: unknown,
    previousValues: unknown[],
    callback: (v: unknown, pv: unknown[]) => Promise<unknown>,
    afterRemoveCallback: (v: unknown, pv: unknown[]) => Promise<unknown>
) => Promise<boolean | unknown>

export type Plugin = {
    name: string,
    promptsOptions: PromptsOptions,
    apply: ApplyFunction
}

export type ConditionFunction = (value: unknown, previousValues: unknown[]) => boolean

type InstallLifeCycle = {
    onInstall: (v: unknown, pv: unknown[]) => Promise<unknown>,
    afterInstall: (v: unknown, pv: unknown[]) => Promise<unknown>,
}

type Version<M extends number, P extends number, F extends number> = 'latest' | `${M}.${P}.${F}`

type RNBPluginParams = {
    organisation: string,
    packageName: string,
    version: Version<number, number, number>
    promptsOptions: PromptsOptionsWrapperParams,
    applyIf?: ConditionFunction,
}

type HelperFunctionParams = {
    accumulatedPath?: string,
    onDirectoryFound?: CallbackOnEachFile
    onFileFound?: CallbackOnEachFile
    [key: string]: unknown,
}

type Helpers = {
    loopOnPluginFiles: (params: HelperFunctionParams) => Promise<unknown>,
    loopOnSourceFiles: (params: HelperFunctionParams) => Promise<unknown>,
}

export class RNBPlugin {
    private readonly templatePath = '.';

    private readonly templatePluginPath: `./node_modules/${string}/${string}/template` | './node_modules' = './node_modules';

    private readonly version: string

    packageUrl: string

    name: string

    promptsOptions?: PromptsOptions

    lifecycle: InstallLifeCycle = {
      onInstall: () => Promise.resolve(),
      afterInstall: () => Promise.resolve(),
    }

    get TEMPLATE_PATH(): string {
      return this.templatePath;
    }

    get TEMPLATE_PLUGIN_PATH(): string {
      return this.templatePluginPath;
    }

    private loopOnPluginFiles = async ({
      accumulatedPath = '/',
      onDirectoryFound = () => Promise.resolve({}),
      onFileFound = () => Promise.resolve({}),
      ...args
    }: HelperFunctionParams) => onEachFiles({
      rootDir: this.TEMPLATE_PLUGIN_PATH,
      accumulatedPath,
      onDirectoryFound,
      onFileFound,
      ...args,
    })

    private loopOnSourceFiles = async ({
      accumulatedPath = '/',
      onDirectoryFound = () => Promise.resolve({}),
      onFileFound = () => Promise.resolve({}),
      ...args
    }: HelperFunctionParams) => onEachFiles({
      rootDir: `${this.TEMPLATE_PATH}/src`,
      accumulatedPath,
      onDirectoryFound,
      onFileFound,
      ...args,
    })

    helpers: Helpers = {
      loopOnPluginFiles: this.loopOnPluginFiles,
      loopOnSourceFiles: this.loopOnSourceFiles,
    }

    conditionFunction: ConditionFunction = (v: unknown) => !!v

    apply: ApplyFunction = async (
      value: unknown,
      previousValues: unknown[],
    ) => {
      if (this.conditionFunction(value, previousValues)) {
        try {
          await execSync(
            `yarn add -D ${this.packageUrl}${this.version}`,
            { stdio: 'pipe' },
          );
          await this.lifecycle.onInstall(value, previousValues);
          await this.lifecycle.afterInstall(value, previousValues);
          try {
            await execSync(
              `yarn remove ${this.packageUrl}`,
              { stdio: 'pipe' },
            );
          } catch (e) {
            // Silent fail
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    private buildPromptsOptions = ({
      type, color = 'white', text, initial,
    } : PromptsOptionsWrapperParams): PromptsOptions => ({
      type,
      name: 'value',
      message: `${text}`,
      onRender(k: Kleur) {
        let msg = text;
        if (type === 'confirm') {
          msg = `${msg} ${k.gray('(y/N)')} \n\n`;
        } else {
          msg = `${msg} \n\n`;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.msg = k[color](msg);
      },
      initial,
    })

    public constructor({
      organisation,
      packageName,
      version = 'latest',
      promptsOptions,
      applyIf,
    }: RNBPluginParams) {
      this.version = version === 'latest' ? '' : `@${version}`;
      this.packageUrl = `${organisation}/${packageName}`;
      this.name = `${organisation}/${packageName}`;
      this.templatePluginPath = `./node_modules/${organisation}/${packageName}/template`;

      if (applyIf) {
        this.conditionFunction = applyIf;
      }
      this.promptsOptions = this.buildPromptsOptions(promptsOptions);
    }
}
