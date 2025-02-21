import React, { useState } from "react";
import { exploreLocations } from "./exploreData";
import { performExploration } from "./exploreLogic";
import style from "./explore.module.scss";
import TextDone from "../../asset/util/text_done.gif";

export default function Explore({ location = "과학실" }) {
  const [result, setResult] = useState("");

  const handleExplore = () => {
    setResult(performExploration());
  };

  return (
    <div className={style.container}>
      <div className={style.where}>{location}</div>
      <div className={style.imgBox}>
        <img src={exploreLocations[location].image} alt={location} />
      </div>
      <div className={style.textBox}>
        <p>{result || exploreLocations[location].description}</p>
        <button onClick={handleExplore}>조사하기</button>
        <img src={TextDone} alt="Text done" />
      </div>
    </div>
  );
}
