import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Register from './components/users/Register';
import Login from './components/users/Login';
import ForgotPassword from './components/users/ForgotPassword';
import ResetPassword from './components/users/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import Events from './components/events/ListEvents';
import AddEvent from './components/events/AddEvent';
import ViewEvent from './components/events/ViewEvent';
import Home from './components/Home';
import AddContact from './components/contacts/AddContact';
import Contacts from './components/contacts/ListContacts';
import DayPlanner from './components/events/DayPlanner';

function App(){

  return(
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/register' component={Register}></Route>
        <Route exact path='/login' component={Login}></Route>
        <Route exact path='/forgot-password' component={ForgotPassword}></Route>
        <Route exact path='/reset-password/:token' component={ResetPassword}></Route>
        <PrivateRoute exact path='/events' component={Events}></PrivateRoute>
        <PrivateRoute exact path='/events/add' component={AddEvent}></PrivateRoute>
        <PrivateRoute exact path='/events/view/:id' component={ViewEvent}></PrivateRoute>
        <PrivateRoute exact path='/meetings' component={Events}></PrivateRoute>
        <PrivateRoute exact path='/appointments' component={Events}></PrivateRoute>
        <PrivateRoute exact path='/meetings/add' component={AddEvent}></PrivateRoute>
        <PrivateRoute exact path='/appointments/add' component={AddEvent}></PrivateRoute>
        <PrivateRoute exact path='/appointments/view/:id' component={ViewEvent}></PrivateRoute>
        <PrivateRoute exact path='/meetings/view/:id' component={ViewEvent}></PrivateRoute>
        <PrivateRoute exact path='/events/edit/:id' component={AddEvent}></PrivateRoute>
        <PrivateRoute exact path='/meetings/edit/:id' component={AddEvent}></PrivateRoute>
        <PrivateRoute exact path='/appointments/edit/:id' component={AddEvent}></PrivateRoute>
        <PrivateRoute exact path='/contacts' component={Contacts}></PrivateRoute> 
        <PrivateRoute exact path='/contacts/add' component={AddContact}></PrivateRoute>
        <PrivateRoute exact path='/contacts/edit/:id' component={AddContact}></PrivateRoute>
        <PrivateRoute exact path='/day-planner' component={DayPlanner}></PrivateRoute>  
        </Switch>
    </BrowserRouter>
  )
}

export default App;
