import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Camera, Search, Bell, Shield, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">SocialWatch</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="btn-primary"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Monitor Social Media
            <span className="text-primary block">Like Never Before</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Capture, archive, and search social media content with high-fidelity screenshots. 
            Never miss important posts - even if they're deleted.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="btn-primary text-lg px-8 py-4"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to monitor social media
            </h2>
            <p className="text-xl text-slate-600">
              Professional-grade tools for researchers, brands, and journalists
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Camera className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Continuous Capture</CardTitle>
                <CardDescription>
                  High-fidelity screenshots every 10-15 seconds across all major platforms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Full-Text Search</CardTitle>
                <CardDescription>
                  Search through all captured content with powerful text extraction and OCR
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Smart Alerts</CardTitle>
                <CardDescription>
                  Get notified when new content is posted or when reconnection is needed
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Secure Storage</CardTitle>
                <CardDescription>
                  Enterprise-grade security with configurable retention policies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Multi-Platform</CardTitle>
                <CardDescription>
                  Monitor Twitter, Instagram, TikTok, Facebook, LinkedIn, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Never Miss Content</CardTitle>
                <CardDescription>
                  Capture everything - even content that gets deleted or modified
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Choose your plan
            </h2>
            <p className="text-xl text-slate-600">
              Start free, upgrade as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Free
                  <Badge variant="secondary">$0</Badge>
                </CardTitle>
                <CardDescription>Perfect for trying out SocialWatch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• 1 platform</li>
                  <li>• 1 profile monitored</li>
                  <li>• 6 months storage</li>
                  <li>• Basic search</li>
                  <li>• Summary notifications</li>
                </ul>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pro
                  <Badge>$29/mo</Badge>
                </CardTitle>
                <CardDescription>Most popular for professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• 3 platforms</li>
                  <li>• 10 profiles monitored</li>
                  <li>• 3 years storage</li>
                  <li>• Full search features</li>
                  <li>• Authenticated monitoring</li>
                </ul>
                <Button 
                  className="w-full btn-primary"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Premium
                  <Badge variant="secondary">$99/mo</Badge>
                </CardTitle>
                <CardDescription>For teams and enterprises</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• 6 platforms</li>
                  <li>• 50 profiles monitored</li>
                  <li>• 5+ years storage</li>
                  <li>• Real-time notifications</li>
                  <li>• BYO S3 support</li>
                </ul>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">SocialWatch</h1>
          </div>
          <p className="text-center text-slate-400">
            © 2025 SocialWatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
