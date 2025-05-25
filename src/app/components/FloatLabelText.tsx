'use client'

import React from 'react';

type validateFunction = {
    (value: string): string;
}

interface FloatLabelTextProps {
    id: string;
    defaultValue?: string;
    prompt: string;
    val?: validateFunction;
}

export default function FloatLabelText({ id, prompt, defaultValue, val} : FloatLabelTextProps) : React.JSX.Element {
    const [ errorMessage, setErrorMessage ] = React.useState<string>('');
    function validate(event: React.ChangeEvent<HTMLInputElement>) {
        if (val) {
            const errmsg = val(event.target.value);
            setErrorMessage(errmsg);
        }
    }
    
    return(
        <div className="relative mb-4 mt-3">
            <input type="text" id={id} name={id} defaultValue={defaultValue} className="peer h-10 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" placeholder={prompt} onChange={validate} onBlur={validate} />
            <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-blue-400 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold">
            {prompt}
            </label>
            { errorMessage ? (<div className="text-white bg-red-500 p-2 text-sm mt-1">{errorMessage}</div>) : null }
        </div>
    )
}