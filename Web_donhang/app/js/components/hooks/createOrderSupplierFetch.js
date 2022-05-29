import { useEffect, useRef, useState } from "react";
import orderManagement from "../../../api/orderManagementApi";

export const createOrderSupplierFetch = () => {
    const [station, setStation] = useState([]);
    const [area, setArea] = useState([]);
    const [valueStation, setValueStation] = useState('')
    console.log(valueStation)
    const stationRef = useRef(false);
    // get station
    useEffect(() => {
        const getStation = async () => {
            try {
                const res = await orderManagement.getStation();
                if (res && res.data) {
                    setStation(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getStation();
    }, []);
    // get area
    useEffect(() => {
        if(!stationRef.current){
            stationRef.current = true;
            return
        }
        const getArea = async () => {
            try {
                const res = await orderManagement.getArea(valueStation);

                if (res && res.data) {
                    setArea(res.data);
                }else {
                    setArea([]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getArea();
       
    }, [valueStation]);
    return {
        station,
        area,
        setValueStation,
    };
};
