import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './authPages/LoginPage';
import RegisterPage from './authPages/RegisterPage';
import ChatPage from './chatPages/ChatPage';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/*TODO Those below should not be public routes */}
        <Route path='/chat' element={<ChatPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
