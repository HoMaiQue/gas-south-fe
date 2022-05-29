import React, {  useState } from "react";
import styled from "styled-components";
import InputReason from "../Detail-Order/InputReason";
import { Formik, Form, Field } from "formik";
import { createOrderFetch } from "../../../hooks/createOrderFetch";
import {  toast } from "react-toastify";
import orderManagement from "../../../../../api/orderManagementApi";
import ToastMessage from "../../../../helpers/ToastMessage";

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
const ContainerDetail = styled.div`
    margin-bottom: 6px;
    margin-left: 8px;
    h4 {
        font-size: 18px;
        margin-bottom: 6px;
        font-weight: 700;
    }
    .list {
        display: flex;
        column-gap: 55px;
        span {
            font-weight: 400;
            color: black;
            font-size: 18px;
        }
    }
`;
const UpdateOrderWrapper = styled.div`
    display: flex;
    column-gap: 30px;
    margin-left: 0;
    .order-item {
        font-weight: 500;
        width: 125px;
        height: 35px;
        border: 2px solid black;
        border-radius: 5px;
        padding: 2px 4px;
    }
    .order-item:last-child {
        padding-left: 8px;
    }
`;
const UpdateOrderDDT = ({ status, datadetail, data, setIsUpdate, setDataOrder }) => {
    const { valves, colors } = createOrderFetch();
    console.log('this is datadetail', datadetail);
    const [initialValues, setInitialValues] = useState(()=> {
        const orderDetails = []
         datadetail && datadetail.forEach(order => {
            orderDetails.push({
                id: order.id,
                quantity: order.quantity, 
                manufacture: order.manufacture.id,
                categoryCylinder: order.categoryCylinder.id,
                colorGas: order.colorGas.id,
                valve: order.valve.id,
            })
        });
        return {
            orderDetail: orderDetails,
        }
    })

    const validate = (values) => {
        const errors = {};
        if (values.orderDetail) {
            for (var i = 0; i < values.orderDetail.length; i++) {
                for (var j = i + 1; j < values.orderDetail.length; j++) {
                    if (
                        values.orderDetail[i].manufacture ===
                        values.orderDetail[j].manufacture &&
                    values.orderDetail[i].categoryCylinder ===
                        values.orderDetail[j].categoryCylinder &&
                        values.orderDetail[i].colorGas ===
                            values.orderDetail[j].colorGas &&
                        values.orderDetail[i].valve ===
                            values.orderDetail[j].valve
                    ) {
                        let position = i ;
                        if(j === values.orderDetail.length - 1){
                            position = j ;
                        }
                        errors.isSame =
                           {nameError:"Vui lòng không chọn trùng loại sản phẩm ",
                            position: position
                        }
                    }
                }
                if (
                    values.orderDetail[i].quantity > initialValues.orderDetail[i].quantity 
                   
                ) {
                    errors.quantity = {
                        position: i ,
                        error: "Vui lòng nhập số lượng nhỏ hơn số lượng ban đầu ",
                    };
                }
            }
        }

        return errors;
    };
    const renderProduct = () => {
        return (
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={async(values) =>{
                   
                    try {
                        let params = {id: data.id}
                        const result = await orderManagement.updateOrder(params,values);
                        if(result && result.success) {
                            ToastMessage('success', result.message)
                            
                            setIsUpdate(false)
                           const res = await orderManagement.detailOrder(data.id)
                           if(res && res.data){
                                setDataOrder(res.data)
                           }
                        }else {
                            ToastMessage('error', res.message)
                            
                        }
                    }catch (e) {
                        console.log(e)
                    }
                }}
            >
                {(formik) => {

                    if (formik.errors.isSame) {
                        ToastMessage("error", formik.errors.isSame.nameError)
                        
                                    formik.values.orderDetail[
                            formik.errors.isSame.position
                        ]["valve"] = "";
                        formik.setErrors({});
                    }
                       
                    if (formik.errors.quantity) {
                        ToastMessage("error", formik.errors.quantity.error)
                       
                        formik.values.orderDetail[
                            formik.errors.quantity.position
                        ]["quantity"] = "";
                        formik.setErrors({});
                    }
                    console.log(formik)
                    return (
                        <Form id="formDDT">
                            {datadetail.map((product, index) => {
                                console.log(product)
                                return (
                                    <ContainerDetail>
                                        <h4>
                                            {product.manufacture.name} - LOẠI{" "}
                                            {product.categoryCylinder.name}
                                        </h4>
                                        <div className="row ">
                                            <div className="col-md-6">
                                                <UpdateOrderWrapper className="row ">
                                                    <div className="">
                                                        <Field
                                                            as="select"
                                                            className="order-item"
                                                            name={`orderDetail[${index}].colorGas`}
                                                        >
                                                            Màu:{" "}
                                                            <option value="">
                                                                Chọn màu
                                                            </option>
                                                            {colors.map(
                                                                (d, i) => (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            d.id
                                                                        }
                                                                        selected={
                                                                            product
                                                                                .colorGas
                                                                                .id ===
                                                                            d.id
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    >
                                                                        {d.name}
                                                                    </option>
                                                                )
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <div className="">
                                                        <Field
                                                            as="select"
                                                            className="order-item"
                                                            name={`orderDetail[${index}].valve`}
                                                           

                                                        >
                                                            Van:{" "}
                                                            <option value="">
                                                                Chọn loại van
                                                            </option>
                                                            {valves.map(
                                                                (d, i) => (
                                                                    <option
                                                                        key={i}
                                                                        value={
                                                                            d.id
                                                                        }
                                                                        selected={
                                                                            product
                                                                                .valve
                                                                                .id ===
                                                                            d.id
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    >
                                                                        {d.name}
                                                                    </option>
                                                                )
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <div className="">
                                                        <Field
                                                            className="order-item"
                                                            type="number"
                                                            placeholder="Số lượng"
                                                            name={`orderDetail[${index}].quantity`}
                                                            defaultValue={
                                                                product.quantity
                                                            }
                                                        />
                                                    </div>
                                                </UpdateOrderWrapper>
                                            </div>
                                        </div>
                                    </ContainerDetail>
                                );
                            })}
                        </Form>
                    );
                }}
            </Formik>
        );
    };

    const totalValue = () => {
        let total = 0;
        for (let i = 0; i < datadetail.length; i++) {
            total = total + datadetail[i].quantity;
        }
        return total;
    };

    return (
        <Wrapper>
            <Header>
                <h3>Thông tin đặt hàng:</h3>
                <span>Số lượng: {totalValue()}</span>
            </Header>
            {renderProduct()}
            {status == "GUI_DUYET_LAI" ? <InputReason /> : ""}
        </Wrapper>
    );
};

export default UpdateOrderDDT;
