import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import MainContainer from './components/MainContainer';
import WelcomePage from './components/WelcomePage';
import ChatConatiner from './components/ChatConatiner';
import Users from './components/Users';
import Groups from './components/Groups';
import CreateGroup from './components/CreateGroup';
import RegisterPage from './components/RegisterPage';
import Conversation from './components/Conversation';
// import ConversationItems from './components/ConversationItems';

function App() {
  return (
    <div className='App'>
  
  {/* <Login/> */}


{/* <MainContainer/> */}
<Routes>

<Route path='/' element={<RegisterPage/>}/>


  <Route path='login' element={<Login/>}/>
 
  <Route path='app' element={<MainContainer/>}>
    <Route path='welcome' element={<WelcomePage/>}/>
    <Route path='chatlist' element={<Conversation/>}/>

    <Route path='chat/:_id' element={<ChatConatiner/>}/>
    <Route path="users" element={<Users/>}/>
    <Route path='groups' element={<Groups/>}/>
    <Route path='creategroup'  element={<CreateGroup/>}/> 
  </Route>
  
</Routes>


    </div>
  );
}

export default App;
