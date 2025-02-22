export const exploreResults = {
  success1: {
    text: "…반짝이는 무언가가 떨어졌다.|동전이다!. ({reward})코인을 획득했다.",
    rewards: [
      { item: "1", probability: 0.6 },
      { item: "2", probability: 0.3 },
      { item: "3", probability: 0.1 }
    ]
  },
  success2: {
    text: "…툭, 하는 소리와 함께 무언가가 떨어졌다.|{reward}을(를) 획득했다.",
    rewards: [
      { item: "쪽지", probability: 0.5 },
      { item: "포츈쿠키", probability: 0.5 }
    ]
  },
  success3: {
    text: "…둔탁한 소리와 함께 무언가가 떨어졌다.|{reward}을(를) 획득했다.",
    rewards: [
      { item: "랜덤박스", probability: 0.3 },
      { item: "핫바", probability: 0.3 },
      { item: "손재부적", probability: 0.1 },
      { item: "망신부적", probability: 0.1 },
      { item: "박복부적", probability: 0.1 },
      { item: "따봉고슴도치", probability: 0.1 }
    ]
  },
  fail: {
    text: [
      "별다른 특이점은 없는 것 같다.",
      "별다른 특이사항은 없는 것 같다.",
      "특별히 눈길이 갈만한 건 없는 것 같다.",
      "…평범하다. 별다른 것은 없는 듯 하다.",
      "이외에 딱히 신경쓰이는 점은 없다."
    ]
  }
};