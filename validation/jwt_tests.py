"""
JWT validation test suite to verify JWT handling works correctly
"""
import asyncio
import jwt
import time
from datetime import datetime, timedelta
from typing import Dict, Optional
import httpx
from jose import JWTError, jws
import os
from .config import settings


class JWTValidator:
    """Validates JWT token handling in the application."""

    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key-change-in-production")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.base_url = settings.API_BASE_URL
        self.client = httpx.AsyncClient(timeout=settings.API_TIMEOUT)

    def create_test_token(self, user_id: str, email: str, expiry_minutes: int = 30) -> str:
        """Create a test JWT token."""
        expire = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        to_encode = {
            "sub": user_id,
            "email": email,
            "exp": expire.timestamp()
        }
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_expired_token(self) -> str:
        """Create an expired JWT token for testing."""
        expire = datetime.utcnow() - timedelta(minutes=1)  # Expired 1 minute ago
        to_encode = {
            "sub": "test_user_123",
            "email": "test@example.com",
            "exp": expire.timestamp()
        }
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_invalid_token(self) -> str:
        """Create an invalid JWT token for testing."""
        # Return a malformed token
        return "this.is.not.a.valid.jwt.token"

    async def validate_token_structure(self, token: str) -> Dict:
        """Validate the structure of a JWT token."""
        try:
            # Split the token to check structure
            parts = token.split('.')
            has_correct_parts = len(parts) == 3

            if has_correct_parts:
                try:
                    # Decode header and payload without verification
                    header = jwt.get_unverified_header(token)
                    payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm], options={"verify_signature": False})

                    return {
                        "valid_structure": True,
                        "has_correct_parts": has_correct_parts,
                        "header_decoded": header,
                        "payload_decoded": payload,
                        "passed": True
                    }
                except:
                    return {
                        "valid_structure": False,
                        "has_correct_parts": has_correct_parts,
                        "error": "Could not decode token parts",
                        "passed": False
                    }
            else:
                return {
                    "valid_structure": False,
                    "has_correct_parts": has_correct_parts,
                    "error": "JWT must have exactly 3 parts separated by dots",
                    "passed": False
                }
        except Exception as e:
            return {
                "valid_structure": False,
                "error": str(e),
                "passed": False
            }

    async def validate_token_signature(self, token: str) -> Dict:
        """Validate the signature of a JWT token."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return {
                "valid_signature": True,
                "payload": payload,
                "passed": True
            }
        except jwt.InvalidSignatureError:
            return {
                "valid_signature": False,
                "error": "Invalid token signature",
                "passed": False
            }
        except jwt.ExpiredSignatureError:
            return {
                "valid_signature": False,
                "error": "Token signature is valid but token has expired",
                "expired": True,
                "passed": False
            }
        except Exception as e:
            return {
                "valid_signature": False,
                "error": str(e),
                "passed": False
            }

    async def validate_token_expiration(self, token: str) -> Dict:
        """Validate that token expiration is handled correctly."""
        try:
            # First, decode without verification to check expiration claim
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm], options={"verify_signature": False})

            exp_claim = payload.get("exp")
            if exp_claim:
                exp_datetime = datetime.utcfromtimestamp(exp_claim)
                current_time = datetime.utcnow()

                is_expired = current_time > exp_datetime

                # Now try to verify with signature check
                try:
                    jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
                    signature_valid = True
                    expired_error = None
                except jwt.ExpiredSignatureError:
                    signature_valid = False
                    expired_error = "Token has expired"
                except Exception as e:
                    signature_valid = False
                    expired_error = str(e)

                return {
                    "exp_claim": exp_claim,
                    "exp_datetime": exp_datetime.isoformat(),
                    "current_time": current_time.isoformat(),
                    "is_expired": is_expired,
                    "signature_valid": signature_valid,
                    "expired_error": expired_error,
                    "passed": not is_expired and signature_valid
                }
            else:
                return {
                    "exp_claim": None,
                    "error": "No expiration claim found in token",
                    "passed": False
                }
        except Exception as e:
            return {
                "error": str(e),
                "passed": False
            }

    async def validate_api_with_token(self, token: str, endpoint: str = "/api/auth/profile") -> Dict:
        """Validate API access with a JWT token."""
        try:
            response = await self.client.get(
                f"{self.base_url}{endpoint}",
                headers={"Authorization": f"Bearer {token}"}
            )

            return {
                "endpoint": endpoint,
                "status_code": response.status_code,
                "response_text": response.text[:200] if response.text else "",  # Limit response size
                "passed": response.status_code in [200, 401, 403, 404],  # Valid responses
                "token_accepted": response.status_code == 200
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "error": str(e),
                "passed": False
            }

    async def run_comprehensive_jwt_validation(self) -> Dict:
        """Run comprehensive JWT validation tests."""
        print("Running JWT validation tests...")

        # Create test tokens
        valid_token = self.create_test_token("test_user_123", "test@example.com")
        expired_token = self.create_expired_token()
        invalid_token = self.create_invalid_token()

        # Test token structure
        valid_struct_result = await self.validate_token_structure(valid_token)
        expired_struct_result = await self.validate_token_structure(expired_token)
        invalid_struct_result = await self.validate_token_structure(invalid_token)

        # Test token signatures
        valid_sig_result = await self.validate_token_signature(valid_token)
        expired_sig_result = await self.validate_token_signature(expired_token)
        invalid_sig_result = await self.validate_token_signature(invalid_token)

        # Test token expiration
        valid_exp_result = await self.validate_token_expiration(valid_token)
        expired_exp_result = await self.validate_token_expiration(expired_token)

        # Test API access with tokens
        valid_token_api_result = await self.validate_api_with_token(valid_token)
        expired_token_api_result = await self.validate_api_with_token(expired_token)
        invalid_token_api_result = await self.validate_api_with_token(invalid_token)
        no_token_api_result = await self.validate_api_with_token("")  # No token

        return {
            "summary": {
                "valid_token_tests_passed": sum([
                    valid_struct_result["passed"],
                    valid_sig_result["passed"],
                    valid_exp_result["passed"],
                    valid_token_api_result.get("token_accepted", False)  # Use .get() to avoid KeyError
                ]),
                "expired_token_detected": expired_sig_result.get("expired", False) or expired_exp_result.get("is_expired", False),
                "invalid_token_rejected": not invalid_sig_result.get("valid_signature", False),
                "total_tests": 10  # Adjust as needed
            },
            "valid_token_tests": {
                "structure": valid_struct_result,
                "signature": valid_sig_result,
                "expiration": valid_exp_result,
                "api_access": valid_token_api_result
            },
            "expired_token_tests": {
                "structure": expired_struct_result,
                "signature": expired_sig_result,
                "expiration": expired_exp_result,
                "api_access": expired_token_api_result
            },
            "invalid_token_tests": {
                "structure": invalid_struct_result,
                "signature": invalid_sig_result,
                "api_access": invalid_token_api_result
            },
            "no_token_tests": {
                "api_access": no_token_api_result
            }
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


async def run_jwt_validation_tests():
    """Run the JWT validation test suite."""
    validator = JWTValidator()
    try:
        results = await validator.run_comprehensive_jwt_validation()
        import json
        print(json.dumps(results, indent=2, default=str))
        return results
    finally:
        await validator.close()


if __name__ == "__main__":
    asyncio.run(run_jwt_validation_tests())