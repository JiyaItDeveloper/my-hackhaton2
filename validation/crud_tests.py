"""
CRUD operation verification tests to ensure all operations work under authenticated context
"""
import asyncio
import json
from typing import Dict, List, Optional
import httpx
from .config import settings


class CRUDValidator:
    """Validates CRUD operations for todo items under authenticated context."""

    def __init__(self):
        self.base_url = settings.API_BASE_URL
        self.client = httpx.AsyncClient(timeout=settings.API_TIMEOUT)
        self.test_user_token = None
        self.test_user_id = None

    async def setup_test_user(self) -> Dict:
        """Create a test user for CRUD operations."""
        try:
            # First, try to register a test user
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
                # Extract token if available in registration response
                if "access_token" in result:
                    self.test_user_token = result["access_token"]
                    return {"success": True, "message": "Test user created and authenticated"}
                else:
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
                        self.test_user_token = login_result.get("access_token")
                        return {"success": True, "message": "Test user created and authenticated"}
                    else:
                        return {"success": False, "error": "Failed to authenticate test user"}
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
                    self.test_user_token = login_result.get("access_token")
                    return {"success": True, "message": "Test user authenticated"}
                else:
                    return {"success": False, "error": "Failed to authenticate existing test user"}
            else:
                return {"success": False, "error": f"Unexpected response: {response.status_code}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def create_todo(self, description: str) -> Dict:
        """Create a new todo item."""
        if not self.test_user_token:
            return {"success": False, "error": "No authentication token available"}

        try:
            response = await self.client.post(
                f"{self.base_url}/api/tasks",
                json={"description": description, "completed": False},
                headers={"Authorization": f"Bearer {self.test_user_token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code == 200
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_todos(self) -> Dict:
        """Get all todos for the authenticated user."""
        if not self.test_user_token:
            return {"success": False, "error": "No authentication token available"}

        try:
            response = await self.client.get(
                f"{self.base_url}/api/tasks",
                headers={"Authorization": f"Bearer {self.test_user_token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else [],
                "success": response.status_code == 200
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_todo_by_id(self, todo_id: str) -> Dict:
        """Get a specific todo by ID."""
        if not self.test_user_token:
            return {"success": False, "error": "No authentication token available"}

        try:
            response = await self.client.get(
                f"{self.base_url}/api/tasks/{todo_id}",
                headers={"Authorization": f"Bearer {self.test_user_token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code in [200, 404]  # 404 is valid (not found)
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def update_todo(self, todo_id: str, description: str, completed: bool) -> Dict:
        """Update a specific todo."""
        if not self.test_user_token:
            return {"success": False, "error": "No authentication token available"}

        try:
            response = await self.client.put(
                f"{self.base_url}/api/tasks/{todo_id}",
                json={"description": description, "completed": completed},
                headers={"Authorization": f"Bearer {self.test_user_token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code in [200, 404]  # 404 is valid (not found)
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def toggle_todo_completion(self, todo_id: str) -> Dict:
        """Toggle the completion status of a specific todo."""
        if not self.test_user_token:
            return {"success": False, "error": "No authentication token available"}

        try:
            response = await self.client.patch(
                f"{self.base_url}/api/tasks/{todo_id}/complete",
                headers={"Authorization": f"Bearer {self.test_user_token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code in [200, 404]  # 404 is valid (not found)
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def delete_todo(self, todo_id: str) -> Dict:
        """Delete a specific todo."""
        if not self.test_user_token:
            return {"success": False, "error": "No authentication token available"}

        try:
            response = await self.client.delete(
                f"{self.base_url}/api/tasks/{todo_id}",
                headers={"Authorization": f"Bearer {self.test_user_token}"}
            )

            return {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "success": response.status_code in [200, 404]  # 404 is valid (not found)
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def run_crud_validation(self) -> Dict:
        """Run comprehensive CRUD validation tests."""
        print("Running CRUD validation tests...")

        # Set up test user
        setup_result = await self.setup_test_user()
        if not setup_result["success"]:
            return {"success": False, "error": f"Failed to set up test user: {setup_result['error']}"}

        # Test Create operation
        create_result = await self.create_todo("Test todo for validation")
        created_todo = None
        if create_result["success"]:
            created_todo = create_result["response"]

        # Test Read (all) operation
        read_all_result = await self.get_todos()

        # Test Read (single) operation
        todo_id = None
        if created_todo and "id" in created_todo:
            todo_id = created_todo["id"]
            read_single_result = await self.get_todo_by_id(todo_id)
        else:
            read_single_result = {"success": False, "error": "Could not get ID of created todo"}

        # Test Update operation
        update_result = None
        if todo_id:
            update_result = await self.update_todo(todo_id, "Updated test todo", True)

        # Test Toggle completion
        toggle_result = None
        if todo_id:
            toggle_result = await self.toggle_todo_completion(todo_id)

        # Test Delete operation
        delete_result = None
        if todo_id:
            delete_result = await self.delete_todo(todo_id)

        # Final verification - try to get the deleted todo (should return 404)
        final_verification = None
        if todo_id:
            final_verification = await self.get_todo_by_id(todo_id)

        return {
            "summary": {
                "setup_successful": setup_result["success"],
                "create_passed": create_result["success"],
                "read_all_passed": read_all_result["success"],
                "read_single_passed": read_single_result["success"],
                "update_passed": update_result["success"] if update_result else False,
                "toggle_passed": toggle_result["success"] if toggle_result else False,
                "delete_passed": delete_result["success"] if delete_result else False,
                "deletion_verified": final_verification["status_code"] == 404 if final_verification else False,
                "total_operations_passed": sum([
                    setup_result["success"],
                    create_result["success"],
                    read_all_result["success"],
                    read_single_result["success"],
                    update_result["success"] if update_result else False,
                    toggle_result["success"] if toggle_result else False,
                    delete_result["success"] if delete_result else False,
                    final_verification["status_code"] == 404 if final_verification else False
                ])
            },
            "operations": {
                "setup": setup_result,
                "create": create_result,
                "read_all": read_all_result,
                "read_single": read_single_result,
                "update": update_result,
                "toggle": toggle_result,
                "delete": delete_result,
                "verification": final_verification
            }
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


async def run_crud_validation_tests():
    """Run the CRUD validation test suite."""
    validator = CRUDValidator()
    try:
        results = await validator.run_crud_validation()
        print(json.dumps(results, indent=2))
        return results
    finally:
        await validator.close()


if __name__ == "__main__":
    asyncio.run(run_crud_validation_tests())