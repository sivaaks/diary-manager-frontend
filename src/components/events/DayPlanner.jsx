import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Typography,Button,Container,Card,IconButton,Box,LinearProgress,Chip,Snackbar,Alert,Tooltip,TextField} from '@mui/material';
import {Visibility } from '@mui/icons-material';
import {DatePicker,LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {API_DAY_PLANNER,formatTime,getChipColor} from '../../Utilities'
import UpdateTime from './UpdateTime';

export default function DayPlanner({props}){

    const path=props.path;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const styles={
        typography:{color:'white',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}
    }
    const [events,setEvents]=useState([]);
    const [loading,setLoading]=useState(true);
    const [date,setDate]=useState(new Date());
    const [alert,setAlert]=useState({show:false,vertical:'top',horizontal:'right',type:'success',message:''});
    const {show,vertical,horizontal,type,message}=alert;
    
    const closeAlert=()=>setAlert({...alert,show:false});

    useEffect(()=>{

        async function getEvents(){
            setLoading(true);
            await axios.get(`${API_DAY_PLANNER}?date=${date}`,{
                headers:{auth:authToken},
            }).then(function(res){
                console.log(res.data);
                setEvents(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }
        getEvents();
       
        
    },[path,authToken,date])

    useEffect(()=>{

    })
    
    return(
        <>
        <Appbar/>
        <Stack spacing={1}>
        {loading?<LinearProgress color="secondary"/>:<></>}
        </Stack>
        <Container>
        <Box sx={{mt:2,width:'100%'}}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">

        </Stack>    
        <Stack direction="row" spacing={1} justifyContent="flex-start">
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker
                label="Select date"
                value={date}
                inputFormat='dd-MM-yyyy'
                onChange={(newDate)=>{
                    setDate(newDate);
                    }}
                renderInput={(params)=><TextField fullWidth required {...params}/>}
                ></DatePicker>
        </LocalizationProvider>
            <Button variant="contained" color="primary" size="large" >Filter</Button>
        </Stack>
        {(events.length>0)? events.map((event,index)=>{
                return(
                    <Box key={index}>
                        <Card sx={{height:'100px',padding:0,mb:1,mt:1,display:'flex',flexDirection:'row',justifyContent:'space-end',alignItems:'center'}}>
                            <Stack sx={{minHeight:'100px',width:'180px',backgroundColor:'red',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                {/* <AccessTime sx={{pr:1,color:'white',fontSize:40}}/> */}
                                <Typography variant="h4" sx={styles.typography}>{formatTime(event.dateTime)}</Typography>
                            </Stack>
                            <Stack sx={{minHeight:'100px',width:'180px',backgroundColor:'green',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <Typography variant="h5" sx={styles.typography}>{event.type}</Typography>
                            </Stack>
                            <Stack direction="column" spacing={1} sx={{ml:1}}>
                                <Typography variant="h4" sx={{fontSize:'32px',fontWeight:'semi-bold'}}>{event.name}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Tooltip title="Status" placement="top"><Chip label={event.status} color={getChipColor(event.status)}></Chip></Tooltip>
                                    <Tooltip title="Priority" placement="top"><Chip label={event.priority} color={getChipColor(event.priority)}></Chip></Tooltip>
                                    <UpdateTime time={event.dateTime}/>
                                </Stack>
                            </Stack>
                            <Stack direction="row" sx={{height:'auto',marginLeft:'auto',marginRight:'10px'}}>
                                <IconButton onClick={()=>history.push(`/${event.type}s/view/${event._id}`)} color="primary" size="large"><Visibility fontSize="large"/></IconButton>
                            </Stack>
                           
                        </Card>
                    </Box>
                )
            }):<p>{`No plans to display`}</p>}
        </Box>
        </Container>
        <Snackbar open={show} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{vertical,horizontal}}>
            <Alert severity={type} variant="filled" sx={{width:'100%',pr:30}}>
                {message}
            </Alert>
        </Snackbar>
        </>
    )

}