import { useEffect,useState } from "react";
import { Tooltip,Chip } from "@mui/material";
import { getChipColor,updateStatus } from "../../Utilities";

export default function UpdateStatus(props){

    const [time]=useState(new Date(props.time));
    const [timeNow,setTimeNow]=useState(new Date());

    useEffect(()=>{
      const timer= setInterval(() => {
            setTimeNow(new Date());
        }, 60000);

        return()=>clearInterval(timer);
    })

    return(
    <>
    <Tooltip title="Status" placement="top"><Chip label={updateStatus(props.status,time,props.duration)} color={getChipColor(updateStatus(props.status,time,timeNow))}></Chip></Tooltip>
    </>
    )
   
}