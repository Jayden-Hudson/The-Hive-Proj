// validation/itemValidation.js – basic generic validation
// Students will customize rules based on their proposal.

function validateItem(input, { partial = false } = {}) {
  const errors = [];

  // Required fields on create
  if (!partial) {
    if (!input.eventName) errors.push('eventName is required');
  }

  // Types
  if (input.eventName != null && typeof input.eventName !== 'string') {
    errors.push('eventName must be a string');
  }

  if (input.eventPerformers != null && typeof input.eventPerformers !== 'string') {
      errors.push('eventPerformers must be a string');
    }

return { valid: errors.length === 0, errors };
}

module.exports = { validateItem };
