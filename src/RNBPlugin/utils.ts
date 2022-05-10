import { promises, Stats } from 'fs';

export type CallbackOnEachFileParams = {
    item: string,
    element: Stats,
    rootDir: string,
    accumulatedPath: string,
    next: (param: CallbackOnEachFileParams) => Promise<unknown>
}

export type CallbackOnEachFile = (param: CallbackOnEachFileParams) => Promise<unknown>

type OnEachFilesParams = {
    rootDir: string,
    accumulatedPath: string,
    onDirectoryFound: CallbackOnEachFile
    onFileFound: CallbackOnEachFile
    [key: string]: unknown,
}

// eslint-disable-next-line import/prefer-default-export
export const onEachFiles = async ({
  rootDir,
  accumulatedPath = '/',
  onDirectoryFound = () => Promise.resolve(),
  onFileFound = () => Promise.resolve(),
  ...args
}: OnEachFilesParams): Promise<unknown> => {
  try {
    const files = await promises.readdir(`${rootDir}${accumulatedPath}`);

    return Promise.all(
      files.map(async (item) => {
        // File or directory found
        const element = await promises.lstat(`${rootDir}${accumulatedPath}${item}`);
        if (!element.isDirectory()) {
          try {
            await onFileFound({
              item,
              element,
              rootDir,
              accumulatedPath,
              next: (...params) => onEachFiles({
                rootDir,
                accumulatedPath: `${accumulatedPath}${item}/`,
                onDirectoryFound,
                onFileFound,
                ...args,
                ...params,
              }),
            });
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject(new Error('Sorry, an error occurred during the onFileFound function, contact the developer of the plugin'));
          }
        }
        try {
          await onDirectoryFound({
            item,
            element,
            rootDir,
            accumulatedPath,
            next: (...params) => onEachFiles({
              rootDir,
              accumulatedPath: `${accumulatedPath}${item}/`,
              onDirectoryFound,
              onFileFound,
              ...args,
              ...params,
            }),
          });
          return onEachFiles({
            rootDir,
            accumulatedPath: `${accumulatedPath}${item}/`,
            onDirectoryFound,
            onFileFound,
            ...args,
          });
        } catch (error) {
          return Promise.reject(new Error('Sorry, an error occurred during the onDirectoryFound function, contact the developer of the plugin'));
        }
      }),
    );
  } catch (error) {
    return Promise.reject(new Error(`Sorry, an error occurred reading: ${rootDir}${accumulatedPath}`));
  }
};
