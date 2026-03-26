// validation/itemValidation.js – basic generic validation
// Students will customize rules based on their proposal.

function initAll() {
  console.log("initAll has started...");

  //initialize form checking
  initCheckForm();
}

function validateItem(input, { partial = false } = {}) {
  const errors = [];

  // Required fields on create
  if (!partial) {
    if (!input.title) errors.push('title is required');
    if (!input.description) errors.push('description is required');
    if (!input.eventdate) errors.push('eventdate is required');
    if (!input.eventtime) errors.push('eventtime is required');
    if (!input.venueid) errors.push('venueid is required');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateItem };
