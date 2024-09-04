import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    const paymentDetailsMock: PaymentDetails = {
      amount: 3000,
      currency: 'USD',
      method: PaymentMethod.CreditCard,
      cardNumber: '4111111111111111',
    };

    const mockProcessPaymentResponse = {
      status: 'success',
      transactionId: '123456789',
    };

    paymentAdapterMock.processPayment.mockImplementation((paymentDetails: PaymentDetails) => mockProcessPaymentResponse);

    // Act
    const result = paymentService.makePayment(paymentDetailsMock);

    // Assert
    expect(result).toEqual(`Payment successful. Transaction ID: ${mockProcessPaymentResponse.transactionId}`);
    expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(paymentDetailsMock);
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    const paymentDetailsMock: PaymentDetails = {
      amount: 3000,
      currency: 'USD',
      method: PaymentMethod.PayPal,
      cardNumber: '4111111111111111',
    };

    const mockProcessPaymentResponse = {
      status: 'failure',
      error: 'Payment was declined',
    };

    paymentAdapterMock.processPayment.mockImplementation(() => mockProcessPaymentResponse);

    // Act & Assert
    expect(() => paymentService.makePayment(paymentDetailsMock)).toThrow('Payment failed');
  });

  test('should throw an error for invalid payment amount', () => {
    // Arrange
    const paymentDetailsMock: PaymentDetails = {
      amount: -500,
      currency: 'USD',
      method: PaymentMethod.CreditCard,
      cardNumber: '4111111111111111',
    };

    // Act & Assert
    expect(() => paymentService.makePayment(paymentDetailsMock)).toThrow('Invalid payment amount');
  });
});
