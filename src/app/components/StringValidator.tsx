interface minMaxLength {
    min?: number;
    max?: number;
}

interface passwordComplexity {
    minLength?    : number;
    maxLength?    : number;
    minAlpha?     : number;
    maxAlpha?     : number;
    minNumeric?   : number;
    maxNumeric?   : number;
    minUppercase? : number;
    maxUppercase? : number;
    minLowercase? : number;
    maxLowercase? : number;
    minSpecial?   : number;
    maxSpecial?   : number;
}

export default class StringValidator {

    private value : string;
    private _isValid : boolean;
    private errmsg : string;

    constructor(value : string) {
        this.value    = value;
        this._isValid = true;
        this.errmsg   = ''
    }

    public getValue() : string {
        return (this.value);
    }

    public trim() : StringValidator {
        this.value = this.value.trim();
        return (this);
    } 

    public lCase() : StringValidator {
        this.value = this.value.toLowerCase();
        return (this);
    }

    public uCase() : StringValidator {
        this.value = this.value.toUpperCase();
        return (this);
    }
    
    public isValid() : boolean {
        return (this._isValid);
    }

    public getErrors() : string {
        return (this.errmsg);
    }

    public isNull(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = (this.value === null);
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is null'
            }
        }
        return (this);
    }

    public isUndefined(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = (this.value === undefined);
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is undefined';
            }
        }
        return (this);
    }

    public isNaN(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = isNaN(Number(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is NaN';
            }
        }
        return (this);
    }

    public isValue(value : string, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = (this.value === value);
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value does not match the expected value';
            }
        }
        return (this);
    }

    public isAlpha(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const alphaPattern = /^[a-z]+$/i;   // Matches only alphabetic characters
            this._isValid = (alphaPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value must contain only alphabetic characters';
            }
        }
        return (this);
    }

    public isAlphaNumeric(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const alphaNumericPattern = /^[a-z0-9]+$/i; // Matches alphanumeric characters
            this._isValid = (alphaNumericPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value must contain only alphanumeric characters';
            }
        }
        return (this);
    }

    public isNumeric(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const numericPattern = /^-?\d+(\.\d+)?$/; // Matches integers and decimals, including negative numbers
            this._isValid = (numericPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value must be a numeric value';
            }
        }
        return (this);
    }

    public isInteger(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const integerPattern = /^-?\d+$/; // Matches only integers, including negative numbers
            this._isValid = (integerPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value must be an integer';
            }
        }
        return (this);
    }

    public isFloat(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const floatPattern = /^-?\d+(\.\d+)?$/; // Matches floating-point numbers, including negative numbers
            this._isValid = (floatPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value must be a floating-point number';
            }
        }
        return (this);
    }

    public isBoolean(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const booleanPattern = /^(true|false)$/i; // Matches 'true' or 'false' (case-insensitive)
            this._isValid = (booleanPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value must be a boolean (true or false)';
            }
        }
        return (this);
    }

    public isInRange(min: number, max: number, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const numericValue = parseFloat(this.value);
            this._isValid = !isNaN(numericValue) && numericValue >= min && numericValue <= max;
            if (!this._isValid) {
                this.errmsg = errmsg || `Value must be in the range ${min} to ${max}`;
            }
        }
        return (this);
    }

    public isInArray(list: string[], errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = list.includes(this.value);
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is not in the list of valid values';
            }
        }
        return (this);
    }

     public isInSet(set: Set<string>, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = set.has(this.value);
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is not in the set of valid values';
            }
        }
        return (this);
    }

    public isInMap(map: Map<string, string>, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = map.has(this.value);
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is not in the map of valid values';
            }
        }
        return (this);
    }

   public isRequired(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = (this.value !== '');
            if (!this._isValid) {
                this.errmsg = errmsg || 'Value is required';
            }
        }
        return (this);
    }

    public isEmail(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this._isValid = (emailPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid email address format';
            }
        }
        return (this);
    }

    public isLength({min, max } : minMaxLength, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            if (min) {
                this._isValid = (this.value.length >= min)
                if (!this._isValid) {
                    this.errmsg = errmsg || `Value must be at least ${min} characters long`;
                }
            }
            if (max) {
                this._isValid = (this.value.length <= max);
                if (!this._isValid) {
                    this.errmsg = errmsg || `Value must be at most ${max} characters long`;
                }
            }
        }
        return (this);
    }

    public isMinLength(minLength: number,errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = (this.value.length >= minLength);
            if (!this._isValid) {
                this.errmsg = errmsg || `Value must be at least ${minLength} characters long`;
            }
        }
        return (this);
    }

    public isMaxLength(maxLength: number, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            this._isValid = (this.value.length <= maxLength);
            if (!this._isValid) {
                this.errmsg = errmsg || `Value must be at most ${maxLength} characters long`;
            }
        }
        return (this);
    }

    public isURL(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[\w- .\/?%&=]*)?$/;
            this._isValid = (urlPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid URL format';
            }
        }
        return (this);
    }

    public isIPv4(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            this._isValid = (ipv4Pattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid IPv4 address format';
            }
        }
        return (this);
    }

    public isIPv6(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
            this._isValid = (ipv6Pattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid IPv6 address format';
            }
        }
        return (this);
    }

    public isCIDRv4(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const cidrPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([1-2]?[0-9]|3[0-2])$/;
            this._isValid = (cidrPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid CIDR v4 format';
            }
        }
        return (this);
    }
    public isCIDRv6(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const cidrPattern = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/([0-9]|[12][0-9]|3[0-2])$/;
            this._isValid = (cidrPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid CIDR v6 format';
            }
        }
        return (this);
    }

    public isBase64(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            this._isValid = (base64Pattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid Base64 format';
            }
        }
        return (this);
    }

    public isUUID(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            this._isValid = (uuidPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid UUID format';
            }
        }
        return (this);
    }

    public isUUIDv4(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const uuidv4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            this._isValid = (uuidv4Pattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid UUIDv4 format';
            }
        }
        return (this);
    }

    public isDate(errmsg : string = '',relaxed = false) : StringValidator {
        if (this._isValid) {
            if (relaxed) {
                const relaxedPattern = /^\d{2,4}-\d{1,2}-\d{1,2}$/; // YY{YY}-{M}M-{D}D
                this._isValid = (relaxedPattern.test(this.value));
                if (this._isValid) {
                    const dateParts = this.value.split('-');
                    const year      = parseInt(dateParts[0], 10);
                    const month     = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JavaScript
                    const day       = parseInt(dateParts[2], 10);
                    this.value      = new Date(year, month, day).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
               }
            }

            const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
            this._isValid = (datePattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid date format, expected YYYY-MM-DD';
            }
        }
        return (this);
    }

    public isTime(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // HH:MM:SS
            this._isValid = (timePattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid time format, expected HH:MM:SS or HH:MM:SS.SSS with optional timezone';
            }
        }
        return (this);
    }

    public isDateTime(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/; // ISO 8601 format
            this._isValid = (dateTimePattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid date-time format, expected ISO 8601';
            }
        }
        return (this);
    }

    public isNorthAmericaPhone(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const usaPhonePattern = /^(?:\(?([2-9][0-8][0-9])\)?[-])([2-9][0-9]{2})[-]([0-9]{4})$/; // Matches US phone numbers
            this._isValid = (usaPhonePattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid phone number format';
            }
        }
        return (this);
    }

    public isUKPhone(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const ukPhonePattern = /^(?:\+44|0)(?:\d{10}|\d{4}\s?\d{6}|\d{3}\s?\d{3}\s?\d{4})$/; // Matches UK phone numbers
            this._isValid = (ukPhonePattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid UK phone number format';
            }
        }
        return (this);
    }

    public isZIP(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const zipPattern = /^\d{5}(?:[-\s]\d{4})?$/; // Matches US ZIP codes (5 digits or 5+4 format)
            this._isValid = (zipPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid ZIP code format';
            }
        }
        return (this);
    }

    public isPostalCode(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const postalCodePattern = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/; // Matches Canadian postal codes
            this._isValid = (postalCodePattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid postal code format';
            }
        }
        return (this);
    }
    
    public isSSN(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const ssnPattern = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/; // Matches US Social Security Numbers
            this._isValid = (ssnPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid Social Security Number format';
            }
        }
        return (this);
    }
    
    public isEIN(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const einPattern = /^(?!00|666|9\d{2})\d{2}-(?!00)\d{7}$/; // Matches US Employer Identification Numbers
            this._isValid = (einPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid Employer Identification Number format';
            }
        }
        return (this);
    }
    
    public isCreditCard(errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const creditCardPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/; // Matches major credit card formats
            this._isValid = (creditCardPattern.test(this.value));
            if (!this._isValid) {
                this.errmsg = errmsg || 'Invalid credit card number format';
            }
        }
        return (this);
    }

    public isComplexPassword(params : passwordComplexity, errmsg : string = '') : StringValidator {
        if (this._isValid) {
            const { minLength, maxLength, minAlpha, maxAlpha, minNumeric, maxNumeric, minUppercase, maxUppercase, minLowercase, maxLowercase, minSpecial, maxSpecial } = params;

            if (minLength && this.value.length < minLength) {
                this._isValid = false;
                this.errmsg = errmsg || `Password must be at least ${minLength} characters long`;
            }
            if (maxLength && this.value.length > maxLength) {
                this._isValid = false;
                this.errmsg = errmsg || `Password must be at most ${maxLength} characters long`;
            }

            const alphaPattern     = /[a-zA-Z]/g;
            const numericPattern   = /\d/g;
            const uppercasePattern = /[A-Z]/g;
            const lowercasePattern = /[a-z]/g;
            const specialPattern   = /[!@#$%^&*(),.?":{}|<>]/g;

            const alphaCount       = (this.value.match(alphaPattern)     || []).length;
            const numericCount     = (this.value.match(numericPattern)   || []).length;
            const uppercaseCount   = (this.value.match(uppercasePattern) || []).length;
            const lowercaseCount   = (this.value.match(lowercasePattern) || []).length;
            const specialCount     = (this.value.match(specialPattern)   || []).length;

            if (minAlpha && alphaCount < minAlpha) {
                this.errmsg = errmsg || `Password must contain at least ${minAlpha} alphabetic characters`;
            } else if (maxAlpha && alphaCount > maxAlpha) {
                this.errmsg = errmsg || `Password must contain at most ${maxAlpha} alphabetic characters`;
            } else if (minNumeric && numericCount < minNumeric) {
                this.errmsg = errmsg || `Password must contain at least ${minNumeric} numeric characters`;
            } else if (maxNumeric && numericCount > maxNumeric) {
                this.errmsg = errmsg || `Password must contain at most ${maxNumeric} numeric characters`;
            } else if (minUppercase && uppercaseCount < minUppercase) {
                this.errmsg = errmsg || `Password must contain at least ${minUppercase} uppercase characters`;
            } else if (maxUppercase && uppercaseCount > maxUppercase) {
                this.errmsg = errmsg || `Password must contain at most ${maxUppercase} uppercase characters`;
            } else if (minLowercase && lowercaseCount < minLowercase) {
                this.errmsg = errmsg || `Password must contain at least ${minLowercase} lowercase characters`;
            } else if (maxLowercase && lowercaseCount > maxLowercase) {
                this.errmsg = errmsg || `Password must contain at most ${maxLowercase} lowercase characters`;
            } else if (minSpecial && specialCount < minSpecial) {
                this.errmsg = errmsg || `Password must contain at least ${minSpecial} special characters`;
            } else if (maxSpecial && specialCount > maxSpecial) {
                this.errmsg = errmsg || `Password must contain at most ${maxSpecial} special characters`;
            }

            this._isValid = (this.errmsg === '');
        }
        return (this);
    }
}