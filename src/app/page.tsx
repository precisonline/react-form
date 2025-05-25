import FloatLabelPassword from './components/FloatLabelPassword';
import FloatLabelSelect   from './components/FloatLabelSelect';
import FloatLabelText     from './components/FloatLabelText';
import FloatLabelTextArea from './components/FloatLabelTextArea';
import * as v             from './validation/CustomerValidation';
import StringValidator    from './components/StringValidator';
import React              from 'react';

export default function Home() {
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
      <form className="flex flex-col p-4">
        <FloatLabelText     id="name"     prompt="Name"          val={v.validateName}      />
        <FloatLabelPassword id="password" prompt="Password"      val={v.validatePassword}  />
        <FloatLabelText     id="addr"     prompt="Address"                                 />
        <FloatLabelText     id="city"     prompt="City"                                    />
        <FloatLabelSelect   id="state"    prompt="State"    values={states}                />
        <FloatLabelText     id="zip"      prompt="Postal Code"                             />
        <FloatLabelText     id="email"    prompt="Email Address" val={v.validateEmail}     />
        <FloatLabelText     id="phone"    prompt="Phone Number"  val={v.validatePhone}     />
        <FloatLabelTextArea id="comments" prompt="Comments"      val={v.validateComments}  />
        <input type="Submit" className="p-3 bg-blue-600 br-2 text-white bold
         text-rounded-md" />
      </form>
      </div>
    </>
  );
}
