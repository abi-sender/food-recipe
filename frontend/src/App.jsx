import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ViewRecipe from "./components/ViewRecipe";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<ViewRecipe/>} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;