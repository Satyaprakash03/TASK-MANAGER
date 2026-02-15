import React from "react";

const Infocard = ({ label, value, color }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />
      <p className="text-xs md:text-[14px] text-gray-700">
        <span className="text-md md:text-[15px] text-black font-semibold">
          {value}&nbsp;
        </span>
        &nbsp;{label}
      </p>
    </div>
  );
};

export default Infocard;