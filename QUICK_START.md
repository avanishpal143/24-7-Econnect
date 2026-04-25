# Quick Start Guide

## 🚀 Run Locally

### Option 1: Python (Recommended)
```bash
cd 24-7-econnect
python3 -m http.server 8000 --directory public
```
Open: http://localhost:8000

### Option 2: Node.js
```bash
npx http-server public -p 8000
```
Open: http://localhost:8000

### Option 3: PHP
```bash
php -S localhost:8000 -t public
```
Open: http://localhost:8000

## 📝 File Organization

### HTML Files
- `public/index.html` - Homepage
- `public/pages/*.html` - Service pages

### CSS Files
- `public/assets/css/site.css` - Main styles
- `public/assets/css/navbar-glassmorphism.css` - Navbar
- `public/assets/css/about-page.css` - About page
- `public/assets/css/pricing-animations.css` - Pricing

### JavaScript Files
- `public/assets/js/site.js` - Main functionality
- `public/assets/js/navbar-glassmorphism.js` - Navbar
- `public/assets/js/pricing-*.js` - Pricing features

### Images
- `public/assets/images/logo-black.png` - Light theme logo
- `public/assets/images/logo-white.png` - Dark theme logo

## 🎨 Customization

### Colors
Edit CSS variables in `site.css`:
```css
:root {
  --maroon: #800020;
  --blue: #007BFF;
  --text: #1a1a1a;
}
```

### Logo
Replace files in `public/assets/images/`:
- `logo-black.png` (for light backgrounds)
- `logo-white.png` (for dark backgrounds)

### Content
Edit HTML files directly in:
- `public/index.html` - Homepage
- `public/pages/` - Service pages

## 📱 Testing Responsive

### Desktop
- Open in browser at full width

### Mobile
- Use browser DevTools (F12)
- Toggle device toolbar
- Test on actual devices

## 🚀 Deploy

### Static Hosting (Recommended)
1. **Vercel**: `vercel --prod`
2. **Netlify**: Drag & drop `public` folder
3. **GitHub Pages**: Push to `gh-pages` branch
4. **Traditional Hosting**: Upload `public` folder via FTP

### Server Setup
Point document root to `public` folder

## ✅ Checklist Before Deploy

- [ ] Test all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test contact form
- [ ] Check images load
- [ ] Test on different browsers
- [ ] Verify meta tags
- [ ] Check console for errors

## 🐛 Common Issues

### Images not loading
- Check file paths are relative
- Verify images exist in `public/assets/images/`

### Styles not applying
- Clear browser cache
- Check CSS file paths in HTML
- Verify CSS syntax

### JavaScript not working
- Check browser console for errors
- Verify JS file paths
- Ensure scripts load after DOM

## 📞 Support

For issues or questions:
- Email: support@24x7econnect.com
- Phone: +91-7428464014

---

**Developed by Devlofox Technologies**
