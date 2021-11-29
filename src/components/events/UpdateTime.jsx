import { useEffect,useState } from "react";
import { Typography } from "@mui/material";
import { findTimeDifference } from "../../Utilities";

export default function UpdateTime(props){

    const [time]=useState(new Date(props.time));
    const [timeNow,setTimeNow]=useState(new Date());

    useEffect(()=>{
      const timer= setInterval(() => {
            setTimeNow(new Date());
        }, 30000);

        return()=>clearInterval(timer);
    })

    return <Typography variant="h5">{findTimeDifference(time,timeNow)}</Typography>;
  
   
}