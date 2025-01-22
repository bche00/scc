import React from "react";
import checkedIcon from "../../asset/util/check_sel.png"; 
import uncheckedIcon from "../../asset/util/check_none.png";

export default function CustomCheckbox({ checked, onChange, label }) {
  return (
    <label>
      <img
        className="me-2"
        src={checked ? checkedIcon : uncheckedIcon}
        alt={checked ? "Checked" : "Unchecked"}
        onClick={() => onChange(!checked)}/>
      <span>{label}</span>
    </label>
  );
}
