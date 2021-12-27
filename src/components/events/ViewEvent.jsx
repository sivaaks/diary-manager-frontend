
import axios from 'axios';
import Appbar from '../Appbar';
import { API_EVENTS,formatDate,formatTime,formatDuration } from '../../Utilities';
import { useEffect, useState } from 'react';
import { LinearProgress,Box,Container,Card,Typography,Stack,Chip } from '@mui/material';
import { Today,AccessTime } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
//import { Delete,Edit,Visibility,Today,AccessTime } from '@mui/icons-material';

export default function ViewEvent({props}){

    const id=props.computedMatch.params.id;
    const authToken=localStorage.getItem('auth-token');
    const [eventDetails,setEventDetails]=useState({name:''});
    const [loading,setLoading]=useState(true);
    const styles={typography:{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}

    // const getEventDetails=async(id)=>{
    //     setLoading(true);
    //     await axios.get(`${API_EVENTS}/${id}`,{
    //         headers:{auth:authToken}
    //     }).then(function(res){
    //         console.log(res.data);
    //         setEventDetails({...res.data});
    //     })
    //     setLoading(false);
    // }

    const cancelEvent=async()=>{
        console.log('cancelled called',authToken);
        setLoading(true);
        await axios.put(`${API_EVENTS}/cancel/${eventDetails._id}`,{},{
            headers:{auth:authToken},
        }).then(function(res){
            console.log(res);
            if(res.status===200) {
            toast.success(`Canceled successfully`);
            }
        }).catch(function(err){
            console.log(err);
            toast.error(`Cancel failed`);
        })
        setLoading(false);
    }

    const getChipColor=(status)=>{
        switch(status){
            case 'Scheduled': return 'primary';
            case 'In progress' : return 'secondary';
            case 'Completed' : return 'success';
            case 'Cancelled': return 'error';
            case 'Low' : return 'green';
            case 'Moderate' : return 'blue';
            case 'High' : return 'red';
            default : return 'primary';
        }
    }

    useEffect(()=>{
       async function getEventDetails(){
            setLoading(true);
            await axios.get(`${API_EVENTS}/${id}`,{
                headers:{auth:authToken}
            }).then(function(res){
                console.log(res.data);
                setEventDetails({...res.data});
            })
            setLoading(false);
    }
    getEventDetails();
    },[id,authToken])

    return(
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container sx={{mt:2}}>
            <Box sx={{backgroundColor:'silver',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <Card sx={{height:'300px',padding:'10px',backgroundColor:'#eee'}}>
                    <Typography variant="h4">{eventDetails.name}</Typography>
                    <Stack direction="row" spacing={2}>
                        <Typography sx={styles.typography}><Today sx={{pr:1}}/>{formatDate(eventDetails.dateTime)}</Typography>
                        <Typography sx={styles.typography}><AccessTime sx={{pr:1}}/>{formatTime(eventDetails.dateTime)}</Typography>
                        <Chip label={eventDetails.status} color={getChipColor(eventDetails.status)}></Chip>
                        <Chip label={`Priority : ${eventDetails.priority}`} sx={{backgroundColor:getChipColor(eventDetails.priority),color:'white'}}></Chip>
                    </Stack>
                    <Stack sx={{mt:2}}>
                        <Typography variant="h5" sx={styles.typography}>Description: {eventDetails.description}</Typography>
                        <Typography variant="h5" sx={styles.typography}>Notes: {eventDetails.notes}</Typography>
                        <Typography variant="h5" sx={styles.typography}>Duration: {formatDuration(eventDetails.duration)}</Typography>
                        <Typography variant="p" sx={styles.typography}>Created at: {eventDetails.createdAt}</Typography>
                    </Stack>
                    <LoadingButton variant="contained" color="error" loading={loading} onClick={cancelEvent}>Cancel</LoadingButton>
                </Card>
            </Box>
        </Container>
        </>
    )

}