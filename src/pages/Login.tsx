import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [resetStep, setResetStep] = useState<"email" | "code" | "password">("email");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Reset all user data (for testing/demo purposes)
  const resetAllUserData = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("usersDB");
    
    // Keep theme preference
    const theme = localStorage.getItem("theme");
    
    toast({
      title: "System Reset Complete",
      description: "All user accounts have been cleared. Everyone must register as new users.",
      duration: 3000,
    });
  };

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

  const handleForgotPassword = async () => {
    setIsLoading(true);
    
    // Check if user exists
    const usersData = localStorage.getItem("usersDB");
    const users = usersData ? JSON.parse(usersData) : {};
    
    if (!users[resetEmail]) {
      toast({
        title: "User not found",
        description: "No account found with this email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    try {
      // Send reset code via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          to_email: resetEmail,
          from_name: "Smart Escalate AI",
          from_email: "noreply@smartescalate.ai",
          reply_to: "support@smartescalate.ai",
          ticket_number: `RESET-${code}`,
          subject: "Password Reset Code",
          priority: "NORMAL",
          category: "Password Reset",
          company: "Smart Escalate AI",
          chat_summary: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #2563eb;">Password Reset Request</h2>
              <p>You have requested to reset your password.</p>
              <p>Your reset code is:</p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #1e40af; margin: 20px 0;">
                ${code}
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          `,
          created_at: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );
      
      toast({
        title: "Reset code sent!",
        description: "Check your email for the 6-digit reset code.",
      });
      
      setResetStep("code");
    } catch (error) {
      console.error("Failed to send reset email:", error);
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleVerifyCode = () => {
    if (resetCode === generatedCode) {
      setResetStep("password");
      toast({
        title: "Code verified!",
        description: "Now set your new password.",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "The reset code you entered is incorrect.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    
    // Update password in localStorage
    const usersData = localStorage.getItem("usersDB");
    const users = usersData ? JSON.parse(usersData) : {};
    
    users[resetEmail].password = newPassword;
    localStorage.setItem("usersDB", JSON.stringify(users));
    
    toast({
      title: "Password reset successful!",
      description: "You can now login with your new password.",
    });
    
    // Reset dialog
    setShowForgotPassword(false);
    setResetStep("email");
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
    setGeneratedCode("");
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
          {/* Temporary Reset Button for Demo */}
          <div className="mb-4 text-center">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={resetAllUserData}
              className="text-xs"
            >
              🗑️ Clear All Data
            </Button>
          </div>
          
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
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

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {resetStep === "email" && "Enter your email to receive a reset code"}
              {resetStep === "code" && "Enter the 6-digit code sent to your email"}
              {resetStep === "password" && "Enter your new password"}
            </DialogDescription>
          </DialogHeader>

          {resetStep === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleForgotPassword} disabled={isLoading || !resetEmail}>
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </DialogFooter>
            </div>
          )}

          {resetStep === "code" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code">6-Digit Code</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setResetStep("email")}>
                  Back
                </Button>
                <Button onClick={handleVerifyCode} disabled={resetCode.length !== 6}>
                  Verify Code
                </Button>
              </DialogFooter>
            </div>
          )}

          {resetStep === "password" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleResetPassword} disabled={newPassword.length < 6}>
                  Reset Password
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
