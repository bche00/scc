import React from 'react';
import style from './layout.module.scss';
import Util from '../util/Util';

export default function Layout({ children }) {
  return (
    <div className={style.container}>
      <div className={style.phone}>
        <div className={style.bar}>
          心靈捕捉部 <span className={style.close}>×</span>
        </div>
        <div className={style.content}>{children}
          <Util />
        </div>
      </div>
    </div>
  );
}
