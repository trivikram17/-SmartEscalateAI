import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulate API call
    setTimeout(() => {
      // Get users database from localStorage
      const usersData = localStorage.getItem("usersDB");
      const users = usersData ? JSON.parse(usersData) : {};
      
      // Check if user exists
      if (users[email]) {
        const user = users[email];
        
        // Check password (in real app, this would be hashed)
        if (user.password === password) {
          // Store auth token and current user info
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userName", user.name);
          localStorage.setItem("userEmail", email);
          
          toast({
            title: "Login successful!",
            description: `Welcome back, ${user.name}!`,
          });

          setIsLoading(false);
          navigate("/");
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      } else {
        toast({
          title: "Login failed",
          description: "No account found with this email. Please sign up.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulate API call
    setTimeout(() => {
      // Get users database from localStorage
      const usersData = localStorage.getItem("usersDB");
      const users = usersData ? JSON.parse(usersData) : {};
      
      // Check if user already exists
      if (users[email]) {
        toast({
          title: "Sign up failed",
          description: "An account with this email already exists. Please login.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Create new user
      users[email] = {
        name: name,
        password: password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem("usersDB", JSON.stringify(users));
      
      // Store auth token and current user info
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      
      toast({
        title: "Account created!",
        description: `Welcome, ${name}! Your account has been created successfully.`,
      });

      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleSkipLogin = () => {
    // Skip authentication and continue as guest (can browse, but can't chat)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", "Guest User");
    localStorage.setItem("userEmail", "guest@smartescalate.ai");
    
    toast({
      title: "Welcome Guest!",
      description: "You can browse the site. Login required to chat.",
    });
    
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Smart Escalate AI</CardTitle>
            <CardDescription>Intelligent Support System</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSkipLogin}
            type="button"
          >
            Continue as Guest
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
