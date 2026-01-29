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

test.describe('Login / Signup Button Tests', () => {

    test('should validate Login/Signup button visibility', async ({ page }) => {
        // 1️⃣ Login / Signup Button
        const loginSignupButton = page.getByTestId('login-signup-button');

        // Assert the button is visible and enabled
        await expect(loginSignupButton).toBeVisible();
        await expect(loginSignupButton).toBeEnabled();
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
})

// FORGOT PASSWORD TESTS

test.describe('Forgot Password Tests', () => {
    test('To check the Forgot Password button functionality', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        const forgotPasswordButton = page.getByRole('button', { name: 'Forgot Password?' }).nth(1);
        await forgotPasswordButton.click();
        const forgotPasswordModal = page.getByRole('heading', { name: 'Verify Your Email' }).nth(1);
        await expect(forgotPasswordModal).toBeVisible();
    })

    test('To check the elements of Forgot Password modal is visible', async ({ page }) => {
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

    test('To check the heading of Forgot Password modal is correct', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        const forgotPasswordButton = await page.getByRole('button', { name: 'Forgot Password?' }).nth(1);
        await forgotPasswordButton.click();
        const forgotPasswordHeading = await page.getByRole('heading', { name: 'Verify Your Email' }).nth(1);
        await expect(forgotPasswordHeading).toBeVisible();
        await expect(forgotPasswordHeading).toHaveText('Verify Your Email');
    });

    test('To check the subheading of Forgot Password Modal is correct', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        const forgotPasswordButton = await page.getByRole('button', { name: 'Forgot Password?' }).nth(1);
        await forgotPasswordButton.click();
        const forgotPasswordSubHeading = await page.getByText('Please enter your email').nth(1)
        await expect(forgotPasswordSubHeading).toBeVisible();
        await expect(forgotPasswordSubHeading).toHaveText('Please enter your email address to receive a verification code.');
    })

    test('To check the email address of Forgot Password modal is enabled', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        const email = page.getByRole('textbox', { name: 'Email Address' }).nth(1);
        await email.click();
        await expect(email).toBeVisible();
        await expect(email).toBeEnabled();
    });

    test('To check the email address of Forgot Password modal accepts input', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        const email = page.getByRole('textbox', { name: 'Email Address' }).nth(1);
        await email.click();
        await email.fill(process.env.TEST_USER_EMAIL);
        await expect(email).toHaveValue(process.env.TEST_USER_EMAIL);
    });

    test('should move forward to Verify OTP modal with registered user email and display success toast', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        const email = page.getByRole('textbox', { name: 'Email Address' }).nth(1);
        await email.click();
        await email.fill(process.env.TEST_USER_EMAIL);
        const verifyButton = page.getByRole('button', { name: 'Verify' }).nth(1);
        await verifyButton.click();
        const verifyOTPModal = page.getByRole('heading', { name: 'Verify OTP' }).nth(1)
        await expect(verifyOTPModal).toBeVisible();
        const successToast = await page.locator('div').filter({ hasText: 'Password reset link sent' }).nth(3);
        await expect(successToast).toBeVisible();
        await expect(successToast).toHaveText('Password reset link sent successfully');
    });

    test('should display error toast when Verify OTP modal with unregistered user email', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        const email = page.getByRole('textbox', { name: 'Email Address' }).nth(1);
        await email.click();
        await email.fill('testuser@gmail.com');
        const verifyButton = page.getByRole('button', { name: 'Verify' }).nth(1);
        await verifyButton.click();
        const errorToast = page.locator('div').filter({ hasText: 'Failed to process forgot' }).nth(3);
        await expect(errorToast).toBeVisible();
        await expect(errorToast).toHaveText('Failed to process forgot password');
    });

    test('check the elements of Forgot Password Verification code modal is visible', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).fill(process.env.TEST_USER_EMAIL);
        await page.getByRole('button', { name: 'Verify' }).nth(1).click();

        // Forgot Password OTP Modal Heading
        const forgotPasswordOTPHeading = page.getByRole('heading', { name: 'Verify OTP' }).nth(1);
        await expect(forgotPasswordOTPHeading).toBeVisible();

        // Forgot Password OTP Modal SubHeading
        const forgotPasswordOTPSubHeading = page.getByText(`Enter the 6-digit code sent to ${process.env.TEST_USER_EMAIL}`).nth(1);
        await expect(forgotPasswordOTPSubHeading).toBeVisible();

        // Forgot Password OTP Modal 6 digit code UI
        const sixDigitUI = await page.locator('div:nth-child(24) > .w-\\[90\\%\\] > .max-w-md > div > .flex');
        await expect(sixDigitUI).toBeVisible();

        // Forgot Password OTP Modal Verify button
        const forgotPasswordOTPVerifybutton = await page.getByRole('button', { name: 'Verify' }).nth(1);
        await expect(forgotPasswordOTPVerifybutton).toBeVisible();

        // Forgot Password OTP Modal Back button
        const backButton = await page.getByRole('button', { name: 'Back' }).nth(1);
        await expect(backButton).toBeVisible();

        // Forgot Password OTP Modal Resend OTP area
        const resendOTP = await page.getByRole('button', { name: 'Resend OTP' }).nth(1);
        await expect(resendOTP).toBeVisible();

        // Forgot Password OTP Modal Close button
        const closeButton = await page.getByRole('img', { name: 'close' }).nth(1);
        await expect(closeButton).toBeVisible();
    });

    test('Check the title of Forgot Password OTP Modal is correct', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        const forgotPasswordOTPEmail = await page.getByRole('textbox', { name: 'Email Address' }).nth(1);
        await forgotPasswordOTPEmail.click();
        await forgotPasswordOTPEmail.fill(process.env.TEST_USER_EMAIL);
        const verifyButton = await page.getByRole('button', { name: 'Verify' }).nth(1);
        await verifyButton.click();
        const verifyOTPHeading = await page.getByRole('heading', { name: 'Verify OTP' }).nth(1)
        await expect(verifyOTPHeading).toHaveText('Verify OTP');
    });

    test('Check the edit email functionality in Forgot Password OTP Modal', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).fill(process.env.TEST_USER_EMAIL);
        await page.getByRole('button', { name: 'Verify' }).nth(1).click();
        const editEmail = await page.getByRole('button', { name: 'Edit email' }).nth(1);
        await editEmail.click();
        const forgotPasswordModal = await page.getByText('Verify Your Email').nth(1);
        await expect(forgotPasswordModal).toBeVisible();
    });

    test('Check the edit button has correct email name', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).fill(process.env.TEST_USER_EMAIL);
        await page.getByRole('button', { name: 'Verify' }).nth(1).click();
        const editEmail = await page.getByRole('button', { name: 'Edit email' }).nth(1);
        await expect(editEmail).toHaveText(process.env.TEST_USER_EMAIL);
    });

    test('check Forgot Password OTP modal has exactly 6 input boxes', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).fill(process.env.TEST_USER_EMAIL);
        await page.getByRole('button', { name: 'Verify' }).nth(1).click();

        // OTP container (KEEPING YOUR LOCATOR)
        const sixDigitUI = page.locator(
            'div:nth-child(24) > .w-\\[90\\%\\] > .max-w-md > div > .flex'
        );

        await expect(sixDigitUI).toBeVisible();

        // Locate input boxes INSIDE the container
        const otpInputs = sixDigitUI.locator('input');

        // Assert exactly 6 OTP boxes
        await expect(otpInputs).toHaveCount(6);
    });


    test('check Forgot Password OTP modal input boxes are enabled', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1).fill(process.env.TEST_USER_EMAIL);
        await page.getByRole('button', { name: 'Verify' }).nth(1).click();

        // OTP container (KEEPING YOUR LOCATOR)
        const sixDigitUI = page.locator(
            'div:nth-child(24) > .w-\\[90\\%\\] > .max-w-md > div > .flex'
        );

        await expect(sixDigitUI).toBeVisible();

        const otpInputs = sixDigitUI.locator('input');

        // Assert each OTP box is enabled
        const count = await otpInputs.count();

        for (let i = 0; i < count; i++) {
            await expect(otpInputs.nth(i)).toBeEnabled();
        }
    });

    test('check Resend OTP countdown decreases over time', async ({ page }) => {
        await page.getByTestId('login-signup-button').click();
        await page.getByRole('button', { name: 'Forgot Password?' }).nth(1).click();
        await page.getByRole('textbox', { name: 'Email Address' }).nth(1)
            .fill(process.env.TEST_USER_EMAIL);
        await page.getByRole('button', { name: 'Verify' }).nth(1).click();

        // Resend OTP button (kept as-is)
        const resendOTPButton = page
            .getByRole('button', { name: 'Resend OTP:' })
            .nth(1);

        await expect(resendOTPButton).toBeVisible();

        // Parent span contains the countdown text
        const resendOTPContainer = resendOTPButton.locator('..');

        // Helper to extract seconds (no heavy regex)
        const getSeconds = async () => {
            const text = await resendOTPContainer.textContent();
            return Number(text?.replace(/\D/g, ''));
        };

        let previousValue = await getSeconds();
        expect(previousValue).toBeGreaterThan(0);

        // Loop a few seconds to confirm decrement
        for (let i = 0; i < 5; i++) {
            await page.waitForTimeout(1000);

            const currentValue = await getSeconds();
            expect(currentValue).toBeLessThan(previousValue);

            previousValue = currentValue;
        }
    });
})