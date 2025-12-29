
import React, { useState, useEffect } from 'react';
import { CheckCircle, Star, Sparkles, Zap, Gift, Sprout, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BackHeader from "../components/navigation/BackHeader";

const premiumFeatures = [
    // Core Experience Features
    { text: 'Access Sacred Space: Your private sanctuary for deep focus & reflection', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Unlock the Sacred Grove: Grow rare, glowing plants in your Mind Garden', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Create & Join Circles of Light: Intimate groups for private connection', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Emotion Atlas: Visualize your mood patterns as beautiful constellations', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Archetype Mirror: Discover yourself through rotating identities', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Word Puzzle Generator: Unlimited, dynamic word search games', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Escape Rooms of the Mind: Interactive meditation puzzles', icon: <CheckCircle className="text-green-500" /> },
    
    // Unspoken Connections Premium Features
    { text: 'All 4 Premium Session Paths: Reflection, Connection, Depth & Wild modes', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Stacked Mode: Questions deepen automatically as you connect', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Secret Wild Cards: Mystery questions unlock at special moments', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Exclusive Decks: Vulnerability, Intimacy & Self-Discovery questions', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Private Sessions: Connect safely with friends, partners & small groups', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Connection Growth Tracking: See your journey & answered questions', icon: <CheckCircle className="text-green-500" /> },
    
    // Community & Connection
    { text: 'Direct Q&A with Therapists', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Priority Responses in Community Groups', icon: <CheckCircle className="text-green-500" /> },
    
    // Content & Tools
    { text: 'Unlimited Advanced Journals with AI prompts', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Extended Guided Meditations Library', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Exclusive Breathing & Sleep Exercises', icon: <CheckCircle className="text-green-500" /> },
    
    // Analytics & Insights
    { text: 'Advanced Mood Analytics & Insights', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Premium Dashboard with Visual Charts', icon: <CheckCircle className="text-green-500" /> },
    
    // Personalization & Rewards
    { text: 'All Premium Themes & Dark Mode', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Custom Avatars & Profile Badges', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Unlock All Achievements & Sacred Seeds', icon: <CheckCircle className="text-green-500" /> },

    // VIP Access
    { text: 'Early Access to New Features', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Request New Features & Meditations (VIP Feedback)', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Weekly Expert Content & Articles', icon: <CheckCircle className="text-green-500" /> },
    { text: 'Downloadable Worksheets & Audio', icon: <CheckCircle className="text-green-500" /> },
];

// STRIPE PAYMENT LINKS - Replace these with your actual Stripe payment links
const STRIPE_PREMIUM_LINK = 'https://buy.stripe.com/7sYcMY8JC3fQeEsdw01VK00'; // Premium subscription link
const STRIPE_VIP_LINK = 'https://buy.stripe.com/test_XXXXXXXX'; // Replace with your VIP Pack link when created

export default function GoPremiumPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            try {
                // Load user directly from localStorage
                const currentUserData = localStorage.getItem('aurawell_current_user');
                if (currentUserData) {
                    const currentUser = JSON.parse(currentUserData);
                    setUser(currentUser);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error("Error loading user:", e);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    // Check for payment success from Stripe redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
            handlePaymentSuccess();
        }
    }, []);

    const handlePaymentSuccess = async () => {
        try {
            // Update localStorage directly to grant premium status
            const currentUserData = localStorage.getItem('aurawell_current_user');
            if (currentUserData) {
                const currentUser = JSON.parse(currentUserData);
                currentUser.is_premium = true;
                currentUser.premium_started_at = new Date().toISOString();
                localStorage.setItem('aurawell_current_user', JSON.stringify(currentUser));
                setUser(currentUser);
            }

            // Try to sync with backend (non-blocking)
            try {
                await User.updateMyUserData({
                    is_premium: true,
                    premium_started_at: new Date().toISOString(),
                });
            } catch (backendError) {
                console.warn("Backend update failed, but user is marked premium locally:", backendError);
            }

            toast.success("Welcome to Premium!", {
                description: "Your payment was successful. Enjoy all premium features!",
                duration: 5000
            });

            // Clear the URL parameter
            window.history.replaceState({}, document.title, "/gopremium");
        } catch (error) {
            console.error("Failed to activate premium:", error);
            toast.error("Payment successful, but failed to activate premium. Please contact support.");
        }
    };

    const handleUpgradeClick = (product = 'premium') => {
        if (!user) {
            toast.error("Please log in first to subscribe to Premium.");
            return;
        }

        // Direct hardcoded links - no constants, no caching issues
        let finalUrl;
        if (product === 'premium') {
            finalUrl = `https://buy.stripe.com/7sYcMY8JC3fQeEsdw01VK00?prefilled_email=${encodeURIComponent(user.email || '')}`;
        } else {
            finalUrl = `https://buy.stripe.com/test_XXXXXXXX?prefilled_email=${encodeURIComponent(user.email || '')}`;
        }

        // Redirect directly to Stripe checkout
        window.location.href = finalUrl;
    };

    const handleStartTrial = async () => {
        if (!user || user.premium_trial_availed || user.is_premium) {
            toast.error("Trial not available.");
            return;
        }
        try {
            await User.updateMyUserData({
                premium_trial_started_at: new Date().toISOString(),
                premium_trial_availed: true,
                is_premium: true, // Temporarily grant premium status
            });
            toast.success("7-Day Free Trial Started!", {
                description: "You now have access to all premium features. Enjoy!",
            });
            // A "real" app would set is_premium to false after 7 days via a backend job.
            // For now, we'll just grant it. The check logic would be client-side.
            navigate(createPageUrl('Dashboard'));
        } catch (error) {
            console.error("Failed to start trial:", error);
            toast.error("Could not start your free trial. Please try again.");
        }
    };
    
    const showTrialButton = user && !user.is_premium && !user.premium_trial_availed;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
                <BackHeader 
                    title="Premium Membership" 
                    subtitle="Unlock your full potential"
                    backTo="Profile"
                    backLabel="Profile"
                />

                <header className="text-center space-y-4 mb-12">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg">
                        <Star className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Unlock Your Full Potential with Mindful Premium
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Elevate your wellness journey with exclusive features, personalized insights, and expert guidance.
                    </p>
                </header>

                <main className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <Card className="bg-white/10 backdrop-blur-sm border border-gray-700 shadow-xl h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl text-purple-300">
                                    <Sparkles className="text-purple-400"/>
                                    What's Included in Premium?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {premiumFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            {feature.icon}
                                            <span className="text-gray-200 font-medium">{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl ring-4 ring-purple-300">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl">Mindful Premium</CardTitle>
                                <p className="text-4xl font-bold mt-2">$12.99<span className="text-lg font-normal opacity-70">/month</span></p>
                                <p className="text-sm opacity-80 mt-1">Billed monthly, cancel anytime.</p>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => handleUpgradeClick('premium')}
                                    className="w-full bg-white text-purple-600 hover:bg-purple-100 text-lg font-bold py-6 rounded-2xl shadow-lg"
                                >
                                    Upgrade Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
