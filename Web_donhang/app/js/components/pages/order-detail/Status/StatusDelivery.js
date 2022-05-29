import React,{useState} from 'react'
import {FaShippingFast}  from "react-icons/fa";
import DetailShipping from "./DetailShipping"
import "./status.css"

function StatusDelivery({datahistory}) {
  console.log("history",datahistory)
  return (
    <div>
    {
      datahistory&&datahistory.map((item)=>{
        // <DetailShipping status={true} datahistory={item}/>
        
        return(
            <DetailShipping status={false} datahistory={item}/>
            
        )
        
      })
    }

 </div>
  )
}

export default StatusDelivery