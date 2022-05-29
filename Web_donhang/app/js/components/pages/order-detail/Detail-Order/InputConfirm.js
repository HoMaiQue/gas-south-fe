import React from "react";
import "./InputReason.css";
import handleProcessOrder from "./handleProcessOrder";
function InputConfirm({ data, handleOpenModalEditOrder, handleClose }) {
  const { isClick, setIsClick,handleChange } = handleProcessOrder(
    data,
    "TO_NHAN_LENH_DA_DUYET"
  );
  const handleEditOrderClick = (e) => {
    e.preventDefault();
    handleClose();
    handleOpenModalEditOrder();
  };
  return (
    <form className="input-reason__container">
      <label className="input-reason__label">
        <textarea
          className="input-reason-form"
          name="name"
          placeholder="Ghi Chú"
          onChange={handleChange}
        />
      </label>
      <div className="input-reason__submit">
        <input
          onClick={(e) => handleEditOrderClick(e)}
          type="button"
          className="orange fontsubmit"
          value="Chỉnh Sửa Đơn"
        />
        <input
          type="button"
          className="green fontsubmit"
          value="Xác nhận đơn hàng"
          onClick={() => setIsClick(!isClick)}
        />
      </div>
    </form>
  );
}

export default InputConfirm;
