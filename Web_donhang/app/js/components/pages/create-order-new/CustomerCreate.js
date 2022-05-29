import React, {useEffect} from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { DatePicker } from "antd";
import { createOrderCustomerFetch } from "../../hooks/createOrderCustomerFetch";
import "react-toastify/dist/ReactToastify.css";
const CustomerCreate = ({ valueOfUser, setValueOfUser, valueDate, setValueDate, handleChangeDate, handleChangeAddress, isReset, orderArray, setOrderArray, handleAdd, handleDelete }) => {
    const { location, setLocation } = createOrderCustomerFetch();
    useEffect(() => {
        setOrderArray([1])
        setValueDate([{value: ''}])
        setLocation({ address: [], area: "" })
    }, [isReset])
   
    return (
        <div style={{ marginBottom: "60px" }}>
            <div className="order_info">
                <div className="order_info_address">
                    <label>Nơi nhận hàng</label>
                    <label>Ngày giao hàng:</label>
                </div>
                {orderArray.map((data, index) => (
                    <div className="order_info_date">
                        <select onChange={(e) => handleChangeAddress(e, index)}  >
                            <option value="">Địa chỉ nhận hàng</option>
                            {location.address.map((d, i) => (
                                <option key={i} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        <div>
                            <DatePicker
                            value={valueDate[index] ? valueDate[index].value : ''}
                                className={`datePicker${index}`}
                                format="DD/MM/YYYY"
                                onChange={(date) =>
                                    handleChangeDate(date, index)
                                }
                            />
                            <div
                                className="order_info_address_add"
                                onClick={
                                    data
                                        ? () => handleAdd()
                                        : () => handleDelete(index)
                                }
                            >
                                {data ? <FaPlus /> : <FaMinus />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerCreate;
