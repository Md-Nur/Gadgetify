import React from "react";
import Forms from "../components/Forms";

const Props: any = {
  method: "POST",
  headingName: "Customer Information",
  apiUrl: "",
  submitName: "Order Now",
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
        type="tel"
        placeholder="Phone Number"
        className="input input-bordered w-full "
      />
      <fieldset className="p-3 w-full">
        <legend className="text-xl">Select Area</legend>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="radio" value={0} name="isDhaka" className="radio" checked />
            <span className="label-text">Out of Dhaka City</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="radio" value={1} name="isDhaka" className="radio" checked />
            <span className="label-text">In Dhaka City</span>
          </label>
        </div>
      </fieldset>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Delivary Address"
        name="address"
      />
    </Forms>
  );
};

export default OrderForm;
