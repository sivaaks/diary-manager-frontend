
// const API_LOGIN='http://localhost:3001/users/login';
// const API_REGISTER='http://localhost:3001/users/register';
// const API_AUTH='http://localhost:3001/users/check-auth';
// const API_EVENTS='http://localhost:3001/events';
// const API_CONTACTS='http://localhost:3001/contacts';
// const API_DAY_PLANNER='http://localhost:3001/day-planner';
//const API_PERSONAL_DIARY='http://localhost:3001/personal-diary';
//const API_INFO='http://localhost:3001/info';

const API_LOGIN='https://diary-manager-backend.herokuapp.com/users/login';
const API_REGISTER='https://diary-manager-backend.herokuapp.com/users/register';
const API_AUTH='https://diary-manager-backend.herokuapp.com/users/check-auth';
const API_EVENTS='https://diary-manager-backend.herokuapp.com/events';
const API_CONTACTS='https://diary-manager-backend.herokuapp.com/contacts';
const API_DAY_PLANNER='https://diary-manager-backend.herokuapp.com/day-planner';
const API_PERSONAL_DIARY='https://diary-manager-backend.herokuapp.com/personal-diary';
const API_INFO='https://diary-manager-backend.herokuapp.com/info';

const convertTimeTo12H=(time)=>{
    const tempTime= parseTime(time);
    const hours= tempTime[0];
    tempTime[1]= tempTime[1].toString().padStart(2,'0')
    if(hours>12) { 
        tempTime[0]-=12;
        tempTime[1]+=' PM';
    }else if(hours===0) {
        tempTime[0]=12;
        tempTime[1]+=' AM';
    }else if(hours<12) tempTime[1]+=' AM';
    else if(hours===12) tempTime[1]+=' PM';
    return tempTime.join(':');
}

const parseTime=(time)=>{
    time=parseFloat(time).toFixed(2);
    let tempTime= time.toString().split('.');
    tempTime[0]= parseInt(tempTime[0]);
    tempTime[1]=parseInt(tempTime[1]);
    return tempTime;
}

const formatDate=(date)=>{
    const tempDate=new Date(date);
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return `${tempDate.getDate().toString().padStart(2,'0')}-${(tempDate.getMonth()+1).toString().padStart(2,'0')}-${tempDate.getFullYear()} (${days[tempDate.getDay()]})`;
}

const dateOnly=(date)=>{
    const getDateOnly= new Date(date);
    return `${getDateOnly.getDate()}-${getDateOnly.getMonth()+1}-${getDateOnly.getFullYear()}`;
}

const formatTime=(time)=>{
    const tempTime=new Date(time);
    return convertTimeTo12H(`${tempTime.getHours()}.${tempTime.getMinutes().toString().padStart(2,'0')}`);
}

const formatDuration=(time)=>{
    const tempTime=new Date(time);
    if (tempTime.getHours()===0) return `${tempTime.getMinutes().toString().padStart(2,'0')} minute(s)`;
    return `${tempTime.getHours()} hour(s) and ${tempTime.getMinutes().toString().padStart(2,'0')} minute(s)`;
}

const capitalize=(input)=>input.charAt(0).toUpperCase()+input.slice(1);

const getChipColor=(status)=>{
    switch(status){
        case 'Scheduled': return 'primary';
        case 'In progress' : return 'secondary';
        case 'Completed' : return 'success';
        case 'Cancelled': return 'error';
        case 'Low' : return 'success';
        case 'Moderate' : return 'primary';
        case 'Medium' : return 'secondary';
        case 'High' : return 'error';
        default : return 'primary';
    }
}

const getTimeBackgroundColor=(priority)=>{
    if (priority==='Low') return 'green';
    if (priority==='Moderate') return 'blue';
    if (priority==='High') return 'red';
}

const findTimeDifference=(eventTime,currentTime)=>{

        let today=new Date();
        let timeDiff=eventTime-today;
        const minutes=Math.floor(Math.abs(timeDiff/(1000*60)%60));
        const hours= Math.floor(Math.abs(timeDiff/(1000*60*60)%24));

        let timeDifference=``;
        if (timeDiff>0) timeDifference=`Starts in `
        else timeDifference=`Started `;
        if (hours>1) timeDifference+=`${hours} hours `;
        else if (hours===1) timeDifference+=`${hours} hour `;
        if (minutes===1) timeDifference+=`${minutes} minute `
        else if(minutes===0 && hours<0) timeDifference+=`Just now` 
        else timeDifference+=`${minutes} minutes`;

        if (timeDiff<0 && (minutes>0 || hours>0)) timeDifference+=' ago'

        return timeDifference;
}

const updateStatus=(status,eventTime,duration)=>{

        if (status==='In progress') {
            updateStatusDuration(status,eventTime,duration);
        } else {

        let today=new Date();
        let timeDiff=eventTime-today;
        const minutes=Math.floor(timeDiff/(1000*60)%60);
        const hours= Math.floor(timeDiff/(1000*60*60)%24);

        if (status==='Scheduled') if (hours<=0 && minutes<=0) return 'In progress'
        return status;
        }
}

const getMinutesAndHoursOnly=(eventTime)=>{
    
        let today=new Date();
        let timeDiff=eventTime-today;
        const minutes=Math.floor(timeDiff/(1000*60)%60);
        const hours= Math.floor(timeDiff/(1000*60*60)%24);

        console.log('minutes : ',minutes,'hours : ',hours);

}

const updateStatusDuration=(status,eventTime,duration)=>{

    let today=new Date();
    let timeDiff=eventTime-duration;
    console.log('time diff and today',timeDiff,today);
    let completed= false;
    if (timeDiff<today) {
        console.log('Completed')
        completed=true;
    }
    else {
        completed=false;
        console.log('not completed');
    }
    // const minutes=Math.floor(timeDiff/(1000*60)%60);
    // const hours= Math.floor(timeDiff/(1000*60*60)%24);

    if (completed) return 'Completed'
    return status;
}



export {API_LOGIN,API_REGISTER,API_AUTH,API_EVENTS,API_CONTACTS,API_DAY_PLANNER,API_PERSONAL_DIARY,API_INFO,convertTimeTo12H,formatDate,formatTime,getChipColor,getTimeBackgroundColor,findTimeDifference,dateOnly,capitalize,updateStatus,formatDuration,getMinutesAndHoursOnly};