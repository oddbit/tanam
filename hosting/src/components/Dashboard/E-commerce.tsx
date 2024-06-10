"use client";
import React from "react";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import ChatCard from "@/components/Chat/ChatCard";
import CardDataStats from "@/components/CardDataStats";
import MapOne from "@/components/Maps/MapOne";

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <span className="i-ic-outline-remove-red-eye text-primary w-[24px] h-[24px]" />
        </CardDataStats>
        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <span className="i-ic-outline-shopping-cart text-primary w-[24px] h-[24px]" />
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <span className="i-ic-outline-shopping-bag text-primary w-[24px] h-[24px]" />
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <span className="i-ic-outline-group text-primary w-[24px] h-[24px]" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
