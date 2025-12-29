import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Upload, Camera, CheckCircle, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";

export default function TherapistOnboarding() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stream, setStream] = useState(null);
  const [selfieCapture, setSelfieCapture] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Professional Questions
    licenseType: "",
    licenseNumber: "",
    yearsExperience: "",
    specializations: [],
    therapeuticApproaches: [],
    education: "",
    clientDemographics: [],
    languages: [],
    insuranceAccepted: "",
    sessionRate: "",
    practiceType: "",

    // Step 2: License/Degree Upload
    licenseDocument: null,

    // Step 3: ID Verification
    idDocument: null,

    // Step 4: Selfie Verification
    selfiePhoto: null
  });

  const specializations = [
    "Anxiety Disorders",
    "Depression",
    "Trauma & PTSD",
    "Relationship Issues",
    "Family Therapy",
    "Addiction & Substance Abuse",
    "Eating Disorders",
    "OCD",
    "Grief & Loss",
    "Child & Adolescent Therapy",
    "ADHD",
    "Bipolar Disorder",
    "Stress Management",
    "Life Transitions"
  ];

  const therapeuticApproaches = [
    "Cognitive Behavioral Therapy (CBT)",
    "Dialectical Behavior Therapy (DBT)",
    "Psychodynamic Therapy",
    "EMDR",
    "Mindfulness-Based Therapy",
    "Solution-Focused Therapy",
    "Acceptance and Commitment Therapy (ACT)",
    "Family Systems Therapy",
    "Trauma-Focused CBT",
    "Play Therapy"
  ];

  const clientDemographics = [
    "Children (5-12)",
    "Adolescents (13-17)",
    "Young Adults (18-25)",
    "Adults (26-64)",
    "Seniors (65+)",
    "Couples",
    "Families",
    "LGBTQ+",
    "Veterans",
    "First Responders"
  ];

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      toast.success(`${field === 'licenseDocument' ? 'License' : 'ID'} uploaded successfully`);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        setSelfieCapture(URL.createObjectURL(blob));
        setFormData(prev => ({ ...prev, selfiePhoto: blob }));

        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }

        toast.success("Photo captured successfully!");
      }, 'image/jpeg');
    }
  };

  const retakeSelfie = () => {
    setSelfieCapture(null);
    setFormData(prev => ({ ...prev, selfiePhoto: null }));
    startCamera();
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.licenseType || !formData.licenseNumber || !formData.yearsExperience ||
            !formData.education || formData.specializations.length === 0 ||
            formData.therapeuticApproaches.length === 0 || formData.languages.length === 0 ||
            !formData.practiceType) {
          toast.error("Please complete all required fields");
          return false;
        }
        return true;
      case 2:
        if (!formData.licenseDocument) {
          toast.error("Please upload your license or degree");
          return false;
        }
        return true;
      case 3:
        if (!formData.idDocument) {
          toast.error("Please upload your ID");
          return false;
        }
        return true;
      case 4:
        if (!formData.selfiePhoto) {
          toast.error("Please capture your selfie");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 4) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
        if (currentStep === 3) {
          // Start camera when entering selfie step
          setTimeout(() => startCamera(), 100);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Stop camera if going back from selfie step
      if (currentStep === 4 && stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleSubmit = () => {
    // Get the pending therapist user from localStorage
    const pendingUser = JSON.parse(localStorage.getItem('aurawell_current_user'));

    // Update user with onboarding data
    const updatedUser = {
      ...pendingUser,
      onboardingComplete: true,
      verification_status: 'pending', // Still pending until admin reviews
      licenseType: formData.licenseType,
      licenseNumber: formData.licenseNumber,
      yearsExperience: parseInt(formData.yearsExperience),
      specializations: formData.specializations,
      therapeuticApproaches: formData.therapeuticApproaches,
      education: formData.education,
      clientDemographics: formData.clientDemographics,
      languages: formData.languages,
      insuranceAccepted: formData.insuranceAccepted,
      sessionRate: formData.sessionRate ? parseInt(formData.sessionRate) : null,
      practiceType: formData.practiceType,
      documentsSubmitted: true,
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));

    // Update users list
    const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
    const userIndex = users.findIndex(u => u.id === pendingUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('aurawell_users', JSON.stringify(users));
    }

    toast.success("Application submitted successfully!");
    setTimeout(() => {
      navigate(createPageUrl("Dashboard"));
    }, 1500);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Professional Information</h2>

      {/* Question 1: License Type */}
      <div>
        <Label className="text-base">1. What is your professional license type? *</Label>
        <Select value={formData.licenseType} onValueChange={(value) => setFormData(prev => ({...prev, licenseType: value}))}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select license type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Licensed Clinical Psychologist (Ph.D./Psy.D.)">Licensed Clinical Psychologist (Ph.D./Psy.D.)</SelectItem>
            <SelectItem value="Licensed Professional Counselor (LPC)">Licensed Professional Counselor (LPC)</SelectItem>
            <SelectItem value="Licensed Clinical Social Worker (LCSW)">Licensed Clinical Social Worker (LCSW)</SelectItem>
            <SelectItem value="Licensed Marriage and Family Therapist (LMFT)">Licensed Marriage and Family Therapist (LMFT)</SelectItem>
            <SelectItem value="Licensed Mental Health Counselor (LMHC)">Licensed Mental Health Counselor (LMHC)</SelectItem>
            <SelectItem value="Psychiatrist (M.D./D.O.)">Psychiatrist (M.D./D.O.)</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question 2: License Number */}
      <div>
        <Label className="text-base">2. What is your license number? *</Label>
        <Input
          className="mt-2"
          placeholder="e.g., PSY-12345"
          value={formData.licenseNumber}
          onChange={(e) => setFormData(prev => ({...prev, licenseNumber: e.target.value}))}
        />
      </div>

      {/* Question 3: Years of Experience */}
      <div>
        <Label className="text-base">3. How many years of clinical experience do you have? *</Label>
        <Input
          className="mt-2"
          type="number"
          placeholder="e.g., 5"
          min="0"
          value={formData.yearsExperience}
          onChange={(e) => setFormData(prev => ({...prev, yearsExperience: e.target.value}))}
        />
      </div>

      {/* Question 4: Specializations */}
      <div>
        <Label className="text-base">4. What are your primary areas of specialization? (Select all that apply) *</Label>
        <div className="mt-2 grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg">
          {specializations.map((spec) => (
            <div key={spec} className="flex items-center space-x-2">
              <Checkbox
                id={spec}
                checked={formData.specializations.includes(spec)}
                onCheckedChange={() => handleCheckboxChange('specializations', spec)}
              />
              <label htmlFor={spec} className="text-sm cursor-pointer">{spec}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Question 5: Therapeutic Approaches */}
      <div>
        <Label className="text-base">5. Which therapeutic approaches/modalities do you practice? (Select all that apply) *</Label>
        <div className="mt-2 grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg">
          {therapeuticApproaches.map((approach) => (
            <div key={approach} className="flex items-center space-x-2">
              <Checkbox
                id={approach}
                checked={formData.therapeuticApproaches.includes(approach)}
                onCheckedChange={() => handleCheckboxChange('therapeuticApproaches', approach)}
              />
              <label htmlFor={approach} className="text-sm cursor-pointer">{approach}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Question 6: Education */}
      <div>
        <Label className="text-base">6. What is your highest level of education and institution? *</Label>
        <Textarea
          className="mt-2"
          placeholder="e.g., Ph.D. in Clinical Psychology from Stanford University"
          rows={3}
          value={formData.education}
          onChange={(e) => setFormData(prev => ({...prev, education: e.target.value}))}
        />
      </div>

      {/* Question 7: Client Demographics */}
      <div>
        <Label className="text-base">7. Which client populations do you work with? (Select all that apply) *</Label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {clientDemographics.map((demo) => (
            <div key={demo} className="flex items-center space-x-2">
              <Checkbox
                id={demo}
                checked={formData.clientDemographics.includes(demo)}
                onCheckedChange={() => handleCheckboxChange('clientDemographics', demo)}
              />
              <label htmlFor={demo} className="text-sm cursor-pointer">{demo}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Question 8: Languages */}
      <div>
        <Label className="text-base">8. What languages do you offer therapy in? *</Label>
        <Input
          className="mt-2"
          placeholder="e.g., English, Spanish, French (separate with commas)"
          value={formData.languages.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            languages: e.target.value.split(',').map(l => l.trim()).filter(l => l)
          }))}
        />
      </div>

      {/* Question 9: Insurance */}
      <div>
        <Label className="text-base">9. Do you accept insurance, or are you private pay only?</Label>
        <Select value={formData.insuranceAccepted} onValueChange={(value) => setFormData(prev => ({...prev, insuranceAccepted: value}))}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select payment option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Accept Insurance">Accept Insurance</SelectItem>
            <SelectItem value="Private Pay Only">Private Pay Only</SelectItem>
            <SelectItem value="Both">Both Insurance and Private Pay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question 10: Practice Type */}
      <div>
        <Label className="text-base">10. What type of practice do you operate? *</Label>
        <Select value={formData.practiceType} onValueChange={(value) => setFormData(prev => ({...prev, practiceType: value}))}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select practice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="In-Person Only">In-Person Only</SelectItem>
            <SelectItem value="Telehealth Only">Telehealth Only</SelectItem>
            <SelectItem value="Hybrid (Both In-Person and Telehealth)">Hybrid (Both In-Person and Telehealth)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Optional: Session Rate */}
      <div>
        <Label className="text-base">Session Rate (Optional)</Label>
        <Input
          className="mt-2"
          type="number"
          placeholder="e.g., 150 (USD per session)"
          value={formData.sessionRate}
          onChange={(e) => setFormData(prev => ({...prev, sessionRate: e.target.value}))}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">License/Degree Verification</h2>
      <p className="text-gray-600">Please upload a clear copy of your professional license or degree certificate.</p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {formData.licenseDocument ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <p className="text-green-600 font-medium">{formData.licenseDocument.name}</p>
            <Button variant="outline" onClick={() => setFormData(prev => ({...prev, licenseDocument: null}))}>
              Change File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <label htmlFor="license-upload" className="cursor-pointer">
                <div className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-gray-500">
                  PDF, JPG, PNG (Max 10MB)
                </div>
              </label>
              <input
                id="license-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('licenseDocument', e)}
                className="hidden"
              />
            </div>
            <Button onClick={() => document.getElementById('license-upload').click()}>
              <Upload className="w-4 h-4 mr-2" />
              Select File
            </Button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your license information will be kept confidential and used only for verification purposes.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">ID Verification - Step 1</h2>
      <p className="text-gray-600">Please upload a clear photo of your government-issued ID (driver's license, passport, etc.).</p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {formData.idDocument ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <p className="text-green-600 font-medium">{formData.idDocument.name}</p>
            <Button variant="outline" onClick={() => setFormData(prev => ({...prev, idDocument: null}))}>
              Change File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <label htmlFor="id-upload" className="cursor-pointer">
                <div className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </div>
                <div className="text-xs text-gray-500">
                  JPG, PNG (Max 10MB)
                </div>
              </label>
              <input
                id="id-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('idDocument', e)}
                className="hidden"
              />
            </div>
            <Button onClick={() => document.getElementById('id-upload').click()}>
              <Upload className="w-4 h-4 mr-2" />
              Select File
            </Button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Privacy Notice:</strong> Your ID will be securely stored and used only for identity verification. Sensitive information will be encrypted.
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">ID Verification - Step 2</h2>
      <p className="text-gray-600">Please take a live selfie to verify your identity.</p>

      <div className="border-2 border-gray-300 rounded-lg p-4">
        {selfieCapture ? (
          <div className="space-y-4">
            <img src={selfieCapture} alt="Captured selfie" className="w-full max-w-md mx-auto rounded-lg" />
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={retakeSelfie}>
                Retake Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md mx-auto rounded-lg bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-center">
              <Button onClick={captureSelfie} disabled={!stream}>
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tips for a good photo:</strong> Make sure your face is well-lit and clearly visible. Remove sunglasses or hats.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">Therapist Application</h1>
          <p className="text-gray-600">Complete all steps to join AuraWell as a verified therapist</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Questions</span>
            <span>License</span>
            <span>ID Upload</span>
            <span>Selfie</span>
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 text-white"
                style={{ backgroundColor: '#5C4B99' }}
              >
                {currentStep === 4 ? 'Submit Application' : 'Next'}
                {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}