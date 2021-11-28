import React,{useEffect, useState} from 'react';
import { Container,Box,Typography,TextField,Stack,FormControl,MenuItem,InputLabel,Select,Alert,Snackbar,LinearProgress } from "@mui/material"
import { TimePicker,DateTimePicker,LocalizationProvider,LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Appbar from "../Appbar";
import {API_EVENTS,API_CONTACTS} from '../../Utilities';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function AddEvent({props}){

    const MEETING='meeting';
    const APPOINTMENT='appointment';
    const EVENT='event';
    const path=props.path;
    const eventId=props.computedMatch.params.id;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const eventDefaults={name:'',description:'',dateTime:new Date(),priority:'Low',contact:'',status:'',notes:'',type:''}
    const [eventDetails,setEventDetails]=useState(eventDefaults);
    const [contacts,setContacts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [requestType,setRequestType]=useState('Add');
    const [eventType,setEventType]=useState(EVENT);
    const [alert,setAlert]=useState({show:false,vertical:'top',horizontal:'right',type:'success',message:''});
    const {show,vertical,horizontal,type,message}=alert;

    const handleChange=({target:{name,value}})=>setEventDetails({...eventDetails,[name]:value});

    // const findType=()=>{
    //     if(path==='/events/add') setEventDetails({...eventDetails,type:EVENT});
    //     if(path==='/meetings/add') setEventDetails({...eventDetails,type:MEETING});
    //     if(path==='/appointments/add') setEventDetails({...eventDetails,type:APPOINTMENT});
    //     if(path==='/events/edit/:id') {
    //         setRequestType('Edit');
    //         setEventDetails({...eventDetails,type:EVENT});
    //         getEventById(getEventId());
    //     }
    //     if(path==='/meetings/edit/:id') {
    //         setRequestType('Edit');
    //         setEventDetails({...eventDetails,type:MEETING});
    //         getEventById(getEventId());
    //     }
    //     if(path==='/appointments/edit/:id') {
    //         setRequestType('Edit');
    //         setEventDetails({...eventDetails,type:APPOINTMENT});
    //         getEventById(getEventId());
    //     }
    // }

    //const getEventId=()=>props.computedMatch.params.id;

    const addEvent=async()=>{
        setLoading(true);
        await axios.post(API_EVENTS,{
            ...eventDetails,type:eventType,status:'Scheduled',
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200) {
                //setAlert({...alert,show:true,message:`${eventDetails.type} added successfully`,type:'success'});
                setAlert({...alert,show:true,message:`${eventType} added successfully`,type:'success'});
                clearInputFields();
            }
        }).catch(function(err){
            console.log(err.response);
            if(err.response.status===401) {
                setAlert({...alert,show:true,message:'Log in to continue, redirecting',type:'error'})
                history.push('/login');
            } else{
                setAlert({...alert,show:true,message:err.response.data.message,type:'error'})
                setLoading(false);
            }
            
        })
        setLoading(false);
    }

    const updateEvent=async()=>{
        setLoading(true);
        await axios.put(`${API_EVENTS}/${eventId}`,{
            ...eventDetails,type:eventType,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200){
                //setAlert({...alert,show:true,message:`${eventDetails.type} updated successfully`,type:'success'});
                setAlert({...alert,show:true,message:`${eventType} updated successfully`,type:'success'});
                clearInputFields();
            }
        }).catch(function(err){
            console.log(err.response);
            if(err.response.status===401) {
                setAlert({...alert,show:true,message:'Log in to continue, redirecting',type:'error'})
                history.push('/login');
            } else{
                setAlert({...alert,show:true,message:err.response.data.message,type:'error'})
            }
            
        })
        setLoading(false);
    }

    // const getEventById=async(id)=>{
    //     await axios.get(`${API_EVENTS}/${id}`,{
    //         headers:{auth:authToken}
    //     }).then(function(res){
    //         if(res.data) {
    //             console.log(res.data);
    //             delete res.data._id;
    //             delete res.data.userId;
    //             delete res.data.createdAt;
    //             console.log(res.data);
    //             setEventDetails({...res.data});
    //         }
    //     }).catch(function(err){
    //         console.log(err.response);
    //     })
    // }

    // const getContacts=async()=>{
    //     setLoading(true);
    //     setContacts([{_id:'1231556896',name:'Siva'},{_id:'125454965484',name:'Myself'}])
    //     await axios.get(API_CONTACTS,{
    //         headers:{auth:authToken}
    //     }).then(function(res){
    //         console.log(res);
    //     }).catch(function(err){
    //         console.log(err);
    //     })
    //     setLoading(false);     
    // }

    const clearInputFields=()=>{
        setEventDetails({...eventDetails,name:'',description:'',dateTime:new Date(),priority:'',contact:'',notes:''})
    }

    const closeAlert=()=>setAlert({...alert,show:false});

    useEffect(()=>{
        async function getContacts(){
            setLoading(true);
            //setContacts([{_id:'1231556896',name:'Siva'},{_id:'125454965484',name:'Myself'}])
            await axios.get(API_CONTACTS,{
                headers:{auth:authToken}
            }).then(function(res){
                setContacts(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        function findType(){
            if(path==='/events/add') setEventType(EVENT);
            if(path==='/meetings/add') setEventType(MEETING);
            if(path==='/appointments/add') setEventType(APPOINTMENT);
            if(path==='/events/edit/:id') {
                setRequestType('Edit');
                //setEventDetails({...eventDetails,type:EVENT});
                setEventType(EVENT);
                getEventById(eventId);
            }
            if(path==='/meetings/edit/:id') {
                setRequestType('Edit');
                //setEventDetails({...eventDetails,type:MEETING});
                setEventType(MEETING);
                getEventById(eventId);
            }
            if(path==='/appointments/edit/:id') {
                setRequestType('Edit');
                //setEventDetails({...eventDetails,type:APPOINTMENT});
                setEventType(APPOINTMENT);
                getEventById(eventId);
            }
        }

        async function getEventById(id){
            await axios.get(`${API_EVENTS}/${id}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    console.log(res.data);
                    delete res.data._id;
                    delete res.data.userId;
                    delete res.data.createdAt;
                    console.log(res.data);
                    setEventDetails({...res.data});
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }
        getContacts();
        findType();
    },[authToken,path,eventId])

    return (
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container sx={{mt:2}}>
            <Box>
                {/* <Typography variant="h4">{requestType} {eventDetails.type}</Typography> */}
                <Typography variant="h4">{requestType} {eventType}</Typography>
            </Box>
            <Stack direction="column" spacing={2} sx={{mt:2}}>
                <Stack direction="row" spacing={2}>
                    <TextField onChange={handleChange} value={eventDetails.name} fullWidth required variant="outlined" name="name" label="Name"></TextField>
                    <TextField onChange={handleChange} value={eventDetails.description} fullWidth variant="outlined" name="description" label="Description"></TextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DateTimePicker
                        label="Event date"
                        value={eventDetails.dateTime}
                        inputFormat='dd-MM-yyyy'
                        onChange={(newDate)=>{
                            //const dateSelected=`${newDate.getDate().toString().padStart(2,0)}-${(newDate.getMonth()+1).toString().padStart(2,0)}-${newDate.getFullYear()}`;
                            setEventDetails({...eventDetails,dateTime:newDate});
                            //setDate(newDate);
                            //setTime(newDate);
                          }}
                        renderInput={(params)=><TextField fullWidth required {...params}/>}
                        ></DateTimePicker>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <TimePicker
                        label="Event time"
                        value={eventDetails.dateTime}
                        onChange={(newTime)=>{
                            //const timeSelected=parseFloat(`${newTime.getHours()}.${newTime.getMinutes()}`)
                            setEventDetails({...eventDetails,dateTime:newTime});
                            //setTime(newTime);
                        }}
                        renderInput={(params)=><TextField fullWidth required {...params}/>}
                        ></TimePicker>
                    </LocalizationProvider>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <FormControl fullWidth required>
                        <InputLabel id="event-priority-label">Priority</InputLabel>
                        <Select
                            labelId="event-priority-label"
                            id="event-priority"
                            value={eventDetails.priority}
                            name="priority"
                            onChange={handleChange}
                            label="Priority"
                        >
                            <MenuItem sx={{color:"green"}} value={'Low'}>Low</MenuItem>
                            <MenuItem sx={{color:"blue"}} value={'Moderate'}>Moderate</MenuItem>
                            <MenuItem sx={{color:"red"}} value={'High'}>High</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel id="event-contact-label">Contact</InputLabel>
                        <Select
                            labelId="event-contact-label"
                            id="event-contact"
                            label="Contact"
                            name="contact"
                            value={eventDetails.contact}
                            onChange={handleChange}
                        >
                            {contacts.map((contact,index)=>{
                                return <MenuItem key={index} value={contact._id}>{contact.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Stack>
                <Stack spacing={2}>
                    {/* {eventDetails.type===MEETING?<TextField onChange={handleChange} value={eventDetails.link} fullWidth variant="outlined" name="link" label="Link"></TextField>:<></>}
                    {eventDetails.type===APPOINTMENT?<TextField onChange={handleChange} value={eventDetails.location} fullWidth variant="outlined" name="location" label="Location"></TextField>:<></>} */}
                    {eventType===MEETING?<TextField onChange={handleChange} value={eventDetails.link} fullWidth variant="outlined" name="link" label="Link"></TextField>:<></>}
                    {eventType===APPOINTMENT?<TextField onChange={handleChange} value={eventDetails.location} fullWidth variant="outlined" name="location" label="Location"></TextField>:<></>}
                    {requestType==='Edit'?<FormControl fullWidth required>
                        <InputLabel id="event-status-label">Status</InputLabel>
                        <Select
                            labelId="event-status-label"
                            id="event-status"
                            value={eventDetails.status}
                            name="status"
                            onChange={handleChange}
                            label="Status"
                        >
                            <MenuItem sx={{color:"green"}} value={'Completed'}>Completed</MenuItem>
                            <MenuItem sx={{color:"magenta"}} value={'In progress'}>In progress</MenuItem>
                            <MenuItem sx={{color:"blue"}} value={'Scheduled'}>Scheduled</MenuItem>
                            <MenuItem sx={{color:"red"}} value={'Cancelled'}>Cancelled</MenuItem>
                        </Select>
                    </FormControl>:<></>}
                    <TextField onChange={handleChange} value={eventDetails.notes} fullWidth multiline rows={4} variant="outlined" name="notes" label="Notes"></TextField>    
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {requestType==='Add'
                    // ?<LoadingButton onClick={addEvent} loading={loading} variant="contained" size="large" color="primary">Add {eventDetails.type}</LoadingButton>
                    ?<LoadingButton onClick={addEvent} loading={loading} variant="contained" size="large" color="primary">Add {eventType}</LoadingButton>
                    //:<LoadingButton onClick={updateEvent} loading={loading} variant="contained" size="large">Update {eventDetails.type}</LoadingButton>}
                    :<LoadingButton onClick={updateEvent} loading={loading} variant="contained" size="large">Update {eventType}</LoadingButton>}
                    <LoadingButton  variant="contained" size="large" color="warning">Clear</LoadingButton>
                    {/* <LoadingButton onClick={()=>history.push(`/${eventDetails.type}s`)} variant="contained" size="large" color="error">Close</LoadingButton> */}
                    <LoadingButton onClick={()=>history.push(`/${eventType}s`)} variant="contained" size="large" color="error">Close</LoadingButton>
                </Stack>
            </Stack>
        </Container>
        <Snackbar open={show} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{vertical,horizontal}}>
            <Alert severity={type} variant="filled" sx={{width:'100%',pr:30}}>
                {message}
            </Alert>
        </Snackbar>
        </>
    )

}