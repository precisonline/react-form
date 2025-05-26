'use client'
import StringValidator from "../components/StringValidator";

export function validateName(value : string) : StringValidator {
    const validator = new StringValidator(value);
    validator.isRequired().isLength({ min: 2, max: 50 });
    return (validator);
}

export function validatePassword(value : string) : StringValidator {
    const validator = new StringValidator(value);
    validator.isRequired().isLength({ min: 6 }).isComplexPassword({ minAlpha: 4, minNumeric: 2, minSpecial: 1 })
    return (validator);
}

export function validateComments(value : string) : StringValidator {
    const validator = new StringValidator(value);
    validator.isRequired();
    return (validator);
}

export function validateEmail(value : string) : StringValidator {
    const validator = new StringValidator(value);
    validator.isRequired().isEmail();
    return (validator);
}

export function validatePhone(value : string) : StringValidator {
    const validator = new StringValidator(value);
    validator.isRequired().isNorthAmericaPhone();
    return (validator);
}