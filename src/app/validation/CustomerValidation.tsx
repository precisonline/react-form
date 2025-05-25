'use client'
import StringValidator from "../components/StringValidator";

export function validateName(value : string) : string {
    const validator = new StringValidator(value);
    validator.isRequired().isAlpha().isLength({ min: 2, max: 50 });
    return (validator.getErrors());
}

export function validatePassword(value : string) : string {
    const validator = new StringValidator(value);
    validator.isRequired().isLength({ min: 6 }).isComplexPassword({ minAlpha: 4, minNumeric: 2, minSpecial: 1 });
    return (validator.getErrors());
}

export function validateComments(value : string) : string {
    const validator = new StringValidator(value);
    validator.isRequired();
    return (validator.getErrors());
}

export function validateEmail(value : string) : string {
    const validator = new StringValidator(value);
    validator.isRequired().isEmail();
    return (validator.getErrors());
}

export function validatePhone(value : string) : string {
    const validator = new StringValidator(value);
    validator.isRequired().isNorthAmericaPhone();
    return (validator.getErrors());
}