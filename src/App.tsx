import { Route, Routes } from "react-router-dom";
import PageLayout from "./components/PageLayout/PageLayout";
import Slab from "./pages/Slab/Slab";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route path="/" element={<Slab />} />
        <Route path="/sme" element={<Slab />} />
      </Route>
    </Routes>
  );
}

export default App;
