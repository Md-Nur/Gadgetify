import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow card place-items-center">{children}</div>
      <div className="divider lg:divider-horizontal"></div>
      <aside className="hidden lg:grid flex-grow card place-items-center">
        <Sidebar />
      </aside>
    </main>
  );
};

export default layout;
