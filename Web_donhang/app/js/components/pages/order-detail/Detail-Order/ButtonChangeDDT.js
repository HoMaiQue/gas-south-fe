import React, { useEffect } from "react";
import "./InputReason.css";

function ButtonChangeDDT({ setIsUpdate, isUpdate, setDropdown }) {
  const handleUpdate = ()=> {
    setIsUpdate(true)
    setDropdown(true)
  }
    return (
        <form className="input-reason__container">
            {!isUpdate && (
                <div
                    className="input-reason__submit margin-top300"
                    onClick={handleUpdate}
                >
                    <input
                        type="button"
                        className="orange fontsubmit"
                        value="Chỉnh sửa"
                    />
                </div>
            )}
            {isUpdate && (
                <div className="update-button-wrap">
                    <div
                        style={isUpdate ? { margin: "300px 0 0" } : {}}
                        className="input-reason__submit margin-top300"
                        onClick={() => setIsUpdate(false)}
                    >
                        <input
                            type="button"
                            className="orange fontsubmit"
                            value="Hủy"
                        />
                    </div>
                    <div
                        style={isUpdate ? { margin: "300px 0 0" } : {}}
                        className="input-reason__submit margin-top300"
                        
                    >
                        <input
                            type="submit"
                            className="green fontsubmit"
                            value="Lưu lại"
                            form="formDDT"
                        />
                    </div>
                </div>
            )}
        </form>
    );
}

export default ButtonChangeDDT;
