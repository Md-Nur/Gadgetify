"use client";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
const DeleteProductButton = ({ id }) => {
  const router = useRouter();
  const path = usePathname();

  const handleDelete = () => {
    toast
      .promise(fetch(`/api/product/${id}`, { method: "DELETE" }), {
        pending: "Product is deleting",
        success: "Product deleted 👌",
        error: "Product can't deleted 🤯",
      })
      .then(() => {
        if (path !== "/") {
          router.push("/");
        }
      });
  };
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-error"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Delete Product
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
          Are you sure?
          </h3>
          <p>You won&apos;t be able to revert this!</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={handleDelete} className="btn btn-error mx-5 rounded">
                Delete
              </button>
              <button className="btn mx-5 rounded">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteProductButton;
