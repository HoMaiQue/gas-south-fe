import React, { useLayoutEffect, useState } from "react";
import "./InforOrder.css";
import * as FaIcon from "react-icons/fa";
import SubContent from "./Detail-Order/SubContent";
import InputConfirm from "./Detail-Order/InputConfirm";
import ButtonChange from "./Detail-Order/ButtonChange";
import ButtonChangeDDT from "./Detail-Order/ButtonChangeDDT";
import OrderNewKT from "./Detail-Order/OrderNewKT";
import { handleShowDate } from "../../../helpers/handleDate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import UpdateOrderDDT from "./updateOrder/UpdateOrderDDT";
import ConfirmTPKD from "./Detail-Order/ConfirmTPKD";
import ConfirmPGD from "./Detail-Order/ConfirmPGD";
import CancelOrderTwoKT from "./Detail-Order/CancelOrderTwoKT";

function InforOrder({
  status,
  data,
  datadetail,
  role,
  handleOpenModalEditOrder,
  handleClose,
  setDataOrder
}) {
  // console.log('this is data', data)
  const [dropdown, setDropdown] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  // console.log(isUpdate)
  // useLayoutEffect(() => {

  //     return ()=> {
  //       setIsUpdate(false)
  //     }
  //   }, [])
  const renderProduct = () => {
    return (
      data.delivery &&
      data.delivery.map((product) => {
        return (
          <span className="date-text">
            {handleShowDate(product.deliveryDate)}
          </span>
        );
      })
    );
  };

  // console.log("role dang nhan",role)
  console.log("day la status", status);
  // console.log("code dang o day",status)
  // console.log("code ",data)

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="infor-order__container">
        <div className="code-wrap ">
          <h3 className="text-[22px] font-semibold text-black">
            {data.orderCode}
          </h3>
          {status === "TU_CHOI_LAN_1" && role === "Truong_phongKD" ? (
            <h3 className=" date-text margin-right200 color-grey">
              Từ chối lần 1
            </h3>
          ) : (
            ""
          )}
          {status === "TU_CHOI_LAN_2" && role === "Pho_giam_docKD" ? (
            <h3 className=" date-text margin-right200 color-grey">
              Từ chối lần 2
            </h3>
          ) : (
            ""
          )}
          {status === "DON_HANG_MOI"&&role!=="KH"? (
            <h3 className=" date-text margin-right200 color-grey">
              Chờ xác nhận
            </h3>
          ) : (
            ""
          )}
          {status === "TO_NHAN_LENH_DA_DUYET" && role === "KE_TOAN" ? (
            <h3 className=" date-text margin-right200 color-grey">
              Đơn hàng mới
            </h3>
          ) : (
            ""
          )}
        </div>
        <div className="company-wrap margin-bottom12">
          {status === "GUI_DUYET_LAI" ||
          status === "TU_CHOI_LAN_2" ||
          status === "DON_HANG_MOI"&&role!=="KH"||
          status === "DANG_DUYET" ||
          status === "DA_DUYET"&&role!=="KH" ||
          status === "DA_HOAN_THANH" ||
          status === "KHONG_DUYET"&&role!=="KH" ||
          (status === "TO_NHAN_LENH_DA_DUYET" && role === "KE_TOAN") ||
          (status === "TU_CHOI_LAN_1" && role === "Truong_phongKD") ? (
            <div className="date-wrap">
              <h3 className="text-[22px] font-semibold text-black margin-right450">
                {data.supplier.name}
              </h3>
            </div>
          ) : (
            ""
          )}
          <div className="date-wrap padding-left100 ">
            <FaIcon.FaRegCalendarAlt className="ordered-icon" />
            <span className=" date-text  ">
              Ngày tạo {handleShowDate(data.createdAt)}
            </span>
          </div>
          {status === "GUI_DUYET_LAI" ||
          status === "TU_CHOI_LAN_2" ||
          status === "DON_HANG_MOI" ||
          status === "DANG_DUYET" ||
          status === "DA_DUYET" ||
          status === "KHONG_DUYET" &&role!=="KH"||
          ((status === "TO_NHAN_LENH_DA_DUYET" && role === "KE_TOAN") ||
            (status === "TU_CHOI_LAN_1" && role === "Truong_phongKD")) ? (
            <div className="date-wrap margin-right100">
              <div className=" date-order-shipping">
                <span className="date-text date-shipping">
                  <FaIcon.FaRegCalendarAlt className="ordered-icon"  />
                  Ngày giao
                </span>
                <div className="date-detail-shipping ">{renderProduct()}</div>
                {/* {console.log("code dang o day ",data.delivery[0].values)} */}
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

        {dropdown && !isUpdate && (
          <SubContent status={status} datadetail={datadetail} />
        )}
        {dropdown ? (
          <FaIcon.FaAngleUp
            className="arrow-icon"
            onClick={() => setDropdown(false)}
          />
        ) : (
          <FaIcon.FaAngleDown
            className="arrow-icon "
            onClick={() => setDropdown(true)}
          />
        )}
        {dropdown && isUpdate && (
          <UpdateOrderDDT status={status} datadetail={datadetail} data={data} setIsUpdate={setIsUpdate} setDataOrder={setDataOrder}/>
        )}


        {/* TO NHAN LENH*/}
        {status === "DON_HANG_MOI" && role === "TO_NHAN_LENH" ? (
          <InputConfirm
            handleOpenModalEditOrder={handleOpenModalEditOrder}
            handleClose={handleClose}
            data={data}
          />
        ) : (
          ""
        )}
        {status === "TU_CHOI_LAN_1" && role === "Truong_phongKD" ? (
          <ConfirmTPKD data={data} />
        ) : (
          ""
        )}
        {status === "TU_CHOI_LAN_2" && role === "Pho_giam_docKD" ? (
          <ConfirmPGD data={data} />
        ) : (
          ""
        )}

        {status === "DA_DUYET" && role === "TO_NHAN_LENH" ? (
          <ButtonChange
            handleOpenModalEditOrder={handleOpenModalEditOrder}
            handleClose={handleClose}
          />
        ) : (
          ""
        )}
        {/* KE TOAN */}
        {status === "TO_NHAN_LENH_DA_DUYET" && role === "KE_TOAN" ? (
          <OrderNewKT data={data} />
        ) : (
          ""
        )}
        {status === "GUI_DUYET_LAI" && role === "KE_TOAN" ? (
          <CancelOrderTwoKT data={data} />
        ) : (
          ""
        )}
      </div>
      {/* DIEU DO TRAM */}
      {status === "DA_DUYET" &&
      role === "DIEU_DO_TRAM" &&
      role !== "TO_NHAN_LENH" ? (
        <ButtonChangeDDT
          setIsUpdate={setIsUpdate}
          isUpdate={isUpdate}
          setDropdown={setDropdown}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default InforOrder;
