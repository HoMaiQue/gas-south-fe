import React,{useState} from 'react'
import {FaShippingFast}  from "react-icons/fa";
import DetailShipping from "./DetailShipping"
import "./status.css"

function StatusDeliveried({datahistory,status_1}) {
// console.log("code dang o day",datahistory)
// const renderList=(array)=>{
//   if(datahistory!==undefined){
//     for(let i=0;i<array.length;i++){
//           return  <DetailShipping status={true} datahistory={datahistory[i]}/>
//           // console.log("2 cai",datahistory[i])
//      }
    
//   }else{
//     return ;
//   }
// }
// const displayHistory=()=>{
//   if(datahistory!==undefined){
//     console.log("day la data tong",datahistory)
//     console.log( "data cua cai gi",renderList(datahistory))
//   }else{
//     return ;
//   }
// }
// displayHistory();
  return (
    <div>
    {
      datahistory&&datahistory.map((item)=>{
        // <DetailShipping status={true} datahistory={item}/>
        
        return(
            <DetailShipping status_1={status_1} status={true} datahistory={item}/>
        )
        
      })
    }

 </div>
  )
}

export default StatusDeliveried