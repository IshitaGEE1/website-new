import { mapGetters } from 'vuex';

const IGNORED_FIELDS = ['id', 'sys', 'metadata', 'image', 'url', 'file', 'navigateTo', 'navigationMenu', 'action', 'redirectTo'];

export default {
  computed: {
    ...mapGetters({
      kw: 'keywordKw',
      channel: 'keywordChannel',
      social: 'keywordSocial'
    })
  },
  beforeMount() {
    this.processDynamicKeywords(this.fields, {
      kw: this.kw,
      channel: this.channel,
      social: this.social
    })
  },
  methods: {
    processDynamicKeywords(dataStructure, value) {
      let replacementMap = value;
      //data paths that don't contain information that is displayed or are self-referencing
      //-> not relevant for keyword insertion
      processAllFields(dataStructure);

      //callback function for replace
      //if value for keyword defined take that value, otherwise take default
      function replacer(match, keyword, defaultValue) {
        if (replacementMap[keyword]) return replacementMap[keyword];
        return defaultValue ? defaultValue : '';
      }

      function processString(string) {
        //match substrings following this pattern: $$$<keyword>(<defaultValue>)
        //keyword and defaultValue are grouped and available to callback function
        //alt regex for browsers supporting positive lookbehind: /\$\$\$(kw|channel|social)\(?((?<=\().+?(?=\)))?\)?/g
        return string.replace(/\$\$\$(kw|channel|social)\(?(((?!\().)+?(?=\)))?\)?/g, replacer);
      }

      /**
       * go recursively through data structure
       * @param node - current node in data structure
       * @param callback - function used to actually change value of string in data (not just copy)
       */
      function processAllFields(node, callback = undefined) {
        // avoid cycles
        if (isCircular(node)) {
          //cycle detected
          console.warn(`Circular structure detected. Abort. In module:`, node.name, node);
          return;
        }
        switch (typeof node) {
          case 'string':
            callback(processString(node));
            return;
          case 'object':
            if (node === null) return;
            //is Array
            if (Array.isArray(node)) {
              node.forEach((elem, index) => {
                callback = (newValue) => node[index] = newValue;
                processAllFields(elem, callback);
              });
              return;
            }
            //is Object
            for (const elemKey in node) {
              //ignore certain paths in data structure
              if (IGNORED_FIELDS.includes(elemKey)) {
                continue;
              }
              callback = (newValue) => node[elemKey] = newValue;
              processAllFields(node[elemKey], callback);
            }
            return;

          default:
            //do nothing
            return;
        }
      }

      //test if a given object is self-referencing
      function isCircular(obj, arr) {
        "use strict";

        var type = typeof obj,
          propName,
          thisVal,
          iterArr,
          lastArr;

        if (type !== "object" && type !== "function") {
          return false;
        }

        if (Object.prototype.toString.call(arr) !== '[object Array]') {
          type = typeof arr; // jslint sake
          if (!(type === "undefined" || type === null)) {
            throw new TypeError("Expected attribute to be an array");
          }

          arr = [];
        }

        arr.push(obj);
        lastArr = arr.length - 1;

        for (propName in obj) {
          if (IGNORED_FIELDS.includes(propName)) {
            continue;
          }
          thisVal = obj[propName];
          type = typeof thisVal;

          if (type === "object" || type === "function") {
            for (iterArr = lastArr; iterArr >= 0; iterArr -= 1) {
              if (thisVal === arr[iterArr]) {
                return true;
              }
            }

            if (isCircular(thisVal, arr)) {
              return true;
            }
          }
        }

        arr.pop(obj);
        return false;
      }
    }
  }
}
