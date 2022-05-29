import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import "./ModalFilter.scss";
import moment from "moment";
import { createOrderSupplierFetch } from "../../hooks/createOrderSupplierFetch";
import { DatePicker } from "antd";
import axios from "axios";
import getUserCookies from "getUserCookies";
import getAreaByStationId from "../../../../api/getAreaByStationId";
import orderManagement from "../../../../api/orderManagementApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getListOrderOfFilter from "../../../../api/getListOrderOfFilter";
import ToastMessage from "../../../helpers/ToastMessage";
const ModalFilter = (props) => {
  const { open, handleCloseModal, setOrderList, setCountOrderStatus } = props;
  const dateFormat = "DD/MM/YYYY";
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const { menuFacture, station, area } = createOrderSupplierFetch();
  const [areaByStation, setAreaByStation] = useState([]);
  const [customer, setCustomer] = useState("");
  const [customerType, setCustomerType] = useState([
    { id: "", name: "Tất cả" },
    { id: "Tong_dai_ly", name: "Tổng đại lý" },
    { id: "Cua_hang_thuoc_tram", name: "Cửa hàng trực thuộc trạm" },
    { id: "Cong_ty", name: "Công ty - Doanh nghiệp" },
  ]);
  const [typeCustomer, setTypeCustomer] = useState("");
  const [objectId, setObjectId] = useState("");
  const [choseArea, setChoseArea] = useState("");
  const [customerTypeList, setCustomerTypeList] = useState([]);
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    handleResetFilter();
  }, [open]);
  useEffect(() => {
    const get_UserCookies = async () => {
      const user_cookies = await getUserCookies();
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
      if (
        user_cookies.user.userRole === "Truong_tram" &&
        user_cookies.user.userType === "Tram"
      ) {
        let areaList = [];
        areaList = await getAreaByStationId(user_cookies.user.isChildOf);
        setAreaByStation(areaList.data.data);
        setObjectId(user_cookies.user.isChildOf);
      }
    };
    get_UserCookies();
  }, []);
  const handleTodayTimeChange = (e) => {
    switch (e.target.value) {
      case "1":
        setStartDate(
          moment()
            .startOf("day")
            .zone("+0700")
        );
        setEndDate(
          moment()
            .endOf("day")
            .zone("+0700")
        );
        setStartDay(
          handleSliceDate(
            moment()
              .startOf("day")
              .zone("+0700")
          )
        );
        setEndDay(
          handleSliceDate(
            moment()
              .endOf("day")
              .zone("+2400")
          )
        );
        break;
      case "2":
        setStartDate(
          moment()
            .startOf("week")
            .zone("+0700")
        );
        setEndDate(
          moment()
            .endOf("week")
            .zone("+0700")
        );
        setStartDay(
          handleSliceDate(
            moment()
              .startOf("week")
              .zone("+0700")
          )
        );
        setEndDay(
          handleSliceDate(
            moment()
              .endOf("week")
              .zone("+0700")
          )
        );
        break;
      case "3":
        setStartDate(
          moment()
            .startOf("month")
            .zone("+0700")
        );
        setEndDate(
          moment()
            .endOf("month")
            .zone("+0700")
        );
        setStartDay(
          handleSliceDate(
            moment()
              .startOf("month")
              .zone("+0700")
          )
        );
        setEndDay(
          handleSliceDate(
            moment()
              .endOf("month")
              .zone("+0700")
          )
        );
        break;
      case "4":
        setStartDate(
          moment()
            .startOf("month")
            .subtract(1, "months")
            .zone("+0700")
        );
        setEndDate(
          moment()
            .endOf("month")
            .subtract(1, "months")
            .zone("+0700")
        );
        setStartDay(
          handleSliceDate(
            moment()
              .startOf("month")
              .subtract(1, "months")
              .zone("+0700")
          )
        );
        setEndDay(
          handleSliceDate(
            moment()
              .endOf("month")
              .subtract(1, "months")
              .zone("+0700")
          )
        );
        break;
      case "5":
        setStartDate("");
        setEndDate("");
    }
  };
  const handleChangeStation = async (e) => {
    let areaList;
    setObjectId(e.target.value);
    areaList = await getAreaByStationId(e.target.value);
    setAreaByStation(areaList.data.data);
  };
  const handleChangeCustomerType = (e) => {
    setTypeCustomer(e.target.value);
  };
  const handleChangeArea = (e) => {
    setChoseArea(e.target.value);
  };
  const handleChangeCustomer = (e) => {
    setCustomer(e.target.value);
  };
  const handleSliceDate = (date) => {
    return date._d
      .toISOString()
      .slice(0, 10)
      .split("-")
      .join("-");
  };
  const handleChangeStartDay = (e) => {
    setStartDate(e);
    setStartDay(handleSliceDate(e));
  };
  const handleChangeEndDay = (e) => {
    setEndDate(e);
    setEndDay(handleSliceDate(e));
  };
  useEffect(() => {
    const getCustomerList = async () => {
      let params = {
        type: "", //value cua tong dai ly
        objectId: "", // id cua tram
        area: "", // id khu vuc
      };
      try {
        if (!typeCustomer || !objectId || !choseArea) {
          return;
        }
        params = {
          type: typeCustomer, //value cua tong dai ly
          objectId: objectId, // id cua tram
          area: choseArea, // id khu vuc
        };

        const res = await orderManagement.getTypeCustomer(params);
        if (res && res.data) {
          setCustomerTypeList(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCustomerList();
  }, [typeCustomer, objectId, choseArea]);
  const handleFilterClick = async () => {
    if (!startDate || !endDate || !customer) {
      ToastMessage('warning',"Chưa nhập đủ thông tin!" )
     
    } else {
      const res = await getListOrderOfFilter(startDay, endDay, customer);
      if (res) {
        if (res.data && res.data.length > 0) {
          setOrderList(res.data);
          setCountOrderStatus(res.data);
          handleCloseModal();
        } else {
          setOrderList([]);
          handleCloseModal();
        }
      }
    }
  };
  const handleResetFilter = () => {
    let radioElement = $("input[name=time]");
    radioElement.prop("checked", false);
    setStartDate("");
    setEndDate("");
    setTypeCustomer("");
    setChoseArea("");
    setCustomer("");
    setCustomerTypeList([]);
    if (userRole === "Truong_tram" && userType === "Tram") {
      setObjectId(objectId);
    } else {
      setObjectId("");
    }
  };
  return (
    <Modal open={open} handleClose={handleCloseModal} isWhite>
      <div className="container_cus">
        <div className="container">
          <div className="modal_time_title">Thời gian:</div>
          <div className="row pl-5">
            <div className="col-md-3 d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input"
                name="time"
                value="1"
                onChange={(e) => handleTodayTimeChange(e)}
              />
              <label className="form-check-label text-center">Hôm nay</label>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input"
                name="time"
                value="2"
                onChange={(e) => handleTodayTimeChange(e)}
              />
              <label className="form-check-label">Tuần này</label>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input"
                name="time"
                value="3"
                onChange={(e) => handleTodayTimeChange(e)}
              />
              <label className="form-check-label">Tháng này</label>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input"
                name="time"
                value="4"
                onChange={(e) => handleTodayTimeChange(e)}
              />
              <label className="form-check-label">Tháng trước</label>
            </div>
          </div>
          <div className="row pl-5 mt-4">
            <div className="col-md-3 d-flex align-items-center">
              <input
                type="radio"
                className="form-check-input"
                name="time"
                value="5"
                onChange={(e) => handleTodayTimeChange(e)}
              />
              <label className="form-check-label text-center">Tùy chọn</label>
            </div>
            <div className="col-md-3 d-flex align-items-center date_cus">
              <DatePicker
                style={{
                  height: "42px",
                  "border-radius": "5px",
                  color: "black",
                  "font-weight": "500",
                }}
                className="date_time_picker"
                value={startDate}
                defaultValue={startDate}
                format={dateFormat}
                onChange={(e) => handleChangeStartDay(e)}
                placeholder="Chọn ngày bắt đầu"
              />
            </div>
            <div className="col-md-3 date_cus">
              <DatePicker
                style={{
                  height: "42px",
                  borderRadius: "5px",
                  color: "black",
                  fontWeight: "500",
                }}
                className="date_time_picker"
                value={endDate}
                defaultValue={endDate}
                format={dateFormat}
                onChange={(e) => handleChangeEndDay(e)}
                placeholder="Chọn ngày kết thúc"
              />
            </div>
          </div>
        </div>
      </div>
      {userType === "Tong_cong_ty" &&
      (userRole === "To_nhan_lenh" ||
        userRole === "Pho_giam_docKD" ||
        userRole === "Truong_phongKD" ||
        userRole === "Giam_doc") ? (
        <div className="container pl-5">
          <div className="row">
            <div className="col-md-6">
              <div className="modal_time_title">Trạm:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={(e) => handleChangeStation(e)}
                value={objectId || ""}
              >
                <option value="">Tất cả</option>
                {station &&
                  station.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="col-md-6">
              <div className="modal_time_title ">Loại khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={(e) => handleChangeCustomerType(e)}
                name="select1"
                value={typeCustomer || ""}
              >
                {customerType &&
                  customerType.map((d, i) => (
                    <option key={i} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <div className="modal_time_title ">Khu vực:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={(e) => handleChangeArea(e)}
                value={choseArea || ""}
              >
                <option value="">Tất cả</option>
                {areaByStation &&
                  areaByStation.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6 ">
              <div className="modal_time_title ">Khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onClick={(e) => handleChangeCustomer(e)}
              >
                <option value="">--Chọn--</option>
                {customerTypeList &&
                  customerTypeList.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row margin_customer">
            <div className="col-md-6 d-flex flex-row-reverse">
              <button
                className="btn-warning btn_customer  btn_customer--warning"
                onClick={handleResetFilter}
              >
                Xóa bộ lọc
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn-success btn_customer  btn_customer--success"
                onClick={handleFilterClick}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : userType === "Tram" &&
        (userRole === "Dieu_do_tram" || userRole === "Truong_tram") ? (
        <div className="container pl-5">
          <div className="row">
            <div className="col-md-6">
              <div className="modal_time_title ">Khu vực:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={(e) => handleChangeArea(e)}
                value={choseArea || ""}
              >
                <option value="">Tất cả</option>
                {areaByStation &&
                  areaByStation.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-6">
              <div className="modal_time_title ">Loại khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onChange={(e) => handleChangeCustomerType(e)}
                name="select1"
                value={typeCustomer || ""}
              >
                {customerType &&
                  customerType.map((d, i) => (
                    <option key={i} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <div style={{ display: "none" }}>
                <div className="modal_time_title">Trạm:</div>
                <select
                  className="form-control border border-dark w-75 drop-down-cus rounded select"
                  onChange={(e) => handleChangeStation(e)}
                >
                  <option value="">Tất cả</option>
                  {station &&
                    station.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="modal_time_title ">Khách hàng:</div>
              <select
                className="form-control border border-dark w-75 drop-down-cus rounded select"
                onClick={(e) => handleChangeCustomer(e)}
              >
                <option value="">--Chọn--</option>
                {customerTypeList &&
                  customerTypeList.map((d, i) => (
                    <option value={d.id} key={i}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row margin_customer">
            <div className="col-md-6 d-flex flex-row-reverse">
              <button
                className="btn-warning btn_customer  btn_customer--warning"
                onClick={handleResetFilter}
              >
                Xóa bộ lọc
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn-success btn_customer  btn_customer--success"
                onClick={handleFilterClick}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Modal>
  );
};

export default ModalFilter;
