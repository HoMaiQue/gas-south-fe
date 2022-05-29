import { useEffect, useRef, useState } from "react";
import orderManagement from "../../../api/orderManagementApi";
export const orderManagementFetch = () => {
    const [loading, setLoading] = useState(false);
    const [countOrderStatus, setCountOrderStatus] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [dateStart, setDateStart] = useState();
    const [dateEnd, setDateEnd] = useState();
    const [orderCode, setOrderCode] = useState("");
    const [isClickSearch, setIsClickSearch] = useState(false);
    const isSearchRef = useRef(false);
    
   
    //render value
    useEffect(() => {
        const getOrderList = async () => {
            setLoading(true)
            const res = await orderManagement.getAll();
            if (res && res.data) {
                setOrderList(res.data);
                setCountOrderStatus(res.data);
            }
            setLoading(false);
        };
        getOrderList();
    }, []);
    
    // search
    useEffect(() => {
        if (!isSearchRef.current) {
            isSearchRef.current = true;
            return;
        }
        const searchOrder = async () => {
            setLoading(true)
            if (
                (orderCode === "" &&
                    dateStart === undefined &&
                    dateEnd === undefined) ||
                (orderCode === "" &&
                    (dateStart === undefined || dateEnd === undefined))
            ) {
                setLoading(false)
                return;
            }
            const params = {
                orderCode: orderCode,
                From: (dateStart && dateStart._d.toISOString()) || "",
                To: (dateEnd && dateEnd._d.toISOString()) || "",
            };       
            const res = await orderManagement.search(params);
            if (res && res.data) {
                setOrderList(res.data);
                setCountOrderStatus(res.data);
            }else {
                setOrderList([]);
                setCountOrderStatus([]);
            }
            setLoading(false)
        };
        searchOrder();
    }, [isClickSearch]);

    
    return {
        setOrderCode,
        setDateStart,
        setDateEnd,
        orderList,
        orderCode,
        dateStart,
        dateEnd,
        isClickSearch,
        setIsClickSearch,
        setOrderList,
        countOrderStatus,
        setCountOrderStatus,
        loading, setLoading
    };
};
