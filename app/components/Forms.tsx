import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  headingName: string;
  action: string;
  method: string;
  // Add any other props here
}

const Forms: React.FC<Props> = ({ children, headingName, action, method }) => {
  return (
    <section className="flex flex-col items-center justify-center bg-base-200 p-5 md:p-10">
      <h2 className="text-3xl font-bold">{headingName}</h2>
      <form
        className="flex flex-col items-center justify-center  rounded-lg px-5 py-10 md:m-5 w-[80vw] gap-5 bg-base-100"
        action={action}
        method={method}
      >
        {children}
      </form>
    </section>
  );
};

export default Forms;
