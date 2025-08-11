

export const validation = (schema) => {
  return (req, res, next) => {
    let validationErrors = []
    for (const key of Object.keys(schema)) {

      const result = schema[key].validate(req[key], { abortEarly: false })

      if (result.error) {
        const details = result.error.details.map(err => err.message)
        validationErrors.push(...details);
      }
    }
    if (validationErrors.length) {
      return res.status(400).json({ errors: validationErrors })
    }
    return next();
  };
};




