import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Globe } from "lucide-react";

export default function CrisisSupport() {
  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7, free and confidential support",
      icon: Phone,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "24/7 crisis support via text message",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service",
      icon: Phone,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-red-800">
          <div className="p-2 bg-red-500 rounded-xl">
            <Phone className="w-5 h-5 text-white" />
          </div>
          Crisis Support - Available 24/7
        </CardTitle>
        <p className="text-red-700">
          If you're in crisis or having thoughts of self-harm, please reach out immediately. You're not alone.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {crisisResources.map((resource, index) => (
            <div 
              key={index}
              className={`p-4 ${resource.bgColor} rounded-2xl border ${resource.borderColor}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <resource.icon className={`w-5 h-5 ${resource.color}`} />
                <h3 className={`font-semibold ${resource.color}`}>
                  {resource.name}
                </h3>
              </div>
              
              <p className="font-bold text-lg mb-2">{resource.phone}</p>
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
              
              <Button 
                className={`w-full ${resource.color.replace('text-', 'bg-')} hover:opacity-90 text-white rounded-2xl`}
                onClick={() => {
                  if (resource.phone.includes('741741')) {
                    // For text line, can't directly trigger SMS, but could show instructions
                    alert('To text: Send "HOME" to 741741');
                  } else if (resource.phone.includes('988') || resource.phone.includes('1-800')) {
                    window.open(`tel:${resource.phone}`, '_self');
                  }
                }}
              >
                <resource.icon className="w-4 h-4 mr-2" />
                Contact Now
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>International users:</strong> Visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline">findahelpline.com</a> to find crisis support in your country.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}