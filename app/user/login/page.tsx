"use client";
import Forms from "@/app/components/Forms";

const Login = () => {
  const Props: any = {
    headingName: "Login Member",
    method: "POST",
    apiUrl: `/api/users/login`,
    submitName: "Login",
  };
  return (
    <Forms {...Props} >
      <input
        type="tel"
        placeholder="Phone Number"
        name="phone"
        className="input input-bordered w-full"
        autoComplete="off"
        required
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        className="input input-bordered w-full mb-12"
        required

      />
    </Forms>
  );
};

export default Login;
