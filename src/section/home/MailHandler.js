import { supabase } from "../../db/supabase";
import products from "../../db/product";
import style from "./home.module.scss";
import { useState, useEffect } from "react";

export default function MailHandler({ giftPopup, setGiftPopup, setMail }) {
  const [mailbox, setMailbox] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!giftPopup) return; //팝업이 열릴 때만 실행

    const fetchMailbox = async () => {
      setLoading(true);
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;

      const userId = loggedInUser.id;

      try {
        const { data, error } = await supabase
          .from("gift_records")
          .select("*, sender_id")
          .eq("receiver_id", userId)
          .order("timestamp", { ascending: false });

        if (error) {
          console.error("우편 데이터를 가져오는 중 오류 발생:", error);
        } else {
          //보낸이의 이름 가져오기
          const senderIds = [...new Set(data.map((gift) => gift.sender_id))];

          const { data: senderData, error: senderError } = await supabase
            .from("users")
            .select("id, name")
            .in("id", senderIds);

          if (senderError) {
            console.error("보낸이 정보를 가져오는 중 오류 발생:", senderError);
          }

          const senderMap = senderData.reduce((acc, sender) => {
            acc[sender.id] = sender.name;
            return acc;
          }, {});

          const sortedMailbox = data.map((gift) => ({
            ...gift,
            sender_name: senderMap[gift.sender_id] || "알 수 없음",
          })).sort((a, b) => {
            if (a.received === b.received) {
              return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return a.received ? 1 : -1;
          });

          setMailbox(sortedMailbox);
          setMail(sortedMailbox.filter((m) => !m.received).length);
        }
      } catch (error) {
        console.error("우편 데이터를 불러오는 중 예기치 않은 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMailbox();
  }, [giftPopup, setMail]);

  const handleReceiveGift = async (gift) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return alert("로그인이 필요합니다.");
    const userId = loggedInUser.id;

    let updatedBagItems = [];

    const { data: userData, error: userError } = await supabase
      .from("users_info")
      .select("bag_item")
      .eq("user_id", userId)
      .single();

    if (!userError && userData?.bag_item) {
      updatedBagItems = [...userData.bag_item];
    }

    const existingItem = updatedBagItems.find((item) => item.itemId === gift.item_id);
    if (existingItem) {
      existingItem.count += gift.count;
    } else {
      updatedBagItems.push({ itemId: gift.item_id, count: gift.count, used: false });
    }

    const { error: updateError } = await supabase
      .from("users_info")
      .update({ bag_item: updatedBagItems })
      .eq("user_id", userId);

    if (updateError) {
      console.error("🚨 소지품 업데이트 실패:", updateError);
      return alert("소지품 업데이트 중 오류 발생!");
    }

    const { error: receivedError } = await supabase
      .from("gift_records")
      .update({ received: true })
      .eq("id", gift.id);

    if (receivedError) {
      console.error("🚨 우편 상태 업데이트 실패:", receivedError);
      return alert("우편 상태 업데이트 중 오류 발생!");
    }

    setMailbox((prevMailbox) => {
      const updatedMailbox = prevMailbox.map((m) =>
        m.id === gift.id ? { ...m, received: true } : m
      );

      return updatedMailbox.sort((a, b) => {
        if (a.received === b.received) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        return a.received ? 1 : -1;
      });
    });

    setMail((prev) => Math.max(prev - 1, 0));

    alert(`${gift.item_name}을(를) 받았습니다!`);
  };

  return (
    <>
      <div className={style.overlay} onClick={() => setGiftPopup(false)}></div>

      <div className={style.popup} onClick={(e) => e.stopPropagation()}>
        <div className={style.popupTop}>
          우 편 함
          <span className={`${style.popupClose} cursorPointer`} onClick={() => setGiftPopup(false)}>×</span>
        </div>
        <div className={style.popupInner}>
          {loading ? (
            <p>로딩 중...</p>
          ) : mailbox.length === 0 ? (
            <p style={{ color: "#888" }}>비어있습니다.</p>
          ) : (
            mailbox.map((gift) => {
              const product = products.find((p) => p.id === gift.item_id);

              return (
                <div key={gift.id} className={`${style.mailItem} ${gift.received ? style.dimmed : ""}`}>
                  <div className={style.mail_left}>
                    <img src={product?.image} alt={gift.item_name} className={style.itemImage} />
                    <p>
                      <strong>{gift.sender_name}</strong> 에게<br />{gift.item_name}(을)를 받았다!
                    </p>
                  </div>

                  {!gift.received ? (
                    <button onClick={() => handleReceiveGift(gift)}>받기</button>
                  ) : (
                    <span className={style.receivedText}>받음</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
