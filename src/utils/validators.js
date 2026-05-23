export const validators = {
  // Email validation
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  // Phone number validation (Indonesia)
  phone: (phone) => {
    const regex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/
    return regex.test(phone)
  },

  // NIM validation (UNIKOM format)
  nim: (nim) => {
    const regex = /^[0-9]{8,10}$/
    return regex.test(nim)
  },

  // URL validation
  url: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Required field
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  },

  // Min length
  minLength: (value, length) => {
    return String(value).length >= length
  },

  // Max length
  maxLength: (value, length) => {
    return String(value).length <= length
  },

  // Match value
  match: (value1, value2) => {
    return value1 === value2
  },

  // Date validation
  date: (date) => {
    return !isNaN(new Date(date).getTime())
  },

  // Future date
  futureDate: (date) => {
    return new Date(date) > new Date()
  },

  // Past date
  pastDate: (date) => {
    return new Date(date) < new Date()
  }
}

export const validateForm = (data, rules) => {
  const errors = {}

  Object.keys(rules).forEach(field => {
    const value = data[field]
    const fieldRules = rules[field]

    for (const rule of fieldRules) {
      let isValid = true
      let errorMessage = ''

      if (rule === 'required') {
        isValid = validators.required(value)
        errorMessage = `${field} wajib diisi`
      } else if (rule.validator) {
        isValid = rule.validator(value)
        errorMessage = rule.message
      }

      if (!isValid) {
        errors[field] = errorMessage
        break
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}