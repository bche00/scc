import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import soundOn from '../../asset/util/sound_on.png';
import soundOff from '../../asset/util/sound_off.png';
import home from '../../asset/util/home.png';
import back from '../../asset/util/back.png';
import { MusicContext } from "../../js/MusicProvider";

export default function Util() {
  const navigate = useNavigate();
  const { isPlaying, toggleMusic } = useContext(MusicContext);

  return (
    <div className="d-flex justify-content-between align-items-end w-100">
      <img
        src={isPlaying ? soundOn : soundOff}
        alt={isPlaying ? "Sound On" : "Sound Off"}
        style={{ cursor: "pointer" }}
        onClick={toggleMusic}
      />

      <Link to="/">
        <img src={home} alt="Home" />
      </Link>

      <img
        src={back}
        alt="Back"
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
