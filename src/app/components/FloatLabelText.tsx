'use client'

import React from 'react';
import StringValidator from "../components/StringValidator";

interface FloatLabelTextProps {
    id:            string;
    defaultValue?: string;
    prompt:        string;
    val?:          (value: string) => StringValidator;
}

export default function FloatLabelText({ id, prompt, defaultValue, val} : FloatLabelTextProps) : React.JSX.Element {
    const [ value, setValue ] = React.useState<string>(defaultValue || '');
    const [ errorMessage, setErrorMessage ] = React.useState<string>('');

    function validate(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
        if (val) {
            const validator = val(event.target.value);
            setValue(validator.getValue());
            setErrorMessage(validator.getErrors());

            if (validator.isValid()) {
                setValue(validator.getValue());
            }
        }
    }
    
    return(
        <div className="relative mb-4 mt-3">
            <input type="text" id={id} name={id} value={value} defaultValue={defaultValue} className="peer h-10 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" placeholder={prompt} onChange={validate} onBlur={validate} />
            <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-blue-400 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold">
            {prompt}
            </label>
            { errorMessage ? (<div className="text-white bg-red-500 p-2 text-sm mt-1">{errorMessage}</div>) : null }
        </div>
    )
}
