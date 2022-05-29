import React from "react";
import handleProcessOrder from "./handleProcessOrder";
function OrderNewKT({ data }) {
    const {isClick, setIsClick,handleChange, cancelClick, setCancelClick } = handleProcessOrder(data, "DA_DUYET", "TU_CHOI_LAN_1","Từ chối đơn hàng lần 1 thành công")
    return (
        <form className="input-reason__container">
            <label className="input-reason__label">
                <textarea
                    className="input-reason-form"
                    name="name"
                    placeholder="Nhập lí do"
                    onChange={handleChange}
                />
            </label>
            <div className="input-reason__submit">
                <input
                    type="button"
                    className="orange fontsubmit"
                    value="Từ chối lần một"
                    onClick={() => setCancelClick(!cancelClick)}
                />
                <input
                    type="button"
                    className="green fontsubmit"
                    value="Duyệt đơn hàng"
                    onClick={() => setIsClick(!isClick)}
                />
            </div>
        </form>
    );
}

export default OrderNewKT;
