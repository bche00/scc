console.log('뭐 해?');

// 클릭 사운드
const clickSound = new Audio('/asset/sound/click_sound.mp3');
clickSound.volume = 0.4;

document.addEventListener('click', () => {
  if (!clickSound.paused) return;
  clickSound.currentTime = 0;
  clickSound.play();
});

// 100vh 모바일 ui(주소창, 하단바 등)에따라 유동적으로
const updateViewportHeight = () => {
  const vh = window.innerHeight * 0.01; // 1vh에 해당하는 값 계산
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// 초기 설정
updateViewportHeight();

// 화면 크기 변경 시 업데이트
window.addEventListener("resize", updateViewportHeight);
