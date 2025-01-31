import React from 'react'

import Warning from "../asset/icon/warning.gif";

export default function notFound() {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center gap-3 mt-5'>
      <img src={Warning} alt="Warning" style={{height: '42px', width: '42px'}}/>
      ※ 잘못된 경로!!!
    </div>
  )
}
