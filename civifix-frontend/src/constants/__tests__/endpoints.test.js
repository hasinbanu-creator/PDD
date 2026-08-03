jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

jest.mock('react-native-config', () => ({
  API_URL: 'https://cv.onenism.org/api/v1',
}));

jest.mock('react-native-device-info', () => ({
  isEmulatorSync: () => true,
}));

describe('API URL resolution', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, EXPO_PUBLIC_API_URL: '' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses the Expo extra apiUrl when no environment override is present', () => {
    const { API_URL } = require('../endpoints');
    expect(API_URL).toBe('https://cv.onenism.org/api/v1/');
  });
});
