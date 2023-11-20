import "./style/App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import About from './components/About';
import SearchAppBar from "./components/SearchAppBar";
import SearchResult from "./components/SearchResult";
import Guide from "./components/Guide";
import Home from "./components/Home"
import NaverShopping from "./components/NaverShopping";


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <SearchAppBar/>
        <div>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/naverShopping/:key' element={<NaverShopping />}/>
            <Route path='/main' element={<Main />}/>
            <Route path='/about' element={<About />}/>
            <Route path='/guide' element={<Guide />}/>
            <Route path='/searchResult' element={<SearchResult />}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;