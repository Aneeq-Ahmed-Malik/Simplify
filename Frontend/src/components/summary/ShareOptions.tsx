import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Facebook, Twitter, Linkedin, Link, Share2, Heart, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import { sharePost } from "@/utils/api";

interface ShareOptionsProps {
  summaryText: string;
  title: string;
  sources: { title: string; url: string; website: string }[];
  
}

const ShareOptions = ({ 
  summaryText, 
  title, 
  sources,
 
}: ShareOptionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const truncatedSummary = summaryText.length > 100 
    ? summaryText.substring(0, 100) + "..." 
    : summaryText;

  const shareUrl = window.location.href;
  
  const encodedText = encodeURIComponent(`Check out this summary about "${title}": ${truncatedSummary}`);
  
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodedText}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this summary with others",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  
  const handleShareToFeed = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to share posts",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        ),
      });
      return;
    }

    try {
      const urls = sources.map(source => source.url);
      await sharePost(summaryText, title, urls);
      toast({
        title: "Success",
        description: "Post shared to community feed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to share post",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5 text-primary" />
          Share This Summary
        </CardTitle>
        <CardDescription>
          Share this summary with others or on social media
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>
          <TabsContent value="social" className="pt-4">
            <div className="flex justify-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] transition-colors hover:bg-[#1DA1F2]/20"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-colors hover:bg-[#1877F2]/20"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2]/10 text-[#0A66C2] transition-colors hover:bg-[#0A66C2]/20"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="pt-4">
            <div className="flex space-x-2">
              <Input 
                value={shareUrl} 
                readOnly 
                className="flex-1 bg-muted/50"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="min-w-[100px]"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="flex items-center justify-center space-x-4">
          {/* <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hover:bg-red-100 dark:hover:bg-red-950/30 ${isLiked ? 'text-red-500 dark:text-red-400' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`mr-1 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}`} />
              Like
            </Button>
            <span className="text-sm text-muted-foreground">{likesCount > 0 ? likesCount : ''}</span>
          </div> */}
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-primary/80 hover:bg-primary"
            onClick={handleShareToFeed}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share to Feed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareOptions;