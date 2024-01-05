import React from "react";
import Forms from "../components/Forms";

const Props: any = {
  action: "",
  method: "POST",
  headingName: "Customer Information",
};
const OrderForm = () => {
  return (
    <Forms {...Props}>
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full "
      />
      <input
        type="number"
        placeholder="Phone Number"
        className="input input-bordered w-full "
      />
      <fieldset className="p-3 w-full">
        <legend className="text-xl">Select Area</legend>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="radio" name="Dhaka" className="radio" checked />
            <span className="label-text">Out of Dhaka City</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="radio" name="Dhaka" className="radio" checked />
            <span className="label-text">In Dhaka City</span>
          </label>
        </div>
      </fieldset>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Delivary Address"
      />
      <input className="btn btn-outline rounded" type="submit" value="Submit" />
    </Forms>
  );
};

export default OrderForm;
