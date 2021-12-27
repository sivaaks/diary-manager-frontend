import { useEffect,useState } from "react";
import { Tooltip,Chip } from "@mui/material";
import { getChipColor,convertTimeToInt} from "../../Utilities";

export default function Status(props){

    const COMPLETED='Completed';
    const INPROGRESS='In progress';
    const SCHEDULED='Scheduled';
    const [time]=useState(new Date(props.time));
    const [timeNow,setTimeNow]=useState(new Date());

    const updateStatus=(eventTime,duration)=>{

        let today=new Date();
        let timeDiff=Math.abs(eventTime-today);
        const durationTime=convertTimeToInt(duration);

        const minutes=Math.floor(timeDiff/(1000*60)%60);
        const hours= Math.floor(timeDiff/(1000*60*60)%24);

        console.log('Duration time:',durationTime);
        console.log('Hours and minutes',hours,minutes);

        if (hours>=durationTime[0] && minutes>=durationTime[1]) return COMPLETED;
        else if ((hours<=0 && minutes<=0) || (minutes<=0)) return INPROGRESS;
        else return SCHEDULED;

    }

    useEffect(()=>{
      const timer= setInterval(() => {
            setTimeNow(new Date());
        }, 30000);

        return()=>clearInterval(timer);
    })

    return(
    <>
    <Tooltip title="Status" placement="top"><Chip label={updateStatus(time,props.duration,timeNow)} color={getChipColor(updateStatus(time,props.duration,timeNow))}></Chip></Tooltip>
    </>
    )
   
}