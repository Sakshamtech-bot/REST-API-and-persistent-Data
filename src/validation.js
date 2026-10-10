const allowedStatuses = [
  "applied",
  "interview",
  "selected",
  "rejected"
];

function validateInternship(data) {
  const errors = {};

  if (!data.title || typeof data.title !== "string") {
    errors.title = "Title is required";
  }

  if (!data.company || typeof data.company !== "string") {
    errors.company = "Company is required";
  }

  if (!data.location || typeof data.location !== "string") {
    errors.location = "Location is required";
  }

  if (!data.startDate || typeof data.startDate !== "string") {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate || typeof data.endDate !== "string") {
    errors.endDate = "End date is required";
  }

  if (
    data.stipend !== undefined &&
    data.stipend !== null &&
    (typeof data.stipend !== "number" || data.stipend < 0)
  ) {
    errors.stipend = "Stipend must be a positive number";
  }

  if (
    data.status !== undefined &&
    !allowedStatuses.includes(data.status)
  ) {
    errors.status =
      "Status must be applied, interview, selected or rejected";
  }
    
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  validateInternship,
  allowedStatuses
};