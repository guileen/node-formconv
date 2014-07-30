/**
 * {
 *      id: {type: String}
 *      name: {type: String, required: true}
 *      password: {type: String, private: true}
 *      intfield: {type: 'int', min:10, max:100, default: 100}
 *      numfield: {type: Number}
 *      createTime: {type: Date}
 *      items: {type: Array}
 * }
 *
 * type:
 *    String
 *    Number
 *    'int'
 *    Date
 *    Boolean
 *
 * validators:
 *    min
 *    max
 *    minLength
 *    maxLength
 *    pattern  // email, url
 *
 */
function scheme(options) {

  function fixOptions() {
    for(var field in options) {
      var value = options[field];
      if(value instanceof RegExp) {
        options[field] = {type: String, pattern: value}
      } else if(typeof value != 'object') {
        options[field] = {type: value}
      }
      var type = options[field].type;
      var typeType = typeof type;
      if(type != 'int' && type != String && type != Number && type != Date && type != Array) {
        throw new Error('wrong type ' + type + ' for field ' + field);
      }
    }
  }
  fixOptions();

  function castValue(fieldDefine, value, obj) {
    if(value == null) {
      if(fieldDefine.default) {
        if(typeof fieldDefine.default == 'function') {
          return fieldDefine.default(obj);
        }
        return fieldDefine.default;
      }
      return null;
    }
    switch(fieldDefine.type) {
     case 'int':
      return parseInt(value);
      break;
     case Number:
      return Number(value);
      break;
     case String:
      return value;
      break;
     case Date:
      return new Date(value);
      break;
     case Array:
      if(value instanceof Array) return value
      return null
     default:
      throw new Error('not support type '+ fieldDefine.type)
    }
  }

  function validateValue(fieldDefine, value, fieldName) {
    if(value == null && fieldDefine.required) {
      throw new Error(fieldName + ' is required');
    }
    // TODO
  }

  /**
   * normalize and validation
   * {"int":"5"} => {"int": 5}
   */
  function normalize(obj) {
    var result = {}, fieldDefine, value;
    for(var field in options) {
      fieldDefine = options[field];
      value = obj[field];
      value = castValue(fieldDefine, value, obj);
      validateValue(fieldDefine, value, field);
      if(value != null) {
        // ignore null value
        result[field] = value;
      }
    }
    return result;
  }

  /**
   * filter private fields
   *
   */
  function filter(obj) {
    var result = {}, fieldDefine, value;
    for(var field in options) {
      fieldDefine = options[field];
      value = obj[field];
      if(!fieldDefine.private && value !== undefined) {
        result[field] = value;
      }
    }
    return result;
  }


  return {
    normalize: normalize
  , filter: filter
    // -----
  , parse: normalize
  }
}

var exports = module.exports = scheme;
