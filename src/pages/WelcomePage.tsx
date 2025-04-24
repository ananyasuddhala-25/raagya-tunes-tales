
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-background to-blue-500/20" />
      
      {/* Animated circles */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" />
      
      {/* Header */}
      <header className="w-full py-6 px-4 relative z-10">
        <div className="container flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Raagya
          </h1>
          <p className="text-sm text-muted-foreground">Tunes & Tales</p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 container relative z-10 p-6">
        {/* Hero section */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Where Music<br />
            <span className="text-primary">Meets Imagination</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover songs that resonate with your soul and dive into stories they inspire. An immersive experience awaits.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">🎵</span>
              </div>
              <span className="text-sm">Rich Music Library</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">🤖</span>
              </div>
              <span className="text-sm">AI Music Assistant</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl">📖</span>
              </div>
              <span className="text-sm">Story Generator</span>
            </div>
          </motion.div>
        </div>
        
        {/* Login form */}
        <motion.div 
          className="lg:w-1/2 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <LoginForm />
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 text-center text-sm text-muted-foreground relative z-10">
        <p>© 2025 Raagya · Tunes & Tales</p>
      </footer>
    </div>
  );
}
