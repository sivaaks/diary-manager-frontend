import { useEffect } from "react";

export default function Timer(){

   

    function renderTime(){
        const time=new Date();
        // setInterval(() => {
        //     console.log('time');
        //     return <p>Time is now {`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}</p>;
        // }, 1000);
        return <p>Time is now {`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}</p>;
    
    }
    

    return (
    <>
    {renderTime()}
    </>

    )
   
}