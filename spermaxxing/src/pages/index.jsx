import Layout from "./Layout.jsx";

import Welcome from "./Welcome";

import Onboarding from "./Onboarding";

import Dashboard from "./Dashboard";

import Tracking from "./Tracking";

import Analytics from "./Analytics";

import Content from "./Content";

import Profile from "./Profile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Welcome: Welcome,
    
    Onboarding: Onboarding,
    
    Dashboard: Dashboard,
    
    Tracking: Tracking,
    
    Analytics: Analytics,
    
    Content: Content,
    
    Profile: Profile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Welcome />} />
                
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Tracking" element={<Tracking />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Content" element={<Content />} />
                
                <Route path="/Profile" element={<Profile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}