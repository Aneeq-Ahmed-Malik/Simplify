
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Heart, ExternalLink, TrendingUp, Calendar, Search, Filter, Users, Coffee } from "lucide-react";
import { useAuth } from "@/utils/auth";
import SummaryDisplay from "@/components/summary/SummaryDisplay";

interface Source {
  title: string;
  url: string;
  website: string;
}

interface FeedSummary {
  id: string;
  topic: string;
  summary: string;
  sources: Source[];
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
  createdAt: string;
  isLiked: boolean;
}

const Feed = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for feed summaries
  const [feedSummaries, setFeedSummaries] = useState<FeedSummary[]>([
    {
      id: "1",
      topic: "The Future of AI in Healthcare",
      summary: "Artificial intelligence is revolutionizing healthcare by improving diagnosis accuracy, streamlining administrative tasks, and personalizing treatment plans. Machine learning algorithms can now predict patient outcomes with increasing accuracy, helping doctors make better decisions.\n\nRecent applications include AI-powered medical imaging that can detect cancers earlier than human radiologists, chatbots that provide initial patient screening, and predictive analytics that identify high-risk patients before their conditions worsen.\n\nEthical considerations remain important as the technology advances, with experts calling for transparent AI systems and careful human oversight.",
      sources: [
        {
          title: "AI Revolution in Modern Healthcare",
          url: "https://example.com/ai-healthcare-1",
          website: "Medical Technology Today"
        },
        {
          title: "Machine Learning Applications in Clinical Settings",
          url: "https://example.com/ai-healthcare-2",
          website: "Journal of Digital Health"
        }
      ],
      user: {
        name: "Dr. Sarah Chen",
        avatar: "SC"
      },
      likes: 128,
      createdAt: "2025-04-10",
      isLiked: false
    },
    {
      id: "2",
      topic: "Sustainable Urban Planning",
      summary: "Cities around the world are adopting sustainable urban planning principles to combat climate change and improve quality of life. Green infrastructure, energy-efficient buildings, and smart transportation systems are becoming standard features in forward-thinking urban centers.\n\nSuccessful case studies include Barcelona's superblocks that prioritize pedestrians over cars, Singapore's vertical gardens that cool buildings naturally, and Copenhagen's comprehensive bicycle infrastructure.\n\nUrban planners are increasingly focused on creating '15-minute cities' where residents can access essential services within a short walk or bike ride, reducing carbon emissions and fostering stronger communities.",
      sources: [
        {
          title: "Reimagining Urban Spaces for Sustainability",
          url: "https://example.com/urban-planning-1",
          website: "Urban Design Quarterly"
        },
        {
          title: "The Rise of Smart, Green Cities",
          url: "https://example.com/urban-planning-2",
          website: "Environmental Science Journal"
        }
      ],
      user: {
        name: "Marco Rossi",
        avatar: "MR"
      },
      likes: 84,
      createdAt: "2025-04-12",
      isLiked: true
    },
    {
      id: "3",
      topic: "Modern JavaScript Development",
      summary: "JavaScript development has evolved dramatically in recent years with the proliferation of frameworks, build tools, and new language features. React, Vue, and Angular continue to dominate the frontend landscape, while Node.js remains the go-to for server-side JavaScript.\n\nModern JavaScript developers now rely on TypeScript for type safety, ESLint for code quality, and package managers like npm and Yarn for dependency management. WebAssembly is opening new performance frontiers, allowing JavaScript applications to run at near-native speeds.\n\nThe trend toward micro-frontends and server components reflects the industry's ongoing search for the right balance of performance, developer experience, and maintainability.",
      sources: [
        {
          title: "State of JavaScript 2025",
          url: "https://example.com/js-dev-1",
          website: "JavaScript Chronicles"
        },
        {
          title: "Frontend Architecture Trends",
          url: "https://example.com/js-dev-2",
          website: "Web Developer Magazine"
        }
      ],
      user: {
        name: "Aisha Johnson",
        avatar: "AJ"
      },
      likes: 156,
      createdAt: "2025-04-08",
      isLiked: false
    }
  ]);

  const handleLike = (summaryId: string) => {
    if (!isAuthenticated) {
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
      return;
    }

    setFeedSummaries(prevSummaries => 
      prevSummaries.map(summary => {
        if (summary.id === summaryId) {
          const newIsLiked = !summary.isLiked;
          return {
            ...summary,
            isLiked: newIsLiked,
            likes: newIsLiked ? summary.likes + 1 : summary.likes - 1
          };
        }
        return summary;
      })
    );

    toast({
      title: "Success",
      description: "Your like has been recorded",
    });
  };

  const filteredSummaries = feedSummaries.filter(summary => 
    summary.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
    summary.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (activeTab === "trending") {
      return b.likes - a.likes;
    } else if (activeTab === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="summary-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0 text-gradient">Community Feed</h1>
        <div className="hidden sm:flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/")}
            className="card-hover"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Create Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Discover Summaries</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>
              <CardDescription>
                Explore summaries shared by our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="trending" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Recent
                  </TabsTrigger>
                  {isAuthenticated && (
                    <TabsTrigger value="following" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Following
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="trending">
                  {sortedSummaries.length > 0 ? (
                    <div className="space-y-4">
                      {sortedSummaries.map((summary) => (
                        <UserSummaryCard 
                          key={summary.id}
                          summary={summary}
                          onLike={() => handleLike(summary.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </TabsContent>
                
                <TabsContent value="recent">
                  {sortedSummaries.length > 0 ? (
                    <div className="space-y-4">
                      {sortedSummaries.map((summary) => (
                        <UserSummaryCard 
                          key={summary.id}
                          summary={summary}
                          onLike={() => handleLike(summary.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </TabsContent>
                
                <TabsContent value="following">
                  <EmptyState message="You haven't followed anyone yet. Discover and follow users to see their summaries here." />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="hidden md:block">
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Technology
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #AI
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Science
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Business
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Health
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Environment
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Programming
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #Design
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      SC
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dr. Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">42 summaries</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Follow</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      MR
                    </div>
                    <div>
                      <p className="text-sm font-medium">Marco Rossi</p>
                      <p className="text-xs text-muted-foreground">36 summaries</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Follow</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      AJ
                    </div>
                    <div>
                      <p className="text-sm font-medium">Aisha Johnson</p>
                      <p className="text-xs text-muted-foreground">29 summaries</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Follow</Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Contributors</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying a user's summary
const UserSummaryCard = ({ summary, onLike }: { summary: FeedSummary, onLike: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="card-hover animate-fade-in overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
              {summary.user.avatar}
            </div>
            <div>
              <CardTitle className="text-base">{summary.user.name}</CardTitle>
              <CardDescription className="text-xs">
                Shared on {new Date(summary.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
            {summary.sources.length} {summary.sources.length === 1 ? 'source' : 'sources'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        <h3 className="font-semibold text-lg mb-2">{summary.topic}</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {expanded ? (
            <p>{summary.summary}</p>
          ) : (
            <p>
              {summary.summary.length > 180 
                ? `${summary.summary.substring(0, 180)}...` 
                : summary.summary}
            </p>
          )}
        </div>
        
        {summary.summary.length > 180 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-primary text-xs"
          >
            {expanded ? "Show less" : "Read more"}
          </Button>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <ExternalLink className="mr-2 h-3 w-3" /> Sources
          </h4>
          <div className="space-y-1">
            {summary.sources.map((source, idx) => (
              <div key={idx} className="text-xs text-muted-foreground flex items-center">
                <span className="truncate">{source.website}</span>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-primary hover:underline inline-flex items-center"
                >
                  View <ExternalLink className="h-2 w-2 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLike}
            className={`flex items-center gap-1 ${summary.isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${summary.isLiked ? 'fill-red-500' : ''}`} />
            <span>{summary.likes}</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Share
            </Button>
            <Button variant="outline" size="sm">
              Save
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({ message }: { message?: string }) => (
  <div className="text-center py-12">
    <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Coffee className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium">Nothing to see here yet</h3>
    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
      {message || "Be the first to share a summary with the community. Create and share your own summaries to get started."}
    </p>
    <Button 
      variant="outline" 
      className="mt-4"
      onClick={() => window.location.href = '/'}
    >
      Create a Summary
    </Button>
  </div>
);

export default Feed;
