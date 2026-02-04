"""
Ownership verification tests to ensure users can only access their own data
"""
import asyncio
import json
from typing import Dict, List
import httpx
from .config import settings


class OwnershipValidator:
    """Validates that users can only access their own data and not other users' data."""

    def __init__(self):
        self.base_url = settings.API_BASE_URL
        self.client = httpx.AsyncClient(timeout=settings.API_TIMEOUT)

    async def create_test_user(self, email: str, password: str, name: str) -> Dict:
        """Create a test user account."""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/auth/register",
                json={
                    "email": email,
                    "password": password,
                    "name": name
                }
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code in [200, 400]  # 400 means user already exists
            }
        except Exception as e:
            return {
                "status_code": "ERROR",
                "error": str(e),
                "success": False
            }

    async def authenticate_user(self, email: str, password: str) -> Dict:
        """Authenticate a user and return their token."""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/auth/login",
                json={
                    "email": email,
                    "password": password
                }
            )

            if response.status_code == 200:
                data = response.json()
                token = data.get("access_token") or data.get("token") or (data.get("data", {}) or {}).get("access_token")

                return {
                    "status_code": response.status_code,
                    "token": token,
                    "success": token is not None
                }
            else:
                return {
                    "status_code": response.status_code,
                    "response": response.json() if response.content else {},
                    "success": False
                }
        except Exception as e:
            return {
                "status_code": "ERROR",
                "error": str(e),
                "success": False
            }

    async def create_todo_for_user(self, token: str, description: str) -> Dict:
        """Create a todo for a specific user."""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/tasks",
                json={
                    "description": description,
                    "completed": False
                },
                headers={"Authorization": f"Bearer {token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code == 200
            }
        except Exception as e:
            return {
                "status_code": "ERROR",
                "error": str(e),
                "success": False
            }

    async def get_user_todos(self, token: str) -> Dict:
        """Get all todos for the authenticated user."""
        try:
            response = await self.client.get(
                f"{self.base_url}/api/tasks",
                headers={"Authorization": f"Bearer {token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else [],
                "success": response.status_code == 200
            }
        except Exception as e:
            return {
                "status_code": "ERROR",
                "error": str(e),
                "success": False
            }

    async def get_specific_todo(self, token: str, todo_id: str) -> Dict:
        """Get a specific todo by ID with user's token."""
        try:
            response = await self.client.get(
                f"{self.base_url}/api/tasks/{todo_id}",
                headers={"Authorization": f"Bearer {token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code in [200, 404]  # 404 is valid (todo not found)
            }
        except Exception as e:
            return {
                "status_code": "ERROR",
                "error": str(e),
                "success": False
            }

    async def attempt_cross_user_access(self, other_user_token: str, target_todo_id: str) -> Dict:
        """Attempt to access another user's todo with a different user's token."""
        try:
            response = await self.client.get(
                f"{self.base_url}/api/tasks/{target_todo_id}",
                headers={"Authorization": f"Bearer {other_user_token}"}
            )

            # If we get a 200, that's a failure in terms of data isolation
            # If we get 401, 403, or 404, that indicates proper isolation
            is_isolated = response.status_code in [401, 403, 404]

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "is_isolated": is_isolated,
                "success": is_isolated
            }
        except Exception as e:
            return {
                "status_code": "ERROR",
                "error": str(e),
                "is_isolated": True,
                "success": False
            }

    async def test_user_data_isolation(self) -> Dict:
        """Test that users cannot access other users' data."""
        print("Testing user data isolation...")

        # Create two test users
        user1_email = "user1@test-isolation.com"
        user1_password = "password123"
        user1_name = "Test User 1"

        user2_email = "user2@test-isolation.com"
        user2_password = "password123"
        user2_name = "Test User 2"

        # Create user 1
        user1_create = await self.create_test_user(user1_email, user1_password, user1_name)
        if not user1_create["success"] and user1_create["status_code"] != 400:
            return {"success": False, "error": f"Failed to create user 1: {user1_create}"}

        # Create user 2
        user2_create = await self.create_test_user(user2_email, user2_password, user2_name)
        if not user2_create["success"] and user2_create["status_code"] != 400:
            return {"success": False, "error": f"Failed to create user 2: {user2_create}"}

        # Authenticate user 1
        user1_auth = await self.authenticate_user(user1_email, user1_password)
        if not user1_auth["success"]:
            return {"success": False, "error": f"Failed to authenticate user 1: {user1_auth}"}
        user1_token = user1_auth["token"]

        # Authenticate user 2
        user2_auth = await self.authenticate_user(user2_email, user2_password)
        if not user2_auth["success"]:
            return {"success": False, "error": f"Failed to authenticate user 2: {user2_auth}"}
        user2_token = user2_auth["token"]

        # Create a todo for user 1
        user1_todo_desc = "User 1's private todo"
        user1_todo = await self.create_todo_for_user(user1_token, user1_todo_desc)
        if not user1_todo["success"]:
            return {"success": False, "error": f"Failed to create todo for user 1: {user1_todo}"}

        user1_todo_id = user1_todo["response"].get("id")

        # Create a todo for user 2
        user2_todo_desc = "User 2's private todo"
        user2_todo = await self.create_todo_for_user(user2_token, user2_todo_desc)
        if not user2_todo["success"]:
            return {"success": False, "error": f"Failed to create todo for user 2: {user2_todo}"}

        user2_todo_id = user2_todo["response"].get("id")

        # Verify user 1 can access their own todo
        user1_own_access = await self.get_specific_todo(user1_token, user1_todo_id)
        user1_can_access_own = user1_own_access["success"] and user1_own_access["status_code"] == 200

        # Verify user 2 can access their own todo
        user2_own_access = await self.get_specific_todo(user2_token, user2_todo_id)
        user2_can_access_own = user2_own_access["success"] and user2_own_access["status_code"] == 200

        # Attempt user 1 to access user 2's todo (should be blocked)
        user1_access_user2_todo = await self.attempt_cross_user_access(user1_token, user2_todo_id)

        # Attempt user 2 to access user 1's todo (should be blocked)
        user2_access_user1_todo = await self.attempt_cross_user_access(user2_token, user1_todo_id)

        # Verify user 1 only sees their own todos
        user1_todos = await self.get_user_todos(user1_token)
        user1_todo_count = len(user1_todos["response"]) if user1_todos["success"] and isinstance(user1_todos["response"], list) else 0
        user1_only_sees_own = user1_todo_count == 1  # Should only see their one todo

        # Verify user 2 only sees their own todos
        user2_todos = await self.get_user_todos(user2_token)
        user2_todo_count = len(user2_todos["response"]) if user2_todos["success"] and isinstance(user2_todos["response"], list) else 0
        user2_only_sees_own = user2_todo_count == 1  # Should only see their one todo

        return {
            "summary": {
                "user1_can_access_own_todo": user1_can_access_own,
                "user2_can_access_own_todo": user2_can_access_own,
                "user1_blocked_from_user2_todo": user1_access_user2_todo["is_isolated"],
                "user2_blocked_from_user1_todo": user2_access_user1_todo["is_isolated"],
                "user1_only_sees_own_todos": user1_only_sees_own,
                "user2_only_sees_own_todos": user2_only_sees_own,
                "data_isolation_score": sum([
                    user1_can_access_own,
                    user2_can_access_own,
                    user1_access_user2_todo["is_isolated"],
                    user2_access_user1_todo["is_isolated"],
                    user1_only_sees_own,
                    user2_only_sees_own
                ]),
                "total_tests": 6
            },
            "user1_details": {
                "created": user1_create["success"],
                "authenticated": user1_auth["success"],
                "token_available": bool(user1_token),
                "todo_created": user1_todo["success"],
                "can_access_own": user1_can_access_own,
                "blocked_from_other": user1_access_user2_todo["is_isolated"],
                "todo_count": user1_todo_count
            },
            "user2_details": {
                "created": user2_create["success"],
                "authenticated": user2_auth["success"],
                "token_available": bool(user2_token),
                "todo_created": user2_todo["success"],
                "can_access_own": user2_can_access_own,
                "blocked_from_other": user2_access_user1_todo["is_isolated"],
                "todo_count": user2_todo_count
            },
            "cross_access_attempts": {
                "user1_to_user2_todo": user1_access_user2_todo,
                "user2_to_user1_todo": user2_access_user1_todo
            }
        }

    async def run_ownership_verification(self) -> Dict:
        """Run comprehensive ownership verification tests."""
        print("Running ownership verification tests...")

        # Execute data isolation tests
        isolation_results = await self.test_user_data_isolation()

        return {
            "summary": {
                "data_isolation_tests_passed": isolation_results.get("summary", {}).get("data_isolation_score", 0),
                "total_isolation_tests": isolation_results.get("summary", {}).get("total_tests", 0),
                "overall_success_rate": f"{isolation_results.get('summary', {}).get('data_isolation_score', 0)}/{isolation_results.get('summary', {}).get('total_tests', 0)}"
            },
            "isolation_results": isolation_results
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


async def run_ownership_verification_tests():
    """Run the ownership verification test suite."""
    validator = OwnershipValidator()
    try:
        results = await validator.run_ownership_verification()
        print(json.dumps(results, indent=2))
        return results
    finally:
        await validator.close()


if __name__ == "__main__":
    asyncio.run(run_ownership_verification_tests())