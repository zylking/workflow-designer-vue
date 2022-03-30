/**
 * 是否外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 正则表达式，校验大于0的正整数
 * /^[1-9]+$/
 */
export function isPositiveInteger(value) {
  return /^[1-9][0-9]*$/.test(value);
}

/**
 * 正则表达式 校验大于等于0的正整数或者1为小数
 * /^(0|[1-9][0-9]*)(\.[0-9]{1})?$/
 * 一般用到此种校验的地方，如：体温、.....
 */
export function isOneDecimal(value) {
  return /^(0|[1-9][0-9]*)(\.[0-9])?$/.test(value);
}

/**
 * 正则表达式 校验大于等于0的正整数数或者两位小数
 * /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/
 * 一般用到此种校验的地方，如：货币单位、.....
 */
export function isTwoDecimal(value) {
  return /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/.test(value);
}
