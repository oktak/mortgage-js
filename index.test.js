mortgageJs = require("./index")

const mortgageCalculator = mortgageJs.createMortgageCalculator();

test('calculates mortgage with default settings using calculator instance and asserts a result', () => {
    let payment = mortgageCalculator.calculatePayment();
    expect(payment).toBeDefined();
});

test('calculates mortgage with specific settings using calculator instance and asserts results', () => {
    mortgageCalculator.totalPrice = 800000;
    mortgageCalculator.downPayment = 160000;
    mortgageCalculator.interestRate = 0.045;
    mortgageCalculator.months = 360;
    mortgageCalculator.taxRate = 0.012;
    mortgageCalculator.insuranceRate = 0.0013;
    mortgageCalculator.mortgageInsuranceRate = 0.010;
    mortgageCalculator.mortgageInsuranceEnabled = true;
    mortgageCalculator.mortgageInsuranceThreshold = 0.2;
    mortgageCalculator.additionalPrincipalPayment = 100;
    let payment = mortgageCalculator.calculatePayment();
    expect(payment).toBeDefined();
    expect(payment.loanAmount).toBe(640000);
    expect(payment.principalAndInterest).toBe(3342.79);
    expect(payment.tax).toBe(800);
    expect(payment.insurance).toBe(86.67);
    expect(payment.total).toBe(4229.46);
    expect(payment.termMonths).toBe(360);
    expect(payment.paymentSchedule.length).toBe(339);
    let paymentLength = payment.paymentSchedule.length;
    for (let i = 0; i < paymentLength; i++) {
        let p = payment.paymentSchedule[i];
        expect(p.count).toBe(i+1);
        expect(p.interestPayment).toBeDefined();
        expect(p.totalInterest).toBeDefined();
        expect(p.principalPayment).toBeDefined();
        expect(p.totalPayment).toBeDefined();
        expect(p.totalPayments).toBeDefined();
        expect(p.balance).toBeDefined();
    }
    expect(payment.mortgageInsurance).toBe(0);
    expect(payment.paymentSchedule[payment.paymentSchedule.length - 1].balance).toBe(0);

    // Adjust additional principal
    mortgageCalculator.additionalPrincipalPayment = 0;
    payment = mortgageCalculator.calculatePayment();
    expect(payment).toBeDefined();
    expect(payment.paymentSchedule.length).toBe(360);
    mortgageCalculator.additionalPrincipalPayment = 500;
    payment = mortgageCalculator.calculatePayment();
    expect(payment).toBeDefined();
    expect(payment.paymentSchedule.length).toBe(274);

    mortgageCalculator.totalPrice = 500000;
    mortgageCalculator.downPayment = 100000;
    mortgageCalculator.interestRate = 0.045;
    mortgageCalculator.months = 360;
    mortgageCalculator.additionalPrincipalPayment = 0;
    payment = mortgageCalculator.calculatePayment();
    expect(payment).toBeDefined();
    expect(payment.paymentSchedule.length).toBe(360);
    expect(payment.paymentSchedule[payment.paymentSchedule.length - 1].balance).toBe(0);
    expect(payment.principalAndInterest).toBe(2026.75);

    mortgageCalculator.additionalPrincipalPayment = 10;
    payment = mortgageCalculator.calculatePayment();
    expect(payment.principalAndInterest).toBe(2036.75);


});

test('calculates mortgage with default settings using method and asserts a result', () => {
    let payment = mortgageJs.calculatePayment();
    expect(payment).toBeDefined();
});

test('calculates mortgage with specific settings using method and asserts results', () => {
    mortgageCalculator.totalPrice = 800000;
    mortgageCalculator.downPayment = 160000;
    mortgageCalculator.interestRate = 0.045;
    mortgageCalculator.months = 360;
    mortgageCalculator.taxRate = 0.012;
    mortgageCalculator.insuranceRate = 0.0013;
    mortgageCalculator.mortgageInsuranceRate = 0.010;
    mortgageCalculator.mortgageInsuranceEnabled = true;
    mortgageCalculator.mortgageInsuranceThreshold = 0.2;
    mortgageCalculator.additionalPrincipalPayment = 100;
    let payment = mortgageJs.calculatePayment(800000,
        160000,
        0.045,
        360,
        0.012,
        0.0013,
        0.010,
        true,
        0.2,
        100);
    expect(payment).toBeDefined();
    expect(payment.loanAmount).toBe(640000);
    expect(payment.principalAndInterest).toBe(3342.79);
    expect(payment.tax).toBe(800);
    expect(payment.insurance).toBe(86.67);
    expect(payment.total).toBe(4229.46);
    expect(payment.termMonths).toBe(360);
    expect(payment.paymentSchedule.length).toBe(339);
    let paymentLength = payment.paymentSchedule.length;
    for (let i = 0; i < paymentLength; i++) {
        let p = payment.paymentSchedule[i];
        expect(p.count).toBe(i+1);
        expect(p.interestPayment).toBeDefined();
        expect(p.totalInterest).toBeDefined();
        expect(p.principalPayment).toBeDefined();
        expect(p.totalPayment).toBeDefined();
        expect(p.totalPayments).toBeDefined();
        expect(p.balance).toBeDefined();
    }
    expect(payment.mortgageInsurance).toBe(0);
});

test('rounding to next penny', () => {
    expect(mortgageJs.nextPenny(3.73889797)).toBe(3.74);
    expect(mortgageJs.nextPenny(1.33333333)).toBe(1.34);
});