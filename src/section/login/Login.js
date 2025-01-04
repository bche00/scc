import React from 'react';

export default function Login({ onLogin }) {
  const handleLoginClick = () => {
    onLogin(); // 부모에서 전달된 handleLogin 호출
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}
