"""
Authentication enforcement validation tests to ensure proper authentication is required for protected endpoints
"""
import asyncio
import json
from typing import Dict
import httpx
from .config import settings


class AuthEnforcementValidator:
    """Validates that authentication is properly enforced on all protected endpoints."""

    def __init__(self):
        self.base_url = settings.API_BASE_URL
        self.client = httpx.AsyncClient(timeout=settings.API_TIMEOUT)

    async def test_endpoint_without_auth(self, endpoint: str, method: str = "GET") -> Dict:
        """Test that an endpoint returns 401 without authentication."""
        try:
            response = await self.client.request(method, f"{self.base_url}{endpoint}")

            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": response.status_code,
                "expected_status": 401,
                "passed": response.status_code == 401,
                "response_body": response.text[:200] if response.text else ""
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": "ERROR",
                "error": str(e),
                "passed": False
            }

    async def test_endpoint_with_invalid_auth(self, endpoint: str, method: str = "GET") -> Dict:
        """Test that an endpoint returns 401 with invalid authentication."""
        try:
            response = await self.client.request(
                method,
                f"{self.base_url}{endpoint}",
                headers={"Authorization": "Bearer invalid-token-here"}
            )

            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": response.status_code,
                "expected_status": 401,
                "passed": response.status_code in [401, 403],  # Allow 403 as well as 401
                "response_body": response.text[:200] if response.text else ""
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": "ERROR",
                "error": str(e),
                "passed": False
            }

    async def test_endpoint_with_valid_auth(self, endpoint: str, method: str = "GET", token: str = None, data: dict = None) -> Dict:
        """Test that an endpoint works with valid authentication."""
        if not token:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": "NO_TOKEN",
                "error": "No valid token provided",
                "passed": False
            }

        try:
            headers = {"Authorization": f"Bearer {token}"}
            if data:
                response = await self.client.request(method, f"{self.base_url}{endpoint}", json=data, headers=headers)
            else:
                response = await self.client.request(method, f"{self.base_url}{endpoint}", headers=headers)

            # For protected endpoints, we expect 200, 201, 204, or 404 (if resource doesn't exist)
            # 404 is acceptable for endpoints that require a specific resource
            valid_statuses = [200, 201, 204, 404]
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": response.status_code,
                "expected_range": valid_statuses,
                "passed": response.status_code in valid_statuses,
                "response_body": response.text[:200] if response.text else ""
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "status_code": "ERROR",
                "error": str(e),
                "passed": False
            }

    async def validate_auth_on_protected_endpoints(self, auth_token: str = None) -> Dict:
        """Validate authentication enforcement on all protected endpoints."""
        protected_endpoints = [
            ("/api/tasks", "GET"),
            ("/api/tasks", "POST"),
            ("/api/tasks/1", "GET"),
            ("/api/tasks/1", "PUT"),
            ("/api/tasks/1", "DELETE"),
            ("/api/tasks/1/complete", "PATCH"),
            ("/api/auth/profile", "GET")
        ]

        results_without_auth = []
        results_with_invalid_auth = []
        results_with_valid_auth = []

        for endpoint, method in protected_endpoints:
            # Test without authentication
            result_no_auth = await self.test_endpoint_without_auth(endpoint, method)
            results_without_auth.append(result_no_auth)

            # Test with invalid authentication
            result_invalid_auth = await self.test_endpoint_with_invalid_auth(endpoint, method)
            results_with_invalid_auth.append(result_invalid_auth)

            # Test with valid authentication (if token available)
            if auth_token:
                # For POST/PUT endpoints, we need sample data
                data = None
                if method in ["POST", "PUT"]:
                    if endpoint.startswith("/api/tasks"):
                        data = {"description": "test", "completed": False}

                result_valid_auth = await self.test_endpoint_with_valid_auth(endpoint, method, auth_token, data)
                results_with_valid_auth.append(result_valid_auth)

        return {
            "summary": {
                "protected_endpoints_tested": len(protected_endpoints),
                "without_auth_correctly_blocked": sum(1 for r in results_without_auth if r["passed"]),
                "with_invalid_auth_correctly_blocked": sum(1 for r in results_with_invalid_auth if r["passed"]),
                "with_valid_auth_works": sum(1 for r in results_with_valid_auth if r["passed"]) if results_with_valid_auth else 0
            },
            "results": {
                "without_auth": results_without_auth,
                "with_invalid_auth": results_with_invalid_auth,
                "with_valid_auth": results_with_valid_auth
            }
        }

    async def validate_public_endpoints_allow_anonymous(self) -> Dict:
        """Validate that public endpoints allow anonymous access."""
        public_endpoints = [
            ("/", "GET"),
            ("/api/auth/register", "POST"),
            ("/api/auth/login", "POST")
        ]

        results = []
        for endpoint, method in public_endpoints:
            # For POST endpoints, we need sample data
            data = None
            if method == "POST" and "register" in endpoint:
                data = {"email": "test@example.com", "password": "password123", "name": "Test User"}
            elif method == "POST" and "login" in endpoint:
                data = {"email": "test@example.com", "password": "password123"}

            try:
                if data:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", json=data)
                else:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}")

                # For public endpoints, we expect successful responses (2xx) or appropriate error responses (4xx)
                # but not necessarily 401 (which would indicate auth enforcement where it shouldn't be)
                passed = response.status_code < 500  # Don't expect server errors

                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": response.status_code,
                    "passed": passed,
                    "response_body": response.text[:200] if response.text else ""
                })
            except Exception as e:
                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": "ERROR",
                    "error": str(e),
                    "passed": False
                })

        return {
            "summary": {
                "public_endpoints_tested": len(public_endpoints),
                "anonymous_access_allowed": sum(1 for r in results if r["passed"])
            },
            "results": results
        }

    async def run_auth_enforcement_validation(self, auth_token: str = None) -> Dict:
        """Run comprehensive authentication enforcement validation."""
        print("Running authentication enforcement validation...")

        # Validate protected endpoints require authentication
        protected_results = await self.validate_auth_on_protected_endpoints(auth_token)

        # Validate public endpoints allow anonymous access
        public_results = await self.validate_public_endpoints_allow_anonymous()

        return {
            "summary": {
                "protected_endpoints_validation": protected_results["summary"],
                "public_endpoints_validation": public_results["summary"],
                "overall_auth_enforcement_score": (
                    protected_results["summary"]["without_auth_correctly_blocked"] +
                    protected_results["summary"]["with_invalid_auth_correctly_blocked"] +
                    public_results["summary"]["anonymous_access_allowed"]
                )
            },
            "protected_endpoints": protected_results,
            "public_endpoints": public_results
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


async def run_auth_enforcement_validation(auth_token: str = None):
    """Run the authentication enforcement validation tests."""
    validator = AuthEnforcementValidator()
    try:
        results = await validator.run_auth_enforcement_validation(auth_token)
        print(json.dumps(results, indent=2))
        return results
    finally:
        await validator.close()


if __name__ == "__main__":
    # For testing without a token
    asyncio.run(run_auth_enforcement_validation())