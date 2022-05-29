import React from "react";
import styled from "styled-components";
const ContentSearch = styled.div`
    display: flex;
    flex-direction: column;
    margin: 6px 0 10px;
    justify-content: space-between;
    height: 100%;
    .content-search-wrap {
        display: flex;
        align-items: center;
    }
    .content-search-input {
        height: 45px;
        border-radius: 12px;
        padding: 0 24px;
        width: 66%;
        font-size: 16px;
        font-weight: 400;
        border: 1px solid black;
        letter-spacing: 3px;
        @media screen and (max-width: 820px) {
            height: 35px;
            font-size: 14px;
            width: 90%;

        }
        :focus {
            outline: none
        }
    }
   
`;
const SearchOrder = ({orderCode, setOrderCode}) => {
   
    const handleInputChange = (event) => {
        setOrderCode(event.target.value)
    }
    return (
        <ContentSearch>
            <div className="content-search-wrap">
                <input
                    value={orderCode}
                    onChange={(handleInputChange)}
                    className=" content-search-input "
                    type="text"
                    placeholder="Nhập mã khách hàng, mã đơn hàng tìm kiếm"
                />
            </div>
        
        </ContentSearch>
    );
};

export default SearchOrder;
