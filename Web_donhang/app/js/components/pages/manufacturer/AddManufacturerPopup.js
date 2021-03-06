// Them thuong hieu
import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import Constant from "Constants";

class AddManufacturerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      color: "",
      weight: "",
      checkedDate: "",
      status: "",
      emptyOrFull: "",
      currentImportPrice: 0,
      idCardBase64: "",
      option: "",
    };
  }


  componentDidMount() { }

  componentDidUpdate(prevProps) { }

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

  fileChangedHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });

    let idCardBase64 = "";
    this.getBase64(event.target.files[0], (result) => {
      idCardBase64 = result;
      this.setState({ idCardBase64 });
    });
  };

  selectOptionHandler = (event) => {
    this.setState({ option: event.target.value });
  };

  async submit(event) {
    event.preventDefault();
    console.log("abe1tete", this.state.idCardBase64);

    let data = this.form.getValues();

    let res = await this.props.addManufacturer(
      data.name,
      data.phone,
      data.address,
      this.state.idCardBase64,
      data.origin,
      data.mass,
      data.ingredient,
      data.preservation,
      data.appliedStandard,
      data.optionSafetyInstructions,
      data.safetyInstructions
    );

    if (res) {
      const modal = $("#create-manufacturer");
      modal.modal("hide");
    }
    window.location.reload();
  }

  render() {
    return (
      <div className="modal fade" id="create-manufacturer" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">T???o m???i th????ng hi???u</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>T??n</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="name"
                          validations={[required]}
                        />
                      </div>
                      <div className="form-group">
                        <label>S??? ??i???n Tho???i</label>
                        {/* ????? text ????? c?? th??? nh???p (083)99995465-(0283)5555666 */}
                        <Input
                          className="form-control"
                          type="text"
                          name="phone"
                        />
                      </div>
                      <div className="form-group">
                        <label>Khu v???c</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="address"
                        />
                      </div>
                      <div className="form-group">
                        <label>Xu???t x???</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="origin"
                        />
                      </div>
                      <div className="form-group">
                        <label>Kh???i l?????ng bao b??</label>
                        <Input
                          className="form-control"
                          name="mass"
                          type="text"
                        />
                      </div>
                      <div className="form-group">
                        <label>Th??nh ph???n</label>
                        <Textarea
                          className="form-control"
                          name="ingredient"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>H?????ng d???n b???o qu???n</label>
                        <Textarea
                          className="form-control"
                          name="preservation"
                        />
                      </div>
                      <div className="form-group">
                        <label>Ti??u chu???n ??p d???ng</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="appliedStandard"
                        />
                      </div>
                      <div className="form-group">
                        <label>Ch??? d???n an to??n</label>
                        <Select
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          value={this.state.option}
                          name="optionSafetyInstructions"
                          onChange={this.selectOptionHandler}>
                          <option value=''>L???a ch???n</option>
                          <option value="Yes">C??</option>
                          <option value="No">Kh??ng</option>
                        </Select>
                        <Textarea
                          className="form-control"
                          name="safetyInstructions"
                          disabled={((this.state.option === "No") || (this.state.option === ""))}
                        />
                      </div>
                      <div>H??nh ???nh</div>
                      <Input
                        type="file"
                        name="logo"
                        data-provide="dropify"
                        onChange={(event) => this.fileChangedHandler(event)}
                        validations={[required]}
                      />
                    </div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary">L??u</Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    ????ng
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

export default AddManufacturerPopup;
