
import axios from 'axios';
import Appbar from '../Appbar';
import { API_EVENTS,convertTimeTo12H } from '../../Utilities';
import { useEffect, useState } from 'react';
import { LinearProgress,Box,Container,Card,Typography,Stack,Chip } from '@mui/material';
import { Today,AccessTime } from '@mui/icons-material';
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
                <Card sx={{height:'200px',padding:'10px',backgroundColor:'#eee'}}>
                    <Typography variant="h4">{eventDetails.name}</Typography>
                    <Stack direction="row" spacing={2}>
                        <Typography sx={styles.typography}><Today sx={{pr:1}}/>{eventDetails.date}</Typography>
                        <Typography sx={styles.typography}><AccessTime sx={{pr:1}}/>{convertTimeTo12H(eventDetails.time)}</Typography>
                        <Chip label={eventDetails.status} color={getChipColor(eventDetails.status)}></Chip>
                        <Chip label={`Priority : ${eventDetails.priority}`} sx={{backgroundColor:getChipColor(eventDetails.priority),color:'white'}}></Chip>
                    </Stack>
                </Card>
            </Box>
        </Container>
        </>
    )

}