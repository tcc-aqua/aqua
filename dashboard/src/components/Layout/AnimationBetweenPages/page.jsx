import { BrowserRouter as Router, Route, Routes, useLoaderData, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashBoardAdmin from '@/app/dashboard/page';

function AnimationBetweenPages() {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait' >
            <Routes location={location} key={location.pathname}>
                <Route path="/dashboard" element={<DashBoardAdmin />} />
            </Routes>
        </AnimatePresence>
    );
}


export default function AnimatedRoutes() {
    return (
        <Router>
            <AnimationBetweenPages />
        </Router>
    );
}