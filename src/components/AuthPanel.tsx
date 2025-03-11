"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

interface AuthPanelProps {
  trigger?: React.ReactNode;
  onAuthenticated?: () => void;
  callbackURL?: string;
}

export function AuthPanel({ 
  trigger = <Button>Sign In</Button>,
  onAuthenticated,
  callbackURL
}: AuthPanelProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");
  
  // Capture the current path when the component mounts
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  // Use the provided callbackURL or fall back to the current path
  const redirectURL = callbackURL || currentPath || "/";

  return (
    <>
      {/* Trigger button */}
      <div onClick={() => setShowAuth(true)}>
        {trigger}
      </div>

      {/* Pull-up auth panel */}
      <AnimatePresence>
        {showAuth && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowAuth(false)}
            />
            
            {/* Auth panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-xl z-50 max-w-md mx-auto"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
              
              <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SignIn callbackURL={redirectURL} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignUp callbackURL={redirectURL} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 