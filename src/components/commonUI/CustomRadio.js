import React from "react";
import selectedIcon from "../../asset/util/radio_sel.png"; // 선택된 상태
import unselectedIcon from "../../asset/util/radio_none.png"; // 선택 안 된 상태

export default function CustomRadio({ name, value, selectedValue, onChange, label }) {
  return (
    <label>
      <img
        src={value === selectedValue ? selectedIcon : unselectedIcon}
        alt={value === selectedValue ? "Selected" : "Unselected"}
        onClick={() => onChange(value)}
      />
      <span>{label}</span>
    </label>
  );
}
