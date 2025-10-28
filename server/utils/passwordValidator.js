export const checkPasswordStrength = (password) => {
  let strength = 0
  
  // Check password length
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Check for lowercase and uppercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  
  // Check for numbers
  if (/\d/.test(password)) strength++
  
  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  
  // Return strength level
  if (strength === 0) return { isValid: false, level: 'very-weak' }
  if (strength <= 2) return { isValid: false, level: 'weak' }
  if (strength <= 3) return { isValid: false, level: 'medium' }
  return { isValid: true, level: 'strong' }
}

export const getPasswordStrengthMessage = (level) => {
  const messages = {
    'very-weak': 'Password is too weak. Must be at least 8 characters.',
    'weak': 'Password is weak. Add uppercase letters, numbers, and special characters.',
    'medium': 'Password is medium strength. Add more characters or special characters for better security.',
    'strong': 'Password is strong.'
  }
  return messages[level] || 'Invalid password'
}