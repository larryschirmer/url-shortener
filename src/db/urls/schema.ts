import * as yup from 'yup';

export default yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});