import { Button, DatePicker, Select, Table, Typography, Checkbox, Tabs, Modal, Form } from "antd";
import moment from "moment";
import React, { Component, Fragment, useEffect, useState } from "react";
import getUserCookies from "getUserCookies";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";
import getAllBranch from "../../../../api/getAllStation";
import getAllStation from "../../../../api/getAllBranch";
import getDashboard from "../../../../api/getDashboard";
import getAggregateDashboard from "../../../../api/getAggregateDashboard";
import getExportChart from "../../../../api/getExportChart";
import getDashboardFixer from "../../../../api/getDashboardFixer";
import detailDashboardFixer from "../../../../api/detailDashboardFixer";
import getDetailCylindersImexExcels from "../../../../api/getDetailCylindersImexExcels";
import exportExcel from "../../../../api/exportExcel";
import ReactCustomLoading from "ReactCustomLoading";
import showToast from "showToast";
// import callApi from "./../../util/apiCaller";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { urlDetailHistoryImport_New, urlSeeDetailDataExport_New, urlDetailStatistialBranch } from "../../../config/config-reactjs";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Line, ComposedChart } from "recharts";
import "./statistical.scss";
const { Option } = Select;
const { TabPane } = Tabs;
// const { Text } = Typography;
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";
const monthFormat = "YYYY/MM";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
const customFormat = (value) => {
  return `custom format: ${value.format(dateFormat)}`;
};

function Statistical() {
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [getBranch, setBranch] = useState([]);
  const [getStation, setStation] = useState([]);
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [listStationDashboard, setStationDashboard] = useState([]);
  const [typeCylinder, setTypeCylinder] = useState([]);
  const [listCreate, setListCreate] = useState([]);
  const [listExport, setListExport] = useState([]);
  const [listTurnback, setListTurnback] = useState([]);
  const [listInventory, setListInventory] = useState([]);
  const [selectYear, setSelectYear] = useState(moment().year());
  const [selectYearQuarter, setSelectYearQuarter] = useState(moment().year());
  const [listChart, setListChart] = useState([]);
  const [listQuarterChart, setListQuarterChart] = useState([]);
  const [typeMonthChart, setTypeMonthChart] = useState([]);
  const [typeQuarterChart, setTypeQuarterChart] = useState([]);
  const [idBranch, setIdBranch] = useState("");
  const [idStation, setIdStation] = useState("");
  const [nameBranch, setNameBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [massMonthLine, setMassMonthLine] = useState([]);
  const [massQuarterLine, setMassQuarterLine] = useState([]);
  const [userTypeFixer, setUserTypeFixer] = useState("");
  const [userRoleFixer, setUserRoleFixer] = useState("");
  const [newCylinder, setNewCylinder] = useState([]);
  const [newExportedCylinder, setNewExportedCylinder] = useState([]);
  const [newInventoryCylinder, setNewInventoryCylinder] = useState([]);
  const [oldCylinder, setOldCylinder] = useState([]);
  const [oldExportedCylinder, setOldExportedCylinder] = useState([]);
  const [oldInventoryCylinder, setOldInventoryCylinder] = useState([]);
  const [checkModal, setCheckModal] = useState("");
  const [id, setId] = useState("");
  const [detailNewCylinder, setDetailNewCylinder] = useState([]);
  const [detailExportCylinder, setDetailExportCylinder] = useState([]);
  const [detailInventoryCylinder, setDetailInventoryCylinder] = useState([]);
  const [visible, setVisible] = useState(false);
  const [checkChangeTab, setCheckChangeTab] = useState("1");
  const [typeExcel, setTypeExcel] = useState("");
  const [nameStation, setNameStation] = useState("");
  const [startYear, setStartYear] = useState(moment().year());
  const [endYear, setEndYear] = useState(moment().year());
  const [startMonth, setStartMonth] = useState(moment().month() + 1);
  const [endMonth, setEndMonth] = useState(moment().month() + 1);
  async function getUser() {
    //Ph??n quy???n
    let user_cookies = await getUserCookies();
    console.log("user_cookies", user_cookies.user.userType);
    if (user_cookies) {
      setUserType(user_cookies.user.userType);
      setUserRole(user_cookies.user.userRole);
    }
    // L???y danh s??ch chi nh??nh
    if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Factory") {
      let resultBranch = await getAllBranch(user_cookies.user.id);
      if (resultBranch.data) {
        setBranch(resultBranch.data.data);
      }
    }

    // L???y danh s??ch tr???m
    if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Region") {
      let resultStation = await getAllStation(user_cookies.user.id);
      if (resultStation.data) {
        setStation(resultStation.data.data);
      }
    }
  }
  function formatNumbers(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  function formatNumber(array) {
    let result = array.map((item) => {
      const arr = Object.keys(item);
      const length = arr.length;
      let temp = item;
      for (let i = 0; i < length; i++) {
        if (typeof item[arr[i]] == "number") {
          temp[arr[i]] = temp[arr[i]].toLocaleString("nl-BE");
        }
      }
      return temp;
    });

    return result;
  }

  useEffect(() => {
    getUser();
  }, [setUserRole, setUserType, setBranch, setStation]);

  function handleTime(value) {

    setStartMonth(value[0]._d.getMonth() + 1)
    setStartYear(value[0]._d.getFullYear())
    setEndMonth(value[1]._d.getMonth() + 1)
    setEndYear(value[1]._d.getFullYear())

    setSelectYear(value[1]._d.getFullYear());
    setSelectYearQuarter(value[1]._d.getFullYear());
    setStartTime(value[0]);
    setEndTime(value[1]);
  }
  // L???y ng??y hi???n t???i
  function handleThisTime() {
    var el = document.getElementsByClassName("btn-history");
    el[0].classList.add("active");
    el[1].classList.remove("active");
    el[2].classList.remove("active");
    el[3].classList.remove("active");
    setStartTime(moment());
    setEndTime(moment());
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  // L???y ng??y h??m qua
  function handleYesterday() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).addClass("active");
      }
      if (item === 2) {
        $(this).removeClass("active");
      }
      if (item === 3) {
        $(this).removeClass("active");
      }
    });
    setStartTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
    setEndTime(moment().subtract(1, "days"), moment().subtract(1, "days"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  //L???y ng??y trong tu???n
  function handleThisWeek() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).removeClass("active");
      }
      if (item === 2) {
        $(this).addClass("active");
      }
      if (item === 3) {
        $(this).removeClass("active");
      }
    });
    setStartTime(moment().startOf("week"));
    setEndTime(moment().endOf("week"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }
  //L???y ng??y trong th??ng
  function handleThisMonth() {
    $(".btn-history").each(function (item, index) {
      if (item === 0) {
        $(this).removeClass("active");
      }
      if (item === 1) {
        $(this).removeClass("active");
      }
      if (item === 2) {
        $(this).removeClass("active");
      }
      if (item === 3) {
        $(this).addClass("active");
      }
    });
    setStartTime(moment().startOf("month"));
    setEndTime(moment().endOf("month"));
    setSelectYear(endTime._d.getFullYear());
    setSelectYearQuarter(endTime._d.getFullYear());
  }

  async function handleChangeExcel(value) {
    setTypeExcel(value);
  }
  //L???y danh s??ch tr???m
  async function handleChangeBranch(value, name) {
    setNameStation("");
    setNameBranch(name.props.name.name ? name.props.name.name : name.props.name);
    setUserTypeFixer(name.props.name.userType);
    setUserRoleFixer(name.props.name.userRole);
    await setStationDashboard([]);
    await setListChart([]);
    await setListQuarterChart([]);
    await setIdBranch(value);

    if (value !== "all") {
      let resultStation = await getAllStation(value);
      if (resultStation.data.success === true) {
        setStation(resultStation.data.data);
      } else {
        setStation([]);
      }
    }
  }

  async function handleChangeStation(value) {
    if (value === "all") {
      await setNameStation("T???t c???");
      await setIdStation("all");
    } else {
      await setNameStation(value.name);
      await setIdStation(value.id);
    }

    await setListChart([]);
    await setListQuarterChart([]);
    await setStationDashboard([]);
    await setIdBranch(null);
  }
  async function handlePreYear() {
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function (item, index) {
      if (item === 4) {
        $(this).removeClass("active");
      }
      if (item === 5) {
        $(this).addClass("active");
      }
    });
    setSelectYear(moment().year() - 1);
  }
  async function handleCurrentYear() {
    setStartTime("");
    setEndTime("");
    $(".btn-history").each(function (item, index) {
      if (item === 4) {
        $(this).addClass("active");
      }
      if (item === 5) {
        $(this).removeClass("active");
      }
    });
    setSelectYear(moment().year());
  }

  async function handlePreYearQuarter() {
    setStartTime("")
    setEndTime("")
    $(".btn-history").each(function (item, index) {
      if (item === 6) {
        $(this).removeClass("active");
      }
      if (item === 7) {
        $(this).addClass("active");
      }
    });
    setSelectYearQuarter(moment().year() - 1);
  }
  async function handleCurrentYearQuarter() {
    setStartTime("")
    setEndTime("")
    $(".btn-history").each(function (item, index) {
      if (item === 6) {
        $(this).addClass("active");
      }
      if (item === 7) {
        $(this).removeClass("active");
      }
    });
    setSelectYearQuarter(moment().year());
  }

  async function handleYear(value) {
    setSelectYear(value);
  }
  async function handleYearQuarter(value) {
    setSelectYearQuarter(value);
  }

  async function getQuarterChart(target, statisticalType, dataType, year, filter, startDate, endDate) {
    let color = ["#66BE02", "#23772F", "#037aff", "#FF6600"];
    let array = [];
    let type = [];
    let mass = [];
    let result = await getExportChart(target, statisticalType, dataType, year, filter, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      result.data.data[0].detail.map((value, index) => {
        type.push({
          name: value.name,
          color: color[index],
        });
        mass.push({
          name: "T???ng KL",
          color: color[index],
        });
      });
      result.data.data.map((value) => {
        let objectChart = {
          name: "Qu?? " + value.quarter,
          "T???ng KL": value.totalMass,
        };
        value.detail.map((v) => {
          Object.assign(objectChart, {
            [v.name]: v.statistic.numberExport,
          });
        });
        array.push(objectChart);
      });
    }
    setListQuarterChart(array);
    setTypeQuarterChart(type);
    setMassQuarterLine(mass);
  }

  async function handleQuarterChart() {
    let user_cookies = await getUserCookies();
    if (startTime === '' && endTime === '') {
      $('.chart-note-quater').text(function () {
        return "Bi???u ????? xu???t b??nh theo qu?? trong n??m " + selectYearQuarter;
      })
    } else {
      $('.chart-note-quater').text(function () {
        return "Bi???u ????? xu???t b??nh theo qu?? t??? th??ng " + startMonth + '/' + startYear + '-' + endMonth + '/' + endYear;
      })
    }
    if (userRole === "SuperAdmin" && userType === "Factory") {
      if (!nameBranch) {
        showToast("Vui l??ng ch???n Chi Nh??nh");
      } else {
        setLoading(true);
        if (idBranch === "all") {
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else if (idBranch !== ("all" && null)) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getQuarterChart(idBranch, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
          } else {
            await getQuarterChart(idBranch, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
          }
        } else if (idBranch === null && idStation) {
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      }
    }

    if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
    }

    if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else {
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      } else {
        showToast("Vui l??ng ch???n tr???m");
      }
    }
    if (userRole === "Owner" && userType === "Factory") {
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
    }
  }

  async function getMonthChart(target, statisticalType, dataType, year, filter, startDate, endDate) {
    let color = ["#66BE02", "#23772F", "#037aff", "#FF6600"];
    let array = [];
    let type = [];
    let mass = [];
    let result = await getExportChart(target, statisticalType, dataType, year, filter, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      result.data.data[0].detail.map((value, index) => {
        type.push({
          name: value.name,
          color: color[index],
        });
        mass.push({
          name: "T???ng KL",
          color: color[index],
        });
      });
      result.data.data.map((value) => {
        let objectChart = {
          name: "Th??ng " + value.month,
          "T???ng KL": value.totalMass,
        };
        value.detail.map((v) => {
          Object.assign(objectChart, {
            [v.name]: v.statistic.numberExport,
          });
        });
        array.push(objectChart);
      });
    }
    setListChart(array);
    setTypeMonthChart(type);
    setMassMonthLine(mass);
  }
  async function handleMonthChart() {
    let user_cookies = await getUserCookies();
    if (startTime === '' && endTime === '') {
      $('.chart-note-p').text(function () {
        return "Bi???u ????? xu???t b??nh theo th??ng trong n??m " + selectYear;
      })
    } else {
      $('.chart-note-p').text(function () {
        return "Bi???u ????? xu???t b??nh theo th??ng t??? th??ng " + startMonth + '/' + startYear + '-' + endMonth + '/' + endYear;
      })
    }
    if (userRole === "SuperAdmin" && userType === "Factory") {
      if (!nameBranch) {
        showToast("Vui l??ng ch???n Chi Nh??nh");
      } else {
        setLoading(true);
        if (idBranch === "all") {
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
        } else if (idBranch !== ("all" && null)) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getMonthChart(idBranch, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
          } else {
            await getMonthChart(idBranch, "byItsChildren", "month", selectYear, "", startTime, endTime);
          }
        } else if (idBranch === null && idStation) {
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
        }
      }
    }

    if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
    }

    if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
        } else {
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
        }
      } else {
        showToast("Vui l??ng ch???n tr???m");
      }
    }
    if (userRole === "Owner" && userType === "Factory") {
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "", startTime, endTime);
    }
  }

  async function handleChangeTab(value) {
    setCheckChangeTab(value);
  }
  async function handleSeeNew(record) {
    setCheckModal("1");
    setId(record.id);
    let detailNewCylinder = [];
    setVisible(true);
    let resultDetail = await detailDashboardFixer(
      idBranch,
      startTime,
      endTime,
      checkChangeTab === "1" ? "NEW" : "OLD",
      "IN",
      record.id ? record.id : null,
      "CREATE"
    );
    if (resultDetail.data.success === true) {
      resultDetail.data.Cylinders.map((value, index) => {
        detailNewCylinder.push({
          index: index + 1,
          id: value.id,
          serial: value.serial,
          color: value.color,
          valve: value.valve,
          weight: value.weight,
          checkedDate: value.checkedDate,
          category: value.category,
          manufacture: value.manufacture,
        });
      });
      detailNewCylinder = formatNumber(detailNewCylinder);

      setDetailNewCylinder(detailNewCylinder);
    }
  }

  async function handleSeeExported(record) {
    setCheckModal("2");
    setId(record.id);
    let detailExportCylinder = [];
    setVisible(true);
    let resultDetail = await detailDashboardFixer(
      idBranch,
      startTime,
      endTime,
      checkChangeTab === "1" ? "NEW" : "OLD",
      "OUT",
      record.id ? record.id : null,
      "EXPORT_CELL"
    );
    if (resultDetail.data.success === true) {
      resultDetail.data.Cylinders.map((value, index) => {
        detailExportCylinder.push({
          index: index + 1,
          id: value.id,
          serial: value.serial,
          color: value.color,
          valve: value.valve,
          weight: value.weight,
          checkedDate: value.checkedDate,
          category: value.category,
          manufacture: value.manufacture,
        });
      });
      detailExportCylinder = formatNumber(detailExportCylinder);

      setDetailExportCylinder(detailExportCylinder);
    }
  }

  async function handleNotData() {
    alert("Kh??ng c?? d??? li???u");
  }
  async function handleSeeInventory(record) {
    setCheckModal("3");
    setId(record.id);
    let detailInventoryCylinder = [];
    setVisible(true);
    let resultDetail = await detailDashboardFixer(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", null, record.id ? record.id : null);
    if (resultDetail.data.success === true) {
      resultDetail.data.Cylinders.map((value, index) => {
        detailInventoryCylinder.push({
          index: index + 1,
          id: value.id,
          serial: value.serial,
          color: value.color,
          valve: value.valve,
          weight: value.weight,
          checkedDate: value.checkedDate,
          category: value.category,
          manufacture: value.manufacture,
        });
      });
      detailInventoryCylinder = formatNumber(detailInventoryCylinder);
      setDetailInventoryCylinder(detailInventoryCylinder);
    }
  }

  async function getOldFixerDashboard(target, startDate, endDate, statisticalType) {
    let sumold = 0;
    let sumexported = 0;
    let suminventory = 0;
    let resultDashboard = await getDashboardFixer(target, startDate, endDate, statisticalType);
    setLoading(false);
    if (resultDashboard.data.success === true) {
      // T??nh t???ng s??? l?????ng b??nh khai b??o m???i
      resultDashboard.data.Declaration.map((value) => {
        sumold += value.number;
      });
      let sumOldCylinder = {
        name: "T???ng",
        number: sumold,
      };
      // T??nh t???ng s??? l?????ng b??nh ???? xu???t
      resultDashboard.data.Export.map((value) => {
        sumexported += value.number;
      });
      let sumExportedCylinder = {
        name: "T???ng",
        number: sumexported,
      };
      // T??nh t???ng s??? l?????ng b??nh t???n kho
      resultDashboard.data.Inventory.map((value) => {
        suminventory += value.number;
      });
      let sumInventoryCylinder = {
        name: "T???ng",
        number: suminventory,
      };

      // Gh??p object T???ng v??o m???ng
      resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumOldCylinder;
      resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
      resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

      resultDashboard.data.Declaration = formatNumber(resultDashboard.data.Declaration);
      resultDashboard.data.Export = formatNumber(resultDashboard.data.Export);
      resultDashboard.data.Inventory = formatNumber(resultDashboard.data.Inventory);

      setOldCylinder(resultDashboard.data.Declaration);
      setOldExportedCylinder(resultDashboard.data.Export);
      setOldInventoryCylinder(resultDashboard.data.Inventory);
    }
  }
  async function getNewFixerDashboard(target, startDate, endDate, statisticalType) {
    let sumnew = 0;
    let sumexported = 0;
    let suminventory = 0;
    let resultDashboard = await getDashboardFixer(target, startDate, endDate, statisticalType);
    setLoading(false);
    if (resultDashboard.data.success === true) {
      // T??nh t???ng s??? l?????ng b??nh khai b??o m???i
      resultDashboard.data.Declaration.map((value) => {
        sumnew += value.number;
      });
      let sumNewCylinder = {
        name: "T???ng",
        number: sumnew,
      };
      // T??nh t???ng s??? l?????ng b??nh ???? xu???t
      resultDashboard.data.Export.map((value) => {
        sumexported += value.number;
      });
      let sumExportedCylinder = {
        name: "T???ng",
        number: sumexported,
      };
      // T??nh t???ng s??? l?????ng b??nh t???n kho
      resultDashboard.data.Inventory.map((value) => {
        suminventory += value.number;
      });
      let sumInventoryCylinder = {
        name: "T???ng",
        number: suminventory,
      };

      // Gh??p object T???ng v??o m???ng
      resultDashboard.data.Declaration[resultDashboard.data.Declaration.length] = sumNewCylinder;
      resultDashboard.data.Export[resultDashboard.data.Export.length] = sumExportedCylinder;
      resultDashboard.data.Inventory[resultDashboard.data.Inventory.length] = sumInventoryCylinder;

      resultDashboard.data.Declaration = formatNumber(resultDashboard.data.Declaration);
      resultDashboard.data.Export = formatNumber(resultDashboard.data.Export);
      resultDashboard.data.Inventory = formatNumber(resultDashboard.data.Inventory);

      setNewCylinder(resultDashboard.data.Declaration);
      setNewExportedCylinder(resultDashboard.data.Export);
      setNewInventoryCylinder(resultDashboard.data.Inventory);
    }
  }
  async function getAllDashboard(target, statisticalType, startDate, endDate, nameBranch) {
    let typeCylinder = [];
    let cutCreate = {};
    let cutTurnback = {};
    let cutInventory = {};
    let cutExport = {};
    let arrayCreate = [{ branch: "T???ng" }];
    let arrayTurnback = [{ branch: "T???ng" }];
    let arrayExport = [{ branch: "T???ng" }];
    let arrayInventory = [{ branch: "T???ng" }];
    let result = await getAggregateDashboard(target, statisticalType, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      // L???y danh s??ch lo???i b??nh
      result.data.data[0].detail.map((value) => {
        typeCylinder.push({
          dataIndex: value.code,
          title: value.name,
        });
      });
      setTypeCylinder(typeCylinder);
      console.log("qqqq", result.data.data);

      result.data.data.map((value, index) => {
        let sumCreate = 0;
        let sumTurnback = 0;
        let sumExport = 0;
        let sumInventory = 0;
        let sumMassExport = 0;
        let a = result.data.data[index].name;
        let objectCreate = { branch: a };
        let objectExport = { branch: a };
        let objectTurnback = { branch: a };
        let objectInventory = { branch: a };

        value.detail.map((v) => {
          //
          sumCreate += v.statistic.create;
          Object.assign(objectCreate, {
            [v.code]: v.statistic.create,
            tongBinh: sumCreate,
          });
          cutCreate = Object.assign(arrayCreate[0], {
            [v.code]: arrayCreate[0][v.code] ? arrayCreate[0][v.code] + v.statistic.create : v.statistic.create,
            tongBinh: arrayCreate[0].tongBinh ? arrayCreate[0].tongBinh + v.statistic.create : v.statistic.create,
          });
          //
          sumExport += v.statistic.numberExport;
          sumMassExport += v.statistic.massExport;
          Object.assign(objectExport, {
            [v.code]: v.statistic.numberExport,
            tongBinh: sumExport,
            tongkhoiLuong: sumMassExport,
          });
          cutExport = Object.assign(arrayExport[0], {
            [v.code]: arrayExport[0][v.code] ? arrayExport[0][v.code] + v.statistic.numberExport : v.statistic.numberExport,
            tongBinh: arrayExport[0].tongBinh ? arrayExport[0].tongBinh + v.statistic.numberExport : v.statistic.numberExport,
            tongkhoiLuong: arrayExport[0].tongkhoiLuong ? arrayExport[0].tongkhoiLuong + v.statistic.massExport : v.statistic.massExport,
          });
          //
          sumTurnback += v.statistic.turnback;
          Object.assign(objectTurnback, {
            [v.code]: v.statistic.turnback,
            tongBinh: sumTurnback,
          });
          cutTurnback = Object.assign(arrayTurnback[0], {
            [v.code]: arrayTurnback[0][v.code] ? arrayTurnback[0][v.code] + v.statistic.turnback : v.statistic.turnback,
            tongBinh: arrayTurnback[0].tongBinh ? arrayTurnback[0].tongBinh + v.statistic.turnback : v.statistic.turnback,
          });
          //
          sumInventory += v.statistic.inventory;
          Object.assign(objectInventory, {
            [v.code]: v.statistic.inventory,
            tongBinh: sumInventory,
          });
          cutInventory = Object.assign(arrayInventory[0], {
            [v.code]: arrayInventory[0][v.code] ? arrayInventory[0][v.code] + v.statistic.inventory : v.statistic.inventory,
            tongBinh: arrayInventory[0].tongBinh ? arrayInventory[0].tongBinh + v.statistic.inventory : v.statistic.inventory,
          });
        });
        arrayCreate.push(objectCreate);
        arrayExport.push(objectExport);
        arrayTurnback.push(objectTurnback);
        arrayInventory.push(objectInventory);
      });
    }
    arrayCreate.shift();
    arrayCreate[arrayCreate.length] = cutCreate;
    arrayCreate = formatNumber(arrayCreate);
    setListCreate(arrayCreate);

    arrayExport.shift();
    arrayExport[arrayExport.length] = cutExport;
    arrayExport = formatNumber(arrayExport);
    setListExport(arrayExport);

    arrayTurnback.shift();
    arrayTurnback[arrayTurnback.length] = cutTurnback;
    arrayTurnback = formatNumber(arrayTurnback);
    setListTurnback(arrayTurnback);

    arrayInventory.shift();
    arrayInventory[arrayInventory.length] = cutInventory;
    arrayInventory = formatNumber(arrayInventory);
    setListInventory(arrayInventory);
  }
  async function getTableDashboard(target, statisticalType, startDate, endDate, nameBranch) {
    let array = [];
    let sumObject, sumChildObject;

    let sumCancel = 0;
    let sumCreate = 0;
    let sumExportShellToElsewhere = 0;
    let sumExportShellToFixer = 0;
    let sumImportShellFromElsewhere = 0;
    let sumImportShellFromFixer = 0;
    let sumInventory = 0;
    let sumMassExport = 0;
    let sumNumberExport = 0;
    let sumTurnback = 0;
    let sumReturnFullCylinder = 0;

    let sumChildCancel,
      sumChildCreate,
      sumChildExportShellToElsewhere,
      sumChildExportShellToFixer,
      sumChildImportShellFromElsewhere,
      sumChildImportShellFromFixer,
      sumChildInventory,
      sumChildMassExport,
      sumChildNumberExport,
      sumChildTurnback,
      sumChildReturnFullCylinder;

    let result = await getDashboard(target, statisticalType, startDate, endDate);
    setLoading(false);
    if (result.data.data.length !== 0) {
      result.data.data.map((value) => {
        sumChildCancel = 0;
        sumChildCreate = 0;
        sumChildExportShellToElsewhere = 0;
        sumChildExportShellToFixer = 0;
        sumChildImportShellFromElsewhere = 0;
        sumChildImportShellFromFixer = 0;
        sumChildInventory = 0;
        sumChildMassExport = 0;
        sumChildNumberExport = 0;
        sumChildTurnback = 0;
        sumChildReturnFullCylinder = 0;

        console.log("vava", value);
        value.detail.map((v) => {
          // T??nh t???ng cho chi nh??nh v?? tr???m
          sumCancel += v.statistic.cancel;
          sumCreate += v.statistic.create;
          sumExportShellToElsewhere += v.statistic.exportShellToElsewhere;
          sumExportShellToFixer += v.statistic.exportShellToFixer;
          sumImportShellFromElsewhere += v.statistic.importShellFromElsewhere;
          sumImportShellFromFixer += v.statistic.importShellFromFixer;
          sumInventory += v.statistic.inventory;
          sumMassExport += v.statistic.massExport;
          sumNumberExport += v.statistic.numberExport;
          sumTurnback += v.statistic.turnback;
          sumReturnFullCylinder += v.statistic.returnFullCylinder;
          //T??nh t???ng cho t???ng tr???m ??? tr??n chi nh??nh
          sumChildCancel += v.statistic.cancel;
          sumChildCreate += v.statistic.create;
          sumChildExportShellToElsewhere += v.statistic.exportShellToElsewhere;
          sumChildExportShellToFixer += v.statistic.exportShellToFixer;
          sumChildImportShellFromElsewhere += v.statistic.importShellFromElsewhere;
          sumChildImportShellFromFixer += v.statistic.importShellFromFixer;
          sumChildInventory += v.statistic.inventory;
          sumChildMassExport += v.statistic.massExport;
          sumChildNumberExport += v.statistic.numberExport;
          sumChildTurnback += v.statistic.turnback;
          sumChildReturnFullCylinder += v.statistic.returnFullCylinder;
          // TH???NG K?? ??? TR???M
          if ((userRole === "Owner" && userType === "Factory") || (userRole === "SuperAdmin" && userType === "Factory" && idBranch === null && idStation)) {
            // T???o object t??nh t???ng
            sumObject = {
              name: "T???ng",
              cancel: sumCancel,
              create: sumCreate,
              exportShellToElsewhere: sumExportShellToElsewhere,
              exportShellToFixer: sumExportShellToFixer,
              importShellFromElsewhere: sumImportShellFromElsewhere,
              importShellFromFixer: sumImportShellFromFixer,
              inventory: sumInventory,
              massExport: sumMassExport,
              numberExport: sumNumberExport,
              turnback: sumTurnback,
              returnFullCylinder: sumReturnFullCylinder,
            };

            array.push({
              name: v.name,
              cancel: v.statistic.cancel,
              create: v.statistic.create,
              exportShellToElsewhere: v.statistic.exportShellToElsewhere,
              exportShellToFixer: v.statistic.exportShellToFixer,
              importShellFromElsewhere: v.statistic.importShellFromElsewhere,
              importShellFromFixer: v.statistic.importShellFromFixer,
              inventory: v.statistic.inventory,
              massExport: v.statistic.massExport,
              numberExport: v.statistic.numberExport,
              turnback: v.statistic.turnback,
              returnFullCylinder: v.statistic.returnFullCylinder,
            });
          }
          // TH???NG K?? ??? CHI NH??NH
          else if (
            (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" && userType === "Factory" && idBranch !== ("all" && null))
          ) {
            // T???o object t??nh t???ng
            sumObject = {
              id: array.length,
              branchName: nameBranch,
              stationName: "T???NG",
              name: "",
              cancel: sumCancel,
              create: sumCreate,
              exportShellToElsewhere: sumExportShellToElsewhere,
              exportShellToFixer: sumExportShellToFixer,
              importShellFromElsewhere: sumImportShellFromElsewhere,
              importShellFromFixer: sumImportShellFromFixer,
              inventory: sumInventory,
              massExport: sumMassExport,
              numberExport: sumNumberExport,
              turnback: sumTurnback,
              returnFullCylinder: sumReturnFullCylinder,
            };
            // T???o object con ????? t??nh t???ng
            sumChildObject = {
              id: array.length,
              branchName: nameBranch,
              stationName: value.name,
              name: "T???ng",
              cancel: sumChildCancel,
              create: sumChildCreate,
              exportShellToElsewhere: sumChildExportShellToElsewhere,
              exportShellToFixer: sumChildExportShellToFixer,
              importShellFromElsewhere: sumChildImportShellFromElsewhere,
              importShellFromFixer: sumChildImportShellFromFixer,
              inventory: sumChildInventory,
              massExport: sumChildMassExport,
              numberExport: sumChildNumberExport,
              turnback: sumChildTurnback,
              returnFullCylinder: sumChildReturnFullCylinder,
            };

            array.push({
              id: index + 1,
              branchName: nameBranch,
              stationName: value.name,
              name: v.name,
              cancel: v.statistic.cancel,
              create: v.statistic.create,
              exportShellToElsewhere: v.statistic.exportShellToElsewhere,
              exportShellToFixer: v.statistic.exportShellToFixer,
              importShellFromElsewhere: v.statistic.importShellFromElsewhere,
              importShellFromFixer: v.statistic.importShellFromFixer,
              inventory: v.statistic.inventory,
              massExport: v.statistic.massExport,
              numberExport: v.statistic.numberExport,
              turnback: v.statistic.turnback,
              returnFullCylinder: v.statistic.returnFullCylinder,
            });

            console.log(array);
          }
        });
        // if (userRole === "SuperAdmin" && ((userType === "Region") || userType === "Factory")) {
        // if (userRole === "SuperAdmin" && userType === "Region") {
        //   array[array.length] = sumChildObject;
        // }
        if (userRole === "SuperAdmin" && ((userType === "Region" && idStation === "all") || userType === "Factory")) {
          // if (userRole === "SuperAdmin" && userType === "Region") {
          if (sumChildObject) {
            array[array.length] = sumChildObject;
          }
        }
      });

      // Gh??p object T???ng v??o m???ng
      array[array.length] = sumObject;
      array = formatNumber(array);
      setStationDashboard(array);
    }
  }
  async function handleSeeExcel() {
    if (checkModal === "1") {
      const data = await getDetailCylindersImexExcels(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", "IN", id, "CREATE");
    } else if (checkModal === "2") {
      const data = await getDetailCylindersImexExcels(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", "OUT", id, "EXPORT_CELL");
    } else if (checkModal === "3") {
      const data = await getDetailCylindersImexExcels(idBranch, startTime, endTime, checkChangeTab === "1" ? "NEW" : "OLD", null, id, null);
    }
  }
  async function exportExcelDashboard(target_ids, action_type, parent_root, start_date, end_date) {
    let result = await exportExcel(target_ids, action_type, parent_root, start_date, end_date);
    setLoading(false);
  }
  async function handleExportExcel() {
    let user_cookies = await getUserCookies();
    if (typeExcel === "") {
      showToast("Vui l??ng ch???n ki???u xu???t excel")
    }
    else {
      if (userRole === "Owner" && userType === "Factory") {
        setLoading(true);
        exportExcelDashboard([user_cookies.user.id], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
      } else if (userRole === "SuperAdmin" && userType === "Fixer") {

      } else if (userRole === "SuperAdmin" && userType === "Region") {
        if (idStation) {
          setLoading(true);
          if (idStation === "all") {
            exportExcelDashboard([user_cookies.user.id], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          } else {
            exportExcelDashboard([idStation], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          }
        } else {
          showToast("Vui l??ng ch???n tr???m");
        }
      } else if (!nameBranch) {
        showToast("Vui l??ng ch???n Chi Nh??nh");
      } else {
        if (userRole === "SuperAdmin" && userType === "Factory") {
          setLoading(true);
          if (idBranch === "all") {
            exportExcelDashboard([user_cookies.user.id], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          } else if (idBranch !== ("all" && null)) {
            exportExcelDashboard([idBranch], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          } else if (idBranch === null && idStation) {
            exportExcelDashboard([idStation], typeExcel, user_cookies.user.parentRoot, startTime, endTime);
          }
        }
      }
    }
  }
  async function handleSeeDashboard() {
    let user_cookies = await getUserCookies();
    if (userRole === "Owner" && userType === "Factory") {
      setLoading(true);
      await getTableDashboard(user_cookies.user.id, "byItself", startTime, endTime);
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "", startTime, endTime);
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);

    } else if (userRole === "SuperAdmin" && userType === "Fixer") {
      await getMonthChart(user_cookies.user.id, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
      await getQuarterChart(user_cookies.user.id, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
    } else if (userRole === "SuperAdmin" && userType === "Region") {
      if (idStation) {
        setLoading(true);
        if (idStation === "all") {
          await getTableDashboard(user_cookies.user.id, "byItsChildren", startTime, endTime, user_cookies.user.name);
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else {
          await getTableDashboard(idStation, "byItself", startTime, endTime, user_cookies.user.name);
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      } else {
        showToast("Vui l??ng ch???n tr???m");
      }
    } else if (!nameBranch) {
      showToast("Vui l??ng ch???n Chi Nh??nh");
    } else {
      if (userRole === "SuperAdmin" && userType === "Factory") {
        setLoading(true);
        if (idBranch === "all") {
          await getAllDashboard(user_cookies.user.id, "", startTime, endTime);
          await getMonthChart(user_cookies.user.id, "byItsChildren", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(user_cookies.user.id, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
        } else if (idBranch !== ("all" && null)) {
          if (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") {
            await getNewFixerDashboard(idBranch, startTime, endTime, "NEW");
            await getOldFixerDashboard(idBranch, startTime, endTime, "OLD");
            await getMonthChart(idBranch, "byItself", "month", selectYear, "EXPORT_CELL", "", startTime, endTime);
            await getQuarterChart(idBranch, "byItself", "quarter", selectYearQuarter, "EXPORT_CELL", "", startTime, endTime);
          } else {
            await getTableDashboard(idBranch, "byItsChildren", startTime, endTime, nameBranch);
            await getMonthChart(idBranch, "byItsChildren", "month", selectYear, "", startTime, endTime);
            await getQuarterChart(idBranch, "byItsChildren", "quarter", selectYearQuarter, "", startTime, endTime);
          }
        } else if (idBranch === null && idStation) {
          await getTableDashboard(idStation, "byItself", startTime, endTime);
          await getMonthChart(idStation, "byItself", "month", selectYear, "", startTime, endTime);
          await getQuarterChart(idStation, "byItself", "quarter", selectYearQuarter, "", startTime, endTime);
        }
      }
    }
  }

  let getFullYear = new Date().getFullYear();
  let arrYear = [];
  for (let i = 2000; i <= getFullYear; i++) {
    arrYear.push(i);
  }

  let index = 0;

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    value = formatNumbers(value);
    return (
      <text x={x + width / 2} y={y} fill="red" textAnchor="middle" dy={-6}>
        {value}
      </text>
    );
  };

  const type_excel_station = [
    {
      name: "Khai b??o m???i",
      key: "CREATE",
    },
    {
      name: "Xu???t v???",
      key: "EXPORT_CELL",
    },
    {
      name: "Nh???p v???",
      key: "IMPORT_CELL",
    },
    {
      name: "Xu???t b??nh",
      key: "EXPORT",
    },
    {
      name: "H???i l??u",
      key: "TURN_BACK",
    },
  ];
  const type_excel_fixer = [
    {
      name: "Khai b??o m???i",
      key: "CREATE",
    },
    {
      name: "Xu???t v???",
      key: "EXPORT_CELL",
    },
    {
      name: "Nh???p v???",
      key: "IMPORT_CELL",
    },
  ];

  const columns_khaibaobinhmoi = [
    {
      title: "KHAI B??O V??? M???I",
      children: [
        { title: "Lo???i b??nh", dataIndex: "name" },
        { title: "S??? l?????ng", dataIndex: "number" },
        {
          title: "Thao t??c",
          render: (text, record, index) =>
            newCylinder.length >= 1 && record.number !== 0 ? (
              <Button type="primary" htmlType="submit" onClick={() => handleSeeNew(record)}>
                Xem
              </Button>
            ) : (
              <Button type="primary" onClick={() => handleNotData(record)}>
                Xem
              </Button>
            ),
        },
      ],
    },
  ];
  const columns_binhdaxuat = [
    {
      title: "V??? ???? XU???T",
      children: [
        { title: "Lo???i b??nh", dataIndex: "name" },
        { title: "S??? l?????ng", dataIndex: "number" },
        {
          title: "Thao t??c",
          render: (text, record, index) =>
            newExportedCylinder.length >= 1 && record.number !== 0 ? (
              <Button type="primary" htmlType="submit" onClick={() => handleSeeExported(record)}>
                Xem
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" onClick={() => handleNotData(record)}>
                Xem
              </Button>
            ),
        },
      ],
    },
  ];
  const columns_binhtonkho = [
    {
      title: "V??? T???N KHO",
      children: [
        { title: "Lo???i b??nh", dataIndex: "name" },
        { title: "S??? l?????ng", dataIndex: "number" },
        {
          title: "Thao t??c",
          render: (text, record, index) =>
            newInventoryCylinder.length >= 1 && record.number !== 0 ? (
              <Button type="primary" htmlType="submit" onClick={() => handleSeeInventory(record)}>
                Xem
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" onClick={() => handleNotData(record)}>
                Xem
              </Button>
            ),
        },
      ],
    },
  ];
  const columns_details = [
    {
      title: "Danh S??ch Chi Ti???t B??nh LPG",
      align: "center",
      children: [
        { title: "STT", dataIndex: "index", align: "center" },
        { title: "S??? Seri", dataIndex: "serial", align: "center" },
        { title: "M??u s???c", dataIndex: "color", align: "center" },
        { title: "Lo???i van", dataIndex: "valve", align: "center" },
        { title: "C??n n???ng", dataIndex: "weight", align: "center" },
        {
          title: "Ng??y ki???m ?????nh",
          // dataIndex: "checkedDate",
          align: "center",
          render: (record, index) => {
            const moment = require("moment");
            const isCorrectFormat = (dateString, format) => {
              return moment(dateString, format, true).isValid();
            };
            return (
              <div>{isCorrectFormat(record.checkedDate, "DD/MM/YYYY") === true ? record.checkedDate : moment(record.checkedDate).format("DD/MM/YYYY")}</div>
            );
          },
        },
        { title: "Th????ng hi???u", dataIndex: "manufacture", align: "center" },
        { title: "Lo???i b??nh", dataIndex: "category", align: "center" },
      ],
    },
  ];
  // console.log("sstate" , renderCustomBarLabel);
  const columns = [
    {
      title: "Lo???i b??nh",
      dataIndex: "name",
      fixed: "left",
      width: 120,
      align: "center",
    },
    {
      title: "Khai b??o m???i",
      dataIndex: "create",
      width: 130,
      align: "center",
    },
    {
      title: "Nh???p v???",
      width: 600,
      dataIndex: "nhapVo",
      align: "center",

      children: [
        {
          title: "Nh???p t??? B??nh Kh??",
          dataIndex: "importShellFromFixer",
          // key: "building",
          width: 200,
          align: "center",
        },
        {
          title: "Nh???p t??? Tr???m Kh??c",
          dataIndex: "importShellFromElsewhere",
          key: "tramKhac",
          width: 200,
          align: "center",
        },
        {
          title: "H???i L??u",
          dataIndex: "turnback",
          key: "hoiLuu",
          width: 200,
          align: "center",
        },
        {
          title: "H???i L??u b??nh ?????y",
          dataIndex: "returnFullCylinder",
          key: "hoiLuuBinhDay",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "Xu???t V???",
      width: 400,
      dataIndex: "xuatVo",
      children: [
        {
          title: "Xu???t B??nh Kh??",
          dataIndex: "exportShellToFixer",
          width: 200,
          align: "center",
        },
        {
          title: "Xu???t Cho Tr???m Kh??c",
          dataIndex: "exportShellToElsewhere",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "Xu???t b??nh",
      dataIndex: "xuatHang",
      width: 400,
      children: [
        {
          title: "S??? L?????ng",
          dataIndex: "numberExport",
          width: 200,
          align: "center",
        },
        {
          title: "Kh???i L?????ng (KG)",
          dataIndex: "massExport",
          width: 200,
          align: "center",
        },
      ],
    },
    {
      title: "V??? thanh l??",
      dataIndex: "cancel",
      width: 120,
      align: "center",
    },
    {
      title: "T???n",
      dataIndex: "inventory",
      fixed: "right",
      width: 100,
      align: "center",
    },
  ];

  const customData = (data) => {
    let result = [];
    let result1 = [];
    const dataGroupByAdress = groupBy(data, (item) => item.branchName);
    //  console.log("dataGroupByAdress"  , dataGroupByAdress);
    forEach(dataGroupByAdress, (values, key) => {
      // console.log("values" , values);
      // console.log("key" , key);
      let datatesst = values.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            startAddress: true,
            lengthAdress: values.length,
          };
        }
        return item;
      });
      result = [...result, ...datatesst];
    });

    const dataGroupByCountry = groupBy(result, (item) => item.stationName);
    forEach(dataGroupByCountry, (values, key) => {
      let datatesst1 = values.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            startCountry: true,
            lengthCountry: values.length,
          };
        }
        return item;
      });
      result1 = [...result1, ...datatesst1];
    });
    return result1;
  };
  let DATA = customData(listStationDashboard);
  console.log("DATA", DATA);
  let collumns_branch = [];
  // console.log("result", result);
  if (userRole === "SuperAdmin" && userType === "Region") {
    collumns_branch = [
      {
        title: "Tr???m",
        dataIndex: "stationName",
        fixed: "left",
        align: "center",
        width: 80,
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (row.startCountry) {
            obj.props.rowSpan = row.lengthCountry;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "Lo???i b??nh",
        dataIndex: "name",
        width: 120,
        align: "center",
        fixed: "left",
      },
      {
        title: "Khai b??o m???i",
        dataIndex: "create",
        width: 130,
        align: "center",
      },
      {
        title: "Nh???p v???",
        width: 600,
        dataIndex: "nhapVo",
        align: "center",
        children: [
          {
            title: "Nh???p t??? B??nh Kh??",
            dataIndex: "importShellFromFixer",
            // key: "building",
            width: 200,
            align: "center",
          },
          {
            title: "Nh???p t??? Tr???m Kh??c",
            dataIndex: "importShellFromElsewhere",
            key: "tramKhac",
            width: 200,
            align: "center",
          },
          {
            title: "H???i L??u",
            dataIndex: "turnback",
            key: "hoiLuu",
            width: 200,
            align: "center",
          },
          {
            title: "H???i L??u b??nh ?????y",
            dataIndex: "returnFullCylinder",
            key: "hoiLuuBinhDay",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xu???t V???",
        width: 400,
        dataIndex: "xuatVo",
        children: [
          {
            title: "Xu???t B??nh Kh??",
            dataIndex: "exportShellToFixer",
            width: 200,
            align: "center",
          },
          {
            title: "Xu???t Cho Tr???m Kh??c",
            dataIndex: "exportShellToElsewhere",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xu???t b??nh",
        dataIndex: "xuatHang",
        width: 400,
        children: [
          {
            title: "S??? L?????ng",
            dataIndex: "numberExport",
            width: 200,
            align: "center",
          },
          {
            title: "Kh???i L?????ng (KG)",
            dataIndex: "massExport",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "V??? thanh l??",
        dataIndex: "cancel",
        width: 120,
        align: "center",
      },
      {
        title: "V??? t???n t???i tr???m",
        dataIndex: "inventory",
        fixed: "right",
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
  } else {
    collumns_branch = [
      {
        title: "Chi nh??nh",
        dataIndex: "branchName",
        fixed: "left",
        align: "center",
        width: 120,
        fixed: "left",
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (row.startAddress) {
            obj.props.rowSpan = row.lengthAdress;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "Tr???m",
        dataIndex: "stationName",
        fixed: "left",
        align: "center",
        width: 80,
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (row.startCountry) {
            obj.props.rowSpan = row.lengthCountry;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "Lo???i b??nh",
        dataIndex: "name",
        width: 120,
        align: "center",
        fixed: "left",
      },
      {
        title: "Khai b??o m???i",
        dataIndex: "create",
        width: 130,
        align: "center",
      },
      {
        title: "Nh???p v???",
        width: 600,
        dataIndex: "nhapVo",
        align: "center",
        children: [
          {
            title: "Nh???p t??? B??nh Kh??",
            dataIndex: "importShellFromFixer",
            // key: "building",
            width: 200,
            align: "center",
          },
          {
            title: "Nh???p t??? Tr???m Kh??c",
            dataIndex: "importShellFromElsewhere",
            key: "tramKhac",
            width: 200,
            align: "center",
          },
          {
            title: "H???i L??u",
            dataIndex: "turnback",
            key: "hoiLuu",
            width: 200,
            align: "center",
          },
          {
            title: "H???i L??u b??nh ?????y",
            dataIndex: "returnFullCylinder",
            key: "hoiLuuBinhDay",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xu???t V???",
        width: 400,
        dataIndex: "xuatVo",
        children: [
          {
            title: "Xu???t B??nh Kh??",
            dataIndex: "exportShellToFixer",
            width: 200,
            align: "center",
          },
          {
            title: "Xu???t Cho Tr???m Kh??c",
            dataIndex: "exportShellToElsewhere",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "Xu???t b??nh",
        dataIndex: "xuatHang",
        width: 400,
        children: [
          {
            title: "S??? L?????ng",
            dataIndex: "numberExport",
            width: 200,
            align: "center",
          },
          {
            title: "Kh???i L?????ng (KG)",
            dataIndex: "massExport",
            width: 200,
            align: "center",
          },
        ],
      },
      {
        title: "V??? thanh l??",
        dataIndex: "cancel",
        width: 120,
        align: "center",
      },
      {
        title: "V??? t???n t???i tr???m",
        dataIndex: "inventory",
        fixed: "right",
        width: 100,
        align: "center",
        fixed: "right",
      },
    ];
  }
  let arr = [];
  const columns_parent1 = [
    {
      title: "CHI NH??NH",
      dataIndex: "branch",
    },
    {
      title: "S??? V??? KHAI B??O M???I",
      children: typeCylinder,
    },
    {
      title: "T???NG",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
  ];

  const columns_parent2 = [
    {
      title: "CHI NH??NH",
      dataIndex: "branch",
    },
    {
      title: "XU???T B??NH",
      children: typeCylinder,
    },
    {
      title: "T???NG S??? B??NH (B??NH)",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
    {
      title: "KH???I L?????NG (KG)",
      dataIndex: "tongkhoiLuong",
    },
  ];
  const columns_parent3 = [
    {
      title: "CHI NH??NH",
      dataIndex: "branch",
    },
    {
      title: "S??? V??? H???I L??U",
      children: typeCylinder,
    },
    {
      title: "T???NG S??? V???",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
  ];
  const columns_parent4 = [
    {
      title: "CHI NH??NH",
      dataIndex: "branch",
    },
    {
      title: "S??? V??? T???N KHO",
      children: typeCylinder,
    },
    {
      title: "T???NG S??? V???",
      dataIndex: "tongBinh",
      render(text, record) {
        return {
          props: {
            style: { fontWeight: "bold" },
          },
          children: <div>{text}</div>,
        };
      },
    },
  ];
  return (
    <div className="section-statistical" id="statistical">
      <ReactCustomLoading isLoading={loading} />
      <div className="section-statistical__report">
        <h1>B??O C??O TH???NG K??</h1>
        <div className="section-statistical__report__title">
          <div className="container-fluid">
            <div className="row border rouded">
              <div className="col-12 d-flex mt-3">
                <h2>Th???i gian</h2>
                <button className="btn-history active" onClick={handleThisTime}>
                  H??m nay
                </button>
                <button className="btn-history" onClick={handleYesterday}>
                  H??m qua
                </button>
                <button className="btn-history" onClick={handleThisWeek}>
                  Tu???n n??y
                </button>
                <button className="btn-history" onClick={handleThisMonth}>
                  Th??ng n??y
                </button>
                <div className="RangePicker--custom">
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                </div>
              </div>
              <div className="col-12 d-flex my-5">
                <h5>Ki???u xu???t excel</h5>
                <div className="select--custom">
                  <Select placeholder="Ch???n" style={{ width: 120 }} onChange={handleChangeExcel}>
                    {(userRole === "SuperAdmin" && userType === "Fixer") ||
                      (userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer")
                      ? type_excel_fixer.map((value, index) => {
                        return (
                          <Option key={index} value={value.key}>
                            {value.name}
                          </Option>
                        );
                      })
                      :
                      type_excel_station.map((value, index) => {
                        return (
                          <Option key={index} value={value.key}>
                            {value.name}
                          </Option>
                        );
                      })
                    }
                  </Select>
                </div>
                {userRole === "SuperAdmin" && userType === "Factory" ? (
                  <div className="d-flex mx-4">
                    <h5>Chi nh??nh</h5>
                    <div className="select--custom">
                      <Select placeholder="Ch???n" style={{ minWidth: 150 }} onChange={(value, name) => handleChangeBranch(value, name)}>
                        <Option value="all" name="all">
                          <b>T???t c???</b>
                        </Option>
                        {getBranch.map((value, index) => {
                          return (
                            <Option name={value} key={index} value={value.id}>
                              {value.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {getStation.length !== 0 ? (
                  <div className="d-flex">
                    <h5>Tr???m</h5>
                    <div className="select--custom">
                      <Select placeholder="Ch???n" value={nameStation} style={{ minWidth: 150 }} onChange={handleChangeStation}>
                        {userType === "Region" && userRole === "SuperAdmin" ? (
                          <Option value="all" name="all">
                            <b>T???t c???</b>
                          </Option>
                        ) : (
                          ""
                        )}
                        {getStation
                          ? getStation.map((value, index) => {
                            return (
                              <Option key={index} value={value}>
                                {value.name}
                              </Option>
                            );
                          })
                          : ""}
                      </Select>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div>
                  <button className="btn-export" onClick={handleExportExcel}>
                    Xu???t excel
                  </button>
                  <button className="btn-see-report" onClick={handleSeeDashboard}>
                    Xem b??o c??o
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-statistical__report__body">
          {/*T??i kho???n M???*/}
          {userRole === "SuperAdmin" && userType === "Factory" && idBranch === "all" ? (
            <div className="container-fluid">
              <div className="row">
                <div className="col-6">
                  <Table bordered dataSource={listCreate} columns={columns_parent1} pagination={false} />
                </div>
                <div className="col-6">
                  <Table bordered dataSource={listExport} columns={columns_parent2} pagination={false} />
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-6">
                  <Table bordered dataSource={listTurnback} columns={columns_parent3} pagination={false} />
                </div>
                <div className="col-6">
                  <Table bordered dataSource={listInventory} columns={columns_parent4} pagination={false} />
                </div>
              </div>
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" && userType === "Factory" && userTypeFixer === "Region" && idBranch !== ("all" && null)) ? (
            <div className="section-statistical__report__body">
              <div className="container">
                <Table dataSource={DATA} columns={collumns_branch} size="small" bordered scroll={{ x: 2100, y: 480 }} pagination={false} />
              </div>
            </div>
          ) : (userRole === "SuperAdmin" && userType === "Region") ||
            (userRole === "SuperAdmin" && userType === "Factory" && userTypeFixer === "Fixer" && idBranch !== ("all" && null)) ? (
            <div className="section-statistical__report__body">
              <div className="container">
                <Tabs defaultActiveKey="1" onChange={handleChangeTab}>
                  <TabPane tab="B??nh m???i" key="1">
                    <div className="section-statistical__report__body mt-2">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-4">
                            <Table columns={columns_khaibaobinhmoi} dataSource={newCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhdaxuat} dataSource={newExportedCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhtonkho} dataSource={newInventoryCylinder} pagination={false} bordered />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="B??nh s???a ch???a" key="2">
                    <div className="section-statistical__report__body mt-2">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-4">
                            <Table columns={columns_khaibaobinhmoi} dataSource={oldCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhdaxuat} dataSource={oldExportedCylinder} pagination={false} bordered />
                          </div>
                          <div className="col-4">
                            <Table columns={columns_binhtonkho} dataSource={oldInventoryCylinder} pagination={false} bordered />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
                <Modal centered visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} width={1000}>
                  <div className="section-statistical__report">
                    <div className="section-statistical__report__body">
                      <div className="container-fluid">
                        <Table
                          dataSource={
                            checkModal === "1"
                              ? detailNewCylinder
                              : checkModal === "2"
                                ? detailExportCylinder
                                : checkModal === "3"
                                  ? detailInventoryCylinder
                                  : ""
                          }
                          columns={columns_details}
                          pagination={true}
                          bordered
                        />
                        <Form.Item>
                          <Button type="primary" size="large" onClick={() => handleSeeExcel()}>
                            Xu???t excel
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          ) : (userRole === "Owner" && userType === "Factory") || (userRole === "SuperAdmin" && userType === "Factory" && idBranch === null && idStation) ? (
            <div className="section-statistical__report__body">
              <div className="container">
                <Table columns={columns} dataSource={listStationDashboard} scroll={{ x: 1700 }} bordered />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="chart">
            <ResponsiveContainer width="100%" height={600}>
              <ComposedChart
                width={1200}
                height={600}
                data={listChart}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                {/* <YAxis /> */}
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => new Intl.NumberFormat("nl-BE").format(value)} />
                <Legend />
                {typeMonthChart.map((value, index, arr) => {
                  if (arr.length - 1 === index) {
                    return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={40} stackId="a" fill={value.color} label={renderCustomBarLabel} />;
                  } else return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={40} stackId="a" fill={value.color} />;
                })}
                {!((userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") || (userRole === "SuperAdmin" && userType === "Fixer"))
                  ? massMonthLine.map((value, index, arr) => {
                    if (arr.length - 1 === index) {
                      return <Line yAxisId="right" type="monotone" dataKey={value.name} stroke="blue" />;
                    }
                  })
                  : ""}
              </ComposedChart>
            </ResponsiveContainer>
            <div className="chart-note">
              <p className="chart-note-p">
                Bi???u ????? xu???t b??nh theo th??ng t??? th??ng {startMonth}/{startYear} - {endMonth}/{endYear}
              </p>
              <div className="chart-note__time ">
                <div className="d-flex">
                  <span>Th???i gian</span>
                  <button className="btn-history active" onClick={handleCurrentYear}>
                    N??m nay
                  </button>
                  <button className="btn-history" onClick={handlePreYear}>
                    N??m tr?????c
                  </button>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    placeholder="Ch???n n??m"
                    optionFilterProp="children"
                    onChange={handleYear}
                    value={selectYear}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {arrYear.map((item, index) => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                  <button onClick={handleMonthChart} className="btn-see">
                    Xem
                  </button>
                </div>
              </div>
            </div>

            <ComposedChart
              width={800}
              height={600}
              data={listQuarterChart}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value) => new Intl.NumberFormat("nl-BE").format(value)} />
              <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" />
              {typeQuarterChart.map((value, index, arr) => {
                if (arr.length - 1 === index) {
                  return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={60} stackId="a" fill={value.color} label={renderCustomBarLabel} />;
                } else {
                  return <Bar yAxisId="left" key={index} dataKey={value.name} barSize={60} stackId="a" fill={value.color} />;
                }
              })}
              {!((userRoleFixer === "SuperAdmin" && userTypeFixer === "Fixer") || (userRole === "SuperAdmin" && userType === "Fixer"))
                ? massQuarterLine.map((value, index, arr) => {
                  if (arr.length - 1 === index) {
                    return <Line yAxisId="right" type="monotone" dataKey={value.name} stroke="blue" />;
                  }
                })
                : ""}
            </ComposedChart>
            <div className="chart-note">
              <p className="chart-note-quater">
                Bi???u ????? xu???t b??nh theo qu?? t??? th??ng {startMonth}/{startYear} - {endMonth}/{endYear}
              </p>
              <div className="chart-note__time ">
                <div className="d-flex">
                  <span style={{ lineHeight: "35px" }}>Th???i gian</span>
                  <button className="btn-history active" onClick={handleCurrentYearQuarter}>
                    N??m nay
                  </button>
                  <button className="btn-history" onClick={handlePreYearQuarter}>
                    N??m tr?????c
                  </button>
                  <Select
                    showSearch
                    style={{ width: 100 }}
                    placeholder="Ch???n n??m"
                    optionFilterProp="children"
                    onChange={handleYearQuarter}
                    value={selectYearQuarter}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {arrYear.map((item, index) => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <RangePicker value={[startTime, endTime]} format={"DD/MM/YYYY"} onChange={handleTime} />
                  <button onClick={handleQuarterChart} className="btn-see">
                    Xem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistical;
