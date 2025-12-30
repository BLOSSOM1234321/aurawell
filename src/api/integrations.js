/**
 * INTEGRATIONS PLACEHOLDER
 * These integrations are not yet implemented in the custom backend
 * They will be added when needed
 */

// Placeholder Core integration
export const Core = {
  InvokeLLM: async () => {
    console.warn('InvokeLLM not implemented yet');
    return null;
  },
  SendEmail: async () => {
    console.warn('SendEmail not implemented yet');
    return null;
  },
  UploadFile: async () => {
    console.warn('UploadFile not implemented yet');
    return null;
  },
  GenerateImage: async () => {
    console.warn('GenerateImage not implemented yet');
    return null;
  },
  ExtractDataFromUploadedFile: async () => {
    console.warn('ExtractDataFromUploadedFile not implemented yet');
    return null;
  },
  CreateFileSignedUrl: async () => {
    console.warn('CreateFileSignedUrl not implemented yet');
    return null;
  },
  UploadPrivateFile: async () => {
    console.warn('UploadPrivateFile not implemented yet');
    return null;
  },
};

export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;

export default Core;
