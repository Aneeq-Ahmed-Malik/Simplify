import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/utils/auth";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, Gift, Star, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated (e.g., on page load)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle successful registration
  const handleRegisterSuccess = () => {
    toast({
      title: "Registration Successful",
      description: "Your account has been created! Please log in to continue.",
    });
    // Navigate to login after a delay to show toast
   
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-secondary/5">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gradient">Join Our Community</h1>
            <p className="text-muted-foreground">
              Create an account to start summarizing content, sharing with others, and growing your knowledge
            </p>
          </div>
          
          <div className="hidden md:block space-y-6">
            <div className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-5 card-hover animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Benefits of Joining</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Create unlimited summaries from top blogs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Save and organize your summary history</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Share summaries with the community</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access audio versions of your summaries</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg border border-primary/20 p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Featured Reviews</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-background/40 p-3 rounded-md">
                    <div className="flex items-center">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium ml-2">Alex P.</span>
                    </div>
                    <p className="text-sm mt-1">
                      "This tool has completely transformed how I keep up with industry news. The summaries are accurate and save me hours each week."
                    </p>
                  </div>
                  <div className="bg-background/40 p-3 rounded-md">
                    <div className="flex items-center">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium ml-2">Maria T.</span>
                    </div>
                    <p className="text-sm mt-1">
                      "The audio feature lets me listen to summaries while commuting. Great for busy professionals!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 max-w-md">
          <Card className="w-full shadow-lg border-primary/10 animate-fade-in">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm type="register" onSuccess={handleRegisterSuccess} />
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-xs text-muted-foreground">OR SIGN UP WITH</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
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
          
          <div className="flex items-center justify-center space-x-2 mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-muted-foreground">
              Secure, encrypted registration process
            </span>
          </div>
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            By creating an account, you agree to our
            <Link to="#" className="text-primary hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="#" className="text-primary hover:underline ml-1">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;