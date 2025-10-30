# Blockchain Global Payments (BGP) Platform

> **Enterprise Crypto Payment Infrastructure** - Complete white-label solution powered by Next.js 14, Supabase, and secure NOWPayments integration.

![BGP Logo](public/favicon.ico)

## 🌟 Overview

Blockchain Global Payments provides a complete cryptocurrency payment processing platform with enterprise-grade features, real-time transaction monitoring, and seamless merchant integration. Built with modern web technologies and 100% white-labeled for maximum brand control.

### ✨ Key Features

- **🔐 Enterprise Security** - Multi-layer security with API key management, IP allowlisting, and HMAC verification
- **⚡ Real-time Processing** - Live payment tracking with instant status updates via webhooks
- **💳 Multi-Currency Support** - Support for 100+ cryptocurrencies and fiat currencies
- **📊 Advanced Analytics** - Comprehensive reporting and transaction analytics
- **🎨 White-Label Ready** - Complete brand customization with zero third-party branding
- **🔗 Easy Integration** - RESTful APIs with comprehensive documentation
- **📱 Responsive Design** - Mobile-optimized interface built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- NOWPayments account (for backend integration)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/blockchain-global-payments.git
cd blockchain-global-payments

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
pnpm db:setup

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the BGP platform.

## 🛠️ Configuration

### Environment Setup

Create a `.env` file with the following configuration:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# BGP Platform
VITE_BGP_APP_URL=https://blockchainglobalpayments.com
VITE_BGP_API_URL=https://api.blockchainglobalpayments.com

# NOWPayments Integration (Server-Only)
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret
BGP_SIGNING_SECRET=your_bgp_signing_secret

# Optional Services
RESEND_API_KEY=your_resend_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Database Setup

```bash
# Run Supabase migrations
pnpm db:migrate

# Seed with sample data (development)
pnpm db:seed

# Reset database (caution: deletes all data)
pnpm db:reset
```

## 📖 Documentation

### API Reference

The BGP platform provides RESTful APIs for merchant integration:

#### Create Payment
```bash
curl -X POST "https://api.blockchainglobalpayments.com/api/merchant/payments" \
  -H "x-merchant-key: bgp_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amountFiat": 100.00,
    "currencyFiat": "USD",
    "payCurrency": "BTC",
    "description": "Order #12345"
  }'
```

#### Get Payment Status
```bash
curl -X GET "https://api.blockchainglobalpayments.com/api/merchant/payments/PAYMENT_ID" \
  -H "x-merchant-key: bgp_live_YOUR_API_KEY"
```

### Webhook Integration

BGP sends webhooks for payment status updates:

```javascript
// Webhook payload example
{
  "event": "payment.completed",
  "payment": {
    "id": "bgp_1234567890",
    "amount": 100.00,
    "currency": "USD",
    "status": "completed",
    "created_at": "2024-10-29T10:30:00Z"
  },
  "timestamp": "2024-10-29T10:30:05Z"
}
```

Verify webhook signatures using the `X-BGP-Signature` header with HMAC-SHA512.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Real-time)
- **Payment Processing**: NOWPayments (Server-side integration)
- **Storage**: Vercel Blob
- **Email**: Resend
- **Deployment**: Vercel

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── services/           # API service layers
├── lib/               # Utilities and configurations
│   ├── supabase.js    # Supabase client
│   └── nowpayments/   # NOWPayments integration (server-only)
├── contexts/          # React contexts
├── styles/           # Global styles
└── utils/            # Helper functions

supabase/
├── migrations/       # Database migrations
└── seed.sql         # Sample data
```

### Security Features

- **🔐 API Key Authentication** - Secure HMAC-based API key system
- **🛡️ IP Allowlisting** - Restrict API access by IP address
- **🔍 Rate Limiting** - Configurable request rate limiting
- **✅ HMAC Verification** - Webhook signature verification
- **🚫 Browser Guards** - Server-side only code protection
- **🔒 Row Level Security** - Database-level access control

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
pnpm test:integration
```

### Brand Audit
```bash
# Ensure no NOWPayments branding in public code
pnpm audit:brand
```

### End-to-End Testing
```bash
pnpm test:e2e
```

## 📊 Monitoring & Analytics

### Payment Analytics
- Real-time transaction monitoring
- Revenue tracking and reporting
- Conversion rate analytics
- Currency performance metrics

### System Monitoring
- API endpoint health checks
- Database connection monitoring
- Webhook delivery tracking
- Error rate monitoring

### Security Auditing
- Failed authentication attempts
- Suspicious activity detection
- Rate limit violations
- IP allowlist enforcement

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
```bash
# Set production environment variables
VITE_BGP_APP_URL=https://blockchainglobalpayments.com
NOWPAYMENTS_API_KEY=your_production_api_key
# ... other production variables
```

2. **Database Migration**
```bash
pnpm db:migrate:production
```

3. **Deploy to Vercel**
```bash
pnpm build
vercel deploy --prod
```

4. **Configure NOWPayments**
   - Set IPN callback URL: `https://blockchainglobalpayments.com/api/np/ipn`
   - Configure your IPN secret in environment variables

### Health Checks

- **API Health**: `GET /api/health`
- **Database Health**: `GET /api/health/database`
- **External Services**: `GET /api/health/services`

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm lint         # Lint code
pnpm format       # Format code
pnpm audit:brand  # Check for brand compliance
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
```

### Code Style

- **ESLint** for code quality
- **Prettier** for code formatting  
- **Conventional Commits** for commit messages
- **Husky** for git hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code patterns
- Write tests for new features
- Update documentation as needed
- Run brand audit before committing: `pnpm audit:brand`
- Ensure all tests pass: `pnpm test`

## 📋 White-Label Compliance

This platform maintains strict white-label compliance:

- ✅ **Zero NOWPayments branding** in public-facing code
- ✅ **BGP branding only** in UI, documentation, and emails
- ✅ **Server-side integration** with NOWPayments hidden from clients
- ✅ **Automated brand auditing** to prevent compliance violations

Run `pnpm audit:brand` to verify compliance.

## 📞 Support

- **Documentation**: [docs.blockchainglobalpayments.com](https://docs.blockchainglobalpayments.com)
- **Support Email**: support@blockchainglobalpayments.com
- **Status Page**: [status.blockchainglobalpayments.com](https://status.blockchainglobalpayments.com)
- **API Reference**: [docs.blockchainglobalpayments.com/api](https://docs.blockchainglobalpayments.com/api)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Database and auth powered by [Supabase](https://supabase.com/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Blockchain Global Payments** - Enterprise crypto payment infrastructure that scales with your business.

For more information, visit [blockchainglobalpayments.com](https://blockchainglobalpayments.com)