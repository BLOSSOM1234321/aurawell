import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { mockClientNotes } from "../../data/mockTherapists";

export default function ClientNotesManager({ therapist, clients }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    note_title: "",
    note_content: "",
    tags: "",
    is_important: false
  });

  useEffect(() => {
    if (selectedClient) {
      loadNotes();
    }
  }, [selectedClient]);

  const loadNotes = async () => {
    if (!selectedClient) return;

    // Load from localStorage or use mock data
    const storedNotes = localStorage.getItem('client_notes');
    const allNotes = storedNotes ? JSON.parse(storedNotes) : mockClientNotes;

    const notesData = allNotes.filter(
      note => note.therapist_email === therapist.email && note.client_email === selectedClient.client_email
    );
    setNotes(notesData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      // Create new note object
      const newNote = {
        id: `note-${Date.now()}`,
        therapist_email: therapist.email,
        client_email: selectedClient.client_email,
        note_title: formData.note_title,
        note_content: formData.note_content,
        tags,
        is_important: formData.is_important,
        created_date: new Date().toISOString()
      };

      // Save to localStorage
      const storedNotes = localStorage.getItem('client_notes');
      const allNotes = storedNotes ? JSON.parse(storedNotes) : mockClientNotes;
      allNotes.push(newNote);
      localStorage.setItem('client_notes', JSON.stringify(allNotes));

      toast.success("Note saved!");
      setShowForm(false);
      setFormData({
        note_title: "",
        note_content: "",
        tags: "",
        is_important: false
      });
      loadNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      // Remove from localStorage
      const storedNotes = localStorage.getItem('client_notes');
      const allNotes = storedNotes ? JSON.parse(storedNotes) : mockClientNotes;
      const updatedNotes = allNotes.filter(note => note.id !== noteId);
      localStorage.setItem('client_notes', JSON.stringify(updatedNotes));

      toast.success("Note deleted");
      loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={selectedClient?.id} onValueChange={(value) => {
          const client = clients.find(c => c.id === value);
          setSelectedClient(client);
        }}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedClient && (
          <Button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#5C4B99' }} className="text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && selectedClient && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Note Title</Label>
                    <Input
                      value={formData.note_title}
                      onChange={(e) => setFormData({...formData, note_title: e.target.value})}
                      placeholder="Session summary, observation, etc."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Note Content *</Label>
                    <Textarea
                      value={formData.note_content}
                      onChange={(e) => setFormData({...formData, note_content: e.target.value})}
                      placeholder="Private notes about this client..."
                      required
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="progress, anxiety, breakthrough"
                        className="mt-2"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-8">
                      <input
                        type="checkbox"
                        id="important"
                        checked={formData.is_important}
                        onChange={(e) => setFormData({...formData, is_important: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="important">Mark as important</Label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" style={{ backgroundColor: '#5C4B99' }} className="flex-1 text-white">
                      Save Note
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedClient && (
        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map(note => (
              <Card key={note.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {note.is_important && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          <h4 className="font-semibold text-gray-800">{note.note_title || "Untitled Note"}</h4>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(note.created_date), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.note_content}</p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notes yet for this client</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}