const { test, expect } = require('@playwright/test');

test.describe('Login / Signup Modal Validation', () => {
  
  // Test data function to provide consistent credentials
  const getTestCredentials = () => {
    return {
      email: 'test@example.com',
      password: 'testpassword123'
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
    
    // Wait for modal animation/transition
    await page.waitForTimeout(2000);
    
    // 2️⃣ Modal Appearance - Use .first() to handle multiple "Welcome Back" elements
    const welcomeHeading = page.getByText('Welcome Back').first();
    await expect(welcomeHeading).toBeVisible({ timeout: 10000 });
    
    // Assert the text "Login to your account" is visible - use .first() to handle multiple elements
    const loginText = page.getByText('Login to your account').first();
    await expect(loginText).toBeVisible();
    
    // Verify form elements are present to confirm it's the login modal
    const emailInput = page.getByPlaceholder('Email Address').first();
    await expect(emailInput).toBeVisible();
  });

  test('should validate form fields in the login modal', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // Wait for modal to load completely
    await page.waitForTimeout(3000);
    
    // Wait for the modal to be visible first
    const welcomeHeading = page.getByText('Welcome Back').first();
    await expect(welcomeHeading).toBeVisible({ timeout: 10000 });
    
    // Get test credentials
    const credentials = getTestCredentials();
    
    // 3️⃣ Form Fields Validation
    // Locate Email Address input using exact placeholder - use .first() to handle duplicates
    const emailInput = page.getByPlaceholder('Email Address').first();
    
    // Locate Password input using exact placeholder - use .first() to handle duplicates
    const passwordInput = page.getByPlaceholder('Password').first();
    
    // Assert both inputs are visible and enabled
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    
    // Clear any existing values first
    await emailInput.clear();
    await passwordInput.clear();
    
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
    
    // Wait for modal to load
    await page.waitForTimeout(2000);
    
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
    
    // Wait for modal to appear
    await page.waitForTimeout(2000);
    
    // Verify modal is visible by checking the heading - use .first() to handle multiple elements
    const welcomeHeading = page.getByText('Welcome Back').first();
    await expect(welcomeHeading).toBeVisible();
    
    // 5️⃣ Modal Close Behavior
    // The close button is an img with alt="close"
    const closeButton = page.getByAltText('close');
    
    // Click the close control
    await closeButton.click();
    
    // Assert the modal is no longer visible by checking the heading is gone
    await expect(welcomeHeading).not.toBeVisible();
  });

  test('should handle complete login flow with form validation', async ({ page }) => {
    // Open modal
    const loginSignupButton = page.getByRole('button', { name: /login|signup|sign up|sign in/i });
    await loginSignupButton.click();
    
    // Wait for modal to load
    await page.waitForTimeout(2000);
    
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
    
    // Verify modal has proper ARIA attributes
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Check that form elements are properly labeled
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));
    
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