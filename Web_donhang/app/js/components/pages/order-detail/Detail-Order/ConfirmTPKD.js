import React from "react";
import handleProcessOrder from "./handleProcessOrder";
function ConfirmTPKD({ data }) {
    const {isClick, setIsClick,handleChange, cancelClick, setCancelClick } = handleProcessOrder(data, "GUI_DUYET_LAI", "KHONG_DUYET","Từ chối đơn hàng thành công")
    return (
        <form className="input-reason__container">
            <label className="input-reason__label">
                <textarea
                    className="input-reason-form"
                    name="name"
                    placeholder="Nhập lí do (*)"
                    onChange={handleChange}
                />
            </label>
            <div className="input-reason__submit">
                <input
                    type="button"
                    className="orange fontsubmit"
                    value="Không duyệt"
                    onClick={() => setCancelClick(!cancelClick)}
                />
                <input
                    type="button"
                    className="green fontsubmit"
                    value="Gửi duyệt lại"
                    onClick={() => setIsClick(!isClick)}
                />
            </div>
        </form>
    );
}

export default ConfirmTPKD;
