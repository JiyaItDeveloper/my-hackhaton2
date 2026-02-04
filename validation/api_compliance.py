"""
API compliance validation script to verify all endpoints behave exactly as specified
"""
import asyncio
import json
from typing import Dict, List
import httpx
from .config import settings


class APIComplianceValidator:
    """Validates that API endpoints behave exactly as specified in the requirements."""

    def __init__(self):
        self.base_url = settings.API_BASE_URL
        self.client = httpx.AsyncClient(timeout=settings.API_TIMEOUT)

    async def validate_endpoint_compliance(self, endpoint: str, method: str, expected_status: int) -> Dict:
        """Validate that an endpoint returns the expected status code."""
        try:
            response = await self.client.request(method, f"{self.base_url}{endpoint}")
            return {
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "passed": response.status_code == expected_status,
                "response_time_ms": response.elapsed.total_seconds() * 1000
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "passed": False,
                "error": str(e)
            }

    async def validate_all_endpoints(self) -> List[Dict]:
        """Validate all API endpoints against specification."""
        endpoints_to_validate = [
            # Authentication endpoints
            ("/api/auth/register", "POST", 200),
            ("/api/auth/login", "POST", 200),
            ("/api/auth/logout", "POST", 200),
            ("/api/auth/profile", "GET", 200),

            # Task endpoints (these will require authentication)
            ("/api/tasks", "GET", 401),  # Should return 401 without auth
            ("/api/tasks", "POST", 401),  # Should return 401 without auth
            ("/api/tasks/1", "GET", 401),  # Should return 401 without auth
            ("/api/tasks/1", "PUT", 401),  # Should return 401 without auth
            ("/api/tasks/1", "DELETE", 401),  # Should return 401 without auth
            ("/api/tasks/1/complete", "PATCH", 401),  # Should return 401 without auth
        ]

        results = []
        for endpoint, method, expected_status in endpoints_to_validate:
            result = await self.validate_endpoint_compliance(endpoint, method, expected_status)
            results.append(result)

        return results

    async def validate_authentication_enforcement(self) -> List[Dict]:
        """Validate that authentication is enforced on protected endpoints."""
        auth_endpoints = [
            ("/api/tasks", "GET"),
            ("/api/tasks", "POST"),
            ("/api/tasks/1", "GET"),
            ("/api/tasks/1", "PUT"),
            ("/api/tasks/1", "DELETE"),
            ("/api/tasks/1/complete", "PATCH"),
        ]

        results = []
        for endpoint, method in auth_endpoints:
            result = await self.validate_endpoint_compliance(endpoint, method, 401)  # Expect 401 without auth
            result["validation_type"] = "authentication_enforcement"
            results.append(result)

        return results

    async def validate_response_format(self, endpoint: str, method: str) -> Dict:
        """Validate that endpoint responses match expected format."""
        try:
            response = await self.client.request(method, f"{self.base_url}{endpoint}")
            try:
                json_response = response.json()
                is_json = True
            except:
                is_json = False

            return {
                "endpoint": endpoint,
                "method": method,
                "is_valid_json": is_json,
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "passed": is_json and response.status_code < 500
            }
        except Exception as e:
            return {
                "endpoint": endpoint,
                "method": method,
                "is_valid_json": False,
                "status_code": "ERROR",
                "error": str(e),
                "passed": False
            }

    async def run_comprehensive_validation(self) -> Dict:
        """Run comprehensive API compliance validation."""
        print("Running API compliance validation...")

        # Validate all endpoints
        endpoint_results = await self.validate_all_endpoints()

        # Validate authentication enforcement specifically
        auth_results = await self.validate_authentication_enforcement()

        # Validate response formats for key endpoints
        format_results = []
        key_endpoints = ["/", "/api/auth/register", "/api/auth/login"]
        for endpoint in key_endpoints:
            format_result = await self.validate_response_format(endpoint, "GET")
            format_results.append(format_result)

        return {
            "summary": {
                "total_endpoints_validated": len(endpoint_results),
                "endpoints_passed": sum(1 for r in endpoint_results if r["passed"]),
                "auth_checks_passed": sum(1 for r in auth_results if r["passed"]),
                "format_checks_passed": sum(1 for r in format_results if r["passed"])
            },
            "endpoint_validation": endpoint_results,
            "authentication_validation": auth_results,
            "format_validation": format_results
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


async def run_api_compliance_validation():
    """Run the API compliance validation."""
    validator = APIComplianceValidator()
    try:
        results = await validator.run_comprehensive_validation()
        print(json.dumps(results, indent=2))
        return results
    finally:
        await validator.close()


if __name__ == "__main__":
    asyncio.run(run_api_compliance_validation())