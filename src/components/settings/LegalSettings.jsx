import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function LegalSettings() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Terms of Service */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('terms')}>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Terms of Service
            </CardTitle>
            {expandedSection === 'terms' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </CardHeader>
        {expandedSection === 'terms' && (
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Eligibility</h3>
              <p className="text-gray-700">
                By using Mindful, you confirm that you are at least 13 years of age and have the legal capacity to enter into these Terms. If you are under 18, you must have parental or guardian consent to use our services. Mindful is designed as a mental wellness support tool and is not intended to replace professional medical advice, diagnosis, or treatment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Account Responsibility</h3>
              <p className="text-gray-700">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information as needed. You must notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Community Conduct</h3>
              <p className="text-gray-700">
                Our community is built on respect, empathy, and support. You agree to treat all community members with kindness and respect. Prohibited conduct includes, but is not limited to: harassment, bullying, sharing personal information without consent, posting inappropriate or offensive content, providing medical advice, spam or promotional content, and impersonation. Violations may result in warnings, content removal, temporary suspension, or permanent account termination.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Subscription & Payments</h3>
              <p className="text-gray-700">
                Mindful offers both free and premium subscription services. Premium subscriptions are billed monthly at $12.99/month unless cancelled. The optional VIP Therapy Session Pack is available for $29.99/month for Premium subscribers. All payments are processed securely through our payment partners. You may cancel your subscription at any time, and cancellation will take effect at the end of your current billing period. No refunds are provided for partial periods, except as required by law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Content Use</h3>
              <p className="text-gray-700">
                You retain ownership of all content you create within Mindful, including journal entries, posts, and comments. By posting content in community areas, you grant us a limited license to display, distribute, and moderate that content within our platform. We respect your privacy and will never share your personal journal entries or private data without your explicit consent. You may request deletion of your content at any time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Limitations of Liability</h3>
              <p className="text-gray-700">
                Mindful is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability to you for any claims shall not exceed the amount you paid for our services in the preceding 12 months. Nothing in these terms limits our liability for death or personal injury caused by negligence, fraud, or other matters where limitation is prohibited by law.
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Last updated: December 2024. These terms may be updated from time to time, and continued use constitutes acceptance of any changes.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Privacy Policy */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('privacy')}>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Privacy Policy
            </CardTitle>
            {expandedSection === 'privacy' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </CardHeader>
        {expandedSection === 'privacy' && (
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Collection</h3>
              <p className="text-gray-700">
                We collect information you provide directly to us, such as your name, email address, profile information, journal entries, mood tracking data, and community posts. We also collect usage information automatically, including device information, app interaction data, and analytics to improve our services. Location data is only collected with your explicit permission for features like local therapy recommendations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Use</h3>
              <p className="text-gray-700">
                We use your information to provide and improve our services, personalize your experience, send you notifications and updates, provide customer support, ensure platform safety and security, and conduct analytics to enhance our features. Your personal journal entries and mood data are never shared with third parties and remain completely private to you. Community posts may be visible to other users as per your privacy settings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Sharing</h3>
              <p className="text-gray-700">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. We may share aggregated, non-personally identifiable information for research and development purposes. We may disclose your information if required by law, to protect our rights, or to ensure user safety. If we undergo a business transition, your information may be transferred as part of the assets, but you will be notified of any changes to this policy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">User Control</h3>
              <p className="text-gray-700">
                You have the right to access, update, and delete your personal information at any time through your account settings. You can control your privacy settings, including who can see your community posts and whether to post anonymously. You may opt out of email communications, though some service-related messages may still be necessary. You can request a complete copy of your data or permanent account deletion by contacting our support team.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Security</h3>
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your personal information, including encryption in transit and at rest, secure server infrastructure, and regular security audits. While we strive to protect your information, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. We will notify you of any data breaches that may affect your personal information as required by law.
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Last updated: December 2024. We may update this Privacy Policy from time to time and will notify you of significant changes.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Cookie Policy */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('cookies')}>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Cookie Policy
            </CardTitle>
            {expandedSection === 'cookies' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </CardHeader>
        {expandedSection === 'cookies' && (
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Purpose of Cookies</h3>
              <p className="text-gray-700">
                Mindful uses cookies and similar technologies to enhance your experience, remember your preferences, maintain your login session, and analyze app usage. Essential cookies are necessary for the app to function properly, including authentication and security features. Performance cookies help us understand how you interact with our app so we can improve functionality and user experience.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">User Control</h3>
              <p className="text-gray-700">
                You can control cookie preferences through your browser settings, though disabling certain cookies may affect app functionality. Essential cookies cannot be disabled as they are necessary for core features like login and security. You can clear your cookies at any time through your browser, though this may require you to log in again and reset your preferences.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Third-Party Cookies</h3>
              <p className="text-gray-700">
                We may use third-party services that set cookies for analytics, authentication (Google Sign-In), and payment processing. These third parties have their own privacy policies and cookie practices. We do not control these third-party cookies and recommend reviewing their respective privacy policies. We do not use cookies for advertising or tracking across other websites.
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Last updated: December 2024. This Cookie Policy may be updated to reflect changes in our practices or applicable laws.
            </p>
          </CardContent>
        )}
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <div>
              <Label className="font-medium">App Version</Label>
              <p className="text-sm text-gray-600">Mindful v2.1.0</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <div>
              <Label className="font-medium">Last Updated</Label>
              <p className="text-sm text-gray-600">December 2024</p>
            </div>
          </div>

          <Button variant="outline" className="w-full justify-between rounded-2xl">
            <span>View Release Notes</span>
            <Info className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-2">Made with ❤️ for mental wellness</p>
          <p className="text-sm text-gray-500">
            Mindful is committed to providing accessible mental health support for everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}