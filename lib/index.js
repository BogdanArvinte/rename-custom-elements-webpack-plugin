class RenameCustomElementsWebpackPlugin {
    constructor(options) {
      this.options = {
        prefix: '',
        sufix: Date.now().toString(36),
        index: 'index.html',
        ...options,
      };
  
      if (this.options.prefix) {
        this.options.prefix += '-';
      }
  
      if (this.options.sufix) {
        this.options.sufix = `-${this.options.sufix}`;
      }
    }
  
    apply(compiler) {
      compiler.hooks.emit.tapAsync('RenameCustomElementsWebpackPlugin', (compilation, callback) => {
        const customElements = this.getCustomElementTags(compilation);
        this.renameCustomElements(compilation, customElements);
  
        callback();
      });
    }
  
    getCustomElementTags(compilation) {
      const { chunks, assets } = compilation;
      let tags = [];
      chunks.forEach(chunk =>
        chunk.files.forEach(filename => {
          const source = assets[filename].source();
          if (source) {
            const foundTags = this.findCustomElementInSource(source);
            tags = tags.concat(foundTags);
          }
        }),
      );
      return tags;
    }
  
    findCustomElementInSource(source) {
      const cePattern = /customElements\.define\(['"]([a-z0-9-]+)['"]/g;
      const matchedCustomElements = source.match(cePattern);
      const customElementTags = [];
      if (matchedCustomElements) {
        matchedCustomElements.forEach(item => {
          customElementTags.push(item.replace(cePattern, '$1'));
        });
      }
      return customElementTags;
    }
  
    renameCustomElements(compilation, customElements) {
      const { chunks, assets } = compilation;
      const index = this.options.index;
  
      chunks.forEach(chunk => {
        chunk.files.forEach(filename => {
          const source = assets[filename].source();
          if (source) {
            const updatedSource = this.updateCustomElementsInSource(source, customElements);
            assets[filename] = {
              source: () => updatedSource,
              size: () => updatedSource.length,
            };
          }
        });
      });
  
      if (assets[index]) {
        const source = assets[index].source();
        const updatedSource = this.updateCustomElementsInSource(source, customElements);
        assets[index] = {
          source: () => updatedSource,
          size: () => updatedSource.length,
        };
      }
    }
  
    updateCustomElementsInSource(source, customElements) {
      let updatedSource = source;
      customElements.forEach(element => {
        updatedSource = this.replaceAll(
          updatedSource,
          `(?<![\w-])(${element})(?=[^\w-])`,
          `${this.options.prefix}${element}${this.options.sufix}`,
        );
      });
      return updatedSource;
    }
  
    replaceAll(str, find, replace) {
      const regex = new RegExp(find, 'g');
      const result = str.replace(regex, replace);
      return result;
    }
  }
  
  module.exports = RenameCustomElementsWebpackPlugin;
  