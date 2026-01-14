<<<<<<< HEAD
=======
import { TooltipProvider } from "@/components/ui/tooltip";
>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
<<<<<<< HEAD
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
=======
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
>>>>>>> bb85232e51518b754e77f798bfd784280e3815f9
);

export default App;
