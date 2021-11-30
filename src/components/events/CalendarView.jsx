import { useEffect,useState } from 'react';
import axios from 'axios';
import Calendar from 'react-awesome-calendar';
import Appbar from '../Appbar';
import { Container,Box,Typography,LinearProgress } from '@mui/material';
import { API_EVENTS } from '../../Utilities';

export default function CalendarView(){
    
    const authToken=localStorage.getItem('auth-token');
    const [loading,setLoading]=useState(true);
    const [date]=useState(new Date());
    const [eventFormat,setEventFormat]=useState();

    useEffect(()=>{
        async function getEvents(){
            setLoading(true);
            await axios.get(`${API_EVENTS}/calendar/all`,{
                headers:{auth:authToken},
            }).then(function(res){
                let eventsFormatTemp=[];
                res.data.map((event)=>{
                    var s = new Date(event.dateTime).toTimeString();
                   return eventsFormatTemp.push({id:event._id,from:`2021-11-30T${s.substring(0,8)}.012Z`,to:`2021-11-30T${s.substring(0,8)}.000Z`,color:'green',title:event.name});
                })
                setEventFormat(eventsFormatTemp);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        getEvents();

    },[authToken,date])

    return(
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container fluid="true">
        <Typography variant="h4" sx={{mt:2}}>Calendar view</Typography>
            <Box>
                <Calendar events={eventFormat}></Calendar>
            </Box>
        </Container>
        </>
    )

}