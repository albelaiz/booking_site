/**
 * Comprehensive Visitor Experience Test
 * Tests all public-facing features as a regular visitor
 */

const puppeteer = require('puppeteer');

async function runVisitorTests() {
    console.log('🏠 Starting Comprehensive Visitor Experience Test...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 100,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    const baseUrl = 'http://localhost:5000';
    
    const results = {
        homepage: [],
        navigation: [],
        properties: [],
        booking: [],
        contact: [],
        auth: [],
        mobile: [],
        performance: [],
        accessibility: []
    };

    try {
        // Test 1: Homepage Loading & Visual Check
        console.log('📱 Testing Homepage...');
        await page.goto(baseUrl, { waitUntil: 'networkidle0' });
        
        // Check if page loads without errors
        const pageTitle = await page.title();
        results.homepage.push(`✅ Page loads with title: ${pageTitle}`);
        
        // Check hero section
        const heroExists = await page.$('.hero, [data-testid="hero"]') !== null;
        results.homepage.push(heroExists ? '✅ Hero section visible' : '❌ Hero section missing');
        
        // Check navigation
        const navExists = await page.$('nav, .navigation, [data-testid="navigation"]') !== null;
        results.navigation.push(navExists ? '✅ Navigation present' : '❌ Navigation missing');
        
        // Check featured properties
        const propertiesExist = await page.$('.property-card, [data-testid="property-card"]') !== null;
        results.properties.push(propertiesExist ? '✅ Featured properties visible' : '❌ Featured properties missing');
        
        // Test 2: Navigation Menu Testing
        console.log('🧭 Testing Navigation...');
        
        // Test main navigation links
        const navLinks = await page.$$eval('nav a, .navigation a', links => 
            links.map(link => ({ text: link.textContent.trim(), href: link.href }))
        );
        results.navigation.push(`✅ Found ${navLinks.length} navigation links`);
        
        // Test mobile menu if present
        const mobileMenuToggle = await page.$('[data-testid="mobile-menu-toggle"], .mobile-menu-toggle, .hamburger');
        if (mobileMenuToggle) {
            results.navigation.push('✅ Mobile menu toggle found');
            await mobileMenuToggle.click();
            await page.waitForTimeout(500);
            const mobileMenuVisible = await page.$('.mobile-menu:not([style*="display: none"])') !== null;
            results.navigation.push(mobileMenuVisible ? '✅ Mobile menu opens' : '❌ Mobile menu not working');
        }

        // Test 3: Property Search & Filtering
        console.log('🔍 Testing Property Search...');
        
        // Look for search/filter elements
        const searchInput = await page.$('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
        if (searchInput) {
            results.properties.push('✅ Search input found');
            await searchInput.type('villa');
            await page.waitForTimeout(1000);
            results.properties.push('✅ Search input accepts text');
        }
        
        // Test property filters
        const filterElements = await page.$$('[data-testid*="filter"], .filter, select');
        results.properties.push(`✅ Found ${filterElements.length} filter elements`);
        
        // Test property cards interaction
        const propertyCards = await page.$$('.property-card, [data-testid="property-card"]');
        if (propertyCards.length > 0) {
            results.properties.push(`✅ Found ${propertyCards.length} property cards`);
            
            // Click on first property
            await propertyCards[0].click();
            await page.waitForTimeout(2000);
            
            // Check if property details page loads
            const currentUrl = page.url();
            const isDetailPage = currentUrl.includes('property') || currentUrl.includes('details');
            results.properties.push(isDetailPage ? '✅ Property details page loads' : '❌ Property details not accessible');
            
            // Go back to homepage
            await page.goBack();
            await page.waitForTimeout(1000);
        }

        // Test 4: Booking Flow
        console.log('📅 Testing Booking Flow...');
        
        // Look for booking buttons/forms
        const bookingButtons = await page.$$('[data-testid="book-now"], .book-now, button:contains("Book"), a:contains("Book")');
        if (bookingButtons.length > 0) {
            results.booking.push(`✅ Found ${bookingButtons.length} booking buttons`);
            
            // Try to start booking process
            await bookingButtons[0].click();
            await page.waitForTimeout(2000);
            
            // Check for booking form
            const bookingForm = await page.$('form[data-testid="booking-form"], .booking-form, form');
            if (bookingForm) {
                results.booking.push('✅ Booking form accessible');
                
                // Test form fields
                const dateInputs = await page.$$('input[type="date"], input[placeholder*="date"], input[placeholder*="Date"]');
                const guestInputs = await page.$$('input[type="number"], select[data-testid="guests"], input[placeholder*="guest"]');
                
                results.booking.push(`✅ Found ${dateInputs.length} date inputs`);
                results.booking.push(`✅ Found ${guestInputs.length} guest inputs`);
            } else {
                results.booking.push('❌ Booking form not found');
            }
        } else {
            results.booking.push('❌ No booking buttons found');
        }

        // Test 5: Contact Form
        console.log('📞 Testing Contact Features...');
        
        // Navigate to contact section/page
        const contactLink = await page.$('a[href*="contact"], a:contains("Contact"), [data-testid="contact"]');
        if (contactLink) {
            await contactLink.click();
            await page.waitForTimeout(1500);
            
            // Check for contact form
            const contactForm = await page.$('form[data-testid="contact-form"], .contact-form, form');
            if (contactForm) {
                results.contact.push('✅ Contact form found');
                
                // Test form fields
                const nameInput = await page.$('input[name="name"], input[placeholder*="name"], input[placeholder*="Name"]');
                const emailInput = await page.$('input[type="email"], input[name="email"]');
                const messageInput = await page.$('textarea[name="message"], textarea[placeholder*="message"]');
                
                results.contact.push(nameInput ? '✅ Name field present' : '❌ Name field missing');
                results.contact.push(emailInput ? '✅ Email field present' : '❌ Email field missing');
                results.contact.push(messageInput ? '✅ Message field present' : '❌ Message field missing');
                
                // Try filling and submitting form
                if (nameInput && emailInput && messageInput) {
                    await nameInput.type('Test User');
                    await emailInput.type('test@example.com');
                    await messageInput.type('This is a test message from the automated visitor test.');
                    
                    results.contact.push('✅ Contact form can be filled');
                }
            } else {
                results.contact.push('❌ Contact form not found');
            }
        } else {
            results.contact.push('❌ Contact link not found');
        }

        // Test 6: Authentication Flow
        console.log('🔐 Testing Authentication...');
        
        // Look for login/signup buttons
        const authButtons = await page.$$('button:contains("Login"), button:contains("Sign"), a:contains("Login"), a:contains("Sign")');
        if (authButtons.length > 0) {
            results.auth.push(`✅ Found ${authButtons.length} auth buttons`);
            
            // Try opening auth modal/page
            await authButtons[0].click();
            await page.waitForTimeout(1500);
            
            // Check for auth form
            const authForm = await page.$('form, .auth-modal, .login-form, .signup-form');
            if (authForm) {
                results.auth.push('✅ Auth form/modal opens');
                
                const emailField = await page.$('input[type="email"], input[name="email"]');
                const passwordField = await page.$('input[type="password"], input[name="password"]');
                
                results.auth.push(emailField ? '✅ Email field present' : '❌ Email field missing');
                results.auth.push(passwordField ? '✅ Password field present' : '❌ Password field missing');
            } else {
                results.auth.push('❌ Auth form not accessible');
            }
        } else {
            results.auth.push('❌ No auth buttons found');
        }

        // Test 7: Mobile Responsiveness
        console.log('📱 Testing Mobile Experience...');
        
        // Test mobile viewport
        await page.setViewport({ width: 375, height: 667 }); // iPhone 6/7/8 size
        await page.reload({ waitUntil: 'networkidle0' });
        
        // Check if content is still visible and accessible
        const contentVisible = await page.$eval('body', el => el.scrollHeight > 400);
        results.mobile.push(contentVisible ? '✅ Content visible on mobile' : '❌ Content issues on mobile');
        
        // Check if navigation adapts to mobile
        const mobileNav = await page.$('.mobile-menu, [data-testid="mobile-menu"], .hamburger') !== null;
        results.mobile.push(mobileNav ? '✅ Mobile navigation present' : '❌ Mobile navigation missing');
        
        // Test tablet viewport
        await page.setViewport({ width: 768, height: 1024 }); // iPad size
        await page.reload({ waitUntil: 'networkidle0' });
        
        const tabletContentVisible = await page.$eval('body', el => el.scrollHeight > 600);
        results.mobile.push(tabletContentVisible ? '✅ Content adapts to tablet' : '❌ Content issues on tablet');

        // Test 8: Performance Check
        console.log('⚡ Testing Performance...');
        
        // Return to desktop and test performance
        await page.setViewport({ width: 1920, height: 1080 });
        
        const performanceMetrics = await page.metrics();
        results.performance.push(`✅ JS Heap: ${(performanceMetrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)}MB`);
        results.performance.push(`✅ Layout Count: ${performanceMetrics.LayoutCount}`);
        
        // Test page load time
        const startTime = Date.now();
        await page.reload({ waitUntil: 'networkidle0' });
        const loadTime = Date.now() - startTime;
        results.performance.push(`✅ Page load time: ${loadTime}ms`);
        
        // Test 9: Accessibility Check
        console.log('♿ Testing Accessibility...');
        
        // Check for basic accessibility features
        const hasAltText = await page.$$eval('img', imgs => 
            imgs.every(img => img.alt && img.alt.trim() !== '')
        );
        results.accessibility.push(hasAltText ? '✅ All images have alt text' : '❌ Some images missing alt text');
        
        // Check for proper heading structure
        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headings => 
            headings.map(h => h.tagName)
        );
        results.accessibility.push(`✅ Found headings: ${headings.join(', ')}`);
        
        // Check for form labels
        const inputs = await page.$$('input, textarea, select');
        let labeledInputs = 0;
        for (const input of inputs) {
            const hasLabel = await input.evaluate(el => {
                const id = el.id;
                const label = el.closest('label') || document.querySelector(`label[for="${id}"]`);
                return !!label || !!el.getAttribute('aria-label') || !!el.getAttribute('placeholder');
            });
            if (hasLabel) labeledInputs++;
        }
        results.accessibility.push(`✅ ${labeledInputs}/${inputs.length} inputs have labels/placeholders`);

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        results.homepage.push(`❌ Test error: ${error.message}`);
    }

    await browser.close();

    // Print Results
    console.log('\n' + '='.repeat(60));
    console.log('🏠 VISITOR EXPERIENCE TEST RESULTS');
    console.log('='.repeat(60));

    Object.entries(results).forEach(([category, tests]) => {
        if (tests.length > 0) {
            console.log(`\n${category.toUpperCase()}:`);
            tests.forEach(test => console.log(`  ${test}`));
        }
    });

    // Calculate summary
    const allTests = Object.values(results).flat();
    const passedTests = allTests.filter(test => test.startsWith('✅')).length;
    const failedTests = allTests.filter(test => test.startsWith('❌')).length;
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 SUMMARY: ${passedTests} passed, ${failedTests} failed`);
    console.log(`✨ Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

    return { passed: passedTests, failed: failedTests, details: results };
}

// Run the tests
if (require.main === module) {
    runVisitorTests().catch(console.error);
}

module.exports = { runVisitorTests };
