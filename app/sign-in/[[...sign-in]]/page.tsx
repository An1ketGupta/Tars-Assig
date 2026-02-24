import { SignIn } from "@clerk/nextjs";
import { MessageSquare, Sparkles, Zap, Shield, Users } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-2xl" />
        <div className="relative z-10 text-center space-y-8 max-w-sm">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 mx-auto glow-primary">
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-gradient">Tars Chat</h1>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              Real-time messaging with a seamless experience.
              Connect, collaborate, and communicate instantly.
            </p>
          </div>
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs font-semibold text-foreground">Real-time</div>
              <div className="text-[10px] text-muted-foreground">instant sync</div>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs font-semibold text-foreground">Secure</div>
              <div className="text-[10px] text-muted-foreground">end-to-end auth</div>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-xs font-semibold text-foreground">Groups</div>
              <div className="text-[10px] text-muted-foreground">team chats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 gap-6">
        <div className="flex lg:hidden items-center gap-2.5 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground glow-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gradient">Tars Chat</span>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
