import { query } from "express-validator";

const validator = [
  query('cpUrl')
    .trim()
    .notEmpty()
    .isURL()
    .withMessage('provide a valid captive portal url'),
];

export {
  validator as passWaniapptokenValidator
};

