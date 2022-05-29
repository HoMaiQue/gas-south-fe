import React, { useEffect, useState } from "react";
import styled from "styled-components";
import handleShowDisplay from "./handleShowDisplay";
const Wrapper = styled.div`
    margin-bottom: 40px;
    .role_1 {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        column-gap: 22px;
    }
    .role_2,
    .role_3 {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        column-gap: 32px;
    }
    .role_4 {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        column-gap: 83px;
    }
    @media screen and (max-width: 820px) {
        .role_1 {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            column-gap: 35px;
        }
        .role_2 {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            column-gap: 11px;
        }
        .role_3 {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            column-gap: 44px;
        }
        .role_4 {
            column-gap: 40px;
        }
    }
`;
const List = styled.ul`
    list-style: none;
    background-color: #fff;
    border: 1px solid black;
    padding: 16px 12px;
    border-radius: 12px;
    display: grid;
    row-gap: 20px;
    column-gap: 20px;
    font-size: 20px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    span {
        font-size: 20px;
        cursor: pointer;
        font-weight: 600;
    }
`;
const Breadcrumb = ({ setOrderList, countOrderStatus }) => {
    const [role, setRole] = useState(0);
    const roles = [
        { role: 0, statuses: [] },
        {
            role: 1,
            statuses: [
                { name: "Tất cả", status: "" },
                { name: "Chờ xác nhận", status: "DON_HANG_MOI" },
                { name: "Xác nhận", status: "DA_DUYET" },
                { name: "Đang giao", status: "DANG_GIAO" },
                { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
                { name: "Không duyệt", status: "KHONG_DUYET" },
            ],
        },
        {
            role: 2,
            statuses: [
                { name: "Tất cả", status: "" },
                { name: "Đơn hàng mới", status: "DON_HANG_MOI" },
                { name: "Từ chối lần 1", status: "TU_CHOI_LAN_1" },
                { name: "Từ chối lần 2", status: "TU_CHO_LAN_2" },
                { name: "Gửi duyệt lại", status: "GUI_DUYET_LAI" },
                { name: "Đang duyệt", status: "TO_NHAN_LENH_DA_DUYET" },
                { name: "Đã duyệt", status: "DA_DUYET" },
                { name: "Đang giao", status: "DANG_GIAO" },
                { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
                { name: "Không duyệt", status: "KHONG_DUYET" },
            ],
        },
        {
            role: 3,
            statuses: [
                { name: "Tất cả", status: "" },
                { name: "Đơn hàng mới", status: "DON_HANG_MOI" },
                { name: "Từ chối lần 1", status: "TU_CHOI_LAN_1" },
                { name: "Từ chối lần 2", status: "TU_CHOI_LAN_2" },
                { name: "Gửi duyệt lại", status: "GUI_DUYET_LAI" },
                { name: "Đang duyệt", status: "DANG_DUYET" },
                { name: "Đã duyệt", status: "DA_DUYET" },
                { name: "Đang giao", status: "DANG_GIAO" },
                { name: "Đã hoàn thành", status: "DANG_GIAO" },
                { name: "Không duyệt", status: "KHONG_DUYET" },
            ],
        },
        {
            role: 4,
            statuses: [
                { name: "Tất cả", status: "" },
                { name: "Đơn hàng mới", status: "DON_HANG_MOI" },
                { name: "Đang giao", status: "DANG_GIAO" },
                { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
            ],
        },
    ];
    const [active, setActive] = useState(0);
    const handleFilterForStatus = (status) => {
        return countOrderStatus.filter((order, index) => {
            if (status === "") {
                return countOrderStatus;
            }
            const statusOfKH = [
                "DON_HANG_MOI",
                "TU_CHOI_LAN_1",
                "TU_CHOI_LAN_2",
                "GUI_DUYET_LAI",
                "DANG_DUYET",
                "TO_NHAN_LENH_DA_DUYET",
            ];
            const statusOfKT = ["TO_NHAN_LENH_DA_DUYET"]
            if (role === 1) {
                if (status === "DON_HANG_MOI") {
                    return statusOfKH.includes(order.status);
                }
                return order.status === status;
            }
            if (role === 3) {
                if (status === "DON_HANG_MOI") {
                    return statusOfKT.includes(order.status);
                }
                return order.status === status;
            }
            const statusOfTRAM = ["DA_DUYET"]
            if (role === 4) {
                if (status === "DON_HANG_MOI") {
                    return statusOfTRAM.includes(order.status);
                }
                return order.status === status;
            }
            
            return order.status === status;
        });
    };
    const handleActive = (index, status) => {
        setActive(index);
        setOrderList(handleFilterForStatus(status));
    };

    const filterOrderStatus = (status) => {
        const statusOfKH = [
            "DON_HANG_MOI",
            "TU_CHOI_LAN_1",
            "TU_CHOI_LAN_2",
            "GUI_DUYET_LAI",
            "DANG_DUYET",
            "TO_NHAN_LENH_DA_DUYET",
        ];
        const statusOfKT = ["TO_NHAN_LENH_DA_DUYET"]
        return countOrderStatus.filter((order) => {
            if (role === 1) {
                if (status === "DON_HANG_MOI") {
                    return statusOfKH.includes(order.status);
                }
                return order.status === status;
            }
            if (role === 3) {
                if (status === "DON_HANG_MOI") {
                    return statusOfKT.includes(order.status);
                }
                return order.status === status;
            }
            const statusOfTRAM = ["DA_DUYET"]
            if (role === 4) {
                if (status === "DON_HANG_MOI") {
                    return statusOfTRAM.includes(order.status);
                }
                return order.status === status;
            }
            return order.status === status;
        });
    };

    useEffect(() => {
        handleShowDisplay().then((data) => {
            if(data > 4){
                setRole(3)
            }else {
                setRole(data);
            }
        });
    }, []);

    return (
        <Wrapper>
            <List className={`role_${roles[role].role}`}>
                { roles[role].statuses.map((status, index) => {
                    return (
                        <li
                            onClick={() => handleActive(index, status.status)}
                            key={index}
                            style={
                                roles[role].role === 3 && index === 5
                                    ? { visibility: "hidden" }
                                    : {}
                            }
                        >
                            <span
                                style={
                                    active === index ? { color: "black" } : {}
                                }
                            >
                                {status.name} (
                                {status.status === ""
                                    ? countOrderStatus.length
                                    : filterOrderStatus(status.status).length}
                                )
                            </span>
                        </li>
                    );
                })}
            </List>
        </Wrapper>
    );
};

export default Breadcrumb;
