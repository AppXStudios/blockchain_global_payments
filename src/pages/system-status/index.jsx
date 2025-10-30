import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import StatusOverview from './components/StatusOverview';
import ServiceComponents from './components/ServiceComponents';
import UptimeChart from './components/UptimeChart';
import IncidentHistory from './components/IncidentHistory';
import StatusSubscription from './components/StatusSubscription';

const SystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    uptime: 99.98,
    responseTime: 145,
    incidentsResolved: 12
  });

  const [services] = useState([
    {
      id: 1,
      name: "Payment Processing API",
      description: "Core payment processing and transaction handling",
      status: "operational",
      icon: "CreditCard",
      responseTime: 120
    },
    {
      id: 2,
      name: "NOWPayments Integration",
      description: "Third-party crypto payment gateway connectivity",
      status: "operational",
      icon: "Link",
      responseTime: 180
    },
    {
      id: 3,
      name: "Webhook Delivery",
      description: "Real-time event notifications and callbacks",
      status: "operational",
      icon: "Webhook",
      responseTime: 95
    },
    {
      id: 4,
      name: "Dashboard & UI",
      description: "Merchant dashboard and user interface",
      status: "operational",
      icon: "Monitor",
      responseTime: 85
    },
    {
      id: 5,
      name: "Database Cluster",
      description: "Primary and replica database instances",
      status: "operational",
      icon: "Database",
      responseTime: 45
    },
    {
      id: 6,
      name: "Authentication Service",
      description: "User login and session management",
      status: "operational",
      icon: "Shield",
      responseTime: 110
    },
    {
      id: 7,
      name: "File Storage",
      description: "Document and media file storage system",
      status: "operational",
      icon: "HardDrive",
      responseTime: 200
    },
    {
      id: 8,
      name: "Email Notifications",
      description: "Transactional email delivery service",
      status: "operational",
      icon: "Mail",
      responseTime: 250
    }
  ]);

  const [uptimeData] = useState([
    { date: "Oct 1", uptime: 99.95 },
    { date: "Oct 3", uptime: 99.98 },
    { date: "Oct 5", uptime: 99.97 },
    { date: "Oct 7", uptime: 99.99 },
    { date: "Oct 9", uptime: 99.96 },
    { date: "Oct 11", uptime: 99.98 },
    { date: "Oct 13", uptime: 99.99 },
    { date: "Oct 15", uptime: 99.97 },
    { date: "Oct 17", uptime: 99.98 },
    { date: "Oct 19", uptime: 99.99 },
    { date: "Oct 21", uptime: 99.98 },
    { date: "Oct 23", uptime: 99.97 },
    { date: "Oct 25", uptime: 99.99 },
    { date: "Oct 27", uptime: 99.98 },
    { date: "Oct 29", uptime: 99.98 }
  ]);

  const [incidents] = useState([
    {
      id: 1,
      title: "Intermittent Payment Processing Delays",
      summary: "Some payment transactions experienced processing delays of 2-5 minutes during peak hours.",
      severity: "minor",
      status: "resolved",
      date: "Oct 25, 2024",
      duration: 45,
      affectedServices: ["Payment Processing API"],
      timeline: [
        {
          time: "14:30 UTC",
          description: "Increased response times detected in payment processing API"
        },
        {
          time: "14:35 UTC",
          description: "Investigation started - identified database query optimization needed"
        },
        {
          time: "14:50 UTC",
          description: "Database optimization deployed to production"
        },
        {
          time: "15:15 UTC",
          description: "Response times normalized - monitoring for stability"
        }
      ],
      postmortem: "The issue was caused by inefficient database queries during high transaction volumes. We've implemented query optimization and added additional monitoring to prevent similar issues."
    },
    {
      id: 2,
      title: "Scheduled Database Maintenance",
      summary: "Planned maintenance window for database cluster upgrades and performance improvements.",
      severity: "minor",
      status: "resolved",
      date: "Oct 20, 2024",
      duration: 120,
      affectedServices: ["Database Cluster", "Payment Processing API"],
      timeline: [
        {
          time: "02:00 UTC",
          description: "Maintenance window started - traffic redirected to backup systems"
        },
        {
          time: "02:30 UTC",
          description: "Primary database cluster upgrade in progress"
        },
        {
          time: "03:45 UTC",
          description: "Database optimization and indexing completed"
        },
        {
          time: "04:00 UTC",
          description: "All systems restored to normal operation"
        }
      ],
      postmortem: "Scheduled maintenance completed successfully with improved database performance and enhanced monitoring capabilities."
    }
  ]);

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update timestamp for real-time feel
      setSystemStatus(prev => ({
        ...prev,
        // Simulate minor fluctuations in response time
        responseTime: Math.floor(Math.random() * 20) + 135
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>System Status - Blockchain Global Payments</title>
        <meta name="description" content="Real-time system status and operational transparency for Blockchain Global Payments infrastructure. Monitor uptime, incidents, and service health." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                System Status
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time operational transparency for our crypto payment infrastructure. 
                Monitor system health, uptime metrics, and incident reports.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Status Overview */}
            <StatusOverview systemStatus={systemStatus} />

            {/* Service Components and Uptime Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ServiceComponents services={services} />
              <UptimeChart uptimeData={uptimeData} />
            </div>

            {/* Incident History and Subscription */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <IncidentHistory incidents={incidents} />
              </div>
              <div>
                <StatusSubscription />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-border bg-card/30 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                Status page automatically refreshes every 30 seconds. 
                For immediate assistance, contact our support team.
              </p>
              <p>
                All times displayed in UTC. Historical data retained for 90 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemStatus;