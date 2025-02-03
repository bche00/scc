import { supabase } from "../../db/supabase";
import products from "../../db/product";
import fortuneMessages from "../../db/fortuneMessages"; // ✅ 복구
import noteMessages from "../../db/noteMessages"; // ✅ 복구
import randomBoxItems from "../../db/randomBoxItems";

// ✅ 팝업 상태 관리
let setPopupState = null;

// ✅ 팝업 핸들러 등록
export const setPopupHandler = (popupFunction) => {
  setPopupState = popupFunction;
};

// ✅ 팝업 UI 띄우기
const showPopup = (image, text) => {
  if (setPopupState) {
    setPopupState({ visible: true, image, text });
  }
};

// ✅ 랜덤 메시지 선택 함수
const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];

// ✅ 랜덤박스 사용 함수
const openRandomBox = async (bagItems, setBagItems) => {
  const totalChance = randomBoxItems.reduce((acc, item) => acc + item.chance, 0);
  let rand = Math.random() * totalChance;

  let selectedItem;
  for (let item of randomBoxItems) {
    if (rand < item.chance) {
      selectedItem = item;
      break;
    }
    rand -= item.chance;
  }

  // ✅ 획득한 아이템 정보 가져오기
  const productInfo = products.find((p) => p.id === selectedItem.id);

  // ✅ 팝업 띄우기 (이미지 + 아이템명)
  showPopup(productInfo.image, `🎁 '${selectedItem.name}'을(를) 획득했습니다!`);

  // 🔹 현재 인벤토리 가져오기
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  const { data, error } = await supabase
    .from("users_info")
    .select("bag_item")
    .eq("user_id", loggedInUser.id)
    .single();

  if (error || !data) {
    console.error("소지품 데이터를 가져오는 중 오류 발생:", error);
    return;
  }

  let updatedBagItems = data.bag_item || [];

  // 🔹 획득한 아이템이 기존 인벤토리에 있는지 확인
  const itemIndex = updatedBagItems.findIndex((item) => item.itemId === selectedItem.id);
  if (itemIndex !== -1) {
    updatedBagItems[itemIndex].count += 1;
  } else {
    updatedBagItems.push({ itemId: selectedItem.id, count: 1, used: false });
  }

  // 🔥 **랜덤박스 개수 감소**
  const boxIndex = updatedBagItems.findIndex((item) => item.itemId === 4);
  if (boxIndex !== -1) {
    if (updatedBagItems[boxIndex].count > 1) {
      updatedBagItems[boxIndex].count -= 1;
    } else {
      updatedBagItems.splice(boxIndex, 1);
    }
  }

  // 🔹 Supabase에 업데이트 (획득한 아이템 반영)
  const { error: updateError } = await supabase
    .from("users_info")
    .update({ bag_item: updatedBagItems })
    .eq("user_id", loggedInUser.id);

  if (updateError) {
    console.error("소지품 업데이트 중 오류 발생:", updateError);
    alert("아이템 추가 중 오류가 발생했습니다.");
  } else {
    setBagItems(updatedBagItems);
  }
};

// 핫바
// ✅ 탐사 횟수를 증가시키는 함수 (핫바 사용 시)
const updateExploreLimit = async () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("로그인이 필요합니다.");
    return;
  }

  // 🔹 현재 탐사 횟수 데이터 가져오기
  const { data, error } = await supabase
    .from("users_info")
    .select("explore_limit")
    .eq("user_id", loggedInUser.id)
    .single();

  if (error || !data) {
    console.error("탐사 횟수 조회 오류:", error);
    alert("탐사 횟수를 가져오는 중 오류가 발생했습니다.");
    return;
  }

  let exploreData = data.explore_limit;

  // 🔹 한국 시간(KST)으로 현재 날짜 가져오기 (YYYY-MM-DD 형식)
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  });

  // 🔹 날짜가 변경되었으면 remaining을 2로 초기화
  if (exploreData.date !== today) {
    exploreData = { date: today, remaining: 2 };
  }

  // 🔹 remaining 값 +1 증가
  exploreData.remaining += 1;

  // 🔹 업데이트 실행
  const { error: updateError } = await supabase
    .from("users_info")
    .update({ explore_limit: exploreData }) // 🔥 JSON 객체 그대로 업데이트
    .eq("user_id", loggedInUser.id);

  if (updateError) {
    console.error("탐사 횟수 업데이트 실패:", updateError);
    alert("탐사 횟수를 증가시키는 중 오류가 발생했습니다.");
  } else {
    alert(`탐사 횟수가 증가했습니다! (현재 탐사 횟수: ${exploreData.remaining})`);
  }
};


// ✅ 아이템 사용 핸들러 (포츈쿠키 & 버려진 쪽지 메시지 복구)
export const handleUseItem = async (itemId, bagItems, setBagItems) => {
  const item = products.find((p) => p.id === itemId);

  if (!item) {
    alert("이 아이템을 사용할 수 없습니다.");
    return;
  }

  const confirmUse = window.confirm(`${item.name}을(를) 사용하시겠습니까?`);
  if (!confirmUse) return;

  let updatedBagItems = [...bagItems];

  const itemIndex = updatedBagItems.findIndex((item) => item.itemId === itemId && !item.used);
  if (itemIndex === -1) {
    alert("사용할 수 있는 아이템이 없습니다.");
    return;
  }

  switch (itemId) {
    case 1: // 포츈쿠키
      showPopup("/asset/product/fortune.png", getRandomMessage(fortuneMessages));
      break;

    case 2: // 버려진 쪽지
      showPopup("/asset/product/note.png", getRandomMessage(noteMessages));
      break;

    case 3: // 핫바 (✅ 탐사 횟수 증가)
      await updateExploreLimit();
      break;

    case 4: // 랜덤박스
      showPopup("/asset/product/luckybox.png", "랜덤박스를 열었습니다! 🎁");
      await openRandomBox(bagItems, setBagItems);
      return;

    case 5: // 손재부적
    case 6: // 망신부적
    case 7: // 박복부적
      alert("해당 물품은 선물 전용으로, 직접 사용이 불가합니다.");
      return;

    case 8: // 따봉고슴도치 스티커
      alert("해당 물품은 선물 방어 전용으로, 소지품에서 직접 사용이 불가합니다.");
      return;

    case 9: // 확성기
    case 10: // 페인트통
    case 11: // 뱃지
      updatedBagItems[itemIndex].used = true;
      alert(`${item.name}을(를) 사용했습니다!`);
      break;

    default:
      alert("이 아이템은 사용할 수 없습니다.");
      return;
  }

  updatedBagItems[itemIndex].count -= 1;
  updatedBagItems = updatedBagItems.filter((item) => item.count > 0 || item.used);

  try {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const koreaTime = new Date();
    koreaTime.setHours(koreaTime.getHours() + 9);

    await supabase.from("users_record").insert([
      {
        user_id: loggedInUser.id,
        item_id: itemId,
        item_name: item.name,
        type: "used",
        timestamp: koreaTime.toISOString(),
      },
    ]);

    await supabase
      .from("users_info")
      .update({ bag_item: updatedBagItems })
      .eq("user_id", loggedInUser.id);

    setBagItems(updatedBagItems);
  } catch (err) {
    console.error("아이템 사용 오류:", err);
    alert("아이템 사용 중 오류가 발생했습니다.");
  }
};
