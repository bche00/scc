export const exploreLocations = {
  "과학실": {
    image: "/asset/locations/science_lab.png",
    description: "실험 기구들이 어질러져 있다. 무언가를 찾을 수 있을까?"
  },
  "도서관": {
    image: "/asset/locations/library.png",
    description: "책들이 가득한 공간. 누군가 중요한 단서를 남겼을지도 모른다."
  },
  "방송실": {
    image: "/asset/locations/broadcast_room.png",
    description: "여러 방송 기기들이 구비되어있다. 서늘한 기운이 감돈다.",
    choices: ["모니터를 살펴본다.", "마이크를 살펴본다."],
    event: true  // 추가 이벤트 발생 가능 장소
  }
};

export const exploreResults = {
  success1: {
    text: "…반짝이는 무언가가 떨어졌다.",
    rewards: [
      { item: "코인", probability: 0.6, amount: 1 },
      { item: "코인", probability: 0.3, amount: 2 },
      { item: "코인", probability: 0.1, amount: 3 }
    ]
  },
  success2: {
    text: "…툭, 하는 소리와 함께 무언가가 떨어졌다.",
    rewards: [
      { item: "쪽지", probability: 0.5 },
      { item: "포츈쿠키", probability: 0.5 }
    ]
  },
  success3: {
    text: "…둔탁한 소리와 함께 무언가가 떨어졌다.",
    rewards: [
      { item: "랜덤박스", probability: 0.3 },
      { item: "핫바", probability: 0.3 },
      { item: "손재부적", probability: 0.1 },
      { item: "망신부적", probability: 0.1 },
      { item: "박복부적", probability: 0.1 }
    ]
  },
  fail: {
    text: "별다른 특이점은 없는 것 같다."
  }
};