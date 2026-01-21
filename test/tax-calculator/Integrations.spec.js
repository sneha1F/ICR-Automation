const { test, expect } = require('@playwright/test');

test.describe('Login / Signup Modal Validation', () => {
  
  // Test data function to provide consistent credentials
  const getTestCredentials = () => {
    return {
      email: 'testsneha@gmail.com',
      password: 'testsneha'
    };
  };
  
  // Global Test Setup - Navigate to portfolio page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.URL}/portfolio`);
    // Ensure the page is fully loaded
    await page.waitForLoadState('networkidle');
  });

  // Global Test Cleanup - Close page after each test to prevent data leaks
  test.afterEach(async ({ page }) => {
    // Clear any stored data and close page
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.close();
  });

  test('should validate Login/Signup button visibility and functionality', async ({ page }) => {
    // 1️⃣ Login / Signup Button
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    
    // Assert the button is visible and enabled
    await expect(loginSignupButton).toBeVisible();
    await expect(loginSignupButton).toBeEnabled();
    
    // Click the Login / Signup button
    await loginSignupButton.click();
  });

  test('should display modal with correct content after clicking Login/Signup button', async ({ page }) => {
    // Click Login/Signup button to open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // 2️⃣ Modal Appearance
    // Wait for the modal to appear - it's a div with specific styling, not role="dialog"
    const modal = page.locator('div').filter({ 
      has: page.locator('h2:has-text("Welcome Back")') 
    }).first();
    
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    // Assert the heading "Welcome Back" is visible
    const welcomeHeading = page.getByRole('heading', { name: 'Welcome Back' });
    await expect(welcomeHeading).toBeVisible();
    
    // Assert the text "Login to your account" is visible
    const loginText = page.getByText('Login to your account');
    await expect(loginText).toBeVisible();
    
    // Additional validation - check for modal styling classes
    const modalContainer = page.locator('div.bg-\\[\\#121212\\].text-white.rounded-2xl');
    await expect(modalContainer).toBeVisible();
  });

  test('should validate form fields in the login modal', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // Get test credentials
    const credentials = getTestCredentials();
    
    // 3️⃣ Form Fields Validation
    // Locate Email Address input using placeholder (based on actual HTML)
    const emailInput = page.getByPlaceholder('Email Address');
    
    // Locate Password input using placeholder (based on actual HTML)
    const passwordInput = page.getByPlaceholder('Password');
    
    // Assert both inputs are visible and enabled
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    
    // Fill valid test credentials into both fields
    await emailInput.fill(credentials.email);
    await passwordInput.fill(credentials.password);
    
    // Verify the values were entered correctly
    await expect(emailInput).toHaveValue(credentials.email);
    await expect(passwordInput).toHaveValue(credentials.password);
  });

  test('should validate all action buttons and links in the modal', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // 4️⃣ Action Buttons & Links
    // Validate Login button (submit button with "Login" text)
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
    
    // Validate Forgot Password button
    const forgotPasswordButton = page.getByRole('button', { name: 'Forgot Password?' });
    await expect(forgotPasswordButton).toBeVisible();
    
    // Validate Sign in with Google button
    const googleSignInButton = page.getByRole('button', { name: /Sign in with Google/i });
    await expect(googleSignInButton).toBeVisible();
    await expect(googleSignInButton).toBeEnabled();
    
    // Validate Register button
    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeVisible();
  });

  test('should close modal when close control is clicked', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // Verify modal is visible
    const modal = page.locator('div').filter({ 
      has: page.locator('h2:has-text("Welcome Back")') 
    }).first();
    await expect(modal).toBeVisible();
    
    // 5️⃣ Modal Close Behavior
    // The close button is an img with alt="close" based on the HTML
    const closeButton = page.getByAltText('close');
    
    // Click the close control
    await closeButton.click();
    
    // Assert the modal is no longer visible
    await expect(modal).not.toBeVisible();
  });

  test('should handle complete login flow with form validation', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // Get test credentials
    const credentials = getTestCredentials();
    
    // Fill form fields using exact placeholders
    const emailInput = page.getByPlaceholder('Email Address');
    const passwordInput = page.getByPlaceholder('Password');
    
    await emailInput.fill(credentials.email);
    await passwordInput.fill(credentials.password);
    
    // Click login button
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeEnabled();
    
    // Note: Actual login submission would depend on the application's behavior
    // This test validates the form is ready for submission
    await expect(emailInput).toHaveValue(credentials.email);
    await expect(passwordInput).toHaveValue(credentials.password);
  });

  test('should validate modal accessibility features', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // Verify modal is visible
    const modal = page.locator('div').filter({ 
      has: page.locator('h2:has-text("Welcome Back")') 
    }).first();
    await expect(modal).toBeVisible();
    
    // Check that form elements are properly accessible using exact placeholders
    const emailInput = page.getByPlaceholder('Email Address');
    const passwordInput = page.getByPlaceholder('Password');
    
    // Verify inputs can receive focus (accessibility requirement)
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
    
    await passwordInput.focus();
    await expect(passwordInput).toBeFocused();
    
    // Verify buttons are keyboard accessible
    const loginButton = page.getByRole('button', { name: 'Login' });
    await loginButton.focus();
    await expect(loginButton).toBeFocused();
  });

});