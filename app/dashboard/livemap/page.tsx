import MapPage from "@/components/ui/live-map";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="lg:w-[97.7%] w-[93%]">
      <MapPage preview={false} />
    </div>
  );
};

export default page;
