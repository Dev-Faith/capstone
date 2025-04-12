import MapPage from "@/components/ui/live-map";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <MapPage preview={false} />
    </div>
  );
};

export default page;
