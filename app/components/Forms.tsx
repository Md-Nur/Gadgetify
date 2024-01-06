"use client";
import { useRouter } from "next/navigation";
import { ReactNode, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import FormSubmitButton from "./FormSubmitButton";

interface Props {
  children: ReactNode;
  headingName: string;
  method: string;
  apiUrl: string;
  submitName: string;
  // Add any other props here
}

const Forms: React.FC<Props> = ({
  children,
  headingName,
  method,
  apiUrl,
  submitName,
  ...props
}) => {
  const router = useRouter();

  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setPending(true);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    // Handle response if necessary
    const data = await response.json();
    if (data.success) {
      toast.success(data.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      router.push("/");
    } else {
      toast.error(data.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    setPending(false);
  }

  return (
    <section className="flex flex-col items-center justify-center bg-base-200 p-5 md:p-10">
      <h2 className="text-3xl font-bold">{headingName}</h2>
      <form
        className="flex flex-col items-center justify-center  rounded-lg px-5 py-10 md:m-5 w-[80vw] gap-5 bg-base-100"
        method={method}
        onSubmit={onSubmit}
      >
        {children}
        <div className="flex justify-evenly w-full flex-wrap ">
          <input
            type="submit"
            className="btn btn-outline rounded"
            value={submitName || "submit"}
            disabled={pending}
          />
          {pending && (
            <span className="loading loading-infinity loading-md"></span>
          )}
          <input
            type="reset"
            className="btn btn-outline rounded"
            value="Clear"
            disabled={pending}
          />
        </div>
      </form>
    </section>
  );
};

export default Forms;
