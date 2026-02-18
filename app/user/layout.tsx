"use client";
import { ReactNode } from "react";
import Drawer from "@/app/components/Drawer";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Drawer>
      <main className="flex flex-col w-full lg:flex-row min-h-screen">
        <div className="flex-grow p-4">{children}</div>
      </main>
    </Drawer>
  );
};

export default layout;
