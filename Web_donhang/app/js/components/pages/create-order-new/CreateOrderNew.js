import React, { useEffect, useState } from "react";
import "./CreateOrderNew.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import CustomerCreate from "./CustomerCreate";
import AdminCreate from "./AdminCreate";
import { createOrderFetch } from "../../hooks/createOrderFetch";
import handleShowDisplay from "../orderManagement/handleShowDisplay";
import getUserCookies from "getUserCookies";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router";
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrderCustomerFetch } from "../../hooks/createOrderCustomerFetch";
import orderManagement from "../../../../api/orderManagementApi";
import { handleDelivery } from "./handleDelivery";
import ToastMessage from "../../../helpers/ToastMessage";
const CreateOrderNew = () => {
    const { location } = createOrderCustomerFetch();
    const { valves, colors, menuFacture, category } = createOrderFetch();
    const [useRole, setUserRole] = useState(0);
    const {
        valueOfUser,
        setValueOfUser,
        valueDate,
        setValueDate,
        handleChangeDate,
        handleChangeAddress,
        orderArray,
        setOrderArray,
        handleAdd,
        handleDelete,
    } = handleDelivery();
    const [isReset, setIsReset] = useState(false);
    useEffect(() => {
        handleShowDisplay().then((data) => {
            setUserRole(data);
        });
    }, []);
    let handleAddOrderDetail = () => {
        setCountOrderDetails([...countOrderDetails, 0]);
    };
    const [countOrderDetails, setCountOrderDetails] = useState([1]);
    const handleResetForm = () => {
        setCountOrderDetails([1]);
    };
    const validate = (values) => {
        const errors = {};
        if (values.orderDetails) {
            for (var i = 0; i < values.orderDetails.length; i++) {
                for (var j = i + 1; j < values.orderDetails.length; j++) {
                    if (
                        values.orderDetails[i].manufacture ===
                            values.orderDetails[j].manufacture &&
                        values.orderDetails[i].categoryCylinder ===
                            values.orderDetails[j].categoryCylinder &&
                        values.orderDetails[i].colorGas ===
                            values.orderDetails[j].colorGas &&
                        values.orderDetails[i].valve ===
                            values.orderDetails[j].valve
                    ) {
                        errors.isSame =
                            "Vui l??ng kh??ng ch???n tr??ng lo???i s???n ph???m ";
                    }
                }
                if (
                    values.orderDetails[i].quantity <= 0 &&
                    values.orderDetails[i].quantity !== ""
                ) {
                    errors.quantity = {
                        position: i,
                        error: "Vui l??ng nh???p s??? l?????ng l???n h??n 0 ",
                    };
                }
            }
        }

        return errors;
    };
    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    delivery: [{ deliveryAddress: "", deliveryDate: "" }],
                    note: "",
                    orderType: "KHONG",
                    orderDetails: [
                        {
                            manufacture: "",
                            categoryCylinder: "",
                            colorGas: "",
                            valve: "",
                            quantity: "",
                        },
                    ],
                    area: "",
                    customers: "",
                    supplier: "",
                }}
                validate={validate}
                onSubmit={async (values, action) => {
                    try {
                        let paramsObjectId;
                        let upDateValues;
                        if (useRole === 1) {
                            console.log(values);
                            const idCustomer = await getUserCookies();
                            if (idCustomer.user.userRole === "SuperAdmin") {
                                paramsObjectId = idCustomer.user.id;
                            } else {
                                paramsObjectId = idCustomer.user.isChildOf;
                            }
                            upDateValues = {
                                ...values,
                                ...valueOfUser,
                                area: location.area,
                                customers: paramsObjectId,
                                supplier: paramsObjectId,
                            };
                            const res = await orderManagement.createOrder(
                                upDateValues
                            );
                            if (res) {
                                if (res.success) {
                                    ToastMessage("success", res.message);
                                    action.resetForm();
                                    handleResetForm();
                                    setValueOfUser({
                                        delivery: [
                                            {
                                                deliveryAddress: "",
                                                deliveryDate: "",
                                            },
                                        ],
                                        area: "",
                                        customers: "",
                                        supplier: "",
                                    });
                                    setIsReset(!isReset);
                                } else {
                                    ToastMessage(
                                        "error",
                                        "Th??m ????n h??ng th???t b???i"
                                    );
                                }
                            }
                        } else {
                            upDateValues = {
                                ...values,
                                ...valueOfUser,
                            };

                            const res = await orderManagement.createOrder(
                                upDateValues
                            );

                            if (res) {
                                if (res.success) {
                                    ToastMessage("success", res.message);

                                    action.resetForm();
                                    handleResetForm();
                                    setValueOfUser({
                                        delivery: [
                                            {
                                                deliveryAddress: "",
                                                deliveryDate: "",
                                            },
                                        ],
                                        area: "",
                                        customers: "",
                                        supplier: "",
                                    });
                                    setIsReset(!isReset);
                                } else {
                                    ToastMessage(
                                        "error",
                                        "Th??m ????n h??ng th???t b???i"
                                    );
                                }
                            }
                        }
                    } catch (err) {
                        action.resetForm();
                        console.log(err);
                    }
                }}
                validator={() => ({})}
            >
                {(formik) => {
                    let handleRemoveOrderDetail = (i) => {
                        //remove order detail
                        let newOrderDetailArr = [...countOrderDetails];
                        const valuesClone = [...formik.values.orderDetails];
                        if (newOrderDetailArr.length > 1) {
                            newOrderDetailArr.splice(i, 1);
                            valuesClone.splice(i, 1);
                            setCountOrderDetails(newOrderDetailArr);
                            formik.setValues({
                                ...formik.values,
                                orderDetails: valuesClone,
                            });
                        }
                    };
                    if (formik.errors.isSame) {
                        ToastMessage("error", formik.errors.isSame);

                        formik.values.orderDetails[
                            formik.touched.orderDetails.length - 1
                        ]["valve"] = "";
                        formik.setErrors({});
                    }
                    if (formik.errors.quantity) {
                        ToastMessage("error", formik.errors.quantity.error);

                        formik.values.orderDetails[
                            formik.errors.quantity.position
                        ]["quantity"] = "";
                        formik.setErrors({});
                    }

                    console.log(formik);
                    return (
                        <Form className="create_order">
                            <div className="order_container">
                                <div className="order_title">
                                    <h2>T???o ????n h??ng m???i</h2>
                                </div>
                                <div className="create-order-icon">
                                    <Link
                                        to="/orderManagement"
                                        className="link"
                                    >
                                        <AiOutlineClose> </AiOutlineClose>
                                    </Link>
                                </div>
                                {useRole === 1 && (
                                    <CustomerCreate
                                        isReset={isReset}
                                        valueOfUser={valueOfUser}
                                        setValueOfUser={setValueOfUser}
                                        valueDate={valueDate}
                                        setValueDate={setValueDate}
                                        handleChangeDate={handleChangeDate}
                                        handleChangeAddress={
                                            handleChangeAddress
                                        }
                                        orderArray={orderArray}
                                        setOrderArray={setOrderArray}
                                        handleAdd={handleAdd}
                                        handleDelete={handleDelete}
                                    />
                                )}

                                {useRole === 2 && (
                                    <AdminCreate
                                        isReset={isReset}
                                        valueOfUser={valueOfUser}
                                        setValueOfUser={setValueOfUser}
                                        valueDate={valueDate}
                                        setValueDate={setValueDate}
                                        handleChangeDate={handleChangeDate}
                                        handleChangeAddress={
                                            handleChangeAddress
                                        }
                                        orderArray={orderArray}
                                        setOrderArray={setOrderArray}
                                        handleAdd={handleAdd}
                                        handleDelete={handleDelete}
                                    />
                                )}
                                {countOrderDetails.map((data, index) => (
                                    <div
                                        key={index}
                                        className="order_info_detail"
                                    >
                                        <div className="order_info_detail_value">
                                            <Field
                                                className="order_info_detail_title_thuonghieu"
                                                name={`orderDetails[${index}].manufacture`}
                                                as="select"
                                            >
                                                <option value="">
                                                    Ch???n th????ng hi???u
                                                </option>
                                                {menuFacture.map((d, i) => (
                                                    <option
                                                        key={i}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <Field
                                                className="order_info_detail_title_loaibinh"
                                                name={`orderDetails[${index}].categoryCylinder`}
                                                as="select"
                                            >
                                                <option value="">
                                                    Ch???n lo???i b??nh
                                                </option>
                                                {category.map((d, i) => (
                                                    <option
                                                        key={i}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <Field
                                                className="order_info_detail_title_mausac"
                                                name={`orderDetails[${index}].colorGas`}
                                                as="select"
                                            >
                                                <option value="">
                                                    Ch???n m??u
                                                </option>
                                                {colors.map((d, i) => (
                                                    <option
                                                        key={i}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <Field
                                                className="order_info_detail_title_loaivan"
                                                name={`orderDetails[${index}].valve`}
                                                as="select"
                                            >
                                                <option value="">
                                                    Ch???n lo???i van
                                                </option>
                                                {valves.map((d, i) => (
                                                    <option
                                                        key={i}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <Field
                                                className="order_info_detail_title_soluong"
                                                type="number"
                                                placeholder="S??? l?????ng"
                                                name={`orderDetails[${index}].quantity`}
                                            />
                                            <div
                                                className="order_info_detail_plus_add"
                                                onClick={
                                                    data
                                                        ? () =>
                                                              handleAddOrderDetail()
                                                        : () =>
                                                              handleRemoveOrderDetail(
                                                                  index
                                                              )
                                                }
                                            >
                                                {data ? (
                                                    <FaPlus />
                                                ) : (
                                                    <FaMinus />
                                                )}
                                            </div>
                                        </div>
                                        <div className="order_info_detail_plus"></div>
                                    </div>
                                ))}
                                <div className="order_info_vobinh">
                                    <div>
                                        <Field
                                            name="orderType"
                                            type="radio"
                                            value="COC_VO"
                                        />
                                        <label>????n c???c v???</label>
                                    </div>
                                    <div>
                                        <Field
                                            name="orderType"
                                            type="radio"
                                            value="MUON_VO"
                                        />
                                        <label>????n m?????n v???</label>
                                    </div>
                                </div>
                                <div className="order_ghichu">
                                    <Field
                                        as="textarea"
                                        name="note"
                                        placeholder="Ghi ch??"
                                    ></Field>
                                </div>
                                <div className="btn-container">
                                    <button
                                        type="submit"
                                        className="btn-create-new-order"
                                    >
                                        T???o ????n h??ng
                                    </button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            <ToastContainer />
        </React.Fragment>
    );
};

export default CreateOrderNew;
