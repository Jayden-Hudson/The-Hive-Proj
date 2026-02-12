// validation/itemValidation.js – basic generic validation
// Students will customize rules based on their proposal.

function validateItem(input, { partial = false } = {}) {
  const errors = [];

  // Required fields on create
  if (!partial) {
    if (!input.eventName) errors.push('eventName is required');
    if (!input.eventDate) errors.push('eventDate is required');
    if (!input.eventTime) errors.push('eventTime is required');
  }

  // Types
  if (input.eventName != null && typeof input.eventName !== 'string') {
    errors.push('eventName must be a string');
  }

  if (input.performers != null && typeof input.performers !== 'string') {
      errors.push('performers must be a string');
    }

  if (input.eventDate != null && typeof input.eventDate !== 'string') {
    errors.push('eventDate must be a string');
  }
  if (input.eventTime != null && typeof input.eventTime !== 'string') {
    errors.push('eventTime must be a string');
  }

return { valid: errors.length === 0, errors };
}

module.exports = { validateItem };
