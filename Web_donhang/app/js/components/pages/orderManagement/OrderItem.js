import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as FaIcon from "react-icons/fa";
import getUserCookies from "getUserCookies";
import { handleShowDate } from "../../../helpers/handleDate";
import Role from "../order-detail/Role";
import Modal from "../../modal";
import handleShowDisplay from "./handleShowDisplay";
import ModalEditOrder from "./ModalEditOrder";
const ContentWrapper = styled.div`
  background-color: #fff;
  border: 1px solid black;
  border-radius: 20px;
  padding: 12px 20px;
  width: 69%;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  .content-wrap {
    display: flex;
    justify-content: space-between;
  }
  .content-heading {
    font-size: 18px;
    font-weight: bold;
    color: black;
    margin-bottom: 0;
    display: flex;
    align-items: center;
  }
  .date-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-company {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 22px;
      font-weight: 500;
      color: black;
      margin-bottom: 0;
    }
  }
  .date {
    font-size: 22px;
    font-weight: 400;
    border: none;
  }
  .status {
    margin-right: 8px;
    font-size: 22px;
    font-weight: 600;
    color: orange;
    width: 100%;
    max-width: 150px;
    text-align: right;
  }
  .address {
    font-size: 22px;
  }
  @media screen and (max-width: 820px) {
    width: 100%;
  }
`;
const OrderItem = ({ orderItem }) => {
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roleData, setRoleData] = useState("");
  console.log(userType)
  useEffect(() => {
    const get_UserCookies = async () => {
      const user_cookies = await getUserCookies();
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
    };
    get_UserCookies();
  }, []);
  //modal edit order
  const [showModalEditOrder, setShowModalEditOrder] = useState(false);

  const handleOpenModalEditOrder = () => setShowModalEditOrder(true);
  const handleCloseModalEditOrder = () => setShowModalEditOrder(false);
  useEffect(() => {
    handleShowDisplay().then((data) => {
      setRoleData(data);
    });
  }, []);
  const handleClose = () => {
    setShowModal(false);
  };
  const handleStatus = (status) => {
    let statusNumber = 0;
    let gray_dark = "#343a40";
    let orange = "#fd7e14";
    let yellow = "#ffc107";
    let success = "#28a745";
    let red = "#dc3545";
    let blue = "#096Ab2";
    const statusRoles = [
      {
        role: "Giam_doc, Pho_giam_doc, Ke_toan",
        statusRole: [
          {
            status: "TO_NHAN_LENH_DA_DUYET",
            name: "Đơn hàng mới",
            color: `${gray_dark}`,
          },
          {
            status: "DON_HANG_MOI",
            name: "Đơn hàng mới",
            color: `${gray_dark}`,
          },
          {
            status: "TU_CHOI_LAN_1",
            name: "Từ chối lần 1",
            color: `${yellow}`,
          },
          {
            status: "TU_CHOI_LAN_2",
            name: "Từ chối lần 2",
            color: `${yellow}`,
          },
          {
            status: "GUI_DUYET_LAI",
            name: "Gửi duyệt lại",
            color: `${orange}`,
          },
          {
            status: "DA_DUYET",
            name: "Đã duyệt",
            color: `${success}`,
          },
          {
            status: "DANG_GIAO",
            name: "Đang giao",
            color: `${yellow}`,
          },
          {
            status: "DA_HOAN_THANH",
            name: "Đã hoàn thành",
            color: `${success}`,
          },
          {
            status: "KHONG_DUYET",
            name: "Không duyệt",
            color: `${red}`,
          },
        ],
      },
      {
        name: "TO NHAN LENH",
        statusRole: [
          {
            status: "DON_HANG_MOI",
            name: "Đơn hàng mới",
            color: `${gray_dark}`,
          },
          {
            status: "TU_CHOI_LAN_1",
            name: "Từ chối lần 1",
            color: `${yellow}`,
          },
          {
            status: "TU_CHOI_LAN_2",
            name: "Từ chối lần 2",
            color: `${yellow}`,
          },
          {
            status: "GUI_DUYET_LAI",
            name: "Gửi duyệt lại",
            color: `${orange}`,
          },
          {
            status: "TO_NHAN_LENH_DA_DUYET",
            name: "Đang duyệt",
            color: `${orange}`,
          },
          {
            status: "DA_DUYET",
            name: "Đã duyệt",
            color: `${success}`,
          },
          {
            status: "DANG_GIAO",
            name: "Đang giao",
            color: `${yellow}`,
          },
          {
            status: "DA_HOAN_THANH",
            name: "Đã hoàn thành",
            color: `${success}`,
          },
          {
            status: "KHONG_DUYET",
            name: "Không duyệt",
            color: `${red}`,
          },
        ],
      },
      {
        name: "Tram",
        statusRole: [
          {
            status: "DA_DUYET",
            name: "Đơn hàng mới",
            color: `${orange}`,
          },
          {
            status: "DANG_GIAO",
            name: "Đang giao",
            color: `${yellow}`,
          },
          {
            status: "DA_HOAN_THANH",
            name: "Đã hoàn thành",
            color: `${success}`,
          },
        ],
      },
      {
        name: "Khach hang",
        statusRole: [
          {
            status: "GUI_DUYET_LAI",
            name: "Chờ xác nhận",
            color: `${gray_dark}`,
          },
          {
            status: "DANG_DUYET",
            name: "Chờ xác nhận",
            color: `${gray_dark}`,
          },
          {
            status: "TU_CHOI_LAN_1",
            name: "Chờ xác nhận",
            color: `${gray_dark}`,
          },
          {
            status: "TU_CHOI_LAN_2",
            name: "Chờ xác nhận",
            color: `${gray_dark}`,
          },
          {
            status: "TO_NHAN_LENH_DA_DUYET",
            name: "Chờ xác nhận",
            color: `${gray_dark}`,
          },
          {
            status: "DON_HANG_MOI",
            name: "Chờ xác nhận",
            color: `${gray_dark}`,
          },
          {
            status: "DA_DUYET",
            name: "Xác nhận",
            color: `${blue}`,
          },
          {
            status: "DANG_GIAO",
            name: "Đang giao",
            color: `${yellow}`,
          },
          {
            status: "DA_HOAN_THANH",
            name: "Đã hoàn thành",
            color: `${success}`,
          },
          {
            status: "KHONG_DUYET",
            name: "Không duyệt",
            color: `${red}`,
          },
        ],
      },
    ];

    if (
      userType === "Government" ||
      userType === "SuperAdmin" ||
      userType === "Tong_cong_ty"
    ) {
      if (
        userRole === "Giam_doc" ||
        userRole === "Pho_giam_doc" ||
        userRole === "Ke_toan" ||
        userRole === "SuperAdmin"
      ) {
        statusNumber = 0;
      }
      if (userRole === "To_nhan_lenh") {
        statusNumber = 1;
      }
    }
    if (userType === "Tram") {
      statusNumber = 2;
    }
    if (userType === "Khach_hang") {
      statusNumber = 3;
    }

    for (var i = 0; i < statusRoles[statusNumber].statusRole.length; i++) {
      if (statusRoles[statusNumber].statusRole[i].status === status) {
        return {
          name: statusRoles[statusNumber].statusRole[i].name,
          color: statusRoles[statusNumber].statusRole[i].color,
        };
      }
    }
  };

  if (roleData === 1) {
    return (
      <React.Fragment>
        <Modal open={showModal} handleClose={handleClose}>
        {roleData === 1 && (
          <Role role="KH" status={orderItem.status} data={orderItem} />
        )}
        </Modal>
      <ContentWrapper onClick={() => setShowModal(true)}>
        <div className="content-wrap">
          <h3 className="content-heading"> {orderItem.orderCode}</h3>
          <span
            className="status"
            style={{
              color: `${handleStatus(orderItem.status) &&
                handleStatus(orderItem.status).color}`,
            }}
          >
            {handleStatus(orderItem.status) &&
              handleStatus(orderItem.status).name}
          </span>
        </div>
        <div className="content-company">
          <div className="date-wrap">
            <FaIcon.FaRegCalendarAlt className=" mr-3" />
            <span className="date">
              Ngày tạo: {handleShowDate(orderItem.createdAt)}
            </span>
          </div>
          <span className=" date">
            Ngày giao:
            {handleShowDate(
              orderItem.delivery && orderItem.delivery[0]
                ? orderItem.delivery[0].deliveryDate
                : ""
            )}
          </span>
        </div>
        <div>
          <FaIcon.FaMapMarkerAlt className=" mr-2 " />
          <span className="address">{orderItem.customers.address}</span>
        </div>
      </ContentWrapper>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Modal open={showModal} handleClose={handleClose}>
        {roleData === 1 && (
          <Role role="KH" status={orderItem.status} data={orderItem} />
        )}
        {roleData === 2 && (
          <Role
            role="TO_NHAN_LENH"
            status={orderItem.status}
            data={orderItem}
            handleOpenModalEditOrder={handleOpenModalEditOrder}
            handleClose={handleClose}
          />
        )}
        {roleData === 3 && (
          <Role role="KE_TOAN" status={orderItem.status} data={orderItem} />
        )}
        {roleData === 5 && (
          <Role
            role="Truong_phongKD"
            status={orderItem.status}
            data={orderItem}
          />
        )}

        {roleData === 6 && (
          <Role
            role="Pho_giam_docKD"
            status={orderItem.status}
            data={orderItem}
          />
        )}

        {roleData === 4 && (
          <Role
            role="DIEU_DO_TRAM"
            status={orderItem.status}
            data={orderItem}
          />
        )}
      </Modal>
      <ModalEditOrder
        open={showModalEditOrder}
        handleClose={handleCloseModalEditOrder}
        status={orderItem.status}
        data={orderItem}
        role="TO_NHAN_LENH"
      />
      <ContentWrapper onClick={() => setShowModal(true)}>
        <div className="content-wrap">
          <h3 className="content-heading"> {orderItem.orderCode}</h3>

          <div className="date-wrap">
            <FaIcon.FaRegCalendarAlt className=" mr-3" />
            <span className="date">
              Ngày tạo: {handleShowDate(orderItem.createdAt)}
            </span>
          </div>
          <span
            className="status"
            style={{
              color: `${handleStatus(orderItem.status) &&
                handleStatus(orderItem.status).color}`,
            }}
          >
            {handleStatus(orderItem.status) &&
              handleStatus(orderItem.status).name}
          </span>
        </div>
        <div className="content-company">
          <h3>{orderItem.supplier.name}</h3>
          <span className=" date">
            Ngày giao:
            {handleShowDate(
              orderItem.delivery && orderItem.delivery[0]
                ? orderItem.delivery[0].deliveryDate
                : ""
            )}
          </span>
        </div>
        <div>
          <FaIcon.FaMapMarkerAlt className=" mr-2 " />
          <span className="address">{orderItem.customers.address}</span>
        </div>
      </ContentWrapper>
    </React.Fragment>
  );
};

export default OrderItem;
