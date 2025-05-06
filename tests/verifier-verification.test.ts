import { describe, it, expect, beforeEach } from 'vitest';
import { mockClarityBitcoin, mockClaritySimnet } from './mocks';

// Mock the Clarity environment
const clarity = mockClaritySimnet();

describe('Verifier Verification Contract', () => {
  beforeEach(() => {
    // Reset the simnet before each test
    clarity.reset();
    
    // Deploy the contract
    clarity.deployContract('verifier-verification', './contracts/verifier-verification.clar');
  });
  
  it('should allow admin to register a verifier', () => {
    // Admin is the deployer by default
    const result = clarity.callPublic('verifier-verification', 'register-verifier', ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', '"Test Verifier"']);
    
    expect(result.success).toBe(true);
    
    // Check if verifier is registered
    const verifier = clarity.callReadOnly('verifier-verification', 'get-verifier', ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']);
    expect(verifier.value.status).toBe('"active"');
    expect(verifier.value.name).toBe('"Test Verifier"');
  });
  
  it('should not allow non-admin to register a verifier', () => {
    // Switch to non-admin user
    clarity.setTxSender('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
    
    const result = clarity.callPublic('verifier-verification', 'register-verifier', ['"Unauthorized Verifier"']);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(100); // ERR_UNAUTHORIZED
  });
});
