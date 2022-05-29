import React,{useState} from 'react'
import "./status.css"
import DetailDropdown from './DetailDropdown';
import {FaAngleDown,FaAngleUp}  from "react-icons/fa";

const DetailShipping=({status,datahistory,status_1})=> {
    // console.log("status",status_1)
    // const getTransport=()=>{
    //     if(datahistory!==undefined){
    //         let transport=[];
    //         for(let i =0;i<datahistory.length; i++){
                
    //             transport.push(datahistory[i].transport)
    //         }
            
    //         return <span className="date-text">{transport[0]}</span>
    //     }
    //     else{
    //         return ;
    //     }
    // }
    // console.log("daata",datahistory)
    // const deliveryDate=()=>{
    //     if(datahistory!==undefined){let date=[];
    //         for(let i =0;i<datahistory.length; i++){
                
    //             date.push(datahistory.deliveryDate)
               
    //         }
    //         // console.log("date",date[0])
    //         return <span className="date-text">{date[0]}</span>
    //     }
    //     else{
    //         return ;
    //     }
    // }
    const totalValueHistory=()=>{
        if(datahistory!==undefined){
            let total=0;
        for(let i =0;i<datahistory.length; i++){
            
            total= total+ datahistory[i].quantity
           
        }
        return total
        }
        else{
            return ;
        }
    }
    
    const [dropdown,setDropdown] = useState(false)
    const showDetailDropdown =()=>{
        setDropdown(!dropdown)
    }
   
  return (
    <div className="detail-shipping__container ">
         <div className="detail-shipping">
            <div className="date-text">
                <h3>Tài xế :Nguyễn Văn A </h3>
            </div>
            <div className=" margin-left60p">
                {status_1==="DANG_GIAO"?"":<h3>Số lượng: {datahistory.quantity}</h3>}

            </div>
        </div>
        <div className="detail-shipping__infor">
            <div className="detail-shipping-number">
                <span className="date-text margin-right-10 ">Biển số xe: {datahistory.transport} </span>
                {status_1=="DA_HOAN_THANH"&&<span className="date-text">{datahistory.deliveryDate}</span>}
                {status_1=="DANG_GIAO"?"":<span></span>}
            </div>
            
        </div>
        {
            dropdown?<DetailDropdown datahistory={datahistory} /> :""
        }
        <div className={status ?"arrow-icon": "hidden"}>
        {
                dropdown?<FaAngleUp onClick={showDetailDropdown}/>:<FaAngleDown  onClick={showDetailDropdown}/>
            }
        </div>
    </div>
  )
}

export default DetailShipping