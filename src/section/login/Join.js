import React, { useState } from "react";
import style from './join.module.scss';

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    alert("입부신청이 완료되었습니다!");
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
            <tr>
              <td>성별</td>
              <td>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="女"
                    checked={form.gender === "女"}
                    onChange={handleChange}
                  />
                  女
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="男"
                    checked={form.gender === "男"}
                    onChange={handleChange}
                  />
                  男
                </label>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className={style.formRow}>
                <div className={style.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="checkbox1"
                    name="checkbox1"
                    checked={form.checkbox1}
                    onChange={handleChange}/>
                  <label htmlFor="checkbox1">
                    저는 정신과 신체 모두 정상입니다.
                  </label>
                </div>
                <div className={style.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="checkbox2"
                    name="checkbox2"
                    checked={form.checkbox2}
                    onChange={handleChange}/>
                  <label htmlFor="checkbox2">
                    심령포착부 활동 중 발생하는 모든 일에 동의하며,
                    심령포착부 측에 책임을 묻지 않습니다.
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <button type="submit">입부신청</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
    
  );
}
