import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Star } from "lucide-react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      await base44.integrations.Core.SendEmail({
        to: 'feedback@druideomega.com',
        subject: `Feedback - ${rating}/5 étoiles`,
        body: `Note: ${rating}/5\n\nFeedback:\n${feedback}`
      });
    },
    onSuccess: () => {
      setOpen(false);
      setRating(0);
      setFeedback("");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Votre avis nous intéresse</h2>
        
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Note</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)}>
                <Star className={`w-8 h-8 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Partagez votre expérience..."
          rows={5}
        />

        <Button 
          onClick={() => submitMutation.mutate()}
          disabled={!rating || !feedback || submitMutation.isPending}
          className="w-full"
        >
          {submitMutation.isPending ? 'Envoi...' : 'Envoyer'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}