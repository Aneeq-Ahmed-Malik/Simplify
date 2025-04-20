import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/utils/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Lock, ShieldCheck, CheckCircle, LayoutGrid } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // useEffect(() => {
  //   // Redirect if already authenticated
  //   if (isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    toast({
      title: "Login Successful",
      description: "Welcome back! You are now logged in.",
    });
    // Navigate to home after a short delay to show toast
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleDemoLogin = async (type: "basic" | "premium") => {
    try {
      const email = type === "basic" ? "demo@example.com" : "premiumdemo@example.com";
      const password = "demopassword123";
      await login(email, password);
      handleLoginSuccess();
    } catch (error) {
      toast({
        title: "Demo Login Failed",
        description: error.message || "Could not log in as demo user.",
        variant: "destructive",
      });
    }
  };

  const features = [
    { icon: FileText, title: "Create Summaries", description: "Generate concise summaries from multiple sources" },
    { icon: LayoutGrid, title: "Community Feed", description: "Discover summaries shared by others" },
    { icon: ShieldCheck, title: "Secure Storage", description: "All your summaries are safely stored" },
    { icon: CheckCircle, title: "Premium Features", description: "Access advanced tools and analytics" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-secondary/5">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gradient">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Log in to your account to access your summaries and personalized features
            </p>
          </div>
          
          <div className="hidden md:block space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border animate-fade-in card-hover" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Privacy Focused</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                We respect your privacy and ensure your data is handled with care. Your summaries are only visible to you unless you choose to share them.
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 max-w-md">
          <Card className="w-full shadow-lg border-primary/10 animate-fade-in">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="demo">Demo Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <AuthForm type="login" onSuccess={handleLoginSuccess} />
                </TabsContent>
                
                <TabsContent value="demo">
                  <div className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-lg text-center">
                      <p className="text-sm">Try our platform instantly with a demo account</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDemoLogin("basic")}
                          className="border rounded p-2 text-center hover:bg-secondary/30 cursor-pointer"
                        >
                          <p className="font-medium">Demo User</p>
                          <p className="text-xs text-muted-foreground">Basic features</p>
                        </button>
                        <button
                          onClick={() => handleDemoLogin("premium")}
                          className="border rounded p-2 text-center hover:bg-secondary/30 cursor-pointer"
                        >
                          <p className="font-medium">Premium Demo</p>
                          <p className="text-xs text-muted-foreground">All features</p>
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground text-center mt-2">
                        Demo accounts reset after 24 hours
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="relative my-4">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-xs text-muted-foreground">OR</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-2 rounded-md border p-2 text-sm hover:bg-secondary/30">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 rounded-md border p-2 text-sm hover:bg-secondary/30">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-3.616 1.75-3.616 5.35-.428 7.14z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Continue as guest
              </Link>
            </CardFooter>
          </Card>
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            By logging in, you agree to our
            <Link to="#" className="text-primary hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="#" className="text-primary hover:underline ml-1">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;