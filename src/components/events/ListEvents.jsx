import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Typography,Button,Container,Card,IconButton,Box,LinearProgress,Chip,Snackbar,Alert,Tooltip,Dialog,DialogTitle,DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { Delete,Edit,Visibility,Today,AccessTime } from '@mui/icons-material';
import {API_EVENTS,formatDate,formatTime,getChipColor,capitalize} from '../../Utilities'
import { LoadingButton } from '@mui/lab';

export default function Events({props}){

    const MEETING='meeting';
    const APPOINTMENT='appointment';
    const EVENT='event';
    const path=props.path;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const styles={
        typography:{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}
    }
    const [events,setEvents]=useState([]);
    const [loading,setLoading]=useState(true);
    const [eventType,setEventType]=useState('');
    const [deleted,setDeleted]=useState();
    const [deleteId,setDeleteId]=useState(null);
    const [deleteDialog,setDeleteDialog]=useState(false);
    const [alert,setAlert]=useState({show:false,vertical:'top',horizontal:'right',type:'success',message:''});
    const {show,vertical,horizontal,type,message}=alert;

    const handleDeleteButton=(id)=>{
        setDeleteDialog(true);
        setDeleteId(id);
    }

    const deleteEvent=async()=>{
        if(deleteId!=null) {
            setLoading(true);
            await axios.delete(`${API_EVENTS}/${deleteId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                console.log(res);
                if(res.status===200) setDeleted(deleteId);
            }).catch(function(err){
                console.log(err);
            })
            setDeleteId(null);
            closeDeleteDialog();
            setLoading(false);
            setAlert({...alert,show:true,message:`${eventType} deleted successfully`,type:'success'});
        }
    }

    const closeAlert=()=>setAlert({...alert,show:false});
    const closeDeleteDialog=()=>setDeleteDialog(false);

    useEffect(()=>{
        async function getEvents(){
            setLoading(true);
            const type= findType();
            setEventType(type);
            await axios.get(`${API_EVENTS}/type/${type}`,{
                headers:{auth:authToken},
            }).then(function(res){
                console.log(res.data);
                setEvents(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }
        function findType() {
            if(path==='/events') return EVENT;
            if(path==='/meetings') return MEETING;
            if(path==='/appointments') return APPOINTMENT;
        }
        getEvents();
        findType();

            //console.log('Use effect');
            //if(props.location.state!=undefined) setAlert({...props.location.state});
    },[path,authToken,deleted])

    return(
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container>
        <Box sx={{mt:2,width:'100%'}}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">

        </Stack>    
        <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Typography variant="h4" sx={{marginRight:'auto'}}>{capitalize(eventType)}s</Typography>
            <Button variant="contained" color="primary" size="large" onClick={()=>history.push(`/${eventType}s/add`)}>Add {eventType}</Button>
        </Stack>
           {(events.length>0)? events.map((event,index)=>{
                return(
                    <Box key={index}>
                        <Card sx={{height:'100px',padding:2,mb:1,mt:1,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <Stack direction="column" spacing={1}>
                                <Typography variant="h4" sx={{fontSize:'32px',fontWeight:'semi-bold'}}>{event.name}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Typography sx={styles.typography}><Today sx={{pr:1}}/>{formatDate(event.dateTime)}</Typography>
                                    <Typography sx={styles.typography}><AccessTime sx={{pr:1}}/>{formatTime(event.dateTime)}</Typography>
                                    <Tooltip title="Status" placement="top"><Chip label={event.status} color={getChipColor(event.status)}></Chip></Tooltip>
                                    <Tooltip title="Priority" placement="top"><Chip label={event.priority} color={getChipColor(event.priority)}></Chip></Tooltip>
                                </Stack>
                            </Stack>
                            <Stack direction="row" sx={{height:'auto'}}>
                                <IconButton onClick={()=>history.push(`/${eventType}s/view/${event._id}`)} color="primary" size="large"><Visibility fontSize="large"/></IconButton>
                                <IconButton onClick={()=>history.push(`/${eventType}s/edit/${event._id}`)} color="secondary" size="large"><Edit fontSize="large"/></IconButton>
                                <IconButton onClick={()=>handleDeleteButton(event._id)} color="error" size="large"><Delete fontSize="large"/></IconButton>
                            </Stack>
                        </Card>
                    </Box>
                )
            }):loading?<p>{`Loading ${eventType}s`}</p>:<p>{`No ${eventType}s to display`}</p>}
        </Box>
        </Container>
        <Snackbar open={show} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{vertical,horizontal}}>
            <Alert severity={type} variant="filled" sx={{width:'100%',pr:30}}>
                {message}
            </Alert>
        </Snackbar>
        <Dialog
            open={deleteDialog}
            onClose={closeDeleteDialog}
        >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent><DialogContentText>Are you sure to delete selected {eventType}? This cannot be undone</DialogContentText></DialogContent>
        <DialogActions>
            <LoadingButton onClick={closeDeleteDialog} color="primary">No, don't delete</LoadingButton>
            <LoadingButton loading={loading} onClick={deleteEvent} color="error" variant="contained">Yes, delete</LoadingButton>
        </DialogActions>
        </Dialog>
        </>
    )

}