import { SignUp } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="relative z-10 text-center space-y-6 max-w-sm">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary text-primary-foreground shadow-2xl mx-auto">
            <MessageSquare className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Join Tars Chat</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Create your account and start chatting with your team right away.
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">Free</div>
              <div className="text-xs text-muted-foreground">to get started</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">Fast</div>
              <div className="text-xs text-muted-foreground">setup in seconds</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">Live</div>
              <div className="text-xs text-muted-foreground">real-time data</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 gap-6">
        <div className="flex lg:hidden items-center gap-2 mb-4">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">Tars Chat</span>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
