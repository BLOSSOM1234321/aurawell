import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ReelUploadModal from "./ReelUploadModal";

export default function ReelUploadButton({ onUploadComplete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="rounded-full w-14 h-14 shadow-lg"
        style={{ backgroundColor: '#5C4B99' }}
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>

      {showModal && (
        <ReelUploadModal
          onClose={() => setShowModal(false)}
          onComplete={() => {
            setShowModal(false);
            onUploadComplete();
          }}
        />
      )}
    </>
  );
}