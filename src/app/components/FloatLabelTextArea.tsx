'use client'

import React from 'react';

interface FloatLabelTextAreaProps {
    id: string;
    prompt: string;
    defaultValue?: string;
    val?: (value: string) => string;
}

export default function FloatLabelTextArea({ id, prompt, defaultValue, val } : FloatLabelTextAreaProps) : React.JSX.Element {
    const [ errorMessage, setErrorMessage ] = React.useState<string>('');
    function validate(event: React.ChangeEvent<HTMLTextAreaElement>) {
        if (val) {
            const errmsg = val(event.target.value);
            setErrorMessage(errmsg);
        }
    }    
    
    return(
        <div className="relative mb-4 mt-3">
            <textarea id={id} name={id} className="peer h-50 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" placeholder={prompt} onChange={validate} onBlur={validate} defaultValue={defaultValue}/>
            <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-blue-400 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1">
            {prompt}
            </label>
        </div>
    )
}