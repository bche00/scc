import { supabase } from "../../db/supabase";
import products from "../../db/product";

export const handleGiftItem = async (item, selectedUser, bagItems, setBagItems, setGiftPopup, userCoin, setUserCoin) => {
  if (!selectedUser || !item) return alert("선물할 친구를 선택해주세요.");

  // console.log("📌 handleGiftItem 받은 item:", item);
  // console.log("📌 item.id 값:", item?.id);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return alert("로그인이 필요합니다.");

  const senderId = parseInt(loggedInUser.id, 10);
  const receiverId = parseInt(selectedUser.id, 10);

  const koreaTime = new Date();
  koreaTime.setHours(koreaTime.getHours() + 9);
  const timestamp = koreaTime.toISOString();

  // 아이템 ID 확인
  const itemId = Number(item.id || item.itemId);
  // console.log("📌 최종 아이템 ID:", itemId);

  const product = products.find(p => p.id === itemId);

  if (!product) {
    console.error("🚨 존재하지 않는 아이템 ID:", itemId, "item:", item);
    return alert("선물할 아이템 정보를 찾을 수 없습니다.");
  }

  try {
    const { data: senderData, error: senderError } = await supabase
      .from("users")
      .select("name")
      .eq("id", senderId)
      .eq("status", "approved")
      .single();

    const { data: receiverData, error: receiverError } = await supabase
      .from("users")
      .select("name")
      .eq("id", receiverId)
      .eq("status", "approved")
      .single();

    if (senderError || receiverError) {
      console.error("🚨 사용자 이름 조회 실패:", senderError || receiverError);
      return alert("선물하는 중 오류 발생! (사용자 정보 오류)");
    }

    const senderName = senderData.name;
    const receiverName = receiverData.name;

    // Supabase에 선물 기록 저장
    const { error: giftError } = await supabase.from("gift_records").insert([{
      sender_id: senderId,
      receiver_id: receiverId,
      sender_name: senderName, 
      receiver_name: receiverName,
      item_id: product.id,
      item_name: product.name,
      count: 1,
      received: false,
      timestamp,
    }]);

    if (giftError) {
      console.error("🚨 gift_records 저장 실패:", giftError);
      return alert("선물하는 중 오류 발생!");
    }

    // Supabase에 선물 기록 추가
    const { error: recordError } = await supabase.from("users_record").insert([
      {
        user_id: senderId,  
        item_id: product.id,
        item_name: product.name,
        type: "gift_sent", 
        timestamp,
        name: receiverName, 
      },
      {
        user_id: receiverId,  
        item_id: product.id,
        item_name: product.name,
        type: "gift_received", 
        timestamp,
        name: senderName,
      }
    ]);

    if (recordError) {
      console.error("🚨 users_record 저장 실패:", recordError);
      return alert("기록 저장 중 오류 발생!");
    }

    // 소지품에서 제거
    let updatedBagItems = bagItems.map(b => 
      b.itemId === product.id ? { ...b, count: b.count - 1 } : b
    ).filter(b => b.count > 0);

    const { error: updateError } = await supabase
      .from("users_info")
      .update({ bag_item: updatedBagItems })
      .eq("user_id", senderId);

    if (updateError) {
      console.error("🚨 소지품 업데이트 실패:", updateError);
      return alert("소지품 업데이트 중 오류 발생!");
    }

    setBagItems(updatedBagItems);
    alert(`${receiverName}에게 '${product.name}'을(를) 선물했다!`);
    setGiftPopup({ visible: false, item: null });

  } catch (error) {
    console.error("🚨 예기치 않은 오류 발생:", error);
    alert("선물 처리 중 오류가 발생했습니다.");
  }
};
