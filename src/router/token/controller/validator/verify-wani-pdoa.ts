import Filter from 'bad-words';
import { param } from "express-validator";
const filter = new Filter();

const validator = [
  param('wanipdoatoken')
    .trim()
    .notEmpty()
    .contains('|')
    .withMessage('provide a valid wanipdoatoken'),
];

export {
  validator as verifyWaniPdoaValidator
};

