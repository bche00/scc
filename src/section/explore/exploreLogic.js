import { exploreResults } from "./exploreResults";
import products from "../../db/product"; // 상품 DB 불러오기
import { supabase } from "../../db/supabase"; // Supabase 불러오기

export async function performExploration() {
  const successRate = Math.random();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    console.error("로그인이 필요합니다.");
    return {
      type: "error",
      segments: ["로그인이 필요합니다."],
    };
  }

  const userId = loggedInUser.id;

  if (successRate > 0.5) {
    const successType = Math.random();
    let result;

  if (successType < 0.5) result = exploreResults.success1;       // 50%
  else if (successType < 0.8) result = exploreResults.success2;  // 30%
  else result = exploreResults.success3;                         // 20%


    // 보상 선택
    let reward = "";

    if (result?.rewards?.length > 0) {
      let rand = Math.random();
      let cumulative = 0;
      for (const r of result.rewards) {
        cumulative += r.probability;
        if (rand < cumulative) {
          reward = r.item;
          break;
        }
      }
      if (!reward) reward = result.rewards[result.rewards.length - 1].item;
    }


    // 보상 아이템 인벤토리에 추가
// 보상 아이템 인벤토리에 추가 or 코인 지급
let coinRewarded = false;

if (!isNaN(Number(reward))) {
  // reward가 숫자일 경우 → 코인 보상으로 처리
  const coinAmount = Number(reward);

  const { data: userInfo, error: userError } = await supabase
    .from("users_info")
    .select("coin")
    .eq("user_id", userId)
    .single();

  if (userError || !userInfo) {
    console.error("유저 정보를 불러오는 데 실패했습니다:", userError);
  } else {
    const newCoin = (userInfo.coin || 0) + coinAmount;

    const { error: updateError } = await supabase
      .from("users_info")
      .update({ coin: newCoin })
      .eq("user_id", userId);

    if (updateError) {
      console.error("코인 업데이트 실패:", updateError);
    } else {
      coinRewarded = true;

      // 기록 저장
      const koreaTime = new Date();
      koreaTime.setHours(koreaTime.getHours() + 9);

      const { error: recordError } = await supabase.from("users_record").insert([{
        user_id: userId,
        item_id: null,
        item_name: `${coinAmount}코인`,
        type: "obtained",
        timestamp: koreaTime.toISOString(),
      }]);
    //     console.log("기록 저장 확인용!!!:", {
    //       user_id: userId,
    //       item_id: null,
    //       item_name: `${coinAmount}코인`,
    //       type: "obtained",
    //       timestamp: koreaTime.toISOString(),
    //   }
    // );
    }
  }
} else {
  // 아이템 지급 로직
  const product = products.find(p => p.name === reward);
  if (product) {
    const { data: userInfo, error: userError } = await supabase
      .from("users_info")
      .select("bag_item")
      .eq("user_id", userId)
      .single();

    if (userError || !userInfo) {
      console.error("유저 정보를 불러오는 데 실패했습니다:", userError);
    } else {
      const updatedBagitem = [...(userInfo.bag_item || [])];
      const existingItem = updatedBagitem.find(item => item.itemId === product.id && !item.used);

      if (existingItem) {
        existingItem.count += 1;
      } else {
        updatedBagitem.push({ itemId: product.id, count: 1, used: false });
      }

      const koreaTime = new Date();
      koreaTime.setHours(koreaTime.getHours() + 9);

      const { error: updateError } = await supabase
        .from("users_info")
        .update({ bag_item: updatedBagitem })
        .eq("user_id", userId);

      if (updateError) {
        console.error("인벤토리 업데이트 실패:", updateError);
      } else {
        await supabase.from("users_record").insert([{
          user_id: userId,
          item_id: product.id,
          item_name: product.name,
          type: "obtained",
          timestamp: koreaTime.toISOString(),
        }]);
      }
    }
  } else {
    console.warn("해당 이름의 아이템을 상품 DB에서 찾을 수 없습니다:", reward);
  }
}

// 결과 세그먼트 생성
const newSegments = result.segments.map(segment =>
  segment.replace("{reward}", reward)
);

return {
  type: "success",
  segments: newSegments
};

  } else {
    const failResult = exploreResults.fail;
    const randomIndex = Math.floor(Math.random() * failResult.segments.length);
    return {
      type: "fail",
      segments: [failResult.segments[randomIndex]]
    };
  }
}
