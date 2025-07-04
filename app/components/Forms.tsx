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
  const {userAuth,setUserAuth} = useUserAuth();
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
    await fetch(apiUrl, {
      method: method,
      body: formData,
    })
      .then((res) => res.json())
      .then((jData) => {
        toast.dismiss();
        if(jData.success){
          
          toast.success(jData.message)
        }else{toast.error(jData.errors);}
      });

      let url = apiUrl.split("/"); 
      if (method === "PUT" && url[2] === "product") {
      // /api/product/${params.id}
      router.push(`/products/updated/${url[3]}`);
    }  
    else if (url[4] === "update-admin") {
      if (userAuth.id === resData?.id) {
        setUserAuth({
          id: resData?.id,
          images: resData?.images,
          isAdmin: resData?.isAdmin,
        });
      }
      router.push(`/admin/unverified-members`);
    } // Update user info
    else if (apiUrl.split("/")[2] === "users" && method === "PUT") {
      setUserAuth({
        id: resData?.id,
        images: resData?.images,
        isAdmin: resData?.isAdmin,
      });
      router.push(`/user/profile/${resData.id || ""}`);
    } // Update events
    else if (apiUrl.split("/")[2] === "events" && method === "PUT") {
      router.push(`/activities/updated/${apiUrl.split("/")[3]}`);
    } // Update userAuth after login and sign up
    else if (
      apiUrl === "/api/users/login" ||
      apiUrl === "/api/users/signin"
    ) {
      setUserAuth({
        id: resData?.id,
        images: resData?.images,
        isAdmin: resData?.isAdmin,
      });
      router.push(`/user/profile/${resData.id}`);
    } // Carousel Update
    else if (apiUrl.split("/")[2] === "carousel" && method === "PUT") {
      router.push("/admin");
    }
    toast.success(jsonData.message);
  } else {
    toast.dismiss();
    toast.error(jsonData.errors);
  }

    ref.current?.reset();
    setPending(false);
  }

  return (
    <section className="flex flex-col items-center justify-center bg-base-200 p-2 sm:p-5 md:p-10">
      <h2 className="text-3xl font-bold">{headingName}</h2>
      <form
        ref={ref}
        className="flex flex-col items-center justify-center  rounded-lg px-5 py-10 md:m-5 w-auto mx-auto gap-5 bg-base-100"
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
