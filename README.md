# TheCodingMachine React Native boilerplate - Toolbox
![React Native Boilerplate Toolbox License](https://img.shields.io/github/license/thecodingmachine/rnb-toolbox)
![React Native Boilerplate Toolbox Version](https://flat.badgen.net/npm/v/@thecodingmachine/rnb-toolbox)
![React Native Boilerplate Toolbox Release Date](https://img.shields.io/github/release-date/thecodingmachine/rnb-toolbox)
![React Native Boilerplate Toolbox Download](https://flat.badgen.net/npm/dt/@thecodingmachine/rnb-toolbox)
![React Native Boilerplate Toolbox Top Language](https://img.shields.io/github/languages/top/thecodingmachine/rnb-toolbox)
[![CI](https://github.com/thecodingmachine/rnb-toolbox/actions/workflows/CI.yml/badge.svg)](https://github.com/thecodingmachine/rnb-toolbox/actions/workflows/CI.yml)

🚧 This is a work in progress documentation. 🚧

This project is part of our [React Native Boilerplate](https://github.com/thecodingmachine/react-native-boilerplate/) that can be used to kickstart a mobile application.

This boilerplate provides **an optimized architecture for building solid cross-platform mobile applications** through separation of concerns between the UI and business logic. It is fully documented so that each piece of code that lands in your application can be understood and re-used.

This toolbox allows you to build plugin modules that can be used to extend the functionality of the boilerplate.

## Quick start

The best way to get started is to use the template repository. It will provide you with a working project that you can start from scratch.

## Documentation

### Initialization

To initialize a plugin, you have to use the RNBPlugin constructor like this:

```javascript
const { RNBPlugin } = require('@thecodingmachine/rnb-toolbox');

const plugin = new RNBPlugin({
  organisation: '<package-organisation>',
  packageName: '<package-name>',
  // version: 'latest | <package-version>', // default: latest
  promptsOptions: {
    type: 'confirm',
    color: 'blue',
    text: 'Do you want to use my custom plugin ?',
    initial: false,
  },
});
```
#### PromptsOptions
| Key name       | default   | type                        | description                                                                                                   | required |
|----------------|-----------|-----------------------------|---------------------------------------------------------------------------------------------------------------|----------|
| organisation   |           | string                      | the organisation name on the npm registry                                                                     | true     |
| packageName    |           | string                      | the package name on the npm registry                                                                          | true     |
| version        | 'latest'  | string                      | the version of the plugin (use it when you make rc/beta/alpha version)                                        | false    |
| promptsOptions |           | PromptsOptionsWrapperParams | the prompt that will be printed for the final user ([Prompts doc](https://github.com/terkelg/prompts#readme)) | true     |

#### PromptsOptionsWrapperParams:

| Key name | default | type   | description                                               |
|----------|---------|--------|-----------------------------------------------------------|
| type     |         | string | [Prompts type](https://github.com/terkelg/prompts#readme) |
| color    | 'white' | string | [Kleur colors](https://github.com/lukeed/kleur#api)       |
| text     |         | string | the prompt text to display                                |
| initial  |         | any    | the prompt default value                                  |

### Life cycle
A RNBPlugin as a defined lifecycle with two hooks:
- onInstall
- afterInstall

#### onInstall
This hook is called right after the plugin is installed. It is called with the following parameters:

#### afterInstall
This hook is called right after the plugin onInstall hook is finished and the plugin is removed from the boilerplate. It is called with the following parameters:

### Helper functions
Generally, you will want to do some operation into life cycle hooks. For example, you will want to loop on plugin files to paste them into the boilerplate code base.
Or you will want loop on the boilerplate files and rename them. To do that you can use the following helper functions:
- loopOnPluginFiles
- loopOnSourceFiles

#### loopOnPluginFiles & loopOnSourceFiles
| Helper function  | default                   | type     | description                                 | required |
|------------------|---------------------------|----------|---------------------------------------------|----------|
| accumulatedPath  | '/'                       | string   | the current path during the loop            | false    |
| onDirectoryFound | () => Promise.resolve({}) | function | function to start when a directory is found | false    |
| onFileFound      | () => Promise.resolve({}) | function | function to start when a file is found      | false    |
| ...args          |                           | any      | custom arguments to give in each loop       | false    |

##### Example

```javascript
plugin.lifecycle.onInstall = async () => {
  await plugin.helpers.loopOnSourceFiles({
    directoryCounter: false, // will be exposed in onFileFound() and onDirectoryFound()
    onDirectoryFound: async ({
      item, accumulatedPath, directoryCounter,
    }) => {
      // do something with the directory
      return Promise.resolve({ directoryCounter: directoryCounter + 1 });
    },
  });
};
```

## License

This project is released under the [MIT License](LICENSE).

## About us

[TheCodingMachine](https://www.thecodingmachine.com/) is a web and mobile agency based in Paris and Lyon, France. We are [constantly looking for new developers and team leaders](https://www.thecodingmachine.com/nous-rejoindre/) and we love [working with freelancers](https://coders.thecodingmachine.com/). You'll find [an overview of all our open source projects on our website](https://thecodingmachine.io/open-source) and on [Github](https://github.com/thecodingmachine).
