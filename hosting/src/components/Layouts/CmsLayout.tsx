"use client";
import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {useAuthentication} from "@/hooks/useAuthentication";
import "flatpickr/dist/flatpickr.min.css";
import React, {useState} from "react";

export default function CmsLayout({children}: {children: React.ReactNode}) {
  useAuthentication();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="l-default">
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex h-screen overflow-hidden">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* <!-- ===== Header Start ===== --> */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </div>
    </>
  );
}
