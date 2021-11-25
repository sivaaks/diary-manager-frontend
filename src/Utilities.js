
// const API_LOGIN='http://localhost:3001/users/login';
// const API_REGISTER='http://localhost:3001/users/register';
// const API_AUTH='http://localhost:3001/users/check-auth';
// const API_EVENTS='http://localhost:3001/events';
// const API_CONTACTS='http://localhost:3001/contacts';
const API_LOGIN='https://diary-manager-backend.herokuapp.com/users/login';
const API_REGISTER='https://diary-manager-backend.herokuapp.com/users/register';
const API_AUTH='https://diary-manager-backend.herokuapp.com/users/check-auth';
const API_EVENTS='https://diary-manager-backend.herokuapp.com/events';
const API_CONTACTS='https://diary-manager-backend.herokuapp.com/contacts';

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

const formatTime=(time)=>{
    const tempTime=new Date(time);
    return convertTimeTo12H(`${tempTime.getHours()}.${tempTime.getMinutes().toString().padStart(2,'0')}`);
}

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

export {API_LOGIN,API_REGISTER,API_AUTH,API_EVENTS,API_CONTACTS,convertTimeTo12H,formatDate,formatTime,getChipColor};