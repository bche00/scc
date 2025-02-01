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


  // 팝업 출력
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
      const { data, error, status } = await supabase
        .from('users')
        .insert(
          [
            {
              name: form.name.trim(),
              password: form.password,
              gender: form.gender,
              status: 'pending',
            },
          ],
          { returning: 'representation' }
        );
  
      console.log("Response Details:", { data, error, status });
  
      if (error) {
        console.error("Supabase Error Details:", { error, status });
        alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
      } else if (status === 201) {
        alert("입부 신청이 완료되었습니다! 부장의 승인을 기다려주세요.");
        setForm({
          name: "",
          password: "",
          confirmPassword: "",
          gender: "",
          checkbox1: false,
          checkbox2: false,
        });
      } else {
        alert("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("예기치 않은 오류가 발생했습니다.");
    }
  };
  
  

// html
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
