"use client";
import { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: ReactNode;
  className?: string;
} & ComponentProps<"button">;

const FormSubmitButton = ({
  children,
  className,
  ...props
}: FormSubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      className={`btn btn-outline rounded ${className}`}
      disabled={pending}
    >
      {pending && <span className="loading loading-infinity loading-md" />}
      {children}
    </button>
  );
};

export default FormSubmitButton;
