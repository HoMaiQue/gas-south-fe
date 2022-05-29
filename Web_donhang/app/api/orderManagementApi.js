import axiosClient from "./axiosClient";
import getUserCookies from "getUserCookies";
class OrderManagement {
    search = async (params) => {
        let data;
        let paramsObjectId;
        var user_cookies = await getUserCookies();
        if (user_cookies.user.userRole === "SuperAdmin") {
            paramsObjectId = user_cookies.user.id;
        } else {
            paramsObjectId = user_cookies.user.isChildOf;
        }
        if (user_cookies) {
            try {
                const roles = ["SuperAdmin", "Tong_cong_ty"];
                let url = `/orderGS/Customers/getFromTo?objectId=${paramsObjectId}`;
                if (user_cookies.user.userType === "Tram") {
                    url = `/orderGS/Supplier/getFromTo?station=${paramsObjectId}`;
                }
                if (roles.includes(user_cookies.user.userType)) {
                    url = `/orderGS/Supplier/getFromTo`;
                }
                data = await axiosClient.get(url, {
                    params,
                    headers: {
                        Authorization: "Bearer " + user_cookies.token,
                    },
                });
            } catch (e) {
                console.log(e);
            }
            return data;
        } else {
            return "Invalid Token API";
        }
    };
    getAll = async () => {
        let data;
        let params;
        var user_cookies = await getUserCookies();
        if (user_cookies.user.userRole === "SuperAdmin") {
            params = user_cookies.user.id;
        } else {
            params = user_cookies.user.isChildOf;
        }
        if (user_cookies) {
            try {
                const roles = ["SuperAdmin", "Tong_cong_ty"];
                // khach hang
                let url = `/orderGS/getAllIfIdIsCustomer?objectId=${params}`;
                if (user_cookies.user.userType === "Tram") {
                    // tram
                    url = `/orderGS/getAllIfIdIsSupplier?objectId=${params}&userid=${user_cookies.user.id}`;
                }
                if (roles.includes(user_cookies.user.userType)) {
                    // tong cong ty 
                    url = `/orderGS/getAllIfIdIsSupplier?userid=${user_cookies.user.id}`;
                }
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (e) {
                console.log(e);
            }
            return data;
        } else {
            return "Invalid Token API";
        }
    };
    getValves = async () => {
        let data;
        let user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = "/valve/showListValve";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });

                return data;
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("invalid token API");
        }
    };
    getColors = async () => {
        let data;
        let user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = "/colorGas";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (error) {
                console.log(error);
            }
            return data;
        } else {
            console.log("invalid token API");
        }
    };
    getMenuFacture = async () => {
        let data;
        let user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = "manufacture/ShowList";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (error) {
                console.log(error);
            }

            return data;
        } else {
            console.log("invalid token API");
        }
    };
    getCategory = async () => {
        let data;
        let user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = "/categoryCylinder/getAll";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (error) {
                console.log(error);
            }
            return data;
        } else {
            console.log("invalid token API");
        }
    };
    getLocation = async () => {
        let data = { address: [], area: "" };
        // let params;
        let user_cookies = await getUserCookies();

        if (user_cookies) {
            try {
                let url = `/orderGS/showAddressUser?objectId=${user_cookies.user.id}`;
                const result = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                if (result.data[0].userRole === "SuperAdmin") {
                    data.address.push(result.data[0].address);
                } else {
                    data.address.push(result.data[0].address);
                    data.address.push(result.data[0].isChildOf.address);
                }
                data.area = result.data[0].area.id;
            } catch (error) {
                console.log(error);
            }

            return data;
        } else {
            console.log("invalid token API");
        }
    };
    getStation = async () => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = "/orderGS/getStation";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    // get area
    getArea = async (params) => {
        try {
            let data;
            // let paramsObjectId;
            let user_cookies = await getUserCookies();
            // if (user_cookies.user.userRole === "SuperAdmin") {
            //     paramsObjectId = user_cookies.user.id;
            // } else {
            //     paramsObjectId = user_cookies.user.isChildOf;
            // }
            if (user_cookies) {
                let url = `area?StationID=${params}`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    getTypeCustomer = async (params) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = "/orderGS/getTypeCustomers";
                data = await axiosClient.get(url, {
                    params,
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid Token API");
            }
        } catch (error) {
            console.log("Error");
        }
    };
    getAddress = async (params) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/orderGS/showAddressUser?objectId=${params}`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    createOrder = async (params) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = "/orderGS/createOrderGS";
                data = await axiosClient.post(url, params, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    confirmOrder = async (params, note)=> {
        try {
            let data 
            let user_cookies = await getUserCookies();
            if(user_cookies){
                let url = `/orderGS/acpOrder?id=${params}&userid=${user_cookies.user.id}`
                data = await axiosClient.put(url,note, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data
            }else {
                console.log('Invalid token API');
            }
        } catch (error) {
            console.log(error);
        }
    };
    detailOrder = async(params)=>{
        try{
            let data
            let user_cookies = await getUserCookies();
            if(user_cookies){
                // console.log("user token",user_cookies.token)
                let url= `/orderDetail/getOrderDetailByOrderGSId?id=${params}`
                data = await axiosClient.get(url,{ headers: {Authorization: 'Bearer ' + user_cookies.token}})
                // console.log("data test",data)
                return data
            }else {
                console.log('Invalid token API');
            }
        } catch (error) {
            console.log(error);
        }
    };
    detailHistoryOrder=async(params)=>{
        try{
            let data
            let user_cookies = await getUserCookies();
            if(user_cookies){
                // console.log("user token",user_cookies.token)
                let url= `/history/showList?id=${params}`
                data = await axiosClient.get(url,{ headers: {Authorization: 'Bearer ' + user_cookies.token}})
                // console.log("data test",data)
                return data
            }else {
                console.log('Invalid token API');
            }
        } catch (error) {
            console.log(error);
        }
    };
    detailHistoryConfirm=async(params,action)=>{
        try{
            let data
            let user_cookies = await getUserCookies();
            if(user_cookies){
                let url= `history/getOrderGSConfirmationHistory?id=${params}&action=${action}$`
                data = await axiosClient.get(url,{ headers: {Authorization: 'Bearer ' + user_cookies.token}})
                // console.log("data test",data)
                return data
            }else {
                console.log('Invalid token API');
            }
        } catch (error) {
            console.log(error);
        }
    }
    cancelOrderOne= async(params,note)=>{
        try {
            let data 
            let user_cookies = await getUserCookies();
            if(user_cookies){
                let url = `/orderGS/notacpOrder?id=${params}&userid=${user_cookies.user.id}`
                data = await axiosClient.put(url,note, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                // console.log("data api",data)
                return data
            }else {
                console.log('Invalid token API');
            }
        } catch (error) {
            console.log(error);
        }
    }
    getOrderConfirmHistory=async(params)=>{
        try{
            let data 
            let user_cookies = await getUserCookies();
            if(user_cookies){
                let url = `history/getOrderGSConfirmationHistory?id=${params}&action=KHONG_DUYET`
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                // console.log("data api",data)
                return data
            }else {
                console.log('Invalid token API');
            }
        }catch (error) {
            console.log(error);
        }
    }
    updateOrder = async (params, values)=> {
        try {
            let data 
            let user_cookies = await getUserCookies();
            if(user_cookies) {
                let url = 'orderGS/updateById'
                data = await axiosClient.put(url,values, {params, headers: { Authorization: "Bearer " + user_cookies.token}})
                return data
            }else {
                console.log('Invalid token API')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const orderManagement = new OrderManagement();
export default orderManagement;
