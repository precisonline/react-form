'use client'

import React              from 'react';
import FloatLabelPassword from './components/FloatLabelPassword';
import FloatLabelSelect   from './components/FloatLabelSelect';
import FloatLabelText     from './components/FloatLabelText';
import FloatLabelTextArea from './components/FloatLabelTextArea';
import { CustomerSchema, CustomerType } from './validation/CustomerValidation';
import { SubmitHandler, useForm }       from 'react-hook-form';
import { zodResolver }    from '@hookform/resolvers/zod';
import { states }         from './data/states';
import { useSearchParams } from 'next/navigation';

export default function Home() {

  const searchParams = useSearchParams(); /* for reading URLs */
  
  const record = {
    name    : 'Testing',
    password: 'abcdef45!!',
    addr    : 'address',
    city    : 'city',
    state   : 'IN',
    zip     : '47150',
    email   : 'email@email.com',
    phone   : '303-651-7050',
    comments: 'testing'
  }
  const { control, handleSubmit } = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    mode: 'onChange',
    defaultValues: record
  });

  const onSubmit : SubmitHandler<CustomerType> = (data) => {
    console.log(data);
  }
  
  return (
    <>
      <div className="p-[2rem]">
      <h1 className="text-[2rem]">Customer Entry</h1>
      <form className="flex flex-col p-4" onSubmit={handleSubmit(onSubmit)} > 
        <FloatLabelText     id="name"     prompt="Name"          control={control} />
        <FloatLabelPassword id="password" prompt="Password"      control={control} />
        <FloatLabelText     id="city"     prompt="City"          control={control} />
        <FloatLabelText     id="addr"     prompt="Address"       control={control} />
        <FloatLabelSelect   id="state"    prompt="State"         control={control} values={states} />
        <FloatLabelText     id="zip"      prompt="Postal Code"   control={control} />
        <FloatLabelText     id="email"    prompt="Email Address" control={control} />
        <FloatLabelText     id="phone"    prompt="Phone Number"  control={control} />
        <FloatLabelTextArea id="comments" prompt="Comments"      control={control} />
        <button type="submit" className="p-3 bg-blue-600 br-2 text-white bold text-rounded-md">Submit</button>
      </form>
      </div>
    </>
  );
}
