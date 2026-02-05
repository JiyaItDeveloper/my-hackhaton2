"""
HTTP status code validation tests to ensure API endpoints return appropriate status codes
"""
import asyncio
import json
from typing import Dict, List
import httpx
from .config import settings


class StatusCodeValidator:
    """Validates that API endpoints return appropriate HTTP status codes."""

    def __init__(self):
        self.base_url = settings.API_BASE_URL
        self.client = httpx.AsyncClient(timeout=settings.API_TIMEOUT)
        self.test_token = None

    async def setup_test_user(self) -> Dict:
        """Create or authenticate a test user for validation."""
        try:
            # Try to register a test user
            registration_data = {
                "email": settings.TEST_USER_EMAIL,
                "password": settings.TEST_USER_PASSWORD,
                "name": "Test User"
            }

            response = await self.client.post(
                f"{self.base_url}/api/auth/register",
                json=registration_data
            )

            if response.status_code == 200:
                result = response.json()
                self.test_token = result.get("access_token")

                if not self.test_token:
                    # Try to log in to get token
                    login_data = {
                        "email": settings.TEST_USER_EMAIL,
                        "password": settings.TEST_USER_PASSWORD
                    }
                    login_response = await self.client.post(
                        f"{self.base_url}/api/auth/login",
                        json=login_data
                    )

                    if login_response.status_code == 200:
                        login_result = login_response.json()
                        self.test_token = login_result.get("access_token")

                return {"success": True, "message": "Test user authenticated"}
            elif response.status_code == 400:
                # User already exists, try to log in
                login_data = {
                    "email": settings.TEST_USER_EMAIL,
                    "password": settings.TEST_USER_PASSWORD
                }
                login_response = await self.client.post(
                    f"{self.base_url}/api/auth/login",
                    json=login_data
                )

                if login_response.status_code == 200:
                    login_result = login_response.json()
                    self.test_token = login_result.get("access_token")
                    return {"success": True, "message": "Test user authenticated"}
                else:
                    return {"success": False, "error": "Failed to authenticate existing test user"}
            else:
                return {"success": False, "error": f"Unexpected response: {response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def test_public_endpoints_status_codes(self) -> List[Dict]:
        """Test that public endpoints return appropriate status codes."""
        public_endpoints = [
            ("/", "GET"),
            ("/api/auth/register", "POST"),
            ("/api/auth/login", "POST"),
        ]

        results = []

        for endpoint, method in public_endpoints:
            try:
                # Prepare request data for POST endpoints
                data = None
                if method == "POST":
                    if "register" in endpoint:
                        data = {
                            "email": f"test_{int(time.time())}@example.com",
                            "password": "password123",
                            "name": "Test User"
                        }
                    elif "login" in endpoint:
                        data = {
                            "email": settings.TEST_USER_EMAIL,
                            "password": settings.TEST_USER_PASSWORD
                        }

                if data:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", json=data)
                else:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}")

                # Determine if the status code is appropriate
                is_appropriate = response.status_code < 500  # No server errors

                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": response.status_code,
                    "expected_range": "2xx-4xx",
                    "is_appropriate": is_appropriate,
                    "response_body": response.text[:200] if response.text else ""
                })

            except Exception as e:
                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": "ERROR",
                    "expected_range": "2xx-4xx",
                    "is_appropriate": False,
                    "error": str(e)
                })

        return results

    async def test_protected_endpoints_without_auth(self) -> List[Dict]:
        """Test that protected endpoints return 401 without authentication."""
        protected_endpoints = [
            ("/api/tasks", "GET"),
            ("/api/tasks", "POST"),
            ("/api/tasks/1", "GET"),
            ("/api/tasks/1", "PUT"),
            ("/api/tasks/1", "DELETE"),
            ("/api/tasks/1/complete", "PATCH"),
            ("/api/auth/profile", "GET")
        ]

        results = []

        for endpoint, method in protected_endpoints:
            try:
                # Prepare request data for POST/PUT endpoints
                data = None
                if method in ["POST", "PUT"]:
                    if "tasks" in endpoint:
                        data = {"description": "test", "completed": False}

                if data:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", json=data)
                else:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}")

                # For protected endpoints without auth, expect 401
                is_expected = response.status_code == 401
                is_appropriate = is_expected  # 401 is the expected behavior

                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": response.status_code,
                    "expected_code": 401,
                    "is_expected": is_expected,
                    "is_appropriate": is_appropriate,
                    "response_body": response.text[:200] if response.text else ""
                })

            except Exception as e:
                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": "ERROR",
                    "expected_code": 401,
                    "is_expected": False,
                    "is_appropriate": False,
                    "error": str(e)
                })

        return results

    async def test_protected_endpoints_with_auth(self) -> List[Dict]:
        """Test that protected endpoints return appropriate status codes with valid authentication."""
        if not self.test_token:
            return [{"error": "No test token available"}]

        protected_endpoints = [
            ("/api/tasks", "GET"),
            ("/api/tasks", "POST"),
            ("/api/auth/profile", "GET")
        ]

        results = []

        for endpoint, method in protected_endpoints:
            try:
                # Prepare request data for POST endpoints
                data = None
                if method == "POST":
                    if "tasks" in endpoint:
                        data = {"description": "test", "completed": False}

                headers = {"Authorization": f"Bearer {self.test_token}"}

                if data:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", json=data, headers=headers)
                else:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", headers=headers)

                # For protected endpoints with valid auth, expect 2xx codes
                is_appropriate = response.status_code in [200, 201, 204]

                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": response.status_code,
                    "expected_range": "2xx",
                    "is_appropriate": is_appropriate,
                    "response_body": response.text[:200] if response.text else ""
                })

            except Exception as e:
                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": "ERROR",
                    "expected_range": "2xx",
                    "is_appropriate": False,
                    "error": str(e)
                })

        return results

    async def test_specific_resource_endpoints(self) -> List[Dict]:
        """Test endpoints that require specific resources (like specific task IDs)."""
        if not self.test_token:
            return [{"error": "No test token available"}]

        # First, create a test task
        create_response = await self.client.post(
            f"{self.base_url}/api/tasks",
            json={"description": "Test task for status code validation", "completed": False},
            headers={"Authorization": f"Bearer {self.test_token}"}
        )

        test_task_id = None
        if create_response.status_code == 200:
            try:
                task_data = create_response.json()
                test_task_id = task_data.get("id")
            except:
                pass

        # Test endpoints with the created task ID or a placeholder
        resource_endpoints = [
            (f"/api/tasks/{test_task_id or '999'}", "GET"),
            (f"/api/tasks/{test_task_id or '999'}", "PUT"),
            (f"/api/tasks/{test_task_id or '999'}", "DELETE"),
            (f"/api/tasks/{test_task_id or '999'}/complete", "PATCH")
        ]

        results = []

        for endpoint, method in resource_endpoints:
            try:
                headers = {"Authorization": f"Bearer {self.test_token}"}

                # Prepare data for PUT requests
                data = None
                if method == "PUT":
                    data = {"description": "Updated test task", "completed": True}

                if data:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", json=data, headers=headers)
                else:
                    response = await self.client.request(method, f"{self.base_url}{endpoint}", headers=headers)

                # For specific resource endpoints, expect 200 (found) or 404 (not found)
                is_appropriate = response.status_code in [200, 204, 404]

                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": response.status_code,
                    "expected_range": "2xx or 404",
                    "is_appropriate": is_appropriate,
                    "response_body": response.text[:200] if response.text else ""
                })

            except Exception as e:
                results.append({
                    "endpoint": endpoint,
                    "method": method,
                    "status_code": "ERROR",
                    "expected_range": "2xx or 404",
                    "is_appropriate": False,
                    "error": str(e)
                })

        return results

    async def run_status_code_validation(self) -> Dict:
        """Run comprehensive HTTP status code validation tests."""
        print("Running HTTP status code validation tests...")

        # Set up test user
        setup_result = await self.setup_test_user()
        if not setup_result["success"]:
            return {"success": False, "error": f"Failed to set up test user: {setup_result['error']}"}

        # Test public endpoints
        public_results = await self.test_public_endpoints_status_codes()

        # Test protected endpoints without auth
        protected_no_auth_results = await self.test_protected_endpoints_without_auth()

        # Test protected endpoints with auth
        protected_with_auth_results = await self.test_protected_endpoints_with_auth()

        # Test specific resource endpoints
        resource_results = await self.test_specific_resource_endpoints()

        # Combine all results
        all_results = {
            "summary": {
                "total_tests": len(public_results) + len(protected_no_auth_results) + len(protected_with_auth_results) + len(resource_results),
                "appropriate_status_codes": sum(1 for r in public_results if r.get("is_appropriate", False)) +
                                         sum(1 for r in protected_no_auth_results if r.get("is_appropriate", False)) +
                                         sum(1 for r in protected_with_auth_results if r.get("is_appropriate", False)) +
                                         sum(1 for r in resource_results if r.get("is_appropriate", False)),
                "public_endpoints_tested": len(public_results),
                "protected_endpoints_without_auth_tested": len(protected_no_auth_results),
                "protected_endpoints_with_auth_tested": len(protected_with_auth_results),
                "resource_endpoints_tested": len(resource_results)
            },
            "public_endpoints": public_results,
            "protected_endpoints_without_auth": protected_no_auth_results,
            "protected_endpoints_with_auth": protected_with_auth_results,
            "resource_endpoints": resource_results
        }

        return all_results

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


async def run_status_code_validation_tests():
    """Run the HTTP status code validation test suite."""
    validator = StatusCodeValidator()
    try:
        results = await validator.run_status_code_validation()
        print(json.dumps(results, indent=2))
        return results
    finally:
        await validator.close()


if __name__ == "__main__":
    import time
    asyncio.run(run_status_code_validation_tests())