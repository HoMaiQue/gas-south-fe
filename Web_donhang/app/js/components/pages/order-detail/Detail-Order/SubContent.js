import React from "react";
import styled from "styled-components";
import InputReason from './InputReason'

const Wrapper = styled.div`
    margin-left: 30px;
    margin-top: 12px;
`;
const Header = styled.div`
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    column-gap: 36px;
    h3,
    span {
        font-size: 22px;
        margin-bottom: 0;
        color: #000000d9;
    }
    h3 {
        font-weight: 500;
    }
    span {
        font-weight: 700;
    }
`;
const ContainerDetail = styled.div`
    margin-bottom: 6px;
    margin-left: 8px;
    h4 {
        font-size: 18px;
        margin-bottom: 6px;
        font-weight: 700;
    }
    .list {
        display: flex;
        column-gap: 55px;
        span {
            font-weight: 400;
            color: black;
            font-size: 18px;
            
        }
    }

`;
const SubContent = ({status,datadetail}) => {
    // console.log("code day ne",datadetail[0].categoryCylinder.name)
    // console.log("code day",datadetail)
    const renderProduct=()=>{
        return datadetail.map((product)=>{
            return <ContainerDetail>
            
            <h4>{product.manufacture.name} - LOẠI {product.categoryCylinder.name}</h4>
            <div className="row ">
                <div className="col-md-6">
                    <div className="row">
                    <div className="col-md-4">
                    <span className="font-medium small-font ">Màu: {product.colorGas.name}</span>
                    </div>
                    <div className="col-md-4">
                    <span className="font-medium small-font ">Van: {product.valve.name}</span>
                    </div>
                    <div className="col-md-4">
                    <span className="font-medium small-font ">Số lượng: {product.quantity}</span>
                    </div>
                    </div>
                </div>
            </div>
        </ContainerDetail>
        })
    }
    // console.log(datadetail[1].quantity)
const totalValue=()=>{
    let total=0;
    for(let i =0;i<datadetail.length; i++){
        
        total= total+ datadetail[i].quantity
       
    }
    return total
}

    return (
        <Wrapper>
           <Header>
                <h3>Thông tin đặt hàng:</h3>
                <span>Số lượng: {totalValue()}</span>
            </Header>
            {renderProduct()}
            {/* {status=="GUI_DUYET_LAI"?<InputReason/>:""} */}
        </Wrapper>
    );
};

export default SubContent;
