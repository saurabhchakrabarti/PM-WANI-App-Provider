import Filter from 'bad-words';
import { check } from "express-validator";
const filter = new Filter();

const validator = [
  check('email')
    .trim()
    .optional()
    .isEmail()
    .isLength({ min: 7, max: 320 })
    .withMessage('provide a valid email address'),
  check('firstName')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 50 }),
  check('lastName')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 50 }),
  check('phone')
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 15 })
    .isMobilePhone('en-IN')
    .withMessage(
      'provide a password with 7 letters that does not contain the word password'
    ),
  check('username')
    .trim()
    .notEmpty(),
  check('password')
    .trim()
    .notEmpty()
];

export {
  validator as createUserValidator
};

