/**
 * 类型检测 - Array
 */
function _isArray (a) {
  return a !== null && Object.prototype.toString.call(a) === "[object Array]";
}

/**
 * 类型检测 - object 
 */
function _isObject (o) {
  return o !== null && Object.prototype.toString.call(o) === "[object Object]";
}

/**
 * 类型检测 - Object
 */
function _isBelongObject (o) {
  return typeof(o) === "object";
} 

/**
 * 类型检测 - 未知类型
 * @returns { Number, String, Array, Object, Boolean, Null, Undefined }
 */
function _typeOf (o) {
  let str = Object.prototype.toString.call(o);
  let type = str.split(' ')[1];
  return type.slice(0, type.length-1);
}

/**
 * 数组唯一性排序
 * 默认成员: {Object,Array,Number,String,Boolean,null}
 * @param { Array }
 * @returns { Array }
 */
function _sortArray (a) {
  if(!_isArray(a)) {
    throw new Error(`The param: ${JSON.stringify(a)} of _sortArray is not a Array`);
  }
  let nArr = a.map((item, index, arr) => {
    if(!_isBelongObject(item) || item == null) {
      return item;
    } else {

      if(_isArray(item)) {
        return _sortArray(item);
      }

      else if(_isObject(item)) {
        return _sortObject(item);
      }
      
      else {
        throw new Error('Not as expected type in _sortArray');
      }
    }
  });
  nArr.sort();
  return nArr;
}

/**
 * 对象唯一性排序
 * 默认成员: {Object,Array,Number,String,Boolean,null}
 * @param { Object }
 * @returns { Object }
 */
function _sortObject (o) {
  if(!_isObject(o)) {
    throw new Error(`The param: ${JSON.stringify(o)} of _sortObject is not a Object`);
  }
  let keys = Object.keys(o).sort();
  let nObj = {};
  keys.forEach((item, index, key) => {

    if(!_isBelongObject(o[item]) || o[item] == null) {
      nObj[item] = o[item];
    }

    else if (_isArray(o[item])) {
      nObj[item] = _sortArray(o[item]);
    }

    else if (_isObject(o[item])) {
      nObj[item] = _sortObject(o[item]);
    }
    
    else {
      throw new Error('Not as expected type in _sortObject');
    }
  });
  return nObj;
}

/**
 * Object 相等判断
 * 默认成员: {Object,Array,Number,String,Boolean,null}
 * @returns { true | false }
 */
function _diffObject (o1, o2) {
  if(!_isObject(o1) || !_isObject(o2)) {
    throw new Error(`The param: ${JSON.stringify(o1)} or ${JSON.stringify(o2)} of _diffObject is not a Object`);
  }
  let _o1 = _sortObject(o1);
  let _o2 = _sortObject(o2);
  return (JSON.stringify(_o1) === JSON.stringify(_o2));
}

/**
 * Array 相等判断
 * 默认成员: {Object,Array,Number,String,Boolean,null}
 * @returns { true | false }
 */
function _diffArray (a1, a2) {
  if(!_isArray(a1) || !_isArray(a2)) {
    throw new Error(`The param: ${JSON.stringify(a1)} or ${JSON.stringify(a2)} of _diffArray is not a Array`);
  }
  let _a1 = _sortArray(a1);
  let _a2 = _sortArray(a2);
  return (JSON.stringify(_a1) === JSON.stringify(_a2));
}

/**
 * 数组元素查找 - （使用'==='操作符,但可查找引用类型）
 * 默认成员: {Object,Array,Number,String,Boolean}
 * @param { arr: 操作数组对象,  item: 待查找元素, index: 查找的起始索引 }
 * @returns { Number: 元素在第一次在数组中的位置(未找到返回-1) }
 */
function _indexOf (arr, item, index=0) {
  if(!_isArray(arr)) {
    throw new Error('The first param required a Array in _indexOf');
  }
  if(index != 0) {
    arr.splice(0, Number(index));
  }
  let res = -1;
  for(let i = 0; i < arr.length; i++) {
    // 类型不同 - 无需比较继续下一次循环
    if(_typeOf(arr[i]) !== _typeOf(item)) {
      continue;
    } 
    else {
      
      const TYPE = _typeOf(arr[i]);
      if(TYPE === "Object") {
        if(_diffObject(arr[i], item)) {
          res = i;
          break;
        }
      }
      else if(TYPE === "Array") {
        if(_diffArray(arr[i], item)) {
          res = i;
          break;
        }
      }
      // 基本类型比较(包含null,undefined)
      else {
        if(arr[i] === item) {
          res = i;
          break;
        }
      }

    }
  }
  return res;
}


/**
 * Array 去重
 * 默认成员: {Object,Array,Number,String,Boolean}
 */
function _uniqueArray (a) {
  if(!_isArray(a)) {
    throw new Error(`The param: ${a} of _uniqueArray is not a Array`);
  }
  let res = [...new Set(a)]; // 去除重复基本类型值-包含null
  let _m = [];
  res.forEach((item, index, arr) => {
    if(!_isBelongObject(item) || item == null) {
      _m.push(item);
    }
    else if (_isArray(item) || _isObject(item)) {
      if(_indexOf(_m, item) === -1) {
        _m.push(item);
      }
    }
    else {
      throw new Error('Not as expected type in _uniqueArray');
    }
  });
  return _m;
}

module.exports = {
  _isArray,
  _isObject,
  _isBelongObject,
  _typeOf,
  _sortArray,
  _sortObject,
  _diffObject,
  _diffArray,
  _indexOf,
  _uniqueArray
}
