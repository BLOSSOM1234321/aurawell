import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Music } from 'lucide-react';
import { UploadFile } from '@/api/integrations';

export default function UploadAudioHelper({ onAudioUploaded }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (.mp3, .wav, etc.)');
      return;
    }

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      setUploadedUrl(result.file_url);
      onAudioUploaded(result.file_url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
    setIsUploading(false);
  };

  return (
    <Card className="bg-blue-50 border-2 border-dashed border-blue-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Music className="w-5 h-5" />
          Upload Background Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-blue-700 text-sm">
            Upload an MP3 file to get a URL. Then, let me know which meditation to add it to.
          </p>
          
          <div>
            <input
              type="file"
              id="audio-upload"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <label htmlFor="audio-upload">
              <Button 
                asChild 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUploading}
              >
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose MP3 File'}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}