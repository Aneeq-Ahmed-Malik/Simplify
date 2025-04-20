import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebsiteSelector from "@/components/summary/WebsiteSelector";
import TopicInput from "@/components/summary/TopicInput";
import SummaryDisplay from "@/components/summary/SummaryDisplay";
import AudioPlayer from "@/components/summary/AudioPlayer";
import DownloadOptions from "@/components/summary/DownloadOptions";
import ShareOptions from "@/components/summary/ShareOptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/utils/auth";
import { getArticleSummary, generateAudio, downloadSummary } from "@/utils/api";

import { FileText, AlertCircle, TrendingUp, BookOpen, History, Sparkles, Users, Zap, Star, Award, Bookmark, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Source {
  title: string;
  url: string;
  website: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [searchTopic, setSearchTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const trendingTopics = [
    "AI Ethics", "Sustainable Energy", "Remote Work",
    "Quantum Computing", "Mental Health", "Blockchain"
  ];

  const handleSearch = async (topic: string) => {
    if (selectedWebsites.length === 0) {
      setError("Please select at least one website.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one website.",
      });
      return;
    }

    console.log("handleSearch called:", { topic, selectedWebsites });
    setIsLoading(true);
    setError(null);
    try {
      const result = await getArticleSummary({
        websites: selectedWebsites || [], // Fallback to empty array
        topic: topic,
      });
      
      setSummary(result.summary);
      setSources(result.sources || []);
      setSearchTopic(topic);
      
      setIsLiked(false);
      setLikesCount(Math.floor(Math.random() * 50));
      
      toast({
        title: "Summary generated successfully!",
        description: `We've compiled insights from ${selectedWebsites.join(", ")}.`,
      });
    } catch (error: any) {
      console.error("Error fetching summary:", error);
      setError(error.message || "Failed to generate summary. Please try again.");
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummaryUpdate = (updatedSummary: string) => {
    setSummary(updatedSummary);
  };

  const handleGenerateAudio = async (text: string, voiceId: string) => {
    return await generateAudio(text, voiceId);
  };

  const handleDownload = async (text: string, title: string, format: "txt" | "pdf" | "docx") => {
    await downloadSummary(text, title, format);
  };
  
  const handleLike = () => {
    if (isAuthenticated) {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } else {
      toast({
        title: "Login required",
        description: "Please log in to like summaries",
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
    }
  };

  const handleBookmarkTopic = (topic: string) => {
    if (isAuthenticated) {
      toast({
        title: "Topic bookmarked",
        description: `"${topic}" has been added to your bookmarks.`,
      });
    } else {
      toast({
        title: "Login required",
        description: "Please log in to bookmark topics",
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
    }
  };

  return (
    <div className="summary-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0 text-gradient">Simplify</h1>
        <div className="hidden sm:flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/feed")}
            className="card-hover"
          >
            <Users className="mr-2 h-4 w-4" />
            Community Feed
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/history")}
            className="card-hover"
          >
            <History className="mr-2 h-4 w-4" />
            View History
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Generate Blog Summary
            </CardTitle>
            <CardDescription>
              Select websites and enter a topic to generate a summary of relevant blog posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <WebsiteSelector 
              onWebsiteSelect={setSelectedWebsites}
              selectedWebsites={selectedWebsites}
            />
            
            <TopicInput onSearch={handleSearch} isLoading={isLoading} />
            
            {!isAuthenticated && (
              <Alert variant="default" className="bg-secondary/50 dark:bg-secondary/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login required for full features</AlertTitle>
                <AlertDescription className="flex items-center">
                  To save summaries, access history, and enable downloads, please 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold ml-1"
                    onClick={() => navigate("/login")}
                  >
                    log in
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Why Use Our Summaries?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Save Time</h3>
                <p className="text-sm text-muted-foreground">
                  Get key insights without reading entire articles
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Multiple Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Insights combined from various reputable blogs
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <History className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Access your summary history anytime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading && (
        <Card className="mb-6 animate-pulse">
          <CardContent className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Generating summary...</span>
          </CardContent>
        </Card>
      )}
      
      {!isLoading && !summary && (
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              Trending Topics
            </CardTitle>
            <CardDescription>
              Explore popular topics our community is summarizing right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="topics">
              <TabsList className="mb-4">
                <TabsTrigger value="topics">Popular Topics</TabsTrigger>
                <TabsTrigger value="summaries">Recent Summaries</TabsTrigger>
              </TabsList>
              
              <TabsContent value="topics">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trendingTopics.map((topic, index) => (
                    <Card key={index} className="card-hover cursor-pointer">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{topic}</h3>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 50) + 10} summaries
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSearch(topic);
                            }}
                          >
                            <Zap className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmarkTopic(topic);
                            }}
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="summaries">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="mt-1">
                      <Star className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">The Future of Remote Work</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Remote work is here to stay, with 82% of companies planning to allow employees to work remotely at least part-time after the pandemic...
                      </p>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs p-0 h-auto hover:bg-transparent hover:underline"
                          onClick={() => handleSearch("The Future of Remote Work")}
                        >
                          Generate similar summary
                        </Button>
                        <Separator orientation="vertical" className="h-3 mx-2" />
                        <span className="text-xs text-muted-foreground">Generated 2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="mt-1">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Sustainable Energy Solutions for 2025</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Renewable energy sources continue to gain momentum with solar and wind power becoming increasingly affordable alternatives to fossil fuels...
                      </p>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs p-0 h-auto hover:bg-transparent hover:underline"
                          onClick={() => handleSearch("Sustainable Energy Solutions")}
                        >
                          Generate similar summary
                        </Button>
                        <Separator orientation="vertical" className="h-3 mx-2" />
                        <span className="text-xs text-muted-foreground">Generated 1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/feed")}>
              <Users className="mr-2 h-4 w-4" />
              Explore Community Feed
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {!isLoading && summary && (
        <SummaryDisplay 
          summary={summary} 
          sources={sources}
          topic={searchTopic}
          onSummaryUpdate={handleSummaryUpdate}
        />
      )}
      
      {summary && !isLoading && (
        <div className="mt-6 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AudioPlayer 
              summaryText={summary}
              onGenerateAudio={handleGenerateAudio}
            />
            <DownloadOptions 
              summaryText={summary}
              title={searchTopic || "Summary"}
              onDownload={handleDownload}
            />
          </div>
          <ShareOptions 
            summaryText={summary}
            title={searchTopic || "Summary"}
            onLike={handleLike}
            isLiked={isLiked}
            likesCount={likesCount}
          />
        </div>
      )}
    </div>
  );
};

export default Index;