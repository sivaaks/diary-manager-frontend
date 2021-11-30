import {useHistory} from 'react-router-dom';


export default function Home(){
    
    const history=useHistory();

    return(
        <>
        <div>
        <h1>Diary manager</h1>
        <button onClick={history.push('/login')}>Login</button>
        </div>
        </>
    )
}