// Simple mock implementation for Clarity testing
// This is a simplified version that would need to be expanded for real testing

export function mockClaritySimnet() {
	let contracts = {};
	let txSender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Default admin
	let blockHeight = 1;
	
	return {
		reset() {
			contracts = {};
			txSender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
			blockHeight = 1;
		},
		
		setTxSender(address) {
			txSender = address;
		},
		
		advanceBlockHeight(blocks) {
			blockHeight += blocks;
		},
		
		deployContract(name, path) {
			// In a real implementation, this would parse and load the contract
			contracts[name] = {
				data: {},
				functions: {},
				// Mock implementation would include contract functions
			};
		},
		
		callPublic(contract, function_name, args = []) {
			// This is a simplified mock that would need actual implementation
			// In a real test environment, this would execute the contract function
			
			// Return mock success for demonstration
			if (contract === 'verifier-verification' && function_name === 'register-verifier') {
				if (txSender !== 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
					return { success: false, error: 100 }; // ERR_UNAUTHORIZED
				}
				
				// Mock successful registration
				return { success: true, value: true };
			}
			
			// Default mock response
			return { success: true, value: true };
		},
		
		callReadOnly(contract, function_name, args = []) {
			// Mock read-only function calls
			
			if (contract === 'verifier-verification' && function_name === 'get-verifier') {
				return {
					value: {
						status: '"active"',
						name: '"Test Verifier"',
						'created-at': blockHeight
					}
				};
			}
			
			if (contract === 'attribute-storage' && function_name === 'get-attributes') {
				return {
					value: [
						{
							name: '"email"',
							value: '"user@example.com"',
							issuer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
							'issued-at': blockHeight,
							'expires-at': 10000
						}
					]
				};
			}
			
			// Default mock response
			return { value: [] };
		}
	};
}

export function mockClarityBitcoin() {
	// Mock for Bitcoin-related functions if needed
	return {};
}
