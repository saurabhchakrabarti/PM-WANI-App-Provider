import Filter from 'bad-words';
import { query } from "express-validator";
const filter = new Filter();

const validator = [
  query('wanipdoatoken')
    .trim()
    .notEmpty()
    .contains('|')
    .withMessage('provide a valid wanipdoatoken'),
];

export {
  validator as verifyWaniPdoaValidator
};

