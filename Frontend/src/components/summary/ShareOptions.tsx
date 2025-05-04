import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Copy, MessageCircleMore } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareOptionsProps {
  summaryText: string;
  title: string;
}

const ShareOptions = ({ summaryText, title }: ShareOptionsProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const truncatedSummary = summaryText.length > 100 
    ? summaryText.substring(0, 100) + "..." 
    : summaryText;

  const whatsappMessage = `Check out this summary about "${title}": ${truncatedSummary} ${shareUrl}`;
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied to clipboard",
      description: "You can now paste and share it manually",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircleMore className="mr-2 h-5 w-5 text-primary" />
          Share on WhatsApp
        </CardTitle>
        <CardDescription>
          Share this summary with your contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-green-500/10 text-green-600 h-12 w-12 hover:bg-green-500/20 transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircleMore className="h-6 w-6" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share via WhatsApp</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex space-x-2 pt-4">
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

      </CardContent>
    </Card>
  );
};

export default ShareOptions;
