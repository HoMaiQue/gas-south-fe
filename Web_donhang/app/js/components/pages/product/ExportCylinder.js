import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import required from 'required';
import showToast from 'showToast';
import getInformationFromCylinders from "../../../../api/getInformationFromCylinders";
import Constant from "Constants";
import ExportCylinders from "./ExportCylinders"
import ReactCustomLoading from "ReactCustomLoading";
import getCylinderDuplicate from "../../../../api/getCylinderDuplicate"
import autoCreateCylinder from "../../../../api/autoCreateCylinder"
import getUserCookies from "getUserCookies";
import { Select, Tabs, Button } from "antd";
const { TabPane } = Tabs;
const { Option } = Select;
var fileReader;

class ExportCylinder extends React.Component {

  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: '',
      listProducts: [],
      error: "",
      inputKey: Date.now(),
      file: null,
      loading: false,
      listDuplicate: [],
      listCylinder: [],
      disableTab1: false,
      disableTab2: false,
      disableTab3: true,
      listErr: [],
      listOk: [],
      errCyl: [],
      errCyl_notCreated: [],
    };
  }

  // handleSelect = async (value) => {
  //   let array = this.state.listCylinder
  //   for (let i = 0; i < this.state.listDuplicate.length; i++) {
  //     this.state.listDuplicate[i].duplicateCylinders.map(v => 
  //     {
  //       if (v.id === value) {
  //         array[i] = value
  //       }
  //     })       
  //   } 
  //   await this.setState({
  //     listCylinder: array
  //   })
  //   console.log("handleSelect", this.state.listCylinder)
  // }
  handleFileUpload(event, isCheck) {
    this.setState({
      loading: true,
      disableTab1: true,
      disableTab2: true,
      disableTab3: true,
      errCyl_notCreated: []
    });

    let that = this;
    let file = null;
    event.preventDefault();
    console.log(isCheck);
    if (isCheck) {
      this.fileInput.value = null;
      this.setState({
        file,
        error: "",
        listProducts: [],
        loading: false,
      });
    } else {
      file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onload = async function(event) {
        let result = event.target.result;
        let arraynew = result
          .trim()
          .split("\n")
          .map((item) => item.replace(/\r|\n/gi, ""))
          .filter((item) => item != "");
        let cylinders_list = [];
        let couting={};
        let ab=[];
        arraynew.forEach((str)=>{
          couting[str] = (couting[str]|| 0)+1;
        });  
        if(Object.keys(couting).length!== arraynew.length){
         let str;
          for(str in couting){
            if(couting.hasOwnProperty(str)){
              if(couting[str] > 1){
              let a =str +' c?? ' + couting[str] + ' l???n tr??ng';
              ab.push(a);
              }
            }
          }
        }
        //ham loc b??nh tr??ng
        const array_id = Object.keys(couting);
        //
        let onePerCern = Math.floor(array_id.length / 100);
        let resultSearch,
          errCyl = [],
          err_msg = "",
          success = false,
          success_cylinders = [],
          success_idCylinders = [],
          errCyl_notCreated = [],
          errCyl_notInSystem = [],
          tempStatus = 200;

        if (array_id.length < 100) {
          let temp = await getInformationFromCylinders(array_id, "EXPORT");
          if (temp.status !== 200) {
            showToast("X???y ra r???i khi k???t n???i t???i m??y ch???");
          }
          if (temp.data.err_msg) {
            errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
            errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
            errCyl = errCyl.concat(temp.data.errCyl);
            success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
            success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
            if (temp.data.success) {
              success = temp.data.success;
            }
          } else {
            let tempIf = temp.data.map((item) => item.serial);
            success_cylinders = success_cylinders.concat(tempIf);

            let tempIf2 = temp.data.map((item) => item.id);
            success_idCylinders = success_idCylinders.concat(tempIf2);
          }
          tempStatus = temp.status;
        } else {
          for (let i = 0; i < 100; i += 10) {
            let array;

            if (i === 90) {
              array = array_id.slice(i * onePerCern, array_id.length);
            } else {
              array = array_id.slice(i * onePerCern, (i + 10) * onePerCern);
            }

            that.setState({ percent: i + 10 });

            let temp = await getInformationFromCylinders(array, "EXPORT");
            console.log(temp);
            if (temp.status !== 200) {
              tempStatus = temp.status;
            }
            if (temp.data.err_msg) {
              errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
              errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
              errCyl = errCyl.concat(temp.data.errCyl);
              success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
              success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
              if (temp.data.success) {
                success = temp.data.success;
              }
            } else {
              let tempIf = temp.data.map((item) => item.serial);
              success_cylinders = success_cylinders.concat(tempIf);
              let tempIf2 = temp.data.map((item) => item.id);
              success_idCylinders = success_idCylinders.concat(tempIf2);
            }
          }
          that.setState({ percent: 0 });
        }

        resultSearch = {
          data: {
            errCyl: errCyl,
            errCyl_notCreated: errCyl_notCreated,
            errCyl_notInSystem: errCyl_notInSystem,
            err_msg: err_msg,
            success: success,
            success_cylinders: success_cylinders,
            success_idCylinders: success_idCylinders,
          },
          status: tempStatus,
        };

        if (resultSearch.status === 200) {
          that.props.getListProducts([]);

          that.setState({
            loading: false,
            listProducts: [],
          });

          if (errCyl.length || errCyl_notCreated.length || errCyl_notInSystem.length || ab.length) {
            let err1 = "",
              err2 = "",
              err3="",
              errorShow = "";
            const regex = /#/gi;

            if (errCyl.length) {
              err1 = `C?? ${errCyl.length} m?? ???? b??n ho???c ??ang kh??ng ??? doanh nghi???p s??? t???i n??n kh??ng th??? xu???t.#`;
            }
            if (errCyl_notCreated.length) {
              err2 = `C?? ${errCyl_notCreated.length + errCyl_notInSystem.length} m?? ch??a khai b??o.#`;
            }
            if(ab.length){
              err3 = ab.toString();
            }
            errorShow = (err1 + err2 +err3).replace(regex, "\n").trim();
            that.setState({
              error: errorShow,
              listErr: errCyl.concat(errCyl_notCreated).concat(errCyl_notInSystem),
              disableTab2: false,
              errCyl: errCyl,
              errCyl_notCreated: errCyl_notCreated.concat(errCyl_notInSystem),
            });
          }

          //Ki???m tra v?? l???y m?? b??nh ?????t
          if (resultSearch.data.success_cylinders.length !== 0) {
            that.setState({
              listOk: resultSearch.data.success_cylinders,
              disableTab1: false,
            });
            //l???y id b??nh ?????t
            that.props.getSuccessIdCylinders(resultSearch.data.success_idCylinders);
          }
          //G???i API l???y danh s??ch b??nh tr??ng
          let result = await getCylinderDuplicate(errCyl);
          let arr = [];
          result.data.listDuplicate.map((value) => {
            arr.push(value.id);
          });
          that.props.getListCylinderDuplicate(arr);
          if (result.data.listDuplicate.length !== 0) {
            that.setState({
              listDuplicate: result.data.listDuplicate,
              disableTab3: false,
            });
          }
          //showToast(resultSearch.data.err_msg)
        } else {
          that.setState({ loading: false });
          showToast("L???i ???????ng truy???n, vui l??ng th??? l???i");
        }
      };
      fileReader.readAsText(file);
    }
  }
  handleUpload = async () => {
    let that = this
    let user_cookies = await getUserCookies();
    let result = await autoCreateCylinder(user_cookies.user.id, this.state.errCyl_notCreated)
    if (result.data.success === true){
      showToast("Upload b??nh ch??a khai b??o th??nh c??ng")
      that.props.getCylindersNotCreate(result.data.successCylinder);
    }
    else {
      showToast(result.data.message)
    }
  }
  handleContinue = () =>{
    this.props.cylinderNotPass(this.state.errCyl)
  }
  render() {
    return (
      <div className="modal fade" id="export-cylinder" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xu???t B??nh - B?????c 1 - Nh???p File</h5>
              <button type="button" className="close" data-dismiss="modal" onClick={this.reloadPopup}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form ref={c => {
                this.form = c
              }} className="card" onSubmit={(event) => this.submitTextFile(event)}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>H??y nh???p t???p tin t??? ?????u ?????c</label>
                        <div style={{ display: "flex" }}>
                          <input
                            accept='.txt'
                            className="form-control"
                            type="file"
                            name="upload_file"
                            ref={(input) => {
                              this.fileInput = input
                            }}
                            onChange={(event) => this.handleFileUpload(event)}
                            validations={[required]} />
                          <input type="reset" />
                        </div>
                      </div>
                      {this.state.error !== "" ? (<div>
                        <label style={{ color: "red" }}>{this.state.error}</label>
                      </div>) : null}

                    </div>
                    <div className="row custom-scroll-table">
                      <Tabs>
                        <TabPane tab="B??nh ?????t" key="1" disabled={this.state.disableTab1}>
                          <table
                            className="table table-striped table-bordered seednet-table-keep-column-width"
                            cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px">#STT</th>
                                <th className="w-120px text-center">M?? B??nh</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listProducts.length !== 0 ? this.state.listProducts.map((store, index) => {
                                return (
                                  <tr>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {store.serial}
                                    </td>
                                  </tr>
                                );
                              }) :
                                this.state.listOk ? this.state.listOk.map((store, index) => {
                                  return (
                                    <tr>
                                      <td scope="row" className="text-center">
                                        {index + 1}
                                      </td>
                                      <td scope="row" className="text-center">
                                        {store}
                                      </td>
                                    </tr>
                                  );
                                })
                                  : ""}
                            </tbody>
                          </table>

                        </TabPane>
                        <TabPane tab="B??nh kh??ng ?????t" key="2" disabled={this.state.disableTab2}>
                          <table
                            className="table table-striped table-bordered seednet-table-keep-column-width"
                            cellSpacing="0"
                          >
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px">#STT</th>
                                <th className="w-120px text-center">M?? B??nh</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.listErr.length !== 0 ? this.state.listErr.map((store, index) => {
                                return (
                                  <tr>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {store}
                                    </td>
                                  </tr>
                                );
                              }) : ""}
                            </tbody>
                          </table>
                        </TabPane>
                        <TabPane tab="B??nh tr??ng" key="3" disabled={this.state.disableTab3}>
                          <table
                            className="table table-striped table-bordered seednet-table-keep-column-width"
                            cellSpacing="0"
                          >
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px align-middle">#STT</th>
                                <th className="w-120px text-center align-middle">S??? serial</th>
                                {/* <th className="w-120px text-center align-middle">Xem s??? serial</th> */}
                              </tr>
                            </thead>
                            <tbody className="custom-scroll-table">
                              {this.state.listDuplicate.map((value, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {value.serial}
                                    </td>
                                    {/* <td scope="row" className="text-center">
                                <Select defaultValue="--Ch???n--"
                                  onChange={(value) => this.handleSelect(value)}
                                >
                                  {value.duplicateCylinders ?
                                    value.duplicateCylinders.map((value, index) => {
                                      console.log("hhhhh", value)
                                      return (
                                        <Option value={value.id} key={index}>{value.serial}</Option>
                                      )
                                    }) : ""}
                                </Select>
                              </td> */}
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </TabPane>
                        <TabPane tab="B??nh ch??a khai b??o" key="4" >
                          <table className="table table-striped table-bordered seednet-table-keep-column-width" cellSpacing="0">
                            <thead className="table__head">
                              <tr>
                                <th className="text-center w-70px align-middle">#STT</th>
                                <th className="w-120px text-center align-middle">S??? serial</th>
                                
                              </tr>
                            </thead>
                            <tbody className="custom-scroll-table">
                              {this.state.errCyl_notCreated.map((value, index) => {
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    <td scope="row" className="text-center">
                                      {value}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="text-center">
                          <Button className="center" type="success" size="large" onClick={this.handleUpload}>
                            UPLOAD
                          </Button>
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <button
                    // disabled={
                    //   this.state.listOk.length === 0 &&
                    //   this.state.listProducts.length === 0 &&
                    //   this.state.listDuplicate.length === 0
                    // }
                    className="btn btn-primary" onClick={(event) => {
                      this.handleFileUpload(event, true)
                      this.handleContinue()
                      const modal = $("#export-cylinder");
                      modal.modal('hide');
                    }} type="submit" data-toggle="modal"
                    data-target="#export-cylinders">Ti???p T???c
                  </button>
                  <button onClick={(event) => this.handleFileUpload(event, true)}
                    className="btn btn-secondary" type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={this.reloadPopup}
                  >????ng
                    </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default ExportCylinder;