"use client";
import Forms from "@/components/Form";

const Singin = () => {
  const Props: any = {
    headingName: "Register User",
    method: "POST",
    apiUrl: `/api/users/signin`,
    submitName: "Signin",
  };
  return (
    <Forms {...Props}>
      <input
        type="text"
        placeholder="Name"
        name="fullname"
        className="input input-bordered w-full"
        required
      />
      <input
        type="number"
        placeholder="Roll No"
        name="rollNo"
        className="input input-bordered w-full"
        required
      />
      <input
        type="text"
        placeholder="Session"
        name="session"
        className="input input-bordered w-full"
        required
      />
      <label
        htmlFor="year"
        className="flex flex-wrap items-center justify-between w-full px-1 md:px-4 py-1 border rounded"
      >
        Year:
        <select
          name="year"
          id="year"
          className="select select-bordered w-full max-w-sm"
        >
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
          <option>MSc Engg</option>
        </select>
      </label>

      <input
        type="tel"
        placeholder="Phone Number"
        required
        name="phone"
        className="input input-bordered w-full"
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        className="input input-bordered w-full"
      />
      <input
        type="text"
        placeholder="Interests"
        name="interests"
        className="input input-bordered w-full"
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        className="input input-bordered w-full"
        required
      />
      <label
        htmlFor="img"
        className="flex items-center justify-between w-full px-1 md:px-4 py-1 border rounded"
      >
        <span className="hidden sm:inline text-xs md:text-lg">Avatar: </span>
        <input
          type="file"
          name="images"
          className="file-input w-full mx-5 rounded max-h-10 file-input-success"
          accept="image/png, image/jpeg"
          id="img"
        />
      </label>
    </Forms>
  );
};

export default Singin;
