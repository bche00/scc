console.log('뭐 해?');

//클릭 사운드
const clickSound = new Audio('/asset/sound/click_sound.mp3');
clickSound.volume = 0.4;

document.addEventListener('click', () => {
  if (!clickSound.paused) return;
  clickSound.currentTime = 0;
  clickSound.play();
});