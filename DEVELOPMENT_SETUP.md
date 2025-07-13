# Development Setup Guide

## API Connection Issues

If you're getting connection refused errors, it means the frontend can't connect to the backend API.

## Solution 1: Use Production API (Recommended)

The frontend is now configured to use the production API by default:
- **API Base URL**: `https://api.manishbosephotography.com/api`
- **Socket URL**: `https://api.manishbosephotography.com`

This should work immediately without any backend server running locally.

## Solution 2: Local Development Setup

If you want to run a local backend server:

1. **Create `.env.local` file** in the project root:
```bash
# Local Development Environment Variables
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000
```

2. **Update `vite.config.ts`** proxy target:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      timeout: 1800000,
    },
  },
},
```

3. **Start your backend server** on port 3000

## Solution 3: Mixed Development

You can use production API for most features and localhost for specific endpoints:

```bash
# Use production API by default, but allow localhost override
VITE_API_BASE_URL=https://api.manishbosephotography.com/api
VITE_API_URL=https://api.manishbosephotography.com

# Override specific endpoints for local development
VITE_LOCAL_API_URL=http://localhost:3000
```

## Current Configuration

- **Production API**: `https://api.manishbosephotography.com`
- **Vite Proxy**: Points to production API
- **Team Management**: Uses `/api/team` endpoint

## Testing Team Management

1. Start the frontend: `npm run dev`
2. Navigate to: `http://localhost:5173/admin/team`
3. The team management should now work with the production API

## Troubleshooting

- **Connection refused**: Backend server not running or wrong URL
- **CORS errors**: Check if the API allows requests from your domain
- **Authentication errors**: Check if admin tokens are valid 