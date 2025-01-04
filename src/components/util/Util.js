import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import soundOn from '../../asset/util/sound_on.png';
import home from '../../asset/util/home.png';
import back from '../../asset/util/back.png';

export default function Util() {
  const navigate = useNavigate();

  return (
    <div className='d-flex justify-content-between align-items-end w-100 mb-2'>
      <img src={soundOn} alt="Sound On" />

      <Link to="/">
        <img src={home} alt="Home" />
      </Link>

      <img src={back} alt="Back"
      onClick={() => navigate(-1)}
      style={{cursor: "pointer"}}/>
    </div>
  );
}
