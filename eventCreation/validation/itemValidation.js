// validation/itemValidation.js – basic generic validation
// Students will customize rules based on their proposal.

function validateItem(input, { partial = false } = {}) {
  const errors = [];

  // Required fields on create
  if (!partial) {
    if (!input.title) errors.push('title is required');
    if (!input.description) errors.push('description is required');
    if (!input.eventDate) errors.push('eventDate is required');
    if (!input.eventTime) errors.push('eventTime is required');
    if (!input.venueID) errors.push('venueID is required');
  }

  // Types
  if (input.title != null && typeof input.title !== 'string') {
    errors.push('title must be a string');
  }

  if (input.description != null && typeof input.description !== 'string') {
    errors.push('description must be a string');
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
