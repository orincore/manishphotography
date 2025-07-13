# Render.com Deployment Guide

## 🚀 **Optimized Configuration for Render.com**

This project is now fully optimized for Render.com deployment with automatic domain handling.

## 📁 **Configuration Files**

### **render.yaml**
- **Static site configuration**
- **Automatic deployment enabled**
- **Security headers configured**
- **No manual redirects** - Render handles everything

### **static.json**
- **SPA routing support**
- **HTTPS enforcement**
- **Clean URLs**

### **public/_redirects**
- **Minimal SPA routing only**
- **No domain redirects**

### **vite.config.ts**
- **Optimized build configuration**
- **Asset optimization**
- **Code splitting**
- **Production optimizations**

## 🔧 **Render.com Dashboard Setup**

### **1. Service Configuration**
- **Environment:** Static Site
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Auto-Deploy:** Enabled

### **2. Environment Variables**
```
VITE_API_BASE_URL=https://api.manishbosephotography.com/api
VITE_API_URL=https://api.manishbosephotography.com
NODE_ENV=production
```

### **3. Custom Domain Setup**
1. **Go to Settings > Custom Domains**
2. **Add your domain:** `manishbosephotography.com`
3. **Enable SSL** (automatic)
4. **Let Render handle www redirects automatically**

## ✅ **What Render.com Handles Automatically**

- **HTTP to HTTPS redirects**
- **www to non-www redirects**
- **SSL certificate management**
- **CDN and caching**
- **Global edge deployment**
- **Automatic scaling**

## 🎯 **Benefits of This Configuration**

1. **No redirect loops** - Render handles all redirects
2. **Better performance** - Optimized build and caching
3. **Automatic SSL** - No manual certificate management
4. **Global CDN** - Fast loading worldwide
5. **Zero configuration** - Everything works out of the box

## 🚀 **Deployment Steps**

1. **Push code to your repository**
2. **Render automatically deploys**
3. **Add custom domain in Render dashboard**
4. **Update DNS to point to Render**
5. **Done!**

## 🔍 **DNS Configuration**

**Point your domain to Render.com:**
- **A Record:** `@` → Render's IP (provided in dashboard)
- **CNAME:** `@` → `your-service.onrender.com`

**No www records needed** - Render handles this automatically.

## 📊 **Performance Optimizations**

- **Code splitting** for faster initial load
- **Asset optimization** with proper caching
- **Security headers** for better protection
- **Minified production build**
- **No source maps** in production

## 🛡️ **Security Features**

- **HTTPS enforcement**
- **Security headers**
- **XSS protection**
- **Content type protection**
- **Frame protection**

## 🎉 **Result**

Your website will be:
- **Fast and optimized**
- **Secure by default**
- **Automatically scaled**
- **Globally distributed**
- **Zero maintenance**

No manual redirects needed - Render.com handles everything automatically! 