import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import soundOn from "../asset/util/sound_on.png";
import soundOff from "../asset/util/sound_off.png";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const publicAudioRef = useRef(null);
  const exploreAudioRef = useRef(null);

  // 1. 저장된 재생 상태 불러오기 (초기값: true)
  const [isPlaying, setIsPlaying] = useState(() => {
    const stored = localStorage.getItem("isPlaying");
    return stored === null ? true : stored === "true";
  });

  const [currentTrack, setCurrentTrack] = useState("public");

  // 공용 음악 초기화
  useEffect(() => {
    const publicAudio = new Audio("/asset/sound/public_music.mp3");
    publicAudio.loop = true;
    publicAudio.volume = 0.4;
    publicAudioRef.current = publicAudio;

    return () => {
      publicAudio.pause();
    };
  }, []);

  useEffect(() => {
    const handleFirstClick = () => {
      if (isPlaying) {
        if (currentTrack === "explore" && exploreAudioRef.current) {
          exploreAudioRef.current.play().catch(() => {});
        } else if (currentTrack === "public" && publicAudioRef.current) {
          publicAudioRef.current.play().catch(() => {});
        }
      }

      document.removeEventListener("click", handleFirstClick);
    };

    document.addEventListener("click", handleFirstClick);

    return () => {
      document.removeEventListener("click", handleFirstClick);
    };
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (currentPath === "/explore") {
      if (!exploreAudioRef.current) {
        const exploreAudio = new Audio("/asset/sound/explore_music.mp3");
        exploreAudio.loop = true;
        exploreAudio.volume = 0.4;
        exploreAudioRef.current = exploreAudio;
      }

      publicAudioRef.current?.pause();
      setCurrentTrack("explore");
    } else {
      exploreAudioRef.current?.pause();
      if (isPlaying) {
        setCurrentTrack("public");
      }
    }
  }, [currentPath]);

  // 2. 음악 토글 시 로컬스토리지에 저장
  const toggleMusic = () => {
    if (currentTrack === "explore" && exploreAudioRef.current) {
      if (isPlaying) {
        exploreAudioRef.current.pause();
      } else {
        exploreAudioRef.current.play().catch(() => {});
      }
    } else if (currentTrack === "public" && publicAudioRef.current) {
      if (isPlaying) {
        publicAudioRef.current.pause();
      } else {
        publicAudioRef.current.play().catch(() => {});
      }
    }

    const newState = !isPlaying;
    setIsPlaying(newState);
    localStorage.setItem("isPlaying", String(newState)); // 저장
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}

      {currentPath === "/explore" && (
        <img
          src={isPlaying ? soundOn : soundOff}
          alt="toggle sound"
          onClick={toggleMusic}
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 9999,
          }}
        />
      )}
    </MusicContext.Provider>
  );
};

