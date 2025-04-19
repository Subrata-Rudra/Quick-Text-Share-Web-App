import "./App.css";
import {Routes, Route} from "react-router-dom";
import SaveTextPage from "./pages/SaveTextPage";
import ShowTextPage from "./pages/ShowTextPage";

function App() {
    return (<div className="App">
      <Routes>
        <Route path="/" element={<SaveTextPage/>} exact/>
        <Route path="/show" element={<ShowTextPage/>} exact/>
      </Routes>
    </div>);
}

export default App;
