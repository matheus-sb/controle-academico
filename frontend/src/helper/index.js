const storage = window.sessionStorage
let helper = {}

/**
 * localStorage
 */
helper.ls = {
  set (key, value) {
    value = JSON.stringify(value)
    storage.setItem(key, value)
  },
  get (key, defaultValue) {
    let value = storage.getItem(key, value)
    if (value === null || value === 'undefined' || value === '') {
      value = defaultValue
    } else {
      value = JSON.parse(value)
    }
    return value
  }
}
/**
 * a wrapper for helper.ls
 */
helper.store = (key, value) => {
  if (arguments.length < 2) {
    return helper.ls.get(key)
  } else {
    return helper.ls.set(key, value)
  }
}

helper.parseErrors = errors => {
  return _.map(errors, error => {
    return { message: error.value }
  })
}

helper.parseFormErrors = errors => {
  const parsedErrors = []
  for (var fieldErrors in errors) {
    var formattedFieldErros = _.map(errors[fieldErrors], erro => ({message: erro}))
    parsedErrors.push(...formattedFieldErros)
  }
  return parsedErrors
}

export default helper
