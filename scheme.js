/**
 * {
 *      id: {type: String}
 *      name: {type: String, required: true}
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
      if(type != 'int' && type != String && type != Number && type != Date) {
        throw new Error('wront type ' + type + ' for field ' + field);
      }
    }
  }
  fixOptions();

  function castValue(fieldDefine, value) {
    if(value == null) {
      if(fieldDefine.default) {
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
      if(!value) {
        if(fieldDefine.required) {
          throw new Error('field ' + field + ' is required');
        }
        if(!fieldDefine.default) {
          continue;
        }
      }
      value = castValue(fieldDefine, value);
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
  function filter() {

  }

}