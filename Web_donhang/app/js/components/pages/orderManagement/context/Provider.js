import { createContext } from "react";
import { orderManagementFetch } from "../../../hooks/orderManagementFetch";
export const themeContext = createContext();

export default function Provider({ children }) {
    const {
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
        loading,
        setLoading,
    } = orderManagementFetch();
    const value = {
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
        loading,
        setLoading,
    };
    return (
        <themeContext.Provider value={value}>{children}</themeContext.Provider>
    );
}
