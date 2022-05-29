import { useContext, useEffect, useRef, useState } from "react";
import orderManagement from "../../../../../api/orderManagementApi";
import { themeContext } from "../../orderManagement/context/Provider";
import { toast } from "react-toastify";
import ToastMessage from "../../../../helpers/ToastMessage";
function handleProcessOrder(
    data,
    statusChangeConfirm,
    statusChangeCancel,
    toastCancelSuccess
) {
    const [isClick, setIsClick] = useState(false);
    const [cancelClick, setCancelClick] = useState(false);
    const confirmRef = useRef(false);
    const cancelRef = useRef(false);
    const valueContext = useContext(themeContext);
    const [textValue, setTextValue] = useState("");
    const handleChange = (e) => {
        setTextValue(e.target.value);
    };
    useEffect(() => {
        if (!confirmRef.current) {
            confirmRef.current = true;
            return;
        }
        const confirmOrder = async () => {
            try {
                const res = await orderManagement.confirmOrder(data.id, {
                    note: textValue,
                });
                if (res && res.success) {
                    ToastMessage("success", "Xác nhận đơn hàng thành công");
                    data.status = statusChangeConfirm;
                    valueContext.setCountOrderStatus([
                        ...valueContext.countOrderStatus,
                    ]);
                    console.log(valueContext);
                } else {
                    ToastMessage("error", "Xác nhận đơn hàng thất bại");
                }
            } catch (error) {
                console.log(error);
            }
        };
        confirmOrder();
    }, [isClick]);

    useEffect(() => {
        if (!cancelRef.current) {
            cancelRef.current = true;
            return;
        }
        const cancelOrder = async () => {
            try {
                const res = await orderManagement.cancelOrderOne(data.id, {
                    note: textValue,
                });
                if (res && res.success) {
                    ToastMessage("success", toastCancelSuccess);

                    data.status = statusChangeCancel;
                    valueContext.setCountOrderStatus([
                        ...valueContext.countOrderStatus,
                    ]);
                } else {
                    ToastMessage("error", "Hãy nhập vào lí do từ chối");
                }
            } catch (error) {
                console.log(error);
            }
        };
        cancelOrder();
    }, [cancelClick]);
    return {
        isClick,
        setIsClick,
        handleChange,
        cancelClick,
        setCancelClick,
    };
}

export default handleProcessOrder;
