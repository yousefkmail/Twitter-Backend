class FieldError extends Error {
  message;
  field;
  constructor(field, message) {
    super(message);
    this.field = field;
    this.message = message;
  }
}

module.exports = FieldError;
