import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, Database, Code, Lock, Layers, Server, Smartphone, BarChart3, CheckCircle, Star, ArrowRight, PlayCircle, Users, Coins, Wallet, CreditCard, TrendingUp, Bell, Eye, GitBranch, Cpu, Monitor, FileCode, Gauge, Rocket, Sparkles, Target, Workflow } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BGPArchitecturePage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    transactions: 0,
    uptime: 0,
    security: 0
  });

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedNumbers(prev => ({
        users: prev?.users < 50000 ? prev?.users + 1000 : 50000,
        transactions: prev?.transactions < 1000000 ? prev?.transactions + 20000 : 1000000,
        uptime: prev?.uptime < 99.9 ? Math.min(99.9, prev?.uptime + 0.1) : 99.9,
        security: prev?.security < 100 ? prev?.security + 2 : 100
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Architecture components data
  const architectureComponents = [
    {
      id: 'frontend',
      title: 'Frontend Layer',
      icon: <Monitor className="w-8 h-8" />,
      color: 'from-violet-500 to-purple-600',
      components: [
        'Next.js 14 App Router',
        'React 18+ Functional Components',
        'TypeScript for Type Safety',
        'Tailwind CSS + Shadcn/UI',
        'Framer Motion Animations',
        'Responsive Design',
        'PWA Support',
        'Real-time Updates'
      ]
    },
    {
      id: 'backend',
      title: 'Backend Services',
      icon: <Server className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      components: [
        'Supabase PostgreSQL',
        'Row Level Security (RLS)',
        'Real-time Subscriptions',
        'Edge Functions',
        'Database Triggers',
        'CRUD Operations',
        'Transaction Management',
        'Data Validation'
      ]
    },
    {
      id: 'auth',
      title: 'Authentication',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      components: [
        'Supabase Auth',
        'Email/Password Auth',
        'Magic Links',
        'OAuth Providers',
        'JWT Tokens',
        'Session Management',
        'Role-based Access',
        'Multi-factor Auth'
      ]
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      components: [
        'NOWPayments Integration',
        'Multi-cryptocurrency Support',
        'HMAC Signature Verification',
        'Webhook Processing',
        'Payment Status Tracking',
        'Batch Payouts',
        'Rate Limiting',
        'IP Whitelisting'
      ]
    },
    {
      id: 'storage',
      title: 'File Storage',
      icon: <Database className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-600',
      components: [
        'Vercel Blob Storage',
        'Merchant Logo Uploads',
        'Document Management',
        'Secure File Access',
        'CDN Distribution',
        'Image Optimization',
        'Version Control',
        'Backup Systems'
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Analytics',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-indigo-500 to-blue-600',
      components: [
        'Real-time Dashboards',
        'Performance Metrics',
        'Error Tracking',
        'User Analytics',
        'Payment Analytics',
        'System Health',
        'Uptime Monitoring',
        'Custom Alerts'
      ]
    }
  ];

  // Performance metrics data
  const performanceData = [
    { name: 'Jan', transactions: 45000, revenue: 85000, users: 1200 },
    { name: 'Feb', transactions: 52000, revenue: 92000, users: 1450 },
    { name: 'Mar', transactions: 61000, revenue: 108000, users: 1700 },
    { name: 'Apr', transactions: 58000, revenue: 95000, users: 1650 },
    { name: 'May', transactions: 70000, revenue: 125000, users: 2100 },
    { name: 'Jun', transactions: 85000, revenue: 145000, users: 2400 }
  ];

  const securityMetrics = [
    { name: 'Secure Transactions', value: 99.98, color: '#10b981' },
    { name: 'Uptime', value: 99.95, color: '#3b82f6' },
    { name: 'Response Time', value: 98.5, color: '#8b5cf6' },
    { name: 'Data Integrity', value: 100, color: '#f59e0b' }
  ];

  // Feature highlights
  const keyFeatures = [
    {
      title: 'White-Label Crypto Payments',
      description: 'Complete NOWPayments integration with BGP branding only',
      icon: <Coins className="w-6 h-6" />,
      status: 'Production Ready'
    },
    {
      title: 'Enterprise Dashboard',
      description: 'Comprehensive merchant management with real-time KPIs',
      icon: <Gauge className="w-6 h-6" />,
      status: 'Full Featured'
    },
    {
      title: 'API Key Management',
      description: 'HMAC-secured API keys with IP whitelisting and rate limiting',
      icon: <Lock className="w-6 h-6" />,
      status: 'Bank-Grade Security'
    },
    {
      title: 'Webhook System',
      description: 'Reliable webhook delivery with signature verification',
      icon: <Workflow className="w-6 h-6" />,
      status: 'Enterprise Ready'
    },
    {
      title: 'Hosted Checkout',
      description: 'QR code payments with real-time status tracking',
      icon: <Smartphone className="w-6 h-6" />,
      status: 'Mobile Optimized'
    },
    {
      title: 'Batch Payouts',
      description: '2FA-secured bulk cryptocurrency payouts',
      icon: <Wallet className="w-6 h-6" />,
      status: 'Secure & Fast'
    }
  ];

  // Architecture flow data
  const architectureFlow = [
    {
      step: 1,
      title: 'User Registration',
      description: 'Merchants sign up and complete KYC verification',
      icon: <Users className="w-5 h-5" />
    },
    {
      step: 2,
      title: 'API Integration',
      description: 'Generate secure API keys with IP whitelisting',
      icon: <Code className="w-5 h-5" />
    },
    {
      step: 3,
      title: 'Payment Processing',
      description: 'Accept crypto payments via NOWPayments backend',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      step: 4,
      title: 'Webhook Delivery',
      description: 'Real-time payment status updates with HMAC verification',
      icon: <Bell className="w-5 h-5" />
    },
    {
      step: 5,
      title: 'Dashboard Analytics',
      description: 'Monitor transactions, revenue, and system health',
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-violet-400" />
              <span className="text-sm font-medium">Complete Application Architecture</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent mb-6">
              Blockchain Global Payments
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Enterprise-grade white-label crypto payment infrastructure built with 
              <span className="text-violet-400 font-semibold"> Next.js 14</span>, 
              <span className="text-cyan-400 font-semibold"> Supabase</span>, and 
              <span className="text-emerald-400 font-semibold"> NOWPayments</span>
            </p>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-violet-400">
                {animatedNumbers?.users?.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-400">Active Merchants</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-cyan-400">
                ${animatedNumbers?.transactions?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Monthly Volume</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-emerald-400">
                {animatedNumbers?.uptime}%
              </div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-orange-400">
                {animatedNumbers?.security}%
              </div>
              <div className="text-sm text-gray-400">Security Score</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-semibold text-white hover:shadow-2xl hover:shadow-violet-500/25 transition-all duration-300">
              <div className="flex items-center">
                <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Launch Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button className="group px-8 py-4 border border-gray-600 rounded-2xl font-semibold text-white hover:border-violet-500 transition-all duration-300">
              <div className="flex items-center">
                <PlayCircle className="w-5 h-5 mr-2" />
                View Demo
              </div>
            </button>
          </motion.div>
        </div>
      </section>
      {/* Navigation Tabs */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'overview', label: 'Architecture Overview', icon: <Layers className="w-4 h-4" /> },
              { id: 'components', label: 'System Components', icon: <Cpu className="w-4 h-4" /> },
              { id: 'features', label: 'Key Features', icon: <Star className="w-4 h-4" /> },
              { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
            ]?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveSection(tab?.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeSection === tab?.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab?.icon}
                <span className="ml-2">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Content Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="px-6 mb-20"
        >
          <div className="max-w-7xl mx-auto">
            
            {/* Architecture Overview */}
            {activeSection === 'overview' && (
              <div>
                <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Architecture Overview
                </h2>
                
                {/* Architecture Flow */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center">Payment Processing Flow</h3>
                  <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 -translate-y-1/2" />
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                      {architectureFlow?.map((step, index) => (
                        <motion.div
                          key={step?.step}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-center relative z-10">
                            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              {step?.icon}
                            </div>
                            <div className="text-2xl font-bold text-violet-400 mb-2">{step?.step}</div>
                            <h4 className="font-semibold mb-2">{step?.title}</h4>
                            <p className="text-sm text-gray-400">{step?.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-8">
                    <Monitor className="w-12 h-12 text-violet-400 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Frontend</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Next.js 14 with App Router</li>
                      <li>• React 18+ Functional Components</li>
                      <li>• TypeScript for Type Safety</li>
                      <li>• Tailwind CSS + Shadcn/UI</li>
                      <li>• Framer Motion Animations</li>
                      <li>• Responsive & Mobile-First</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-8">
                    <Database className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Backend</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Supabase PostgreSQL</li>
                      <li>• Row Level Security (RLS)</li>
                      <li>• Real-time Subscriptions</li>
                      <li>• Edge Functions</li>
                      <li>• Database Triggers</li>
                      <li>• CRUD Operations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-2xl p-8">
                    <Shield className="w-12 h-12 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold mb-4">Security</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• HMAC-SHA512 Signatures</li>
                      <li>• JWT Authentication</li>
                      <li>• IP Whitelisting</li>
                      <li>• Rate Limiting</li>
                      <li>• Encryption at Rest</li>
                      <li>• Audit Logging</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* System Components */}
            {activeSection === 'components' && (
              <div>
                <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  System Components
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {architectureComponents?.map((component, index) => (
                    <motion.div
                      key={component?.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${component?.color}/10 border border-gray-700 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300`}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${component?.color} rounded-2xl flex items-center justify-center mb-6 text-white`}>
                        {component?.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4">{component?.title}</h3>
                      <ul className="space-y-2">
                        {component?.components?.map((item, idx) => (
                          <li key={idx} className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {activeSection === 'features' && (
              <div>
                <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {keyFeatures?.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                          {feature?.icon}
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                          {feature?.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature?.title}</h3>
                      <p className="text-gray-400">{feature?.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {activeSection === 'performance' && (
              <div>
                <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Performance Metrics
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {/* Transaction Volume Chart */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Transaction Volume</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <defs>
                            <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="transactions" 
                            stroke="#8b5cf6" 
                            fillOpacity={1} 
                            fill="url(#transactionGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Revenue Growth</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#06b6d4" 
                            strokeWidth={3}
                            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Performance KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6 text-center">
                    <Zap className="w-8 h-8 text-violet-400 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-violet-400 mb-2">&lt; 200ms</div>
                    <div className="text-sm text-gray-400">API Response Time</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-cyan-400 mb-2">99.95%</div>
                    <div className="text-sm text-gray-400">System Uptime</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                    <Target className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-emerald-400 mb-2">10K+</div>
                    <div className="text-sm text-gray-400">TPS Capacity</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-2xl p-6 text-center">
                    <Globe className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-orange-400 mb-2">Global</div>
                    <div className="text-sm text-gray-400">CDN Coverage</div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Features */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Security Architecture
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {/* Security Metrics Chart */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6">Security Metrics</h3>
                    <div className="space-y-6">
                      {securityMetrics?.map((metric, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{metric?.name}</span>
                            <span className="text-sm font-bold" style={{ color: metric?.color }}>
                              {metric?.value}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric?.value}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-2 rounded-full"
                              style={{ backgroundColor: metric?.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-500/10 to-orange-600/10 border border-red-500/20 rounded-2xl p-6">
                      <Shield className="w-8 h-8 text-red-400 mb-4" />
                      <h3 className="text-lg font-bold mb-3">HMAC Signature Verification</h3>
                      <p className="text-gray-400">All webhook payloads are secured with HMAC-SHA512 signatures to ensure data integrity and authenticity.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6">
                      <Lock className="w-8 h-8 text-blue-400 mb-4" />
                      <h3 className="text-lg font-bold mb-3">Row Level Security</h3>
                      <p className="text-gray-400">Database access is protected with RLS policies ensuring users can only access their own data.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-6">
                      <Eye className="w-8 h-8 text-green-400 mb-4" />
                      <h3 className="text-lg font-bold mb-3">Comprehensive Audit Logging</h3>
                      <p className="text-gray-400">All user actions are logged with IP tracking and detailed metadata for compliance and security monitoring.</p>
                    </div>
                  </div>
                </div>

                {/* Security Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">SOC 2 Compliant</h3>
                    <p className="text-sm text-gray-400">Meets industry security standards</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">PCI DSS Ready</h3>
                    <p className="text-sm text-gray-400">Payment card industry compliant</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">End-to-End Encryption</h3>
                    <p className="text-sm text-gray-400">Data encrypted in transit and at rest</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Deployment Ready Banner */}
      <section className="px-6 py-16 bg-gradient-to-r from-violet-900/20 via-transparent to-cyan-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
              <span className="text-sm font-medium">Production Ready</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Deploy to Vercel in{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                One Click
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Complete repository with migrations, seed data, and environment setup. 
              Run <code className="px-2 py-1 bg-gray-800 rounded">pnpm dev</code> and start processing payments immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-semibold text-white hover:shadow-2xl hover:shadow-violet-500/25 transition-all duration-300">
                <div className="flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  Clone Repository
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button className="px-8 py-4 border border-gray-600 rounded-2xl font-semibold text-white hover:border-violet-500 transition-all duration-300">
                <div className="flex items-center">
                  <FileCode className="w-5 h-5 mr-2" />
                  View Documentation
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BGPArchitecturePage;