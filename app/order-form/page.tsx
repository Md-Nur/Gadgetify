import React from "react";

const OrderForm = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-base-200 p-5 md:p-10">
      <h2 className="text-3xl font-bold">Customer Information</h2>
      <form
        className="flex flex-col items-center justify-center  w-full rounded-lg px-5 py-10 m-5 max-w-lg gap-5 bg-base-100"
        action=""
        method="post"
      >
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
        <div className="p-3 w-full">
          <h4 className="text-xl">Select Area</h4>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="radio"
                name="Dhaka"
                className="radio"
                checked
              />
              <span className="label-text">Out of Dhaka City</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="radio"
                name="Dhaka"
                className="radio"
                checked
              />
              <span className="label-text">In Dhaka City</span>
            </label>
          </div>
        </div>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Delivary Address"
        ></textarea>
        <input className="btn btn-outline rounded" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default OrderForm;
