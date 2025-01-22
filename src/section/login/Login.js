import React from 'react';

export default function Login({ onLogin }) {
  const handleLoginClick = () => {
    onLogin();
  };

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}
