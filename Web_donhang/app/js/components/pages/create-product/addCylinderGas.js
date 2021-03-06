import React, { Component } from 'react';
import { message, Radio, Form, Input, Select, Upload, Icon, Modal } from "antd";
import required from 'required';
import showToast from "showToast";
import getDestinationUserAPI from 'getDestinationUserAPI';
import getUserCookies from "getUserCookies";
import getAllTypeGas from "getAllTypeGas";
import getAllUserApi from 'getAllUserApi';
import callApi from './../../../util/apiCaller';
import Constants from "Constants";
import getAllManufacturer from "getAllManufacturer";
import openNotificationWithIcon from "./../../../helpers/notification";
import vi from 'antd/es/date-picker/locale/vi_VN';
import moment from "moment";
import 'moment/locale/vi';
import { CREATE_CYLINDERGAS } from './../../../config/config';

const { Option } = Select;

class AddCylinderGas extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cylinderType: '',
            color: '',
            valve: '',
            weight: '',
            checkedDate: '',
            status: '',
            emptyOrFull: '',
            currentImportPrice: '',
            usingType: '',
            user_type: '',
            user_role: '',
            serial: '',
            select: '',
            checkCongtyCon: 1,
            value: 1, 
            listconttycon: '',
            activePage: 1,
            options: [],
            options2: [],
            doitac: '',
            factoryy: '',
            manufacture: '',
            typegas: '',
            listUserFixer: [],
            listTypeGas: [],
            category:'',
            listStation: [],
            listFactoryUser: [],
            listGeneralUser: [],
            listAgencyUser: [],
            listManufacturers: [],
            loading: false,
            idCardBase64: "",
            errorForm: "",
        };
    }
    async getAllTypeGas() {
        const dataUsers = await getAllTypeGas(Constants.GENERAL);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                
                let listArrTypeGas = [];
                for (let i = 0; i < dataUsers.data.data.length; i++) {
                    listArrTypeGas.push({
                        value: dataUsers.data.data[i].id,
                        label: dataUsers.data.data[i].name,
                        ...dataUsers.data.data[i],
                    })
                }
                
                this.setState({
                    listTypeGas: listArrTypeGas
                })
            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }
            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
        }
    }
    async getAllManufacturer() {
        const dataUsers = await getAllManufacturer(Constants.GENERAL);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listManufacturers: dataUsers.data });
                console.log("listManu", this.state.listManufacturers);
            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }
        }
        else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
        }
    }
    async getAllUser() {

        const dataUsers = await getAllUserApi();
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                let userLists = dataUsers.data;
                let userFactory = dataUsers.data.filter(x => x.userType === Constants.FACTORY);
                let userAgency = dataUsers.data.filter(x => x.userType === Constants.AGENCY);
                let userGeneral = dataUsers.data.filter(x => x.userType === Constants.GENERAL);
                this.setState({ listUsers: userLists, listFactoryUser: userFactory, listGeneralUser: userGeneral, listAgencyUser: userAgency });
                //filter 3 type

            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }
        }
        else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
        }

    }
    async addProduct(e) {
        e.preventDefault();
        const user_cookies = await getUserCookies();
        const token = "Bearer " + user_cookies.token;
        const { serial, color, valve, usingType, typegas, manufacture, weight, idCardBase64 } = this.state;
        let params = {
            serial: serial,
            color: color,
            weight: weight,
            classification: usingType,
            valve: valve,
            manufacture: manufacture,
            img_url: idCardBase64
        };
        await callApi("POST", CREATE_CYLINDERGAS, params, token).then(res => {
            if(serial === "" || color === "" || weight === "" || valve === ""){
                this.setState({
                    errorForm: "Vui l??ng nh???p ?????y ????? th??ng tin (*)"
                });
                return false;
            } else {
                showToast("T???o th??nh c??ng");
                window.location.reload(false);                
            }
        });
    }

    onChangeType = e => {
        this.setState({
            usingType: e.target.value
        });
    };

    onChangeSelectManu = value => {
        this.setState({
            manufacture: value
        });
    }

    onChangeValue = e => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }

    async getListFixer() {
        const dataUsers = await getDestinationUserAPI(Constants.FACTORY, '', Constants.OWNER);

        if (dataUsers) {

            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({
                    options: dataUsers.data.map((user) => {
                        return {
                            value: user.id,
                            label: user.name
                        }
                    })                    
                });
            } else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

        } else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
        }
    }
    async getList() {
        const dataUsers = await getDestinationUserAPI(Constants.FIXER);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({
                    options2: dataUsers.data.map((user) => {
                        return {
                            value: user.id,
                            label: user.name
                        }
                    })
                })
            } else {
            }
        } else {
            showToast("X???y ra l???i trong qu?? tr??nh l???y d??? li???u");
        }
    }

    async componentDidMount() {
        const user_cookies = await getUserCookies();
        this.setState({ user_type: user_cookies.user.userType, user_role: user_cookies.user.userRole }, () => {
        })
        this.getAllUser();
        this.getAllManufacturer();
        await this.getListFixer();
        await this.getList();
        await this.getAllTypeGas();
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          cb(reader.result);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
    }

    handleFileChange = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
    
        let idCardBase64 = "";
        this.getBase64(event.target.files[0], (result) => {
          idCardBase64 = result;
          this.setState({ idCardBase64 });
        });
    };
    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value, color, valve, serial, weight, errorForm } = this.state;
        return (
            <div className="modal fade" id="popup-create-product" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header table__head rounded-0">
                            <h4 className="modal-title text-white">T???o m???i s???n ph???m</h4>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="text-white">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form 
                                ref={c => {
                                    this.form = c
                                }}
                                className="card"
                                onSubmit={(e) => this.addProduct(e)}
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>M??</label>
                                                <Input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="serial"
                                                    onChange={this.onChangeValue}
                                                    value={serial}
                                                />
                                                {serial === "" && 
                                                    <p 
                                                        className="mt-2"
                                                        style={{color: "red"}}
                                                    >
                                                        {errorForm}
                                                    </p>
                                                }
                                            </div>
                                            <div
                                                className="form-group"
                                                style={{height: "60.8px"}}
                                            >
                                                <label>Ph??n lo???i</label>
                                                <div className="form-group">
                                                    <Radio.Group
                                                        onChange={this.onChangeType}
                                                        value={this.state.usingType}
                                                    >
                                                        <Radio value="New">B??nh m???i</Radio>
                                                        <Radio value="Old">B??nh c??</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>M??u s???c</label>
                                                <Input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="color" 
                                                    id="color" 
                                                    onChange={this.onChangeValue}
                                                    value={color}
                                                />
                                                {color === "" && 
                                                    <p 
                                                        className="mt-2"
                                                        style={{color: "red"}}
                                                    >
                                                        {errorForm}
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tr???ng l?????ng v??? b??nh</label>
                                                <Input className="form-control"
                                                    type="number"
                                                    name="weight"
                                                    id="weight"
                                                    onChange={this.onChangeValue}
                                                    value={weight}
                                                />
                                                {weight === "" && 
                                                    <p 
                                                        className="mt-2"
                                                        style={{color: "red"}}
                                                    >
                                                        {errorForm}
                                                    </p>
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label>Th????ng hi???u</label>
                                                <Select className="form-control"
                                                    name="manufacture"
                                                    onChange={this.onChangeSelectManu}
                                                >
                                                    <Option value="">-- Ch???n --</Option>
                                                    {this.state.listManufacturers.map((item, index) =>
                                                        <Option value={item.id} key={index}>{item.name}</Option>)}
                                                </Select>
                                            </div>
                                            <div className="form-group">
                                                <label>Lo???i van</label>
                                                <Input 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="valve" 
                                                    id="color" 
                                                    onChange={this.onChangeValue}
                                                    value={valve}
                                                />
                                                {valve === "" && 
                                                    <p 
                                                        className="mt-2"
                                                        style={{color: "red"}}
                                                    >
                                                        {errorForm}
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6 text-center m-auto">
                                            <div className="form-group">
                                                <label>H??nh ???nh b??nh</label>
                                                <Input
                                                    type="file"
                                                    name="logo"
                                                    data-provide="dropify"
                                                    onChange={(event) => this.handleFileChange(event)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <footer className="card-footer text-center">
                                    <button type="submit" className="btn btn-primary">L??u</button>
                                    
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                        style={{ marginLeft: "10px" }}>????ng
                                    </button>
                                </footer>
                            </Form>
                        </div>                        
                    </div>
                </div>
            </div>
        )
    }
}
export default AddCylinderGas;