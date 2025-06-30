export const exploreLocations = {
  "1층 계단": {
    image: "/asset/img/hallway.png",
    description: "시간이 얼마나 흘렀는지 잘 모르겠다.\n어딜 둘러볼까?",
    choices: ["▶ 1층", "▶ 2층", "▶ 3층", "▶ 외부"]
  },
  "1층": {
    image: "/asset/img/hallway.png",
    description: "교문은 굳게 닫혀있고, 창 밖은 어둡기만하다.",
    choices: [
      { text: "▶ 교무실" },
      { text: "▶ 방송실" },
      { text: "▶ 행정실" },
      { text: "▶ 보건실" },
      { text: "▶ 복도를 살펴본다(1층)" },
      { text: "▶ 돌아간다. ", goTo: "1층 계단" }
    ]
  },
  "교무실": {
    image: "/asset/img/hallway.png",
    description: "잠겨있다.",
    choices: ["▶ 돌아간다."]
  },
  "방송실": {
    image: "/asset/img/broadcasting.png",
    description: "여러 방송 기기들이 구비되어있다. 서늘한 기운이 감돈다.",
    choices: [
      { text: "▶ 모니터를 살펴본다." },
      { text: "▶ 마이크를 살펴본다." },
      { text: "▶ 카메라를 살펴본다." },
      { text: "▶ 돌아간다. ", goTo: "1층" }
    ]
  },
  "모니터를 살펴본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "구식으로 보이는 낡은 모니터들이다.|한참 오래 전 부터 사람의 손을 타지 않은 듯 화면엔 먼지가 쌓여있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
  "마이크를 살펴본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "먼지가 쌓이는 것을 방지하려는 듯 천이 덮여있다.",
    choices: [
      { text: "▶ 작동시켜본다."},
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
  "작동시켜본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "케케묵은 냄새만 풍길 뿐, 전원은 켜지지 않는다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
  "카메라를 살펴본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "사용감이 상당히 느껴지는 카메라 장비다.\n덮개가 렌즈를 가리고 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
    "행정실": {
    image: "/asset/img/office.png",
    description: "사무용 책상과 모니터들이 즐비하다.",
      choices: [
      { text: "▶ 게시판을 살펴본다." },
      { text: "▶ 사무용 책상을 살펴본다." },
      { text: "▶ 사물함을 살펴본다." },
      { text: "▶ 돌아간다. ", goTo: "1층" }
    ]
  },
    "게시판을 살펴본다.": {
    image: "/asset/img/office.png",
    description: "알아볼 수 없을 만큼 복잡한 내용의 문서들이 다닥다닥 붙어 있다.\n곳곳에 압정도 몇 개 튀어나와있다.",
    choices: [
      { text: "▶ 압정을 건드려본다."},
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
      ]
  },
    "압정을 건드려본다.": {
    image: "/asset/img/office.png",
    description:
      "아야!|HP가 2 정도 깎인 기분이 든다.|다행히 HP 시스템이 없어 별다른 일은 일어나지 않았다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
      "사무용 책상을 살펴본다.": {
    image: "/asset/img/office.png",
    description: "대체로 사무용품이나 서류 등이 난잡하게 어질러져있다.",
    choices: [
      { text: "▶ 결재 서류를 읽어본다."},
      { text: "▶ 유인물을 읽어본다."},
      { text: "▶ 시말서를 읽어본다."},
      { text: "▶ 돌아간다." }
      ]
  },
      "결재 서류를 읽어본다.": {
    image: "/asset/img/office.png",
    description: "[비품구매요청서]\n작성일자: xx--年 --月 --日|구입항목: a4용지(수량: 4), 잉크(수량2), 탁상달력(수량12), 왼쪽다리(수량2), 농구공(수량3), 강당용 의자(수량20) ....\n합계 금액 : xxx,xx원",
    choices: [
      { text: "▶ 돌아간다." }
      ]
  },
      "유인물을 읽어본다.": {
    image: "/asset/img/office.png",
    description: "[선사 시대의 신앙 - 토테미즘]|1. 토테미즘이란?\n→ 자연물(동물, 식물, 자연 현상 등)을 부족의 조상이나 수호신으로 믿는 원시 신앙 형태.|2. 왜 믿었을까?\n◎자연에 대한 경외감에서 비롯됨.\n◎생존과 직결된 동물(곰, 호랑이 등)에 신성함을 부여함.\n◎부족의 정체성과 결속렬을 강화하는 역할. ...",
    choices: [
      { text: "▶ 돌아간다." }
      ]
  },
      "시말서를 읽어본다.": {
    image: "/asset/img/office.png",
    description: "[시말서]\n성명: 최OO\n소속: 2학년 학년부\n작성일: xx--年 --月 --日|「본인은 xx--년 --월 --일부터 --일까지 실시된 학년 통합 현장체@%-8습 중 발생한 학생 $!종 사고와 관련하여 다음과 같은 %^유로 시말서를 제출합니다.」|「사건 발생 당일(둘째 날 밤), 학생들이 자율 활동 시간에 지도 교사의 사전 허가 없이 동아(#리 모여 산%$으로 이동하여 담력$&/험 활동을 진행한 사실을 사전에 인지하지 못하였고, 이에 대한 지^& 및 통제가 미흡하였습니다.」|「특히 해당 활동 후 학생 복귀 시 인원 점검을 형식적으로 실시하여, 실^&자가 동행하지 않았음에도 이를 인지하지 못하고, 다음 날 아침에야 @#^ 사실을 확인하게 되었습니다.」|「이로 인해 학생 안전에 심각한 문제가 발생하였고, 학부모와 학생 모두에게 큰 불안과 충격을 안겨드린 점을 깊이 반성하고 있습니다. 학생의 안전을 최우선으로 고려해야 할 교사로서의...|군데군데 흐려져 읽기가 어렵다.",
    choices: [
      { text: "▶ 돌아간다." }
      ]
  },
      "사물함을 살펴본다.": {
    image: "/asset/img/office.png",
    description: "대부분 잠겨있다.|…개중엔 끔찍한 냄새가 나는 사물함도 몇 있는데, 굳이 건들진 말자.",
    choices: [
      { text: "▶ 그럼에도 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
      ]
  },
      "보건실": {
    image: "/asset/img/health_Room.png",
    description: "약품 냄새가 코를 찌른다. 내부는 깨끗해 보인다.",
    choices: [
      { text: "▶ 침대를 살펴본다." },
      { text: "▶ 서랍을 살펴본다." },
      { text: "▶ 트레이를 살펴본다." },
      { text: "▶ 돌아간다. ", goTo: "1층" }
    ]
  },
      "침대를 살펴본다.": {
    image: "/asset/img/health_Room.png",
    description: "어떤 침대의 커튼을 살펴볼까?",
    choices: ["▶ 첫 번째 침대", "▶ 두 번째 침대", "▶ 세 번째 침대", "▶ 돌아간다."]
  },
    "첫 번째 침대": {
    image: "/asset/img/health_Room.png",
    description: "첫 번째 침대의 커튼을 들춰봤다.|침구 위엔 먼지만 떠다닐 뿐 아무것도 없었다.",
    choices: ["▶ 돌아간다."]
  },
    "두 번째 침대": {
    image: "/asset/img/health_Room.png",
    description: "두 번째 침대의 커튼을 들춰봤다.|아무도 없지만, 잘 정리된 이불 한 구석이 조금 불룩하다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
    "세 번째 침대": {
    image: "/asset/img/health_Room.png",
    description: "커튼 너머로 긴 머리의 여자 인영이 보인다.|………….|…들춰볼까?",
    choices: [
      { text: "▶ 들춰본다." },
      { text: "▶ 돌아간다." }
    ]
  },
    "들춰본다.": {
    image: "/asset/img/health_Room.png",
    description: "정말로?",
    choices: [
      { text: "▶ 들춰본다. ", itemId: 2 },
      { text: "▶ 돌아간다." }
    ]
  },
    "들춰본다. ": {
    image: "/asset/img/health_Room.png",
    description: "당신은 세 번째 침대의 커튼을 들췄다.|….|아무도 없다.|베개 안 쪽에 구겨진 종이조각이 보인다.|[버려진 쪽지]를 얻었다.",
    choices: [
      { text: "▶ 돌아간다. ", goTo: "보건실" }
    ]
  },
    "서랍을 살펴본다.": {
  image: "/asset/img/health_Room.png",
  description: "치료를 받은 학생들의 명단과, 보건 선생님의것으로 보이는 서류 몇 가지가 가지런히 정리되어 있다.",
  choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ]
},
    "트레이를 살펴본다.": {
  image: "/asset/img/health_Room.png",
  description: "트레이 안에는 각종 의약품과 붕대 등의 응급처치 용품들이 들어있다.|다행히 학교 내부엔 친구들이 다칠 만한 경우들은 몇 없으니 사용할 일은 없을 것이다.",
  choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ]
  },
  "복도를 살펴본다(1층)": {
    image: "/asset/img/hallway.png",
    description: "1층의 복도다.\n주변엔 아무도 없다. 고요하다.",
    choices: [
      { text: "▶ 창문을 살펴본다." },
      { text: "▶ 화장실로 이동한다." },
      { text: "▶ 돌아간다." }
    ]
  },
  "복도를 살펴본다(2층)": {
    image: "/asset/img/hallway.png",
    description: "2층의 복도다.\n동아리원들의 대화소리가 조금씩 들리는 것 같다.",
    choices: [
      { text: "▶ 창문을 살펴본다." },
      { text: "▶ 화장실로 이동한다. " },
      { text: "▶ 돌아간다." }
    ]
  },
  "복도를 살펴본다(3층)": {
    image: "/asset/img/hallway.png",
    description: "3층의 복도다.\n걸을 때 마다 삐걱거리는 소리가 조금 들린다.",
    choices: [
      { text: "▶ 창문을 살펴본다."},
      { text: "▶ 화장실로 이동한다.  " },
      // { text: "▶ (?)바닥을 살펴본다.", goTo: "바닥을 살펴본다", itemId: 98, oneTimeOnly: true },
      { text: "▶ 돌아간다." }
      ]
  },
  "창문을 살펴본다.": {
    image: "/asset/img/hallway.png",
    description: "창 밖은 칠흑같은 어둠 뿐이다.\n시간도 날씨도 알 수 없다.",
    choices: [
      { text: "▶ 창문을 열어본다.", coinPenalty: 2, goTo: "창문을 열어본다" },
      { text: "▶ 돌아간다." }
      ]
  },
    "바닥을 살펴본다": {
    image: "/asset/img/hallway.png",
    description: "당신은 3층 복도 3학년 교실 앞, 바닥 한 구석에 떨어져있는 시꺼먼 형체를 들여다본다.|자세히 살펴보니 그것은…|가발이었다!|[교장선생님의 가발]을 획득했다.",
    choices: [{ text: "▶ 돌아간다.", goTo: "복도를 살펴본다(3층)" }]
  },
    "창문을 열어본다": {
    image: "/asset/img/hallway.png",
    description: "…창문을 열었다.|바람 한 점 불지 않는다. 별다른 특이사항은 없는 것 같……|…아!|손이 미끄러져 창 밖으로 무언가 떨어트리고 말았다.|[2코인]을 잃었다.",
    choices: [
      { text: "▶ 돌아간다.", goTo: "창문을 살펴본다."}
    ]
  },
  // ===1층화장실===
    "화장실로 이동한다.": {
    image: "/asset/img/restroom.png",
    description: "음습하다. 세면대에선 물이 새는 듯 물 떨어지는 소리가 들린다.",
    choices: ["▶ 세면대를 살펴본다.", "▶ 화장실 칸을 살펴본다.", "▶ 돌아간다."]
  },
  "세면대를 살펴본다.": {
    image: "/asset/img/restroom.png",
    description: "지저분한 거울에 당신의 모습이 비치고 있다.|수돗물을 틀어보았지만, 물은 나오지 않았다.",
    choices: [
      { text: "▶ 돌아간다." },
      { text: "　"}
    ]
  },
  "　": {
    image: "/asset/img/restroom.png",
    description: "쪽지의 내용이 떠올라서였을까, 혹은 문득 그냥 그러고싶어서였을까.\n당신은 거울에 대고 가위바위보를 해보았다.",
    choices: ["▶ 가위를 낸다", "▶ 바위를 낸다", "▶ 보를 낸다", "▶ 돌아간다."]
  },
  "가위를 낸다": {
    image: "/asset/img/restroom.png",
    description: "가위를 냈다. 거울 속의 당신도 똑같이 가위를 냈다.|비겼다.",
    choices: [
      {text : "▶ 돌아간다."}
    ],
  },
  "바위를 낸다": {
    image: "/asset/img/restroom.png",
    description: "바위를 냈다. 거울 속의 당신도 똑같이 바위를 냈다.|비겼다.",
    choices: [
      {text : "▶ 돌아간다."}
    ],
  },
  "보를 낸다": {
    image: "/asset/img/restroom.png",
    description: "보를 냈다. 거울 속의 당신도 똑같이 보를 냈다.|비겼다.",
    choices: [
      {text : "▶ 돌아간다."}
    ],
  },
  "화장실 칸을 살펴본다.": {
    image: "/asset/img/restroom.png",
    description: "몇 번째 칸을 살펴볼까?",
    choices: [ "▶ 첫 번째 칸", "▶ 두 번째 칸", "▶ 세 번째 칸", "▶ 돌아간다." ],
  },
  "첫 번째 칸": {
    image: "/asset/img/restroom.png",
    description: "특별한 것은 없다. 내부는 깨끗하다.",
    choices: [
      {text : "▶ 돌아간다."}
    ],
  },
  "두 번째 칸": {
    image: "/asset/img/restroom.png",
    description: "…구역질이 난다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "세 번째 칸": {
    image: "/asset/img/restroom.png",
    description: "변기 커버가 닫혀있다. 굳이 열어보고싶진 않다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  // ===2층화장실===
      "화장실로 이동한다. ": {
    image: "/asset/img/restroom.png",
    description: "향긋한 방향제 냄새가 난다. 조용하다.",
    choices: ["▶ 세면대를 살펴본다. ", "▶ 화장실 칸을 살펴본다. ", "▶ 돌아간다."]
  },
    "세면대를 살펴본다. ": {
    image: "/asset/img/restroom.png",
    description: "깨끗한 유리에 당신의 모습이 비친다. 모서리에 작은 금이 가 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "화장실 칸을 살펴본다. ": {
    image: "/asset/img/restroom.png",
    description: "몇 번째 칸을 살펴볼까?",
    choices: [ "▶ 첫 번째 칸 ", "▶ 두 번째 칸 ","▶ 세 번째 칸 ", "▶ 돌아간다." ],
  },
  "첫 번째 칸 ": {
    image: "/asset/img/restroom.png",
    description: "암모니아 냄새가 코를 찌른다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "두 번째 칸 ": {
    image: "/asset/img/restroom.png",
    description: "으악!|당신은 황급히 문을 닫았다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
  "세 번째 칸 ": {
    image: "/asset/img/restroom.png",
    description: "평범하다. 구석에 청소용품이 몇 가지 구비되어있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  // ===3층화장실===
    "화장실로 이동한다.  ": {
    image: "/asset/img/restroom.png",
    description: "음습하다. 세면대에선 물이 새는 듯 물 떨어지는 소리가 들린다.",
    choices: ["▶ 세면대를 살펴본다.  ", "▶ 화장실 칸을 살펴본다.  ", "▶ 돌아간다."]
  },
    "세면대를 살펴본다.  ": {
    image: "/asset/img/restroom.png",
    description: "깨끗한 유리에 당신의 모습이 비친다. 모서리에 작은 금이 가 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "화장실 칸을 살펴본다.  ": {
    image: "/asset/img/restroom.png",
    description: "몇 번째 칸을 살펴볼까?",
    choices: [ "▶ 첫 번째 칸  ", "▶ 두 번째 칸  ","▶ 세 번째 칸  ","▶ 네 번째 칸", "▶ 돌아간다." ],
  },
    "첫 번째 칸  ": {
    image: "/asset/img/restroom.png",
    description: "벽면에 기묘한 낙서가 새겨져 있다.|알아보긴 힘들 것 같다.",
    choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ],
  },
    "두 번째 칸  ": {
    image: "/asset/img/restroom.png",
    description: "깔끔하다. 그런데 휴지가 없다. 이런….",
    choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ],
  },
    "세 번째 칸  ": {
    image: "/asset/img/restroom.png",
    description: "머리카락이 수북히 쌓여 있다.|…기분 나쁠 만큼 길다.",
    choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ],
  },
    "네 번째 칸": {
    image: "/asset/img/restroom.png",
    description: "어라? 열리지 않는다.|아래를 내려다봐도 사람의 다리 같은 건 보이지 않는다.",
    choices: [
    // { text: "▶ 문을 두들겨본다.", goTo:"문을 두들겨본다."},
    { text: "▶ 돌아간다." },
    ],
  },
    "문을 두들겨본다.": {
    image: "/asset/img/restroom.png",
    description: "몇 번 두들길까?",
    choices: [
    { text: "▶ 한 번",  goTo:"한 번 두들겨본다." },
    { text: "▶ 두 번",  goTo:"두 번 두들겨본다." },
    { text: "▶ 세 번",  goTo:"세 번 두들겨본다." },
    { text: "▶ 네 번", goTo:"네 번 두들겨본다.", coinPenalty: 1 },
    { text: "▶ 그만둔다. ", goTo: "화장실 칸을 살펴본다.  " }
    ],
  },
  "네 번 두들겨본다.": {
    image: "/asset/img/restroom.png",
    description: "당신은 네 번째 칸 화장실의 문을 네 번 두들겨보았다.|쾅!!!|안에서 누군가 문을 세게 내려친 듯 하다.|당신은 놀란 나머지, 코인을 떨어트리고 말았다.|[1코인]를 잃었다.",
    choices: [
    { text: "▶ 돌아간다. ", goTo: "문을 두들겨본다." }
    ],
  },
    "한 번 두들겨본다.": {
    image: "/asset/img/restroom.png",
    description: "당신은 네 번째 칸 화장실의 문을 한 번 두들겨보았다.|….|아무일도 일어나지 않았다.",
    choices: [
    { text: "▶ 돌아간다. ", goTo: "문을 두들겨본다." }
    ]
  },
    "두 번 두들겨본다.": {
    image: "/asset/img/restroom.png",
    description: "당신은 네 번째 칸 화장실의 문을 두 번 두들겨보았다.|….|화장실 문이 열렸다.|안에는 아무도 없다.",
    choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다. ", goTo: "문을 두들겨본다." }
    ]
  },
    "세 번 두들겨본다.": {
    image: "/asset/img/restroom.png",
    description: "당신은 네 번째 칸 화장실의 문을 세 번 두들겨보았다.|….|아무일도 일어나지 않았다.",
    choices: [
    { text: "▶ 돌아간다. ", goTo: "문을 두들겨본다." }
    ]
  },
    "2층": {
    image: "/asset/img/hallway.png",
    description: "계단을 통해 2층으로 올라왔다.\n마룻바닥 여기저기 축축한 습기가 배어있다. 섬뜩한 한기가 느껴진다.",
    choices: [
      { text: "▶ 교실"},
      { text: "▶ 도서실"},
      { text: "▶ 미술실"},
      { text: "▶ 복도를 살펴본다(2층)"},
      { text: "▶ 돌아간다. ", goTo: "1층 계단"}
    ],
  },
  // 2층 교실
    "교실": {
    image: "/asset/img/class_room.png",
    description: "1학년과 2학년의 교실들.\n떠들썩한 낮과 달리, 고요하고 섬뜩한 분위기가 흐른다.",
    choices: [
      { text: "▶ 칠판을 살펴본다."},
      { text: "▶ 책상을 살펴본다."},
      { text: "▶ 사물함을 살펴본다. "},
      { text: "▶ 돌아간다. ", goTo: "2층"}
    ],
  },
    "칠판을 살펴본다.": {
    image: "/asset/img/class_room.png",
    description: "[지각생] : OOO, △△△...\n그리고 여러 낙서들이 모서리에 그려져있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "책상을 살펴본다.": {
    image: "/asset/img/class_room.png",
    description: "책상 밑면에 말라붙은 무언가가 있다.\n으… 자세히 보고 싶지 않다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "사물함을 살펴본다. ": {
    image: "/asset/img/class_room.png",
    description: "누군가의 신발 한 짝이 있다.\n…다른 한 짝은 어디에 둔 거지?",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  // 3층 교실
    "교실 ": {
    image: "/asset/img/class_room.png",
    description: "3층은 3학년만 교실을 사용하고 있다.\n…고요하다.",
    choices: [
      { text: "▶ 칠판을 살펴본다. "},
      { text: "▶ 책상을 살펴본다. "},
      { text: "▶ 사물함을 살펴본다.  "},
      { text: "▶ 돌아간다. ", goTo: "3층"}
    ],
  },
    "칠판을 살펴본다. ": {
    image: "/asset/img/class_room.png",
    description: "분필 냄새가 난다. 칠판은 아무런 낙서 없이 깨끗하다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "책상을 살펴본다. ": {
    image: "/asset/img/class_room.png",
    description: "교과서, 필통, 구겨진 학습지 등이 들어있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "사물함을 살펴본다.  ": {
    image: "/asset/img/class_room.png",
    description: "땀에 젖은 체육복이 아무렇게나 널브러져 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "도서실": {
    image: "/asset/img/library.png",
    description: "눅눅한 종이 냄새가 난다. 큰 소리를 내면 안될 것 같다.",
    choices: [
      { text: "▶ 책장을 살펴본다."},
      { text: "▶ 컴퓨터를 살펴본다."},
      { text: "▶ 프린터기를 살펴본다."},
      { text: "▶ 돌아간다. ", goTo: "2층"}
    ],
  },
  "책장을 살펴본다.": {
    image: "/asset/img/library.png",
    description: "다양한 서적들이 빼곡하게 들어서있다.\n눈에 띄는 책들이 몇 권 있다.\n…뭔가 읽어볼까?",
    choices: [
      { text: "▶ 「분신사바」"},
      { text: "▶ 「해녀 괴담」"},
      { text: "▶ 「퇴마부 제작법」"},
      { text: "▶ 돌아간다. ", goTo: "도서실"}
    ],
  },
    "「분신사바」": {
    image: "/asset/img/library.png",
    description: "「 분신사바(筆神さま)놀이 방법 」|준비물:\n종이 1장, 볼펜 1자루, 2명 이상의 참여자|1. 종이에 예, 아니오 혹은 O, X를 그린다.|2. 참여자 2명이 한 자루의 펜 혹은 연필을 함께 잡고, 종이의 중앙에 가볍게 올려둔다.|3.「 분신사바, 분신사바, 이곳에 오셨으면 O로 대답해 주세요. 」등의 말을 반복하며, 근처의 영혼을 부른다.|4. 펜이 움직이기 시작하면, 질문을 하나씩 조심스레 던진다.|이 때, 중간에 절대 손을 놓거나 펜을 떨어트려서는 안 된다.|5. 반드시 「 놀이를 끝내도 될까요? 」등의 마무리 질문을 하고, 펜이 O를 카리켰을 때 놀이를 종료해야한다.",
    choices: [
    { text: "▶ 돌아간다." }
    ],
  },
    "「해녀 괴담」": {
      image: "/asset/img/library.png",
      description: "「해녀 괴담」 - 토모카즈키(共潜)|토모카즈키(共潜)\n‘トモ’ = 같은, ‘カヅキ(潜く) = 잠수하다, 즉 “같이 잠수하는 자”.|해녀가 혼자 뭍에서 작업하다 보면, 바다 아래에서 자신과 똑같이 생긴 다른 해녀가 나타나 조개(전복·성게 등)를 건네는 모습이 보인다고 한다.|해녀가 그 조개를 받으면 건네준 해녀가 손짓하며 더 깊이 잠수하여 따라가게 만들고, 결국 숨이 차오르는 것도 잊은 채 깊은 바닷속으로 끌려 들어가 목숨을 잃게 된다는 이야기.|때문에 해녀들은 옷이나 그물에 오각별 문양을 새기고, 혼자가 아닌 여럿이서 함께 물질을 하는 것이 체계가 되었다고 한다.|현재로 와선 당장 눈 앞의 조개들을 욕심내다 너무 오래 잠수하는 것을 방지하기 위해, 또 홀로 작업하다 사고가 나는 것을 예방하기 위해 만들어진 민담이라는 해석이 있다.",
      choices: [
      { text: "▶ 돌아간다." }
      ],
    },
    "「퇴마부 제작법」": {
      image: "/asset/img/library.png",
      description: "누군가가 직접 수필로 작성한 듯, 삐뚤빼뚤한 글씨로 적혀있다.|「 “퇴마부“를 만드는 방법. 」|「 노란색 한지에 피나 붉은색 잉크 등으로 ㅂ$#문&(흐려져있다)를 그려넣는다. 」|「 제령할 영혼의 이름을 삼창하며, 부적에 불을 붙여 태운다. 」|「 이 때, 모든 의식이 끝난 뒤 꼭 태운 재를 날려보낼 것. 」",
      choices: [
      { text: "▶ 돌아간다." }
      ],
    },
    "컴퓨터를 살펴본다.": {
    image: "/asset/img/library.png",
    description: "책을 검색하거나, 출력을 위해 학생들에게 마련된 컴퓨터.\n…당연하게도 켜지진 않는다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "프린터기를 살펴본다.": {
    image: "/asset/img/library.png",
    description: "잉크도, 용지도 모두 충분해 보인다.\n역시나 켜지진 않는다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "미술실": {
    image: "/asset/img/art_room.png",
    description: "눅눅한 종이 냄새가 난다.\n석고로 된 흉상들이 나를 노려보는 것만 같다.",
    choices: [
      { text: "▶ 미술도구함을 살펴본다."},
      { text: "▶ 책상을 살펴본다.　"},
      { text: "▶ 흉상을 살펴본다."},
      { text: "▶ 돌아간다. ", goTo: "2층"}
    ],
  },
  "미술도구함을 살펴본다.": {
    image: "/asset/img/art_room.png",
    description: "물감, 물통, 붓, 종이, 이젤 등 다양한 도구들이 마련되어있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "책상을 살펴본다.　": {
    image: "/asset/img/art_room.png",
    description: "눌러붙은 물감 자국과 목탄 흔적들이 가득해 지저분해 보인다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "흉상을 살펴본다.": {
    image: "/asset/img/art_room.png",
    description: "여기저기 긁히고 부서져 어딘가 섬뜩하게 느껴진다.",
    choices: [
      { text: "▶ 부숴본다.", coinPenalty: 1, goTo: "부숴본다." },
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "부숴본다.": {
    image: "/asset/img/art_room.png",
    description: "당신은 석고 흉상을 들어 바닥에 내던졌다.|뿌드득, 하는 둔탁한 소리와 함께 얼굴이 산산조각 나며 하얀 석고 가루가 휘날린다.|…흉상 내부는 텅 비어있다.|………어라?|몸을 크게 움직여서인지, 주머니에서 코인이 떨어져나와 서랍장 아래로 굴러들어간 듯 하다.|[1코인]를 잃었다.",
    choices: [
      { text: "▶ 돌아간다. ", goTo: "미술실" }
    ],
  },
    "3층": {
    image: "/asset/img/hallway.png",
    description: "계단을 통해 3층으로 올라왔다.\n바닥과 벽 여기저기에 금이 가 있다.",
    choices: [
      { text: "▶ 교실 "},
      { text: "▶ 과학실"},
      { text: "▶ 음악실"},
      { text: "▶ 복도를 살펴본다(3층)"},
      { text: "▶ 돌아간다. ", goTo: "1층 계단"}
    ],
  },
    "과학실": {
    image: "/asset/img/science_room.png",
    description: "찌든 화학품 냄새가 불쾌하게 코를 찌른다.",
    choices: [
      { text: "▶ 비품실을 살펴본다."},
      { text: "▶ 인체모형을 살펴본다."},
      { text: "▶ 서랍장을 살펴본다.　"},
      { text: "▶ 돌아간다. ", goTo: "3층"}
    ],
  },
  "비품실을 살펴본다.": {
    image: "/asset/img/science_room.png",
    description: "과학 실험 때 쓰이는 비품들을 보관하는 간이 창고다.\n대부분 천으로 덮여있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "인체모형을 살펴본다.": {
    image: "/asset/img/science_room.png",
    description: "반은 인피, 반은 근육이 드러난 교육용 모형이다.\n돌출된 안구와 눈이 마주친 것 같은 기분이 든다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "서랍장을 살펴본다.　": {
    image: "/asset/img/science_room.png",
    description: "비커, 눈금실린더, 알코올램프 등이 가지런히 정리되어있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "음악실": {
    image: "/asset/img/music_room.png",
    description: "두꺼운 방음문을 지나 목재식 내부의 음악실 안으로 들어왔다.",
      choices: [
      { text: "▶ 피아노를 살펴본다."},
      { text: "▶ 보면대를 살펴본다."},
      { text: "▶ 사물함을 살펴본다.　"},
      { text: "▶ 돌아간다. ", goTo: "3층"}
    ],
  },
  "피아노를 살펴본다.": {
    image: "/asset/img/music_room.png",
    description: "보급형 그랜드 피아노. 전반적으로 깔끔하지만, 자주 쓰이는 건반 부근이 조금 닳아있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "보면대를 살펴본다.": {
    image: "/asset/img/music_room.png",
    description: "녹이 슨 듯한 쇠 냄새를 풍기고 있다.\n…드문드문 보이는 악보는 음계를 알아보기 어려울 만큼 잉크가 뭉개져있다.",
    choices: [
      { text: "▶ 악보를 읽어본다." },
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "악보를 읽어본다.": {
    image: "/asset/img/music_room.png",
    description: "당신은 보표를 더듬어가며 희미하게 새겨진 음계를 읽어내본다.|(E) (D#) (E)… (D#)…… (E) (B) (D)…… (C)… (A)……\n이 다음은 흐려져 알아보기 힘들다.",
    choices: [
      { text: "▶ 돌아간다. ", goTo: "음악실" }
    ],
  },
  "사물함을 살펴본다.　": {
    image: "/asset/img/music_room.png",
    description: "내부엔 리코더, 오카리나, 단소, 기타 등의 악기들이 가지런지 정리되어있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "외부": {
    image: "/asset/img/hallway.png",
    description: "본관 내부 통로를 이용해 옆 건물로 이동했다.",
      choices: [
      { text: "▶ 체육관" },
      { text: "▶ 급식실" },
      { text: "▶ 돌아간다. ", goTo: "1층 계단" }
    ]
  },
  "체육관": {
    image: "/asset/img/gym.png",
    description: "체육관은 광활했지만 조금도 인기척을 느낄 수 없다.\n소리를 내면 메아리가 울릴 듯 하다.",
    choices: [
      { text: "▶ 농구골대를 살펴본다."},
      { text: "▶ 무대를 살펴본다."},
      { text: "▶ 창고를 살펴본다."},
      { text: "▶ 돌아간다. ", goTo: "외부"}
    ],
  },
  "농구골대를 살펴본다.": {
    image: "/asset/img/gym.png",
    description: "당신은 농구골대를 올려다 보았다.\n학생들이 많이 사용한 듯 여기저기 닳고 그물은 살짝 찢어져있기까지 하다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "무대를 살펴본다.": {
    image: "/asset/img/gym.png",
    description: "무대 바닥이 일부 들떠 있다.\n조명 장비는 전혀 작동하지 않고, 오래된 먼지만 쌓여 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
  "창고를 살펴본다.": {
    image: "/asset/img/gym.png",
    description: "문을 열자마자 묵은 먼지가 훅 끼치며 공중에 흩날린다.|내부는 낡은 철제 캐비닛과 공보관함, 매트 등이 작은 공간을 꽉 채우고 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "급식실": {
    image: "/asset/img/cafeteria.png",
    description: "희미한 음식 냄새가 난다.",
      choices: [
      { text: "▶ 조리실을 살펴본다."},
      { text: "▶ 배식대를 살펴본다."},
      { text: "▶ 식탁을 살펴본다."},
      { text: "▶ 돌아간다. ", goTo: "외부"}
    ],
  },
    "조리실을 살펴본다.": {
    image: "/asset/img/cafeteria.png",
    description: "조리대 위에 커다란 냄비가 있다.\n부글부글 끓는 소리와 뜨거운 열기, 그리고… 알 수 없는, 비릿하고 역한 냄새가 훅 끼쳐온다.",
    choices: [
      { text: "▶ 뚜껑을 열어본다.", itemId: 99 },
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "뚜껑을 열어본다.": {
    image: "/asset/img/cafeteria.png",
    description: "정말로?",
    choices: [
      { text: "▶ 뚜껑을 열어본다. " },
      { text: "▶ 돌아간다." }
    ],
  },
    "뚜껑을 열어본다. ": {
    image: "/asset/img/cafeteria.png",
    description: "당신은 냄비의 뚜껑을 열어봤다.|안에는…|……….|바닥과 옆면에 소금이 다닥다닥 말라붙어있었다.|[소금]을 획득했다.",
    choices: [
      { text: "▶ 돌아간다. ", goTo: "급식실" }
    ],
  },
    "배식대를 살펴본다.": {
    image: "/asset/img/cafeteria.png",
    description: "누군가 안쪽에서 긁은 듯한 흠집이 바닥까지 이어져 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
    "식탁을 살펴본다.": {
    image: "/asset/img/cafeteria.png",
    description: "의자들이 가지런히 정리되어있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
    ],
  },
};