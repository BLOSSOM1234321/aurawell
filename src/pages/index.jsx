import Layout from "./Layout.jsx";

import Auth from "./Auth";

import Dashboard from "./Dashboard";

import MoodTracker from "./MoodTracker";

import Meditations from "./Meditations";

import Journal from "./Journal";

import Resources from "./Resources";

import Community from "./Community";

import Group from "./Group";

import Settings from "./Settings";

import GoPremium from "./GoPremium";

import UnspokenConnections from "./UnspokenConnections";

import ArchetypeMirrorPage from "./ArchetypeMirrorPage";

import WordPuzzlesPage from "./WordPuzzlesPage";

import SacredSpacePage from "./SacredSpacePage";

import Growth from "./Growth";

import Profile from "./Profile";

import Groups from "./Groups";

import MindfulWorldMap from "./MindfulWorldMap";

import Reels from "./Reels";

import TherapistDashboard from "./TherapistDashboard";

import TherapistDirectory from "./TherapistDirectory";

import Discover from "./Discover";

import CreateGroup from "./CreateGroup";

import UserGroupView from "./UserGroupView";

import CreateSupportGroups from "./CreateSupportGroups";

import TherapistOnboarding from "./TherapistOnboarding";

import TherapistMessages from "./TherapistMessages";

import TherapistProfile from "./TherapistProfile";

import TherapistCreateReel from "./TherapistCreateReel";

import LiveSessions from "./LiveSessions";

import CrisisDetectionDemo from "./CrisisDetectionDemo";

import ModeratorDashboard from "./ModeratorDashboard";

import SupportGroupStageSelection from "./SupportGroupStageSelection";

import SupportRoomChat from "./SupportRoomChat";

import AdminTools from "./AdminTools";

import InitializeSupportGroups from "./InitializeSupportGroups";

import ArchivedPosts from "./ArchivedPosts";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    MoodTracker: MoodTracker,
    
    Meditations: Meditations,
    
    Journal: Journal,
    
    Resources: Resources,
    
    Community: Community,
    
    Group: Group,
    
    Settings: Settings,

    GoPremium: GoPremium,

    UnspokenConnections: UnspokenConnections,
    
    ArchetypeMirrorPage: ArchetypeMirrorPage,
    
    WordPuzzlesPage: WordPuzzlesPage,
    
    SacredSpacePage: SacredSpacePage,
    
    Growth: Growth,
    
    Profile: Profile,
    
    Groups: Groups,
    
    MindfulWorldMap: MindfulWorldMap,
    
    Reels: Reels,
    
    TherapistDashboard: TherapistDashboard,
    
    TherapistDirectory: TherapistDirectory,
    
    Discover: Discover,
    
    CreateGroup: CreateGroup,
    
    UserGroupView: UserGroupView,

    CreateSupportGroups: CreateSupportGroups,

    TherapistOnboarding: TherapistOnboarding,

    TherapistMessages: TherapistMessages,

    TherapistProfile: TherapistProfile,

    TherapistCreateReel: TherapistCreateReel,

    LiveSessions: LiveSessions,

    CrisisDetectionDemo: CrisisDetectionDemo,

    ModeratorDashboard: ModeratorDashboard,

    InitializeSupportGroups: InitializeSupportGroups,

    ArchivedPosts: ArchivedPosts,

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

// Check if user is logged in
function isAuthenticated() {
    const user = localStorage.getItem('aurawell_current_user');
    return !!user;
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/auth" replace />;
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    const isAuthPage = location.pathname === '/auth';

    // If on auth page or therapist onboarding, show it without Layout
    const isOnboardingPage = location.pathname === '/therapistonboarding';
    if (isAuthPage || isOnboardingPage) {
        return (
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/therapistonboarding" element={<TherapistOnboarding />} />
            </Routes>
        );
    }

    // For all other pages, require authentication and wrap in Layout
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/MoodTracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
                <Route path="/Meditations" element={<ProtectedRoute><Meditations /></ProtectedRoute>} />
                <Route path="/Journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                <Route path="/Resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/Community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/Group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
                <Route path="/Group/:id" element={<ProtectedRoute><Group /></ProtectedRoute>} />
                <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/GoPremium" element={<ProtectedRoute><GoPremium /></ProtectedRoute>} />
                <Route path="/UnspokenConnections" element={<ProtectedRoute><UnspokenConnections /></ProtectedRoute>} />
                <Route path="/ArchetypeMirrorPage" element={<ProtectedRoute><ArchetypeMirrorPage /></ProtectedRoute>} />
                <Route path="/WordPuzzlesPage" element={<ProtectedRoute><WordPuzzlesPage /></ProtectedRoute>} />
                <Route path="/SacredSpacePage" element={<ProtectedRoute><SacredSpacePage /></ProtectedRoute>} />
                <Route path="/Growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
                <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/Groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                <Route path="/MindfulWorldMap" element={<ProtectedRoute><MindfulWorldMap /></ProtectedRoute>} />
                <Route path="/Reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
                <Route path="/TherapistDashboard" element={<ProtectedRoute><TherapistDashboard /></ProtectedRoute>} />
                <Route path="/TherapistDirectory" element={<ProtectedRoute><TherapistDirectory /></ProtectedRoute>} />
                <Route path="/Discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
                <Route path="/CreateGroup" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
                <Route path="/UserGroupView" element={<ProtectedRoute><UserGroupView /></ProtectedRoute>} />
                <Route path="/CreateSupportGroups" element={<ProtectedRoute><CreateSupportGroups /></ProtectedRoute>} />
                <Route path="/TherapistOnboarding" element={<TherapistOnboarding />} />
                <Route path="/TherapistMessages" element={<ProtectedRoute><TherapistMessages /></ProtectedRoute>} />
                <Route path="/TherapistProfile/:therapistId" element={<ProtectedRoute><TherapistProfile /></ProtectedRoute>} />
                <Route path="/TherapistCreateReel" element={<ProtectedRoute><TherapistCreateReel /></ProtectedRoute>} />
                <Route path="/LiveSessions" element={<ProtectedRoute><LiveSessions /></ProtectedRoute>} />
                <Route path="/CrisisDetectionDemo" element={<ProtectedRoute><CrisisDetectionDemo /></ProtectedRoute>} />
                <Route path="/ModeratorDashboard" element={<ProtectedRoute><ModeratorDashboard /></ProtectedRoute>} />
                <Route path="/AdminTools" element={<ProtectedRoute><AdminTools /></ProtectedRoute>} />
                <Route path="/InitializeSupportGroups" element={<ProtectedRoute><InitializeSupportGroups /></ProtectedRoute>} />
                <Route path="/support-group/:groupId" element={<ProtectedRoute><SupportGroupStageSelection /></ProtectedRoute>} />
                <Route path="/support-room/:roomId" element={<ProtectedRoute><SupportRoomChat /></ProtectedRoute>} />
                <Route path="/ArchivedPosts" element={<ProtectedRoute><ArchivedPosts /></ProtectedRoute>} />
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