// App.js
import './App.css';
import { Outlet } from "react-router-dom";
import DataContextProvider from '../store/data';

function App() {
  return (
    <DataContextProvider>
      <Outlet /> 
    </DataContextProvider>
  );
}

export default App;
