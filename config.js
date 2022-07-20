const port = process.env.PORT;
const validatorKey = process.env.VALIDATOR_KEY;
const hcaptchaSecret = process.env.HCAPTCHA_SECRET;

module.exports = { port, validatorKey, hcaptchaSecret };
