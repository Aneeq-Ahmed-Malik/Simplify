
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Headphones, Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Voice {
  id: string;
  name: string;
  preview?: string;
}

const voices: Voice[] = [
  { id: "voice1", name: "Emma (Female)" },
  { id: "voice2", name: "John (Male)" },
  { id: "voice3", name: "Alex (Neutral)" },
  { id: "voice4", name: "Sarah (Female)" },
  { id: "voice5", name: "Michael (Male)" },
];

interface AudioPlayerProps {
  summaryText: string;
  onGenerateAudio: (text: string, voiceId: string) => Promise<string>;
}

const AudioPlayer = ({ summaryText, onGenerateAudio }: AudioPlayerProps) => {
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleGenerateAudio = async () => {
    if (!summaryText) return;
    
    setIsGenerating(true);
    try {
      const url = await onGenerateAudio(summaryText, selectedVoice);
      setAudioUrl(url);
      
      // Create new audio element
      const audio = new Audio(url);
      audio.volume = volume[0] / 100;
      setAudioElement(audio);
      
      // Set up event listeners
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('play', () => setIsPlaying(true));
      
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume[0] / 100;
    }
  };

  if (!summaryText) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Headphones className="mr-2 h-5 w-5" />
          Listen to Summary
        </CardTitle>
        <CardDescription>
          Convert the summary to speech using different voices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-full sm:w-48">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleGenerateAudio}
              disabled={isGenerating || !summaryText}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-primary-foreground animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Headphones className="mr-2 h-4 w-4" />
                  Generate Audio
                </>
              )}
            </Button>
          </div>

          {audioUrl && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={!audioUrl}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex items-center space-x-2 flex-1">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <audio controls className="w-full hidden">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
