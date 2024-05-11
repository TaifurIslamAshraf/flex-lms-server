import Joi from 'joi';

// Joi schema for UserName
const userNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .required()
    .regex(/^[A-Z][a-zA-Z]*$/)
    .message('First Name must start with an uppercase letter and contain only letters.'),
  middleName: Joi.string(),
  lastName: Joi.string()
    .trim()
    .max(20)
    .required()
    .regex(/^[A-Za-z]+$/)
    .message('Last Name must contain only letters.'),
});

// Joi schema for Guardian
const guardianSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherContactNo: Joi.string().required(),
  motherOccupation: Joi.string().required(),
}).required();

// Joi schema for Student
const joyStudentValidationSchema = Joi.object({
  password: Joi.string().max(20).message("Password can't be more than 20 characters!"),
  student: {
    name: userNameSchema.required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid('Male', 'Female').required(),
    dateOfBirth: Joi.date(),
    contactNo: Joi.string().required(),
    bloodGroup: Joi.string().valid('A', 'B', 'AB', 'O', 'Rh+', 'Rh-'),
    presentAddress: Joi.string(),
    permanentAddress: Joi.string(),
    guardian: guardianSchema,
    admissionSemester: Joi.string().required(),
    academicDepartment: Joi.string().required(),
    // avatar: Joi.string(),
  }
})

// Joi schema for UserName
const UpdateUserNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/)
    .message('First Name must start with an uppercase letter and contain only letters.'),
  middleName: Joi.string().allow(''),
  lastName: Joi.string()
    .trim()
    .max(20)
    .regex(/^[A-Za-z]+$/)
    .message('Last Name must contain only letters.'),
});

// Joi schema for Guardian
const updateGuardianSchema = Joi.object({
  fatherName: Joi.string().allow(''),
  fatherOccupation: Joi.string().allow(''),
  fatherContactNo: Joi.string().allow(''),
  motherName: Joi.string().allow(''),
  motherContactNo: Joi.string().allow(''),
  motherOccupation: Joi.string().allow(''),
});

// Joi schema for Student
const updateJoyStudentValidationSchema = Joi.object({
  password: Joi.string().max(20).allow('').message("Password can't be more than 20 characters!"),
  student: Joi.object({
    name: UpdateUserNameSchema.allow(null),
    email: Joi.string().email().allow(''),
    gender: Joi.string().valid('Male', 'Female').allow(''),
    dateOfBirth: Joi.date().allow(null),
    contactNo: Joi.string().allow(''),
    bloodGroup: Joi.string().valid('A', 'B', 'AB', 'O', 'Rh+', 'Rh-').allow(''),
    presentAddress: Joi.string().allow(''),
    permanentAddress: Joi.string().allow(''),
    guardian: updateGuardianSchema,
    admissionSemester: Joi.string().allow(''),
    academicDepartment: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
  }).allow(null),
});

export { joyStudentValidationSchema, updateJoyStudentValidationSchema };
