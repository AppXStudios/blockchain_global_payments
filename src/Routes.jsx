import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Layout from "components/ui/Layout";
import NotFound from "pages/NotFound";
import Authentication from './pages/authentication';
import InvoiceCreation from './pages/invoice-creation';
import HostedCheckout from './pages/hosted-checkout';
import WebhookManagement from './pages/webhook-management';
import DashboardOverview from './pages/dashboard-overview';
import SystemStatus from './pages/system-status';
import PricingPage from './pages/pricing';
import PaymentsManagement from './pages/payments-management';
import Documentation from './pages/documentation';
import ApiKeysManagement from './pages/api-keys-management';
import ContactPage from './pages/contact';
import HomePage from './pages/home';
import MerchantOnboarding from './pages/merchant-onboarding';
import MerchantSettings from './pages/merchant-settings';
import PayoutManagement from './pages/payout-management';
import ConversionsManagement from './pages/conversions-management';
import SubscriptionManagement from './pages/subscription-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Layout>
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="/invoice-creation" element={<InvoiceCreation />} />
            <Route path="/hosted-checkout" element={<HostedCheckout />} />
            <Route path="/webhook-management" element={<WebhookManagement />} />
            <Route path="/dashboard-overview" element={<DashboardOverview />} />
            <Route path="/system-status" element={<SystemStatus />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payments-management" element={<PaymentsManagement />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/api-keys-management" element={<ApiKeysManagement />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/merchant-onboarding" element={<MerchantOnboarding />} />
            <Route path="/merchant-settings" element={<MerchantSettings />} />
            <Route path="/payout-management" element={<PayoutManagement />} />
            <Route path="/conversions-management" element={<ConversionsManagement />} />
            <Route path="/subscription-management" element={<SubscriptionManagement />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;