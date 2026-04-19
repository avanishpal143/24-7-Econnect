(function(){
'use strict';
const progressBar=document.getElementById('scrollProgress');
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  const s=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight;
  if(progressBar)progressBar.style.width=(s/t*100)+'%';
  if(navbar){
    navbar.classList.toggle('scrolled',s>60);
    // Shrink pill padding on scroll
    const inner=navbar.querySelector('.nav__inner');
    if(inner){inner.style.padding=s>60?'0 1.25rem':'0 1.5rem';}
  }
},{passive:true});
if(navbar)navbar.classList.toggle('scrolled',window.scrollY>60);

// Hamburger
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('navLinks');
if(hamburger&&navLinks){
  hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click',(e)=>{
    if(navbar&&!navbar.contains(e.target)){
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
  // Mobile dropdown toggle
  document.querySelectorAll('.nav__item--dropdown .nav__link').forEach(link=>{
    link.addEventListener('click',(e)=>{
      if(window.innerWidth<=768){
        e.preventDefault();
        link.closest('.nav__item--dropdown').classList.toggle('open');
      }
    });
  });
  // Add Contact Us button inside mobile menu if not already there
  if(!navLinks.querySelector('.nav__mobile-cta')){
    const ctaLi=document.createElement('li');
    ctaLi.className='nav__item nav__mobile-cta';
    ctaLi.innerHTML='<a href="/#contact" class="nav__cta" style="display:block;text-align:center;margin:.5rem 0 .25rem">Contact Us</a>';
    navLinks.appendChild(ctaLi);
  }
}

// AOS
const aosEls=document.querySelectorAll('[data-aos]');
const aosObs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const delay=parseInt(entry.target.dataset.aosDelay||0);
      setTimeout(()=>entry.target.classList.add('aos-animate'),delay);
      aosObs.unobserve(entry.target);
    }
  });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
aosEls.forEach(el=>aosObs.observe(el));

// Counters
function animateCounter(el){
  const target=parseInt(el.dataset.count),suffix=el.dataset.suffix||'',duration=2000,step=target/(duration/16);
  let current=0;
  const timer=setInterval(()=>{
    current=Math.min(current+step,target);
    const val=current>=1000?Math.round(current).toLocaleString('en-IN'):Math.round(current);
    el.textContent=val+suffix;
    if(current>=target)clearInterval(timer);
  },16);
}
const cntObs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);cntObs.unobserve(entry.target);}});
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el=>cntObs.observe(el));

// Pricing toggle (for pricing page)
const billingToggle=document.getElementById('billingToggle');
if(billingToggle){
  billingToggle.addEventListener('change',function(){
    const isYearly=this.checked;
    document.querySelectorAll('[data-monthly]').forEach(el=>{el.textContent=isYearly?el.dataset.yearly:el.dataset.monthly;});
  });
}



// FAQ Accordion
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq__item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq__q').setAttribute('aria-expanded','false');
    });
    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    }
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const href=this.getAttribute('href');
    if(href==='#')return;
    const target=document.querySelector(href);
    if(target){e.preventDefault();window.scrollTo({top:target.offsetTop-80,behavior:'smooth'});if(hamburger)hamburger.classList.remove('open');if(navLinks)navLinks.classList.remove('open');}
  });
});

// Mobile: Collapsible "Why Choose Us" section
if(window.innerWidth<=768){
  const whyLeft=document.querySelector('.why__left');
  if(whyLeft){
    whyLeft.classList.add('collapsed');
    whyLeft.addEventListener('click',function(){
      this.classList.toggle('collapsed');
    });
  }
  
  // Auto-scroll products on mobile
  const productsGrid=document.querySelector('.products__grid');
  if(productsGrid){
    let scrollPos=0;
    const scrollSpeed=1;
    const cardWidth=productsGrid.querySelector('.pcard')?.offsetWidth || 0;
    const gap=16;
    const scrollAmount=cardWidth+gap;
    
    function autoScrollProducts(){
      if(productsGrid.scrollLeft>=productsGrid.scrollWidth-productsGrid.clientWidth){
        productsGrid.scrollTo({left:0,behavior:'smooth'});
        scrollPos=0;
      }else{
        scrollPos+=scrollSpeed;
        if(scrollPos>=scrollAmount){
          productsGrid.scrollBy({left:scrollAmount,behavior:'smooth'});
          scrollPos=0;
        }
      }
    }
    
    const productInterval=setInterval(autoScrollProducts,3000);
    
    // Pause on touch
    productsGrid.addEventListener('touchstart',()=>clearInterval(productInterval));
  }
  
  // Auto-scroll pricing on mobile
  const pricingGrid=document.querySelector('.pricing-preview__grid');
  if(pricingGrid){
    let pricingScrollPos=0;
    const pricingCardWidth=pricingGrid.querySelector('.pp-card')?.offsetWidth || 0;
    const pricingGap=20;
    const pricingScrollAmount=pricingCardWidth+pricingGap;
    
    function autoScrollPricing(){
      if(pricingGrid.scrollLeft>=pricingGrid.scrollWidth-pricingGrid.clientWidth){
        pricingGrid.scrollTo({left:0,behavior:'smooth'});
        pricingScrollPos=0;
      }else{
        pricingScrollPos+=1;
        if(pricingScrollPos>=pricingScrollAmount){
          pricingGrid.scrollBy({left:pricingScrollAmount,behavior:'smooth'});
          pricingScrollPos=0;
        }
      }
    }
    
    const pricingInterval=setInterval(autoScrollPricing,3500);
    
    // Pause on touch
    pricingGrid.addEventListener('touchstart',()=>clearInterval(pricingInterval));
  }
}

// Contact form
const form=document.getElementById('lead-form');
const formMsg=document.getElementById('formMsg');
const submitBtn=document.getElementById('submitBtn');
if(form){
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    const fd=new FormData(form);
    const data={name:fd.get('name'),company:fd.get('company'),mobile:fd.get('mobile'),email:fd.get('email'),products:fd.getAll('products[]')};
    if(!data.name||!data.company||!data.mobile||!data.email){showMsg('Please fill in all required fields.','error');return;}
    if(!/^[0-9]{10}$/.test(data.mobile)){showMsg('Please enter a valid 10-digit mobile number.','error');return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){showMsg('Please enter a valid email address.','error');return;}
    submitBtn.disabled=true;submitBtn.textContent='Sending...';
    try{
      // Build mailto link as fallback (no server required)
      const subject=encodeURIComponent('New Enquiry from '+data.name+' - '+data.company);
      const body=encodeURIComponent(
        'Name: '+data.name+'\nCompany: '+data.company+'\nMobile: '+data.mobile+'\nEmail: '+data.email+'\nProducts: '+(data.products.length?data.products.join(', '):'None selected')
      );
      window.location.href='mailto:support@24x7econnect.com?subject='+subject+'&body='+body;
      showMsg('Thank you! We will contact you soon.','success');
      form.reset();
    }catch{showMsg('Something went wrong. Please email us at support@24x7econnect.com','error');}
    finally{submitBtn.disabled=false;submitBtn.innerHTML='Submit <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';}
  });
}
function showMsg(text,type){
  if(!formMsg)return;
  formMsg.innerHTML='<div class="form-'+type+'">'+text+'</div>';
  setTimeout(()=>{formMsg.innerHTML='';},6000);
}
})();

// ── CASE STUDY MODAL ─────────────────────────────────────
const caseData = {
  wa: {
    gradient: 'linear-gradient(135deg,#25d366,#128c7e)',
    icon: '💬',
    tag: 'WhatsApp API',
    result: '3X Engagement',
    title: 'How an EdTech Brand Tripled Student Engagement with WhatsApp API',
    stats: [
      { value: '3X', label: 'Student Engagement' },
      { value: '90', label: 'Days to Results' },
      { value: '99%', label: 'Message Delivery' },
      { value: '40%', label: 'Support Cost Saved' }
    ],
    challenge: 'A growing online education platform with 50,000+ enrolled students struggled with low course completion rates and poor communication. Emails went unread and SMS lacked interactivity.',
    solution: 'They integrated 24x7 Econnect\'s WhatsApp Business API to send personalised course reminders, assignment nudges, live-class alerts and a 24/7 chatbot for instant doubt resolution.',
    results: [
      'Course completion rates jumped from 28% to 84% within 3 months.',
      'Student support tickets dropped by 40% thanks to the automated chatbot.',
      'Broadcast open rates reached 97% vs 18% for email.',
      'NPS score improved from 42 to 71 in one quarter.'
    ],
    quote: '"24x7 Econnect\'s WhatsApp API transformed how we connect with students. The results were beyond what we expected." — Head of Growth'
  },
  sms: {
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    icon: '📱',
    tag: 'SMS & OTP APIs',
    result: '60% Cost Reduction',
    title: 'How a Fintech Startup Cut OTP Costs by 60% with Priority SMS Routes',
    stats: [
      { value: '60%', label: 'Cost Reduction' },
      { value: '99.9%', label: 'Delivery Rate' },
      { value: '<3s', label: 'Avg OTP Delivery' },
      { value: '5M+', label: 'OTPs / Month' }
    ],
    challenge: 'A fast-growing fintech app was sending over 5 million OTPs per month. Their existing provider had inconsistent delivery times (up to 30 seconds) and high per-SMS costs eating into margins.',
    solution: '24x7 Econnect onboarded them onto dedicated priority OTP routes with intelligent failover, real-time delivery reports and a simple REST API that integrated in under 2 hours.',
    results: [
      'OTP delivery time reduced from ~30 seconds to under 3 seconds on average.',
      'Per-SMS cost dropped by 60% through volume-based pricing.',
      'Delivery rate improved from 94% to 99.9% at peak traffic.',
      'Zero downtime during IPO-day traffic spike of 10X normal volume.'
    ],
    quote: '"Switching to 24x7 Econnect was the best infrastructure decision we made this year. Costs down, reliability up." — CTO'
  },
  rcs: {
    gradient: 'linear-gradient(135deg,#4285f4,#34a853)',
    icon: '🌐',
    tag: 'Google RCS',
    result: '45% Higher CTR',
    title: 'How a Retail Chain Boosted Campaign CTR by 45% Using Google RCS',
    stats: [
      { value: '45%', label: 'Higher CTR' },
      { value: '3.2X', label: 'Conversion Rate' },
      { value: '80%', label: 'Read Rate' },
      { value: '₹2.4Cr', label: 'Revenue Attributed' }
    ],
    challenge: 'A national retail chain with 200+ stores was running SMS campaigns for seasonal sales. Plain-text messages had low engagement and no way to showcase products visually.',
    solution: '24x7 Econnect migrated their campaigns to Google RCS — rich cards with product images, carousels, quick-reply buttons and a verified brand sender ID, all delivered natively in the Android Messages app.',
    results: [
      'Click-through rate jumped from 3.1% (SMS) to 4.5% (RCS) — a 45% improvement.',
      'Conversion rate on RCS campaigns was 3.2X higher than plain SMS.',
      'Read receipts gave the marketing team real-time campaign visibility.',
      'Diwali sale campaign alone attributed ₹2.4 Cr in direct revenue.'
    ],
    quote: '"RCS let us bring our catalogue to customers\' phones. The visual experience made all the difference." — VP Marketing'
  },
  ivr: {
    gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
    icon: '📞',
    tag: 'Voice & IVR',
    result: '70% Call Deflection',
    title: 'How a Healthcare Provider Deflected 70% of Support Calls with Smart IVR',
    stats: [
      { value: '70%', label: 'Call Deflection' },
      { value: '4X', label: 'Agent Productivity' },
      { value: '24/7', label: 'Availability' },
      { value: '92%', label: 'Patient Satisfaction' }
    ],
    challenge: 'A multi-city hospital network was receiving 8,000+ calls daily for appointment bookings, test results and general FAQs. Long hold times frustrated patients and overwhelmed agents.',
    solution: '24x7 Econnect deployed a multi-level IVR with natural language prompts, automated appointment booking integrated with the hospital\'s HMS, and intelligent call routing for complex queries.',
    results: [
      '70% of calls resolved fully by IVR without agent involvement.',
      'Average hold time dropped from 8 minutes to under 45 seconds.',
      'Agent productivity improved 4X — they now handle only complex cases.',
      'Patient satisfaction score rose to 92% in post-call surveys.'
    ],
    quote: '"Our patients get answers instantly now. The IVR handles routine queries flawlessly, letting our team focus on what matters." — Operations Head'
  },
  email: {
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    icon: '📧',
    tag: 'Email Marketing',
    result: '2X Revenue',
    title: 'How an E-commerce Brand Doubled Revenue with Automated Email Campaigns',
    stats: [
      { value: '2X', label: 'Monthly Revenue' },
      { value: '38%', label: 'Open Rate' },
      { value: '65%', label: 'Cart Recovery' },
      { value: '5X', label: 'Email ROI' }
    ],
    challenge: 'An online fashion store had a large subscriber list but was sending one-size-fits-all newsletters. Cart abandonment was at 78% and repeat purchase rate was low.',
    solution: '24x7 Econnect\'s email platform enabled behavioural segmentation, automated cart-recovery drip sequences, post-purchase upsell flows and A/B tested subject lines — all without any developer effort.',
    results: [
      'Monthly revenue doubled within one quarter of going live.',
      'Cart recovery emails recaptured 65% of abandoned carts.',
      'Average email open rate reached 38% vs industry average of 21%.',
      'Email channel ROI measured at 5X spend within 6 months.'
    ],
    quote: '"We always knew email was powerful but never had the tools to use it properly. 24x7 Econnect changed that completely." — Founder'
  }
};

function openCaseModal(key) {
  const d = caseData[key];
  if (!d) return;
  const modal = document.getElementById('caseModal');
  const content = document.getElementById('csModalContent');

  const statsHtml = d.stats.map(s =>
    `<div class="cs-modal__stat"><strong data-target="${s.value}">${s.value}</strong><span>${s.label}</span></div>`
  ).join('');

  const resultsHtml = d.results.map(r => `<li>${r}</li>`).join('');

  content.innerHTML = `
    <div class="cs-modal__hero" style="background:${d.gradient}">
      <button class="cs-modal__close" onclick="closeCaseModal()" aria-label="Close">&times;</button>
      <div class="cs-modal__hero-icon">${d.icon}</div>
      <div class="cs-modal__hero-title">${d.tag}</div>
      <div class="cs-modal__hero-tag">${d.tag}</div>
      <div class="cs-modal__hero-result">${d.result}</div>
    </div>
    <div class="cs-modal__body">
      <h2 id="csModalTitle">${d.title}</h2>
      <div class="cs-modal__stats">${statsHtml}</div>
      <div class="cs-modal__section">
        <div class="cs-modal__section-label">The Challenge</div>
        <p>${d.challenge}</p>
      </div>
      <div class="cs-modal__section">
        <div class="cs-modal__section-label">Our Solution</div>
        <p>${d.solution}</p>
      </div>
      <div class="cs-modal__section">
        <div class="cs-modal__section-label">Results</div>
        <ul class="cs-modal__results">${resultsHtml}</ul>
      </div>
      <div class="cs-modal__quote"><p>${d.quote}</p></div>
    </div>`;

  // Remove old close btn from outside hero (we moved it inside hero)
  const oldClose = modal.querySelector('.cs-modal__close-outer');
  if (oldClose) oldClose.remove();

  modal.style.display = 'flex';
  // Trigger open animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.add('cs-modal--open');
      modal.querySelector('.cs-modal__box').scrollTop = 0;
      // Animate stat numbers
      animateModalStats(modal);
    });
  });
  document.body.style.overflow = 'hidden';
}

function animateModalStats(modal) {
  modal.querySelectorAll('.cs-modal__stat strong').forEach((el, i) => {
    const raw = el.dataset.target || el.textContent;
    // Extract numeric part
    const numMatch = raw.match(/[\d.]+/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[0]);
    const prefix = raw.slice(0, raw.indexOf(numMatch[0]));
    const suffix = raw.slice(raw.indexOf(numMatch[0]) + numMatch[0].length);
    const isDecimal = numMatch[0].includes('.');
    const duration = 900;
    const delay = i * 120;
    let start = null;
    el.textContent = prefix + '0' + suffix;
    setTimeout(() => {
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = isDecimal
          ? (target * ease).toFixed(1)
          : Math.round(target * ease);
        el.textContent = prefix + val + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
  });
}

function closeCaseModal() {
  const modal = document.getElementById('caseModal');
  modal.classList.remove('cs-modal--open');
  // Wait for transition then hide
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 380);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCaseModal();
});
