import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Table,Modal, Icon, Menu, Switch, Radio, DatePicker, message,Tabs,Tooltip } from "antd";
//import './index.scss';
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getAllUserApi from "getAllUserApi";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import callApi from "./../../../util/apiCaller";
import { GETORDERFACTORY, UPDATEORDER,CHANGESTATUS,GETORDERSOFGASTANK } from "./../../../config/config";
import PopupExportOrder from "../../pages/updateOrder/popupExportOrder"
import PopupDriverExportOrder from "../../pages/updateOrder/popupDriverExportOrder"
//import firebase from './../../../util/firebase';
import ImportDriverTypeCylinder from "../factory/ImportDriverTypeCylinder";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableUpdateOrderExcel from '../../pages/updateOrder/tableUpdateOrderExcel';
import NumberOfCylinder from "./NumberOfCylinder";
import './CreateOrder.scss';
import './SeeOrder.scss';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ONE_DAY = 24 * 60 * 60 * 1000 // millisecond
const key = 'updatable'

class SeeOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleNumberOfCylinder:false,
      listAllOrder: [],
      idAPI: "",
      tokenAPI: "",
      userRole:"",
      userType:"",
      // visibleModal: false,
      product_parse: [],
      selectedOrderIDs: [],
      selectedOrderInfor: [],
      //
      isLoading: false,
      data: [],
      enableFilter: false,
      warning: 'none',
      warningValue: 'none',
      startDate: '',
      endDate: '',
      selectedRowKeys: [],
      selectedRows: [],
      listTableExcel: [],
      excelToday: moment(new Date()).format("DD/MM/YYYY"),
      listDeliveryNow: [],
      listDeliveryOld: [],
      listDeliveryNowBegin: [],
      listDeliveryOldBegin: [],
      ShippingTextDetail: [],
      message: [],
      listOrder:[],
      indexCylinders:[],
      startDate:moment(),
      endDate:moment(),
      status:false,
      searchList:[],
      listAllOrderBegin:[],
      visible:false,
      modalDelete:false,
      order:{},
      note:"",
      listAllFixer:[],
      listAllOrder_CreatedBy: [],
      listAllOrder_WareHouse: [],
      chanceOrder:"1",
      orderSussces:false,
      noteOfCylinder:{}
    };
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      idAPI: id,
      tokenAPI: token,
      userRole:user_cookies.user.userRole,
      userType:user_cookies.user.userType
    });
    await this.getAllOrder_new(id, token);
    // const messaging=firebase.messaging();
    // messaging.requestPermission().then(()=>{
    //   console.log("Have Permission");
    //   return messaging.getToken();
    // }).then((tokenFirebase)=>{
    //   console.log(tokenFirebase);
    // })
  }
  getAllOrderB= async (id, token,type)=>{
    let parmas = {
      "warehouseId": id,
      "type": type
    };
    await callApi("POST", GETORDERSOFGASTANK, parmas, token).then((res) => {
      let temp = [];
      let tempNext = [];
        console.log("data order11111222", res.data);
      let i = 1;
      for (let item of res.data.order_createdBy) {
        temp.push({
          key: i,
          orderId: item.id ? item.id : "",
          Factory_Name: item.warehouseId?item.warehouseId.name:"",
          //customerCode: item.customerId.id,
          orderCode: item.orderCode ? item.orderCode : "",
          customerId: item.customerId?item.customerId:"",
          agencyId: item.agencyId ? item.agencyId.name : "",
          type: item.type == "B" ? "B??nh" : "V???",
          
          note: item.note ? item.note : "",
          
          listCylinder: item.listCylinder ? item.listCylinder : [],
          warehouseId: item.warehouseId ? item.warehouseId.name : "",
          // date: moment(item.orderDate).format("DD/MM/YYYY"),
          // expected_DeliveryDate: item.expected_DeliveryDate,
          createdAt: item.createdAt ? item.createdAt : "",
          expected_DeliveryDate: moment(item.deliveryDate).format("DD/MM/YYYY"),
          expected_DeliveryTime: moment(item.deliveryDate).format("HH:mm"),
          deliveryDate: item.deliveryDate ? item.deliveryDate : "",
          // status: item.status === "INIT" ? "Kh???i t???o"
          // : item.status === "CONFIRMED" ? "???? x??c nh???n ????n h??ng"
          // : item.status === "DELIVERING" ? "??ang v???n chuy???n"
          // : item.status === "DELIVERED" ? "???? giao"
          // : item.status === "COMPLETED" ? "???? ho??n th??nh"
          // : item.status === "CANCELLED" ? "???? b??? h???y"
          // : item.status,
          status: item.status ? item.status : "",
        });
        
        i++;
        }
        for (let item of res.data.order_warehouse) {
          if(item.createdBy.id===this.state.idAPI){

          }else{
            tempNext.push({
              key: i,
              orderId: item.id ? item.id : "",
              Factory_Name:item.createdBy? item.createdBy.name:"",
              //customerCode: item.customerId.id,
              orderCode: item.orderCode ? item.orderCode : "",
              customerId: item.customerId?item.customerId:"",
              agencyId: item.agencyId ? item.agencyId.name : "",
              type: item.type == "B" ? "B??nh" : "V???",
              // warehouseId: item.warehouseId
              //valve: item.valve ? item.valve : '',
              //color: item.color ? item.color : '',
              // time: moment(item.time).format("HH:mm:ss"),
              //cylinderType: item.cylinderType ? item.cylinderType.name : '',
              // listCylinder: item.listCylinder,
              // listCylinder: item.listCylinder,
              note: item.note ? item.note : "",
              // status: item.status === "INIT" ? '' : item.status,
    
              // idCustomer: item.idCustomer.name,
              // idBranch: item.idBranch.name,
              // numberCylinders: item.numberCylinders ? item.numberCylinders : 0,
              listCylinder: item.listCylinder ? item.listCylinder : [],
              warehouseId: item.warehouseId ? item.warehouseId.name : "",
              // date: moment(item.orderDate).format("DD/MM/YYYY"),
              // expected_DeliveryDate: item.expected_DeliveryDate,
              createdAt: item.createdAt ? item.createdAt : "",
              expected_DeliveryDate: moment(item.deliveryDate).format("DD/MM/YYYY"),
              expected_DeliveryTime: moment(item.deliveryDate).format("HH:mm"),
              deliveryDate: item.deliveryDate ? item.deliveryDate : "",
              // status: item.status === "INIT" ? "Kh???i t???o"
              // : item.status === "CONFIRMED" ? "???? x??c nh???n ????n h??ng"
              // : item.status === "DELIVERING" ? "??ang v???n chuy???n"
              // : item.status === "DELIVERED" ? "???? giao"
              // : item.status === "COMPLETED" ? "???? ho??n th??nh"
              // : item.status === "CANCELLED" ? "???? b??? h???y"
              // : item.status,
              status: item.status ? item.status : "",
            });
          }
          i++;
          }
          // console.log("Dayaaaa",new Date(temp[0].createdAt));
          // console.log("Dayaaaa",temp);
          // console.log("Dayaaaa",tempNext);
          // temp.sort(function(a,b){
          //   return new Date(b.createdAt) - new Date(a.createdAt);
          // });
          // tempNext.sort(function(a,b){
          //   return new Date(b.createdAt) - new Date(a.createdAt);
          // });
          // console.log("Dayaaaa",temp);
          // console.log("Dayaaaa",tempNext);
        this.setState({
          listAllOrder_CreatedBy: temp,
          listAllOrder_WareHouse: tempNext,
        })  
    });
    type="V";
    let URL = GETORDERFACTORY + id+"&type="+type
    await callApi("GET", URL, token).then((res) => {
      let temp = [];
      let i = 1;
      console.log("res.data.orderFactory2",res.data.orderFactory);
      for (let factory of res.data.orderFactory) {
        if (factory.Factoty_Orders.length > 0) {
          for (let order of factory.Factoty_Orders) {
            temp.push({
              key: i,
              id: order.id,
              Factory_Name: factory.Factory_Name,
              orderCode: order.orderCode,
              orderId: order.id ? order.id : '',
              // customerCode: order.customerId.customerCode,
              customerId: order.warehouseId ?order.warehouseId:"",
              customerName: order.customerId ? order.customerId.name : "",
              // agencyCode: order.agencyId.agencyCode,
              agencyName: order.agencyId ? order.agencyId.name : '',
              listCylinder: order.listCylinder ? order.listCylinder : [],
              orderDate: order.createdAt ? order.createdAt : '__/__/____',
              expected_DeliveryDate: order.deliveryDate ? moment(order.deliveryDate).format("DD/MM/YYYY - HH:mm") : '__/__/____',
              // expected_DeliveryTime: order.deliveryDate ? moment(order.deliveryDate).format("HH:mm") : '__:__',      
              deliveryDate: order.deliveryDate ? order.deliveryDate : '',
              note: order.note,
              createdAt: order.createdAt ? order.createdAt : '',
              // status: order.status === "INIT" ? "Kh???i t???o"
              // : order.status === "CONFIRMED" ? "???? x??c nh???n ????n h??ng"
              // : order.status === "DELIVERING" ? "??ang v???n chuy???n"
              // : order.status === "DELIVERED" ? "???? giao"
              // : order.status === "COMPLETED" ? "???? ho??n th??nh"
              // : order.status === "CANCELLED" ? "???? b??? h???y"
              // : order.status,
              status: order.status ? order.status : '',
            });
            i++;
          }
        }
      }
      temp.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      this.setState({
        listAllOrder: temp,
        listOrder:res.data.orderFactory,
        isLoading: false,
      });
    })    
    // el[1].classList.add("active");
  }     
  
  getAllOrderFixer = async (id, token,type)=>{
    let parmas = {
      "warehouseId": id,
      "type":"V"
    };
    await callApi("POST", GETORDERSOFGASTANK, parmas, token).then((res) => {
      let temp = [];
        console.log("data order111112", res.data);
      let i = 1;
      for (let item of res.data.order) {
        temp.push({
          key: i,
          orderId: item.id ? item.id : "",
          Factory_Name: item.createdBy?item.createdBy.name:"",
          //customerCode: item.customerId.id,
          orderCode: item.orderCode ? item.orderCode : "",
          customerId: item.customerId ? item.customerId : "",
          agencyId: item.agencyId ? item.agencyId.name : "",
          type: item.type == "B" ? "B??nh" : "V???",
          note: item.note ? item.note : "",
          listCylinder: item.listCylinder ? item.listCylinder : [],
          warehouseId: item.warehouseId ? item.warehouseId.name : "",
          createdAt: item.createdAt ? item.createdAt : "",
          expected_DeliveryDate: moment(item.deliveryDate).format("DD/MM/YYYY"),
          expected_DeliveryTime: moment(item.deliveryDate).format("HH:mm"),
          deliveryDate: item.deliveryDate ? item.deliveryDate : "",
          status: item.status ? item.status : "",
        });
        i++;
        }
        this.setState({
          listAllOrder: temp,
        })  
    });
  }
  // Ph??t
  getAllOrder_new = async (id, token) => {
    this.setState({ isLoading: true });
    var el = document.getElementsByClassName("btn-history");
    console.log("el",el);
    let type="V";
    let user_cookies = await getUserCookies();
    if(user_cookies.user.userRole==="SuperAdmin" && user_cookies.user.userType=="Fixer"){
      let type="V"
      this.getAllOrderFixer(id, token,type);
    }else if (user_cookies.user.userRole==="Owner" && user_cookies.user.userType==="Factory"){
      let type="B"
      this.getAllOrderB(id, token,type);
      
     }else if (user_cookies.user.userRole==="SuperAdmin" && user_cookies.user.userType==="Region"){

     type="B"
     this.getAllOrderB(id, token,type);
     this.getAllOrderFactoryFixer(id, token,type); 
      
   }
    else{
     
      this.getAllOrderFactoryFixer(id, token,type);
    }
    
    // el[1].classList.add("active");
    
  }
  // Ph??t

  getAllOrderFactoryFixer = async ( id,token,type)=>{
    let URL = GETORDERFACTORY + id+"&type="+type
    await callApi("GET", URL, token).then((res) => {
      let temp = [];
      let i = 1;
      console.log("res.data.orderFactory1",res.data.orderFactory);
      for (let factory of res.data.orderFactory) {
        if (factory.Factoty_Orders.length > 0) {
          for (let order of factory.Factoty_Orders) {
            if((this.state.userRole==="SuperAdmin" && this.state.userType==="Factory")){
              if(order.status==="INIT"){

              }else{
                temp.push({
                  key: i,
                  Factory_Name: factory.Factory_Name,
                  id: order.id,
                  orderCode: order.orderCode,
                  orderId: order.id ? order.id : '',
                  type: order.type,
                  customerId:type==="B"?order.customerId:order.warehouseId,
                  agencyName: order.agencyId ? order.agencyId.name : '',
                  listCylinder: order.listCylinder ? order.listCylinder : [],
                  orderDate: order.createdAt ? order.createdAt : '__/__/____',
                  expected_DeliveryDate: order.deliveryDate ? moment(order.deliveryDate).format("DD/MM/YYYY - HH:mm") : '__/__/____',
                  // expected_DeliveryTime: order.deliveryDate ? moment(order.deliveryDate).format("HH:mm") : '__:__',      
                  deliveryDate: order.deliveryDate ? order.deliveryDate : '',
                  note: order.note,
                  createdAt: order.createdAt ? order.createdAt : '',
                  status: order.status ? order.status : '',
                });
              }
              
            }else{
              if(order.status==="INIT" ){

              }else{
                temp.push({
                  key: i,
                  Factory_Name: factory.Factory_Name,
                  id: order.id,
                  orderCode: order.orderCode,
                  orderId: order.id ? order.id : '',
                  type: order.type,
                  customerId:type==="B"?order.customerId:order.warehouseId,
                  agencyName: order.agencyId ? order.agencyId.name : '',
                  listCylinder: order.listCylinder ? order.listCylinder : [],
                  orderDate: order.createdAt ? order.createdAt : '__/__/____',
                  expected_DeliveryDate: order.deliveryDate ? moment(order.deliveryDate).format("DD/MM/YYYY - HH:mm") : '__/__/____',
                  // expected_DeliveryTime: order.deliveryDate ? moment(order.deliveryDate).format("HH:mm") : '__:__',      
                  deliveryDate: order.deliveryDate ? order.deliveryDate : '',
                  note: order.note,
                  createdAt: order.createdAt ? order.createdAt : '',
                  status: order.status ? order.status : '',
                });
              }
              
            }
            
            i++;
          }
        }
      }
      if(type==="V"){
        temp.sort(function(a,b){
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        this.setState({
          listAllOrder: temp,
          listOrder:res.data.orderFactory,
          isLoading: false,
      });
  
      }else{
        // console.log("N?? du96 ra v???y",temp)
        temp.sort(function(a,b){
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        console.log("N?? du96 ra v???y",temp)
        this.setState({
          listAllOrder_WareHouse:temp,
           isLoading: false,
        });
      }
      
    })
  }
  
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onChangeStatusOK = async (id, status) => {
    message.loading({ content: '??ang c???p nh???t...', key, duration: 5 });

    let updateOrderStatus = {
      updatedBy: this.state.idAPI,
      orderStatus: status,
      orderId: id,
    }
    let parmas = {
      updateOrderStatus
    };

    await callApi("POST", UPDATEORDER, parmas, this.state.tokenAPI)
      .then(async (res) => {
        console.log('UPDATEORDER', res);

        if (res.data.status === true) {
          alert("Th??nh c??ng");
        }
        else {
          alert('L???i: ' + res.data.message);
        }
        await this.getAllOrder_new(this.state.idAPI, this.state.tokenAPI);
      })
      .catch()

  };
  getListProducts = (products) => {
    this.setState({ product_parse: products });
  }

  handleInputValue = (val) => {
    this.setState({ ShippingTextDetail: val });
    console.log("handleInputValue", this.state.ShippingTextDetail)
    console.log("handleInputValuearr", val)
  }
  handleDataChange = enableFilter => {
    this.setState({ enableFilter });
  };

  handleWarningChange = e => {
    const { value } = e.target

    this.setState({
      warning: value === 'none' ? 'none' : { position: value },
      warningValue: value,
    }, this.filterData)
  };

  

  onSelectChange = async (selectedRowKeys, selectedRows) => {
  await  this.setState({ selectedRowKeys, selectedRows });
    console.log(" selectedRowKeys", this.state.selectedRowKeys);
    console.log("selectedRows",this.state.selectedRows);
  };

  onSelectRowChange = (record, selected, selectedRows, nativeEvent) => {
  };
  createListOrderIDs = () => {
    const {
      selectedRows
    } = this.state

    if (selectedRows.length === 0) {
      alert('Ch??a ch???n ????n h??ng n??o')
    }
    else {
      let orderIDs = []
      let selectedOrderInforBegin = [];
      selectedRows.forEach(row => {
        orderIDs.push(row.id)
      });
      console.log("selectedRows", selectedRows);
      this.setState({ selectedOrderIDs: orderIDs, selectedOrderInfor: selectedRows })
    }
  }
  onClickNumberOfCylinder = (status) => {
		this.setState({
      visibleNumberOfCylinder: status,
      
		});
	};
  handleChangeNumberOfCylinder = ()=>{
		this.setState({
			visibleNumberOfCylinder:true
		});
	
  }
  
  handleThisTime= async (e) =>{
    let {chanceOrder}=this.state;
    let target=e.target;
    const el = document.getElementsByClassName("btn-history");
    const Tabs = document.querySelector("#Tabs");
    console.log("Tabs111111",Tabs),
      console.log("14/12",e.target);
      el[0].classList.remove("active");
      console.log("(e.target)",target.getAttribute("class")[0])
      if(target.getAttribute("class")[0]==="t"){
          el[0].classList.remove("active");
          el[1].classList.add("active");
          el[2].classList.remove("active");
          el[3].classList.remove("active");
          el[4].classList.remove("active");
      await  this.setState({
            startDate:moment(),
            endDate:moment(),
        });
      }else if(target.getAttribute("class")[0]==="l"){
        el[0].classList.remove("active");
        el[1].classList.remove("active");
        el[2].classList.add("active");
        el[3].classList.remove("active");
        el[4].classList.remove("active");
        await this.setState({
          startDate:moment().subtract(1, 'days'),
          endDate:moment().subtract(1, 'days'),
        });
      }else if(target.getAttribute("class")[0]==="w"){
        el[0].classList.remove("active");
        el[1].classList.remove("active");
        el[2].classList.remove("active");
        el[3].classList.add("active");
        el[4].classList.remove("active");
        await this.setState({
          startDate:moment().startOf('week'),
          endDate:moment().endOf('week'),
        });  
      }else if(target.getAttribute("class")[0]==="m"){
        el[0].classList.remove("active");
        el[1].classList.remove("active");
        el[2].classList.remove("active");
        el[3].classList.remove("active");
        el[4].classList.add("active");
        await this.setState({
          startDate:moment().startOf('month'),
          endDate:moment().endOf('month'),
        });
          
      }
    let temp=[];
    let endDate = this.state.endDate.toDate();
    let startDate = this.state.startDate.toDate();
    endDate = (new Date(endDate.setHours(23, 59, 59, 999))).toISOString();
    startDate = (new Date(startDate.setHours(0, 0, 0, 0))).toISOString();
      let select = document.getElementById("status").value;
      if(select==="Tr???ng th??i"){
        el[0].classList.remove("active");
        if(     el[1].classList.length==2
            &&  el[2].classList.length==2
            &&  el[3].classList.length==2
            &&  el[4].classList.length==2){
            await  this.setState({
                status:false
            });   
        }else{
          if(chanceOrder==="1"){
            temp = this.searchAllList(this.state.listAllOrder,startDate,endDate,"");
          }else if(chanceOrder==="2"){
            console.log("this.state.listAllOrder_CreatedBy",this.state.listAllOrder_CreatedBy);
            temp = this.searchAllList(this.state.listAllOrder_CreatedBy,startDate,endDate,"");
          }else if(chanceOrder==="3"){
            temp = this.searchAllList(this.state.listAllOrder_WareHouse,startDate,endDate,"");
          }
          
         await this.setState({
            status:true,
            searchList:temp
        });
        }
         
      }else{
        console.log("e.target",target);
        el[0].classList.add("active"); 
        if(target.getAttribute("class")[0]==="s" 
        &&  el[1].classList.length==2
        &&  el[2].classList.length==2
        &&  el[3].classList.length==2
        &&  el[4].classList.length==2){
             console.log("endDate",Date.parse((endDate)));
             console.log("endDate",Date.parse((startDate)));
             if(chanceOrder==="1"){
              temp = this.searchAllList(this.state.listAllOrder,"","",select);
            }else if(chanceOrder==="2"){
              temp = this.searchAllList(this.state.listAllOrder_CreatedBy,"","",select);
             
            }else if(chanceOrder==="3"){
              temp = this.searchAllList(this.state.listAllOrder_WareHouse,"","",select);   
            
            }else if(chanceOrder==="4"){
               
            }
             
        }else{
          if(chanceOrder==="1"){
            temp = this.searchAllList(this.state.listAllOrder,startDate,endDate,select);
          }else if(chanceOrder==="2"){
            temp = this.searchAllList(this.state.listAllOrder_CreatedBy,startDate,endDate,select);
          }else if(chanceOrder==="3"){
            temp = this.searchAllList(this.state.listAllOrder_WareHouse,startDate,endDate,select);
          }
          
          this.setState({
          status:true,
          searchList:temp
        });
          console.log("temp",temp);
  
        }
      console.log("temp",temp);
        this.setState({
          status:true,
          searchList:temp
        });  
      }

  }
   handleTime= async(value) =>{
     let {chanceOrder}=this.state;
   await  this.setState({
       startDate:value[0],
       endDate:value[1],
       status:true
     });
    let endDate = this.state.endDate.toDate();
    let startDate = this.state.startDate.toDate();
    endDate = (new Date(endDate.setHours(23, 59, 59, 999))).toISOString();
    startDate = (new Date(startDate.setHours(0, 0, 0, 0))).toISOString();
    const el = document.getElementsByClassName("btn-history");
    el[1].classList.remove("active");
    el[2].classList.remove("active");
    el[3].classList.remove("active");
    el[4].classList.remove("active");
    let select =document.getElementById("status").value;
    let temp=[];
    if(document.getElementById("status").value==="Tr???ng th??i"){
      if(chanceOrder==="1"){
        temp = this.searchAllList(this.state.listAllOrder,startDate,endDate,"");
      }else if(chanceOrder==="2"){
        temp = this.searchAllList(this.state.listAllOrder_CreatedBy,startDate,endDate,""); 
      }else if(chanceOrder==="3"){
        temp = this.searchAllList(this.state.listAllOrder_CreatedBy,startDate,endDate,"");
      }
      
      this.setState({
        searchList:temp,
      });
    }else{
      if(chanceOrder==="1"){
        temp = this.searchAllList(this.state.listAllOrder,this.state.startDate,this.state.endDate,select);
      }else if(chanceOrder==="2"){
        temp = this.searchAllList(this.state.listAllOrder_CreatedBy,this.state.startDate,this.state.endDate,select); 
      }else if(chanceOrder==="3"){
        temp = this.searchAllList(this.state.listAllOrder_WareHouse,this.state.startDate,this.state.endDate,select); 
      }
      
      this.setState({
        searchList:temp,
      });
    }
  }
  searchAllList = (array,startDate,endDate,select)=>{
      let temp=[]
      if(select===""){
        temp = array.filter((item) => {
          return  item.status===select
                  &&Date.parse((endDate))>=  Date.parse((item.createdAt)) 
                  && Date.parse((startDate))<=  Date.parse((item.createdAt)) 
        });
      } if(startDate==="" & endDate===""){
        temp = array.filter((item) => {
        return  item.status===select 
        });
      }else{
        temp = array.filter((item) => {
          return  Date.parse((endDate))>=  Date.parse((item.createdAt)) 
                  && Date.parse((startDate))<=  Date.parse((item.createdAt)) 
        });
      }
      return temp 
  }
  resetOrderTable=()=>{
    document.getElementById("status").value="Tr???ng th??i";
    const el = document.getElementsByClassName("btn-history");
    el[0].classList.remove("active");
    el[1].classList.remove("active");
    el[2].classList.remove("active");
    el[3].classList.remove("active");
    el[4].classList.remove("active");
    this.setState({
      startDate:moment(),
      endDate:moment(),
      status:false
    });
  }
  setValueModalUpdate=()=>{
    
      this.setState({
        visible:true
      });
  }
  setValueModalDelete= () =>{
      this.setState({
        visible: true,
        modalDelete: true
      });
  
    
  }
  handleCancel=()=>{
    this.setState({
      visible:false
    });
  }
  handleOk= async(order)=>{
    let {selectedRows}=this.state;
    let parmas = {
    };
    let user_cookies = await getUserCookies();
    let orderShippingId=[];
  if(order.status==="CANCELLED"){
    alert("????n ???? h???y kh??ng th??? ti???p t???c duy???t");
    return;
  }  
  if(selectedRows.length > 0 && this.state.orderSussces===true ){
    for( let i=0;i<selectedRows.length;i++){
      orderShippingId.push({
        "orderShippingId":selectedRows[i].orderId
      });
    }
    parmas = {
      "orderShipping":orderShippingId,
      "user":user_cookies.user.id,
      "status":this.state.modalDelete==true?"CANCELLED" :
      (this.state.modalDelete===false 
        && user_cookies.user.userRole==="SuperAdmin" 
        && user_cookies.user.userType=== "Region" && this.state.chanceOrder!=="3")?"PROCESSING"
        :"CONFIRMED",
      "note": this.state.note
    };
  }if(selectedRows.length <= 0 && this.state.orderSussces===true ){
      alert("Ch??a ch???n ????n h??ng n??o");
  }else{
    
    parmas = {
      "orderShipping":[{
        "orderShippingId":order.orderId
      }],
      "user":user_cookies.user.id,
      "status":this.state.modalDelete==true?"CANCELLED" :
      (this.state.modalDelete===false 
        && user_cookies.user.userRole==="SuperAdmin" 
        && user_cookies.user.userType=== "Region" && this.state.chanceOrder!=="3")?"PROCESSING"
        :"CONFIRMED",
      "note": this.state.note
    };
  }
   
     console.log("oder",order);
    await callApi("POST", CHANGESTATUS, parmas, this.state.tokenAPI)
      .then(async (res) => {
        console.log('UPDATEORDER', res);
      })
      .catch()
    this.setState({
    visible:false,
    modalDelete:false,
    orderSussces:false,
  });
  await this.getAllOrder_new(user_cookies.user.id, this.state.tokenAPI);
  await this.resetOrderTable();
  }
  onChangeCommon = (e) => {
    this.setState({
      note: e.target.value,
    });
  };
  handel= (e) =>{
    console.log("e",e);
    this.setState({
      chanceOrder:e
    });
  }
  render() {
    let {
      maDH,
      countOrder,
      listAllOrder,
      selectedRowKeys,
      //visibleModal,
      enableFilter,
      warning,
      data,
      startDate,
      endDate
      //selectedRowKeys,
    } = this.state;
    console.log("this.state.message", this.state.message)
    console.log('listAllOrder b???t ?????u', listAllOrder);

    
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelectRowChange,
    };
    const columns =(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer")?  [
      {
        title: 'STT',
        key:"key",
        width: 150,
        render:(record)=>{
          console.log("record.key",record.key)
          return record.key
        }
      },
      {
        title: 'M?? ????n h??ng',
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        width: 250,
      },
      {
        title: 'T??n tr???m',
        dataIndex: "Factory_Name",
        key: "Factory_Name",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        width: 250,
      },
      {
        title: 'Ng??y-gi??? t???o',
        dataIndex: "createdAt",
        key: "createdAt",
        ...this.getColumnSearchProps("createdAt"),
        width: 200,

        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          return (moment(a.createdAt) - moment(b.createdAt))
        },
        render: (text) => {
          return (
            <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>
          )
        }
      },
  
      {
        title: 'Ng??y giao',
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
        width: 200,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          return (moment(a.deliveryDate) - moment(b.deliveryDate))
        },
             },
      
             {
              title: 'S??? l?????ng',
              width: 150,
              render: (text, record,index) => {
                let a=record;
                let sum=0;
                 for(let i=0;i<record.listCylinder.length;i++){
                   
                    sum +=+record.listCylinder[i].numberCylinders;
                 }
                 console.log(sum);
                return(
                  <div className="text-success">
                    <lable onClick={() =>{
                      this.setState({indexCylinders :record.listCylinder});
                      this.handleChangeNumberOfCylinder();
                      }}>
                      {sum}
                    </lable>
                  </div>
                )
              }
            },

      {
        title: 'Tr???ng th??i',
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
        width: 200,
        render: (text) => {
          const txt = text === "INIT" ? "Kh???i t???o"
            : text === "CONFIRMED" ? "???? duy???t"
              : text === "DELIVERING" ? "??ang v???n chuy???n"
                : text === "DELIVERED" ? "???? giao"
                  : text === "COMPLETED" ? "???? ho??n th??nh"
                    : text === "CANCELLED" ? "???? b??? h???y"
                      : text === "PROCESSING" ? "??ang x??? l??"
                        : text
          return (
            <div>{txt}</div>
          )
        }
      },

      {
        title: 'Thao t??c',
        align: "center",
        key:"action",
        fixed: 'right',
        width: 190,
        render: (order) => (
          <div>
              {/* {!(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") 
              && !(this.state.userRole==="SuperAdmin" && this.state.userType==="Factory")
              && !(this.state.userRole==="SuperAdmin" && this.state.userType==="Region")
              && (
                  <Tooltip placement="top" title="Ch???nh s???a">
                    
                  <i
                    className="fa fa-pencil"
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() =>{
                      this.setState({order :order});
                      this.setValueModalUpdate();
                      }}>
                        
                      </i>
              </Tooltip>
              )} */}
                  <Tooltip placement="top" title="Xem">
                    <i
                      className="fa fa-eye"
                      data-toggle="modal"
                      data-target={"#approval-order-" }
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() =>{
                        this.setState({indexCylinders :order.listCylinder,
                            noteOfCylinder :{
                                          note:order.note,
                                          status:order.status,
                                          expected_DeliveryDate:order.expected_DeliveryDate
                                            }});
                        this.handleChangeNumberOfCylinder();
                        }}></i>
                  </Tooltip>
          
              {!(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") 
               && !(this.state.userRole==="Owner" && this.state.userType==="Factory")
               && (
                  <Tooltip placement="top" title="Duy???t">
                  <i
                    className="fa fa-check-circle"
                    data-toggle="modal"
                    data-target={"#approval-order-" }
                    style={{color: "#009347", cursor: "pointer", marginRight: "10px" }}
                    onClick={() =>{
                      this.setState({order :order});
                      this.setValueModalUpdate();
                      }}>
                  </i>
              </Tooltip>
              )}
              {(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") && (
                  <Tooltip placement="top" title="V???n chuy???n">
                  <Icon type="car" className="fa" />
                      <i
                        style={{color: "red", cursor: "pointer", marginRight: "10px" }}
                        onClick={() =>{
                          this.setState({order :order});
                          this.setValueModalDelete();
                        }
                        }
                      ></i>
                  </Tooltip>
              )}
              {(!(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") && !(this.state.chanceOrder==="2"))  && (
                  <Tooltip placement="top" title="H???y">
                  <i
                    className="fa fa-trash"
                    style={{color: "red", cursor: "pointer", marginRight: "10px" }}
                    onClick={() =>{
                      this.setState({order :order});
                      this.setValueModalDelete();
                    }
                    }
                  ></i>
              </Tooltip>
              )}
              
                
          </div>
        ),
      },
    ]:[
      {
        title: 'STT',
        key:"key",
        width: 150,
        render:(record)=>{
          console.log("record.key",record.key)
          return record.key
        }
      },
      {
        title: 'M?? ????n h??ng',
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        width: 250,
      },
      {
        title: 'T??n tr???m',
        dataIndex: "Factory_Name",
        key: "Factory_Name",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: 'left',
        width: 250,
      },
      {
        title:this.state.chanceOrder==="1" ?'Nh?? m??y':'Kh??ch h??ng',
        width: 250,
        render:(text,record)=>{
          return  record.customerId?record.customerId.name:""
        }
      },
      
      {
        title: 'Ng??y-gi??? t???o',
        dataIndex: "createdAt",
        key: "createdAt",
        ...this.getColumnSearchProps("createdAt"),
        width: 200,

        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          return (moment(a.createdAt) - moment(b.createdAt))
        },
        render: (text) => {
          return (
            <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>
          )
        }
      },
  
      {
        title: 'Ng??y giao',
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
        width: 200,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          return (moment(a.deliveryDate) - moment(b.deliveryDate))
        },
             },
      
             {
              title: 'S??? l?????ng',
              width: 150,
              render: (text, record,index) => {
                let a=record;
                let sum=0;
                 for(let i=0;i<record.listCylinder.length;i++){
                   
                    sum +=+record.listCylinder[i].numberCylinders;
                 }
                 console.log(sum);
                return(
                  <div className="text-success">
                    <lable onClick={() =>{
                      this.setState({indexCylinders :record.listCylinder});
                      this.handleChangeNumberOfCylinder();
                      }}>
                      {sum}
                    </lable>
                  </div>
                )
              }
            },

      {
        title: 'Tr???ng th??i',
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
        width: 200,
        render: (text) => {
          const txt = text === "INIT" ? "Kh???i t???o"
            : text === "CONFIRMED" ? "???? duy???t"
              : text === "DELIVERING" ? "??ang v???n chuy???n"
                : text === "DELIVERED" ? "???? giao"
                  : text === "COMPLETED" ? "???? ho??n th??nh"
                    : text === "CANCELLED" ? "???? b??? h???y"
                      : text === "PROCESSING" ? "??ang x??? l??"
                        : text
          return (
            <div>{txt}</div>
          )
        }
      },

      {
        title: 'Thao t??c',
        align: "center",
        key:"action",
        fixed: 'right',
        width: 190,
        render: (order) => (
          <div>
              {/* {!(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") 
              && !(this.state.userRole==="SuperAdmin" && this.state.userType==="Factory")
              && !(this.state.userRole==="SuperAdmin" && this.state.userType==="Region")
              && (
                  <Tooltip placement="top" title="Ch???nh s???a">
                    
                  <i
                    className="fa fa-pencil"
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() =>{
                      this.setState({order :order});
                      this.setValueModalUpdate();
                      }}>
                        
                      </i>
              </Tooltip>
              )} */}
                  <Tooltip placement="top" title="Xem">
                    <i
                      className="fa fa-eye"
                      data-toggle="modal"
                      data-target={"#approval-order-" }
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() =>{
                        this.setState({indexCylinders :order.listCylinder,
                            noteOfCylinder :{
                                          note:order.note,
                                          status:order.status,
                                          expected_DeliveryDate:order.expected_DeliveryDate
                                            }});
                        this.handleChangeNumberOfCylinder();
                        }}></i>
                  </Tooltip>
          
              {!(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") 
               && !(this.state.userRole==="Owner" && this.state.userType==="Factory")
               && (
                  <Tooltip placement="top" title="Duy???t">
                  <i
                    className="fa fa-check-circle"
                    data-toggle="modal"
                    data-target={"#approval-order-" }
                    style={{color: "#009347", cursor: "pointer", marginRight: "10px" }}
                    onClick={() =>{
                      this.setState({order :order});
                      this.setValueModalUpdate();
                      }}>
                  </i>
              </Tooltip>
              )}
              {(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") && (
                  <Tooltip placement="top" title="V???n chuy???n">
                  <Icon type="car" className="fa" />
                      <i
                        style={{color: "red", cursor: "pointer", marginRight: "10px" }}
                        onClick={() =>{
                          this.setState({order :order});
                          this.setValueModalDelete();
                        }
                        }
                      ></i>
                  </Tooltip>
              )}
              {(!(this.state.userRole==="SuperAdmin" && this.state.userType==="Fixer") && !(this.state.chanceOrder==="2"))  && (
                  <Tooltip placement="top" title="H???y">
                  <i
                    className="fa fa-trash"
                    style={{color: "red", cursor: "pointer", marginRight: "10px" }}
                    onClick={() =>{
                      this.setState({order :order});
                      this.setValueModalDelete();
                    }
                    }
                  ></i>
              </Tooltip>
              )}
              
                
          </div>
        ),
      },
    ];
    //console.log(this.state.valueCompany);
    return (
      <Row id="SeeOrdercss">
        <Row className="SeeOrdercss__title">
            <h4>Xem ????n h??ng ???????c nh???n</h4>
            <Row className="SeeOrdercss__title__right">
              <Button
                type="primary"
                id="orderList"
                onClick={()=>{this.setState({ visible :true,orderSussces:true})}}
              >
                Duy???t ????n h??ng
              </Button>
              <Button
                type="primary"
                onClick={this.resetOrderTable}
              >
                Nh???p l???i  
              </Button>
            </Row>    
        </Row>
        <Row className="SeeOrdercss__menu border">
          <Row className="SeeOrdercss__menu__right">
            {!(this.state.userRole === "SuperAdmin" && this.state.userType === "Fixer") && (

              <select
                className="status btn-history"
                id="status"
                name="status"
                style={{
                  borderColor: "#928b8b",
                }}
                onChange={this.handleThisTime}
              >
                <option selected>Tr???ng th??i</option>
                <option value="INIT">Kh???i t???o</option>
                <option value="PROCESSING">??ang x??? l??</option>
                <option value="DELIVERING">??ang giao</option>
                <option value="DELIVERED">???? giao</option>
                <option value="CANCELLED">???? h???y</option>
                <option value="CONFIRMED">???? duy???t</option>
              </select>

            )}
            {(this.state.userRole === "SuperAdmin" && this.state.userType === "Fixer") && (

              <select
                className="status btn-history"
                id="status"
                name="status"
                style={{
                  borderColor: "#928b8b",
                }}
                onChange={this.handleThisTime}
              >
                <option selected>Tr???ng th??i</option>
                <option value="DELIVERING">??ang giao</option>
                <option value="DELIVERED">???? giao</option>
                <option value="CONFIRMED">???? duy???t</option>
              </select>

            )}
            <button
              className="thisDay btn-history"
              onClick={
                this.handleThisTime}
              value="thisDay"
            >
              H??m nay
                      </button>
            <button
              className="lastDay btn-history"
              value="lastDay"
              onClick={this.handleThisTime
              }
            >
              H??m qua
                      </button>
            <button
              className="week btn-history"
              onClick={this.handleThisTime}
            >
              Tu???n n??y
                      </button>
            <button
              className="month btn-history"
              onClick={this.handleThisTime}
            >
              Th??ng n??y
            </button>
          </Row>
          <Row className="SeeOrdercss__menu__left">
            <RangePicker
              value={[startDate, endDate]}
              format={"DD/MM/YYYY"}
              onChange={this.handleTime}
            />
          </Row>
        </Row> 
                 
        <Row className="SeeOrdercss__body">
             <Tabs   defaultActiveKey="1" 
                   onChange={this.handel}>
                     
                   <TabPane tab="????n ?????t v???" key="1">
                   <div className="SeeOrdercss__body__text">
                    
                   <Table
                     scroll={{ x: 1500, y: 420 }}
                     bordered
                     columns={columns}
                     dataSource={this.state.status===false?this.state.listAllOrder:this.state.searchList}
                     rowSelection={rowSelection}         
                   />
                   </div>
                  </TabPane>    
                
                
                {((this.state.userRole ==="SuperAdmin"&& this.state.userType ==="Fixer") 
                ||(this.state.userRole ==="SuperAdmin"&& this.state.userType ==="Factory"))?(
                  ""
                ):(
                  <TabPane tab="????n ?????t b??nh ???? t???o" key="2">
                    <div className="SeeOrdercss__body__text">
                    <Table
                    scroll={{ x: 1500, y: 420 }}
                    bordered
                    columns={columns}
                    dataSource={this.state.status===false?this.state.listAllOrder_CreatedBy:this.state.searchList}
                    rowSelection={rowSelection}         
                  />
                    </div>
                                  
                  </TabPane>
                )}
                {!(this.state.userRole ==="SuperAdmin"&& this.state.userType ==="Fixer") && !(this.state.userRole ==="SuperAdmin"&& this.state.userType ==="Factory") && (
                    <TabPane tab="????n ?????t b??nh nh???n ???????c" key="3">
                      <div className="SeeOrdercss__body__text">
                        <Table
                        scroll={{ x: 1500, y: 420 }}
                        bordered
                        columns={columns}
                        dataSource={this.state.status===false?this.state.listAllOrder_WareHouse:this.state.searchList}
                        rowSelection={rowSelection}         
                        />
                      </div>
                    
                  </TabPane>
                )}
            </Tabs>
        </Row>
        {this.state.visibleNumberOfCylinder===true && 
							(
								<NumberOfCylinder
								visibleNumberOfCylinder={this.state.visibleNumberOfCylinder}
								onClickNumberOfCylinder={(status) =>
									this.onClickNumberOfCylinder(status)
								}
                indexCylinders={this.state.indexCylinders}
                noteOfCylinder={this.state.noteOfCylinder}
							/>
							)
							}
        {
          this.state.selectedRows.length !== 0 ?
          <PopupExportOrder
            getListProducts={this.getListProducts}
            selectedOrderInfor={this.state.selectedOrderInfor}
            handleInput={this.handleInputValue}

          />
          : ""
        }
        <PopupDriverExportOrder
          product_parse={this.state.product_parse}
          selectedOrderIDs={this.state.selectedOrderIDs}
          selectedOrderInfor={this.state.selectedOrderInfor}
          ShippingTextDetail={this.state.ShippingTextDetail}
        />
        {this.state.visible===true && (
          <Modal
          title={this.state.modalDelete===true && this.state.orderSussces===false? "H???y ????n h??ng " + this.state.order.orderCode
          :this.state.modalDelete===false && this.state.orderSussces===false?"Duy???t ????n h??ng "+this.state.order.orderCode:
         " Duy???t ????n h??ng"}
          visible={this.state.visible}
          onOk={()=>this.handleOk(this.state.order)}
          // confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
            <Form.Item label={this.state.modalDelete===false?"":"L?? do"}>
            {this.state.modalDelete===false?"":(
                <div class="form-group">
                <textarea
                  class="form-control"
                  rows="2"
                  id="comment"
                  value={this.state.note}
                  onChange={this.onChangeCommon}
                  name="comment"
                ></textarea>
                {/* <textarea class="form-control" rows="2" id="comment" value={common} onChange={this.onChangeCommon} name="common"></textarea> */}
              </div>
            )}
            </Form.Item>
          </Modal>
        )}
        
      </Row>
    );
  }
}
export default (SeeOrder);