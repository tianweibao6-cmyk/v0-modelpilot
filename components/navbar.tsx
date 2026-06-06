"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

interface NavbarProps {
  onPurchase: () => void;
}

export function Navbar({ onPurchase }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SigmaPilot</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#upload" className="text-muted-foreground hover:text-foreground transition-colors">
              上传赛题
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              核心功能
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              定价
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button onClick={onPurchase} className="btn-gradient border-0">
              立即解锁
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <a 
                href="#upload" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                上传赛题
              </a>
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                核心功能
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                定价
              </a>
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  onPurchase();
                }}
                className="btn-gradient border-0 w-full"
              >
                立即解锁
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
