import React from "react";
import Github from "../assets/github.svg";
import { GITHUB } from "../utils/constants";

const handleClick = (url) => {
  console.log("Clicked on badge to open", url);
  window.open(url, "_blank");
};

function Badge() {
  return (
    <p className="badge">
      <img
        src={Github}
        alt={GITHUB.ALT_TEXT}
        title={GITHUB.TOOLTIP}
        onClick={handleClick.bind(this, GITHUB.REPO_URL)}
      />
    </p>
  );
}

export default Badge;
