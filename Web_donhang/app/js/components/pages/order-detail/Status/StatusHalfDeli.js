import React,{useState} from 'react'

import DetailShipping from "./DetailShipping"
import "./status.css"

function StatusHalfDeli() {

  return (
    <div>
         <DetailShipping status={true}/>
    </div>
  )
}

export default StatusHalfDeli