import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";

import style from "./login.module.scss";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ name: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  const handleJoinUsClick = () => {
    navigate("/join-us");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleLoginClick = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("name", form.name)
        .eq("password", form.password)
        .eq("status", "approved")
        .single();

      if (error || !data) {
        setErrorMessage(
          "이름 또는 비밀번호가 올바르지 않거나,\n승인되지 않은 회원입니다."
        );
        console.error("Login Error:", error);
        return;
      }

      setErrorMessage("");

      onLogin();
      navigate("/"); // 홈 화면으로 이동
    } catch (err) {
      console.error("Unexpected Error:", err);
      setErrorMessage("예기치 않은 오류가 발생했습니다.\n다시 시도해주세요.");
    }
  };

  return (
    <div className={style.container}>
      <h2>心靈捕捉部</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginClick();
        }}>
        <div>
          <label htmlFor="name">이름 :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required/>
        </div>
        <div>
          <label htmlFor="password">비밀번호 :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required/>
        </div>
        {errorMessage && (
          <p style={{
              color: "red",
              whiteSpace: "pre-line", // \n을 줄바꿈으로 처리
            }}>
            {errorMessage}
          </p>
        )}
        <div className={style.btn}>
          <button onClick={handleLoginClick}>로그인</button>
          <span className="cursorPointer" onClick={handleJoinUsClick}>회원가입</span>
        </div>
      </form>
    </div>
  );
}
