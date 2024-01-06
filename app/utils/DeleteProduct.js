"use client";
import Swal from "sweetalert2";

const DeleteProduct = (id) =>  {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/product/${id}`, { method: "DELETE" }).then((data) => {
        if (data.status) {
          Swal.fire({
            title: "Deleted!",
            text: data.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Can't deleted!",
            text: data.message,
            icon: "error",
          });
        }
      });
    }
  });
};

export default DeleteProduct;
