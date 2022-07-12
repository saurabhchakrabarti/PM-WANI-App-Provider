import Filter from 'bad-words';
import { check } from "express-validator";
const filter = new Filter();

const validator = [
  check('username')
    .trim()
    .notEmpty(),
  check('password')
    .trim()
    .notEmpty()
];

export {
  validator as loginUserValidator
};

