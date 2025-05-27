'use client'

import React              from 'react';
import FloatLabelPassword from './components/FloatLabelPassword';
import FloatLabelSelect   from './components/FloatLabelSelect';
import FloatLabelText     from './components/FloatLabelText';
import FloatLabelTextArea from './components/FloatLabelTextArea';
import { CustomerSchema, CustomerType } from './validation/CustomerValidation';
import { SubmitHandler, useForm }       from 'react-hook-form';
import { zodResolver }    from '@hookform/resolvers/zod';

export default function Home() {
  const { control, handleSubmit } = useForm<CustomerType, any, CustomerType>({
    resolver: zodResolver(CustomerSchema),
    mode: 'onChange'
  });

  const onSubmit : SubmitHandler<CustomerType> = (data) => {
    console.log(data);
  }
  
  const states = {"" : "","AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois",
    "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana",
    "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan",
    "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana",
    "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
    "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota",
    "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania",
    "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota",
    "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
    "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin",
    "WY": "Wyoming"};

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
