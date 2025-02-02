import { supabase } from "../../db/supabase";
import products from "../../db/product";
import fortuneMessages from "../../db/fortuneMessages";
import noteMessages from "../../db/noteMessages";
import randomBoxItems from "../../db/randomBoxItems";

// 팝업 상태를 관리하는 변수
let setPopupState = null;

// 팝업을 띄우는 함수 등록
export const setPopupHandler = (popupFunction) => {
  setPopupState = popupFunction;
};

// 팝업 UI를 띄우는 함수
const showPopup = (image, text) => {
  if (setPopupState) {
    setPopupState({ visible: true, image, text });
  }
};

// 랜덤한 메시지를 선택하는 함수
const getRandomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];

// 랜덤박스에서 랜덤 아이템 지급
const openRandomBox = async () => {
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

  alert(`🎁 랜덤박스에서 '${selectedItem.name}'을(를) 획득했습니다!`);
};

// 아이템 사용 핸들러
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
      showPopup("/asset/images/fortune.jpg", getRandomMessage(fortuneMessages));
      break;

    case 2: // 버려진 쪽지
      showPopup("/asset/images/note.jpg", getRandomMessage(noteMessages));
      break;

    case 10: // 랜덤박스
      await openRandomBox();
      return;

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
