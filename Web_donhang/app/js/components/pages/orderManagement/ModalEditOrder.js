import Constant from "Constants";
import React, { useEffect, useState } from "react";
import * as FaIcon from "react-icons/fa";
import styled from "styled-components";
import orderManagement from "../../../../api/orderManagementApi";
import { handleShowDate } from "../../../helpers/handleDate";
import { createOrderFetch } from "../../hooks/createOrderFetch";
import Modal from "../../modal";
import "../order-detail/InforOrder.css";

const Wrapper = styled.div`
  margin-left: 30px;
  margin-top: 12px;
`;
const Header = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  column-gap: 36px;
  h3,
  span {
    font-size: 22px;
    margin-bottom: 0;
    color: #000000d9;
  }
  h3 {
    font-weight: 500;
  }
  span {
    font-weight: 700;
  }
`;
const ModalEditOrder = (props) => {
  const { open, handleClose, status, data, role } = props;
  const { valves, colors, menuFacture, category } = createOrderFetch();
  const [dataOrder, setDataOrder] = useState([]);

  useEffect(() => {
    const getRole = async () => {
      const dataOrderDetail = await orderManagement.detailOrder(data.id);
      setDataOrder(dataOrderDetail.data);
    };
    getRole();
  }, [data.id]);
  const renderProduct = () => {
    return (
      data.delivery &&
      data.delivery.map((product) => {
        return (
          <div className="date-text">
            {handleShowDate(product.deliveryDate)}
          </div>
        );
      })
    );
  };
  const renderStatusOrder = () => {
    let color;
    if (Constant.ORDER_STATUS.find((o) => o.key === status) !== undefined) {
      color = Constant.ORDER_STATUS.find((o) => o.key === status).color;
    }
    return (
      <h3 className="date-text margin-right200" style={{ color: color }}>
        {Constant.ORDER_STATUS.find((o) => o.key === status) &&
          Constant.ORDER_STATUS.find((o) => o.key === status).value}
      </h3>
    );
  };
  const totalValue = () => {
    let total = 0;
    for (let i = 0; i < dataOrder.length; i++) {
      total = total + dataOrder[i].quantity;
    }
    return total;
  };
  const handleCancelClick = () => {
    handleClose();
  };
  const handleSaveClick = () => {
    console.log("luu lai click", dataOrder);
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <div className="container">
        <div className="row">
          <div className="infor-order__container modal_edit_order custom-scrollbar">
            <div className="code-wrap ">
              <h3 className="text-[22px] font-semibold text-black">
                {data.orderCode}
              </h3>
              {renderStatusOrder()}
            </div>
            <div className="row">
              {status === "GUI_DUYET_LAI" ||
              status === "TU_CHOI_LAN_2" ||
              status === "DON_HANG_MOI" ||
              status === "DANG_DUYET" ||
              status === "DA_DUYET" ||
              status === "DA_HOAN_THANH" ||
              status === "KHONG_DUYET" ||
              (status === "TO_NHAN_LENH_DA_DUYET" &&
                role === "TO_NHAN_LENH") ? (
                <div className="col-md-4">
                  <h3 className="text-[22px] font-semibold text-black">
                    {data.supplier.name}
                  </h3>
                </div>
              ) : (
                ""
              )}
              <div className="col-md-4">
                <FaIcon.FaRegCalendarAlt className="ordered-icon " />
                <span className=" date-text  ">
                  Ngày tạo: {handleShowDate(data.createdAt)}
                </span>
              </div>
              {status === "GUI_DUYET_LAI" ||
              status === "TU_CHOI_LAN_2" ||
              status === "DON_HANG_MOI" ||
              status === "DANG_DUYET" ||
              status === "DA_DUYET" ||
              status === "KHONG_DUYET" ||
              (status === "TO_NHAN_LENH_DA_DUYET" &&
                role === "TO_NHAN_LENH") ? (
                <div className="col-md-4">
                  <div className="row">
                    <div className="date-text col-md-6 d-flex">
                      <div className="ml-auto">
                        <FaIcon.FaRegCalendarAlt className="ordered-icon" />
                        Ngày giao:
                      </div>
                    </div>
                    <div className="col-md-6">{renderProduct()}</div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="address-wrap ">
              <FaIcon.FaMapMarkerAlt className="ordered-icon" />
              <span className="date-text ">{data.customers.address}</span>
            </div>
            <div className="row">
              <Wrapper>
                <Header>
                  <h3>Thông tin đặt hàng:</h3>
                  <span>Số lượng: {totalValue()}</span>
                </Header>
              </Wrapper>
            </div>
            {dataOrder &&
              dataOrder.map((data, index) => {
                return (
                  <div key={index} className="mt-2">
                    {/* <div className="row">
                      <h4 className="text-uppercase pl-3">
                        {data.manufacture.name} - LOẠI{" "}
                        {data.categoryCylinder.name}
                      </h4>
                    </div> */}
                    <div className="row">
                      {/* <div className="col-md-1">
                        <FaIcon.FaMinusCircle className="fa_icon" />
                      </div> */}
                      <div className="col-md-3">
                        <select className="form-control border border-dark rounded">
                          <option>Thương hiệu</option>
                          {menuFacture &&
                            menuFacture.map((d, i) => (
                              <option
                                value={d.id}
                                key={i}
                                selected={
                                  data.manufacture.id === d.id ? true : false
                                }
                              >
                                {d.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select className="form-control border border-dark rounded">
                          <option>Loại bình</option>
                          {category &&
                            category.map((d, i) => (
                              <option
                                value={d.id}
                                key={i}
                                selected={
                                  data.categoryCylinder.id === d.id
                                    ? true
                                    : false
                                }
                              >
                                {d.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select className="form-control border border-dark rounded">
                          <option>Màu sắc</option>
                          {colors &&
                            colors.map((d, i) => (
                              <option
                                value={d.id}
                                key={i}
                                selected={
                                  data.colorGas.id === d.id ? true : false
                                }
                              >
                                {d.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select className="form-control border border-dark rounded">
                          <option>Loại van</option>
                          {valves &&
                            valves.map((d, i) => (
                              <option
                                value={d.id}
                                key={i}
                                selected={data.valve.id === d.id ? true : false}
                              >
                                {d.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <input
                          className="form-control border border-dark rounded"
                          placeholder="Số lượng"
                          type="number"
                          defaultValue={parseInt(data.quantity)}
                        />
                      </div>
                      {index === 0 ? (
                        <div className="col-md-1">
                          <FaIcon.FaPlusCircle className="fa_icon" />
                        </div>
                      ) : (
                        <div className="col-md-1">
                          <FaIcon.FaMinusCircle className="fa_icon" />
                        </div>
                      )}
                      {/* <div className="col-md-1">
                        <FaIcon.FaPlusCircle className="fa_icon" />
                      </div> */}
                    </div>
                  </div>
                );
              })}
            <div className="row mt-5">
              <div className="col-md-6 d-flex flex-row-reverse">
                <button className="btn btn-warning" onClick={handleCancelClick}>
                  Bỏ qua
                </button>
              </div>
              <div className="col-md-6">
                <button className="btn btn-success" onClick={handleSaveClick}>
                  Lưu lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditOrder;
