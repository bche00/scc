import React, { useState } from "react";
import style from './join.module.scss';
import { supabase } from "../../db/supabase";

import CustomRadio from "../../components/commonUI/CustomRadio";
import CustomCheckbox from "../../components/commonUI/CustomCheckbox";

export default function SignUpForm() {
  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    gender: "",
    checkbox1: false,
    checkbox2: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCustomCheckboxChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCustomRadioChange = (value) => {
    setForm({
      ...form,
      gender: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.gender) {
      alert("성별을 선택해주세요.");
      return;
    }
    if (!form.checkbox1 || !form.checkbox2) {
      alert("필수 체크박스를 모두 선택해주세요.");
      return;
    }

    try {
      const { error: insertError, status } = await supabase
        .from("users")
        .insert(
          [
            {
              name: form.name.trim(),
              password: form.password,
              gender: form.gender,
              status: "pending",
            },
          ]
        );

      if (insertError) {
        console.error("가입 실패:", insertError);
        alert(`회원가입 중 오류가 발생했습니다: ${insertError.message}`);
        return;
      }

      // 방금 가입한 유저 ID 다시 조회
      const { data: userQuery, error: queryError } = await supabase
        .from("users")
        .select("id")
        .eq("name", form.name.trim())
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (queryError || !userQuery) {
        console.error("유저 조회 실패:", queryError);
        alert("가입은 되었지만 사용자 정보를 찾을 수 없습니다.");
        return;
      }

      const userId = userQuery.id;

      // users_info 존재 여부 확인
      const { data: infoCheck } = await supabase
        .from("users_info")
        .select("user_id")
        .eq("user_id", userId)
        .single();

if (!infoCheck) {
  // 신규 insert
  const { error: infoInsertError, data: infoInsertData } = await supabase.from("users_info").insert([
    {
      user_id: userId,
      name: form.name.trim(),
      coin: 2,
      bag_item: [],
      explore_limit: { remaining: 3 },
    },
  ]);
  if (infoInsertError) {
    console.error("users_info 초기화 실패:", infoInsertError);
    alert("가입은 성공했지만 정보 저장에 실패했습니다.");
  } else {
    //console.log("users_info에 코인 지급 완료:", infoInsertData);
  }
} else {
  // 이미 있으면 코인 2개로 강제 업데이트 (필요시)
  const { error: infoUpdateError } = await supabase
    .from("users_info")
    .update({ coin: 2 })
    .eq("user_id", userId);

  if (infoUpdateError) {
    console.error("users_info 코인 업데이트 실패:", infoUpdateError);
  } else {
    //console.log("users_info 코인 2개로 업데이트 완료");
  }
}



      alert("입부 신청이 완료되었습니다! 부장의 승인을 기다려주세요.");

      setForm({
        name: "",
        password: "",
        confirmPassword: "",
        gender: "",
        checkbox1: false,
        checkbox2: false,
      });
    } catch (err) {
      console.error("예기치 않은 오류:", err);
      alert("예기치 않은 오류가 발생했습니다.");
    }
  };

  return (
    <div className={style.container}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <table cellPadding="10">
          <tbody>
            <tr>
              <td>이름 :</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  maxLength="8"
                  onChange={handleChange}
                  placeholder="이름을 입력해주세요."
                  required
                  autoComplete="username"
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호 :</td>
              <td>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력해주세요."
                  required
                  autoComplete="new-password"
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호<br />확인 :</td>
              <td>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 확인해주세요."
                  required
                  autoComplete="new-password"
                />
              </td>
            </tr>
            <tr className={style.radio}>
              <td>성별 :</td>
              <td>
                <CustomRadio
                  name="gender"
                  value="女"
                  selectedValue={form.gender}
                  onChange={handleCustomRadioChange}
                  label="女"
                />
                <CustomRadio
                  name="gender"
                  value="男"
                  selectedValue={form.gender}
                  onChange={handleCustomRadioChange}
                  label="男"
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" className={style.formRow}>
                <div className={style.checkboxContainer}>
                  <CustomCheckbox
                    checked={form.checkbox1}
                    onChange={(value) => handleCustomCheckboxChange("checkbox1", value)}
                    label="저는 정신과 신체 모두 정상입니다."
                  />
                </div>
                <div className={style.checkboxContainer}>
                  <CustomCheckbox
                    checked={form.checkbox2}
                    onChange={(value) => handleCustomCheckboxChange("checkbox2", value)}
                    label="심령포착동아리 활동 중 발생하는 모든 일에 동의하며 책임을 묻지 않습니다."
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <button type="submit" className={style.btn}>입부신청</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
