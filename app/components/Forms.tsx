"use client";
import { ReactNode, FormEvent, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../context/userContext";

interface Props {
  children: ReactNode;
  headingName: string;
  method: string;
  apiUrl: string;
  submitName: string;
  className?: string;
  onSuccess?: () => void;
  // Add any other props here
}

const Forms: React.FC<Props> = ({
  children,
  headingName,
  method,
  apiUrl,
  submitName,
  onSuccess,
  ...props
}) => {
  const { userAuth, setUserAuth } = useUserAuth();
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

    toast.loading("Uploading product...");
    const response = await fetch(apiUrl, {
      method: method,
      body: formData,
    });
    const jData = await response.json();
    toast.dismiss();

    if (jData.success) {
      toast.success(jData.message);
      const resData = jData.data;

      let url = apiUrl.split("/");
      if (method === "PUT" && url[2] === "product") {
        router.push(`/products/updated/${url[3]}`);
      } else if (url[4] === "update-admin") {
        if (userAuth.id === resData?.id) {
          setUserAuth({
            id: resData?.id || "",
            name: resData?.name || userAuth.name || "",
            phone: resData?.phone || userAuth.phone || "",
            address: resData?.address || userAuth.address || "",
            images: resData?.images || "",
            isAdmin: resData?.isAdmin || false,
          });
        }
        router.push(`/admin/unverified-members`);
      } else if (url[2] === "users" && method === "PUT") {
        setUserAuth({
          id: resData?.id || "",
          name: resData?.name || "",
          phone: resData?.phone || "",
          address: resData?.address || "",
          images: resData?.images || "",
          isAdmin: resData?.isAdmin || false,
        });
        router.push("/user/profile");
      } else if (
        apiUrl === "/api/users/login" ||
        apiUrl === "/api/users/signin"
      ) {
        setUserAuth({
          id: resData?.id || "",
          name: resData?.name || "",
          phone: resData?.phone || "",
          address: resData?.address || "",
          images: resData?.images || "",
          isAdmin: resData?.isAdmin || false,
        });
        router.push("/user/profile");
      } else if (url[2] === "carousel" && method === "PUT") {
        router.push("/admin");
      }

      if (onSuccess) onSuccess();
    } else {
      toast.error(jData.errors);
    }

    ref.current?.reset();
    setPending(false);
  }

  // Check if className is passed in props to override default width
  const formClassName = props.className || "flex flex-col items-center justify-center rounded-lg px-5 py-10 md:m-5 w-auto mx-auto gap-5 bg-base-100";

  return (
    <section className="flex flex-col items-center justify-center bg-base-200 p-2 sm:p-5 md:p-10">
      <h2 className="text-3xl font-bold mb-6">{headingName}</h2>
      <form
        ref={ref}
        className={formClassName}
        method={method}
        onSubmit={onSubmit}
      >
        {children}
        <div className="flex justify-evenly w-full flex-wrap mt-6">
          <button className="btn btn-primary px-8 rounded-lg" disabled={pending}>
            <input type="submit" value={submitName || "submit"} className="cursor-pointer" />
            {pending && (
              <span className="loading loading-spinner loading-md ml-2"></span>
            )}
          </button>
          <input
            type="reset"
            className="btn btn-outline px-8 rounded-lg"
            value="Clear"
            disabled={pending}
          />
        </div>
      </form>
    </section>
  );
};

export default Forms;
