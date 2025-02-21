import { supabase } from "../../db/supabase";
import products from "../../db/product";

// 선물 기능 처리 함수
export const handleGiftItem = async (item, selectedUser, bagItems, setBagItems, setGiftPopup, userCoin, setUserCoin) => {
  if (!selectedUser || !item) return alert("선물할 친구를 선택해주세요.");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return alert("로그인이 필요합니다.");

  const senderId = parseInt(loggedInUser.id, 10);
  const receiverId = parseInt(selectedUser.id, 10);

  const koreaTime = new Date();
  koreaTime.setHours(koreaTime.getHours() + 9);
  const timestamp = koreaTime.toISOString();

  console.log("📌 선물 기록 추가 요청:", { senderId, receiverId, itemId: item.id, timestamp });

  try {
    // 1. 보낸이(sender)와 받는이(receiver) 이름 조회
    const { data: senderData, error: senderError } = await supabase
      .from("users")
      .select("name")
      .eq("id", senderId)
      .single();

    const { data: receiverData, error: receiverError } = await supabase
      .from("users")
      .select("name")
      .eq("id", receiverId)
      .single();

    if (senderError || receiverError) {
      console.error("🚨 사용자 이름 조회 실패:", senderError || receiverError);
      return alert("선물하는 중 오류 발생! (사용자 정보 오류)");
    }

    const senderName = senderData.name;
    const receiverName = receiverData.name;

    // 아이템 정보 가져오기 (id가 문자열일 가능성 방지)
    const product = products.find(p => p.id === Number(item.id));

    if (!product) {
      console.error("🚨 존재하지 않는 아이템 ID:", item.id);
      return alert("선물할 아이템 정보를 찾을 수 없습니다.");
    }

    // 2. Supabase에 선물 기록 저장
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

    // 3. 선물 기록을 users_record 테이블에 추가
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

    // 4. 선물 후 소지금 차감 (음수 방지 추가)
    const updatedCoins = Math.max(0, userCoin - (product?.price || 0));

    const { error: coinError } = await supabase
      .from("users_info")
      .update({ coin: updatedCoins })
      .eq("user_id", senderId);

    if (coinError) {
      console.error("🚨 코인 업데이트 실패:", coinError);
      return alert("코인 차감 중 오류 발생!");
    }

    setUserCoin(updatedCoins);


    // 5. 선물 후 소지품에서 제거
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
