import { useEffect,useState } from "react";
import { Typography } from "@mui/material";

export default function Time(props){

    const [time]=useState(new Date(props.time));
    const [timeNow,setTimeNow]=useState(new Date());

    const findTimeDifference=(eventTime,currentTime)=>{

        let today=new Date();
        let timeDiff=eventTime-today;
        const minutes=Math.floor(Math.abs(timeDiff/(1000*60)%60));
        const hours= Math.floor(Math.abs(timeDiff/(1000*60*60)%24));

        let timeDifference=``;
        if (timeDiff>0) timeDifference=`Starts in `
        else timeDifference=`Started `;
        if (hours>1) timeDifference+=`${hours} h `;
        else if (hours===1) timeDifference+=`${hours} h `;
        if (minutes===1) timeDifference+=`${minutes} m `
        else if(minutes===0 && hours<0) timeDifference+=`Just now` 
        else timeDifference+=`${minutes} m`;

        if (timeDiff<0 && (minutes>0 || hours>0)) timeDifference+=' ago'

        return timeDifference;
}

    useEffect(()=>{
      const timer= setInterval(() => {
            setTimeNow(new Date());
        }, 30000);

        return()=>clearInterval(timer);
    })

    return <Typography variant="h5">{findTimeDifference(time,timeNow)}</Typography>;
  
   
}