import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { DatePicker } from "antd";
import orderManagement from "../../../../api/orderManagementApi";
import { createOrderSupplierFetch } from "../../hooks/createOrderSupplierFetch";
const AdminCreate = ({
    valueOfUser,
    setValueOfUser,
    valueDate,
    setValueDate,
    handleChangeDate,
    handleChangeAddress,
    isReset,
    orderArray,
    setOrderArray,
    handleAdd,
    handleDelete,
}) => {
    const [agency, setAgency] = useState("");
    const [customerType, setCustomerType] = useState([]);
    const [address, setAddress] = useState([]);
    const stationRef = useRef("");
    const areaRef = useRef("");
    const agencyRef = useRef("");
    const { station, area, setValueStation } = createOrderSupplierFetch();
    const nodeRef1 = useRef(false);
    const nodeRef2 = useRef(false);
    console.log(agency)
    useEffect(() => {
        setOrderArray([1]);
        setValueDate([{ value: "" }]);
        setAgency("");
        setCustomerType([]);
        setAddress([]);
        stationRef.current.value = "";
        areaRef.current.value = "";
        agencyRef.current.value = "";
    }, [isReset]);
    const handleAgency = (e) => {
        setAgency(e.target.value);
    };
    const handleStation = (e) => {
        setValueOfUser({ ...valueOfUser, supplier: e.target.value });
        setValueStation(e.target.value);
    };
    const handleArea = (e) => {
        setValueOfUser({ ...valueOfUser, area: e.target.value });
    };
    const handleCustomerType = (e) => {
        setValueOfUser({ ...valueOfUser, customers: e.target.value });
    };

    useEffect(() => {
        if (!nodeRef1.current) {
            nodeRef1.current = true;
            return;
        }
        const getCustomer = async () => {
            try {
                if (!agency || !valueOfUser.supplier || !valueOfUser.area) {
                    setCustomerType([]);
                    setAddress([]);
                    setValueOfUser({ ...valueOfUser, customers: "" });
                    return;
                }

                let params = {
                    type: agency,
                    objectId: valueOfUser.supplier,
                    area: valueOfUser.area,
                };

                const res = await orderManagement.getTypeCustomer(params);
                if (res && res.data) {
                    setCustomerType(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getCustomer();
    }, [agency, valueOfUser.supplier, valueOfUser.area]);

    useEffect(() => {
        if (!nodeRef2.current) {
            nodeRef2.current = true;
            return;
        }
        const getAddress = async () => {
            try {
                const res = await orderManagement.getAddress(
                    valueOfUser.customers
                );
                if (res && res.data) {
                    setAddress(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getAddress();
    }, [valueOfUser.customers]);
    return (
        <div className="tram_container">
            <div className="tram_title">
                <div>Tr???m</div>
                <div>V??ng</div>
                <div>?????i t?????ng</div>
            </div>
            <div className="tram_content">
                <div>
                    <select onChange={handleStation} ref={stationRef}>
                        <option value="">Ch???n tr???m</option>
                        {station.map((d, i) => (
                            <option key={i} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select onChange={handleArea} ref={areaRef}>
                        <option value="">Ch???n khu v???c</option>
                        {area.map((d, i) => (
                            <option key={i} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="tram_content_tong_dai_ly">
                    <div>
                        <select onChange={handleAgency} ref={agencyRef}>
                            <option value="">Ch???n ?????i t?????ng</option>
                            <option value="Tong_dai_ly">T???ng ?????i l??</option>
                            <option value="Cua_hang_thuoc_tram">
                                C???a h??ng tr???c thu???c tr???m
                            </option>
                            <option value="Cong_ty">
                                C??ng ty - Doanh nghi???p
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="tram_title">
                <div>Kh??ch h??ng</div>
                <div>?????a ch??? giao h??ng</div>
                <div>Ng??y giao h??ng</div>
            </div>
            {orderArray.map((data, index) => (
                <div key={index} className="tram_order">
                    {index === 0 ? (
                        <div className="tram_order_detail">
                            <select onChange={handleCustomerType}>
                                <option value="">Ch???n Kh??ch h??ng</option>
                                {customerType.map((d, i) => (
                                    <option key={i} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div
                            className="tram_order_detail"
                            style={{ opacity: "0", visibility: "hidden" }}
                        >
                            <select onChange={handleCustomerType}>
                                <option value="">Ch???n Kh??ch h??ng</option>
                                {customerType.map((d, i) => (
                                    <option key={i} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="tram_order_detail">
                        <select onChange={(e) => handleChangeAddress(e, index)}>
                            <option value="">Ch???n ?????a ch???</option>
                            {address.map((d, i) => (
                                <option key={i} value={d.address}>
                                    {d.address}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="tram_order_detail">
                        <div>
                            <div>
                                <DatePicker
                                    value={
                                        valueDate[index]
                                            ? valueDate[index].value
                                            : ""
                                    }
                                    onChange={(date) =>
                                        handleChangeDate(date, index)
                                    }
                                    format="DD/MM/YYYY"
                                />
                                <div
                                    className="order_info_address_add"
                                    onClick={
                                        index === 0
                                            ? () => handleAdd()
                                            : () => handleDelete(index)
                                    }
                                >
                                    {index === 0 ? <FaPlus /> : <FaMinus />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminCreate;
