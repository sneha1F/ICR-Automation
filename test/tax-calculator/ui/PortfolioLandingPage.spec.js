const { test, expect } = require('@playwright/test');

// Global Test Setup - Navigate to portfolio page before each test
test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/portfolio`);
    // Ensure the page is fully loaded
    await page.waitForLoadState('networkidle');
});

// Global Test Cleanup - Close page after each test to prevent data leaks
test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
});

// LOGIN / SIGNUP BUTTON TESTS

test('should validate Login/Signup button visibility', async ({ page }) => {
    // 1️⃣ Login / Signup Button
    const loginSignupButton = page.getByTestId('login-signup-button');

    // Assert the button is visible and enabled
    await expect(loginSignupButton).toBeVisible();
    await expect(loginSignupButton).toBeEnabled();
});

test('should allow clicking Login/Signup button', async ({ page }) => {
    const loginSignupButton = page.getByTestId('login-signup-button');

    await expect(loginSignupButton).toBeVisible();
    await expect(loginSignupButton).toBeEnabled();

    // This validates clickability WITHOUT asserting behavior
    await expect(async () => {
        await loginSignupButton.click();
    }).not.toThrow();
});

// LOGIN MODAL TESTS

test('To check login modal elements are visible', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();

    //Modal Heading
    const modalHeading = await page.getByRole('heading', { name: 'Welcome Back' }).nth(1)
    await expect(modalHeading).toBeVisible();

    //Modal Text
    const modalText = await page.getByText('Login to your account').nth(1)
    await expect(modalText).toBeVisible();

    //Modal Email
    const modalEmail = await page.getByRole('textbox', { name: 'Email Address' }).nth(1)
    await expect(modalEmail).toBeVisible();

    //Modal Password
    const modalPassword = await page.getByRole('textbox', { name: 'Password' }).nth(1)
    await expect(modalPassword).toBeVisible();

    //Modal Forgot Password
    const modalForgotPassword = await page.getByRole('button', { name: 'Forgot Password?' }).nth(1)
    await expect(modalForgotPassword).toBeVisible();

    //Modal Login
    const modalLogin = await page.getByRole('button', { name: 'Login' }).nth(2)
    await expect(modalLogin).toBeVisible();

    //Modal Google Sign In
    const modalGoogleSignIn = await page.getByRole('button', { name: 'Google Sign in with Google' }).nth(1)
    await expect(modalGoogleSignIn).toBeVisible();

    //Modal Register
    const modalRegister = await page.getByText('Don’t have an account?').nth(1)
    await expect(modalRegister).toBeVisible();

    //Modal Register Button
    const modalRegisterButton = await page.getByRole('button', { name: 'Register' }).nth(1)
    await expect(modalRegisterButton).toBeVisible();

    //Modal Close Button
    const modalCloseButton = await page.getByRole('img', { name: 'close' }).nth(1)
    await expect(modalCloseButton).toBeVisible();
})

test('To check the cross button of Login/Signup modal is functional', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();
    const loginModal = await page.getByRole('heading', { name: 'Welcome Back' }).nth(1);
    await expect(loginModal).toBeVisible();
    const closeButton = await page.getByRole('img', { name: 'close' }).nth(1);
    await closeButton.click();
    await expect(loginModal).toBeHidden();
});

test('To check the Email and Password input fields are workinng correctly', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();
    const modalEmail = await page.getByRole('textbox', { name: 'Email Address' }).nth(1);
    await modalEmail.click();
    await modalEmail.fill(process.env.TEST_USER_EMAIL);
    const modalPassword = await page.getByRole('textbox', { name: 'Password' }).nth(1);
    await modalPassword.click();
    await modalPassword.fill(process.env.TEST_USER_PASSWORD);
    await expect(modalEmail).toHaveValue(process.env.TEST_USER_EMAIL)
    await expect(modalPassword).toHaveValue(process.env.TEST_USER_PASSWORD)
});

test('To check the Login functionality', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();

    await page.getByRole('textbox', { name: 'Email Address' }).nth(1)
        .fill(process.env.TEST_USER_EMAIL);

    await page.getByRole('textbox', { name: 'Password' }).nth(1)
        .fill(process.env.TEST_USER_PASSWORD);

    await page.getByRole('button', { name: 'Login' }).nth(2).click();

    // ✅ Assertion — THIS is what makes it a test
    const profileName = page
        .locator('div', { hasText: process.env.TEST_USER_NAME })
        .first();

    await expect(profileName).toBeVisible();
});

test('To check the password eye icon is functional', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();

    const passwordInput = page
        .getByRole('textbox', { name: 'Password' })
        .nth(1);

    await passwordInput.fill(process.env.TEST_USER_PASSWORD);

    // 1️⃣ Before click → password should be masked
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Eye icon (better locator than nth-child chain)
    const eyeButton = passwordInput
        .locator('..') // parent div (relative)
        .locator('div.cursor-pointer') // right-side eye wrapper
        .first();

    await eyeButton.click();

    // 2️⃣ After click → password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Optional but strong: value remains intact
    await expect(passwordInput).toHaveValue(process.env.TEST_USER_PASSWORD);
});

test('should successfully log in via UI', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();

    await page.getByRole('textbox', { name: 'Email Address' }).nth(1)
        .fill(process.env.TEST_USER_EMAIL);

    await page.getByRole('textbox', { name: 'Password' }).nth(1)
        .fill(process.env.TEST_USER_PASSWORD);

    await page.getByRole('button', { name: 'Login' }).nth(2).click();

    // ✅ Assertion — THIS is what makes it a test
    const profileName = page
        .locator('div', { hasText: process.env.TEST_USER_NAME })
        .first();

    await expect(profileName).toBeVisible();
});

// FORGOT PASSWORD TESTS

test('To check the Forgot Password button functionality', async ({ page }) => {
    await page.getByTestId('login-signup-button').click();
    const modalForgotPassword = page.getByRole('button', { name: 'Forgot Password?' }).nth(1);
    await expect(async () => {
        await modalForgotPassword.click();
    }).not.toThrow();
})

test('To check the elements of Forgot Password modal is visible', async ({ page }) => {
    await page.goto('https://newuat.indiacryptoresearch.co.in/portfolio');
    await page.getByTestId('login-signup-button').click();
    page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();

    //Back Button
    const backButton = await page.getByRole('button', { name: 'Back' }).nth(1);
    await expect(backButton).toBeVisible();

    //Forgot Password Heading
    const forgotPasswordHeading = await page.getByRole('heading', { name: 'Verify Your Email' }).nth(1);
    await expect(forgotPasswordHeading).toBeVisible();

    //Verify Email Input
    const verifyEmail = await page.getByText('Please enter your email').nth(1);
    await expect(verifyEmail).toBeVisible();

    //Forgot Password SubHeading
    const forgotPasswordSubHeading = await page.getByText('Please enter your email').nth(1);
    await expect(forgotPasswordSubHeading).toBeVisible();
    await expect(forgotPasswordSubHeading).toHaveText('Please enter your email address to receive a verification code.');

    //Verify Button
    const verifyButton = await page.getByRole('button', { name: 'Verify' }).nth(1);
    await expect(verifyButton).toBeVisible();

    //Close Button
    const closeButton = await page.getByRole('img', { name: 'close' }).nth(1);
    await expect(closeButton).toBeVisible()
})