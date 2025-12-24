import React from 'react';
import { Brain, MessageCircle, Database, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ContextIndicator({ 
  messagesCount, 
  memoriesCount, 
  summariesCount,
  currentEmotion 
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {messagesCount > 0 && (
        <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 text-xs">
          <MessageCircle className="w-3 h-3 mr-1" />
          {messagesCount} msg
        </Badge>
      )}
      
      {memoriesCount > 0 && (
        <Badge variant="outline" className="bg-purple-500/20 border-purple-400/30 text-purple-200 text-xs">
          <Database className="w-3 h-3 mr-1" />
          {memoriesCount} mémoires
        </Badge>
      )}
      
      {summariesCount > 0 && (
        <Badge variant="outline" className="bg-indigo-500/20 border-indigo-400/30 text-indigo-200 text-xs">
          <Brain className="w-3 h-3 mr-1" />
          {summariesCount} résumé{summariesCount > 1 ? 's' : ''}
        </Badge>
      )}
      
      {currentEmotion && (
        <Badge variant="outline" className="bg-pink-500/20 border-pink-400/30 text-pink-200 text-xs">
          <Heart className="w-3 h-3 mr-1" />
          {currentEmotion.emotional_reaction}
        </Badge>
      )}
    </div>
  );
}