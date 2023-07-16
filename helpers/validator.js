import Joi from 'joi'
const validate = (schema) => (payload) =>
  schema.validate(payload, { abordEarly: false });


const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

export const ValidateLogin = validate(LoginSchema)
