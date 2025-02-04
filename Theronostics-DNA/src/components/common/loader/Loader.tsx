import React from "react";
import ReactLoding from "react-loading";

const Loader = () => {
  return (
    <div className="loading-screen">
      <ReactLoding type={"bars"} color={"#75AC71"} height={100} width={100} />
    </div>
  );
};

export default Loader;
