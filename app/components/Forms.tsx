"use client";
import { ReactNode, FormEvent, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!formData) {
      throw Error("There have no form data: " + formData);
    }
    // await toast.promise(
    //   fetch(apiUrl, {
    //     method: method,
    //     body: formData,
    //   }),
    //   {
    //     pending: "Processing request",
    //     success: "Success👌",
    //     error: "There is a problem to processing the request 🤯",
    //   }
    // );
    toast.loading("Uploading product...");
    await fetch(apiUrl, {
      method: method,
      body: formData,
    })
      .then((res) => res.json())
      .then((jData) => {
        toast.dismiss();
        jData.success
          ? toast.success(jData.message)
          : toast.error(jData.errors);
      });

    if (method === "PUT") {
      let url = apiUrl.split("/"); // /api/product/${params.id}
      router.push(`/products/updated/${url[3]}`);
    }

    ref.current?.reset();
    setPending(false);
  }

  return (
    <section className="flex flex-col items-center justify-center bg-base-200 p-2 sm:p-5 md:p-10">
      <h2 className="text-3xl font-bold">{headingName}</h2>
      <form
        ref={ref}
        className="flex flex-col items-center justify-center  rounded-lg px-5 py-10 md:m-5 w-[80vw] gap-5 bg-base-100"
        method={method}
        onSubmit={onSubmit}
      >
        {children}
        <div className="flex justify-evenly w-full flex-wrap ">
          <button className="btn btn-outline rounded" disabled={pending}>
            <input type="submit" value={submitName || "submit"} />
            {pending && (
              <span className="loading loading-infinity loading-md"></span>
            )}
          </button>
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
