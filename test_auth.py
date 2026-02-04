import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_api_endpoints():
    print("Testing API endpoints...")

    # Test registration
    print("\n1. Testing user registration...")
    registration_data = {
        "email": "test@example.com",
        "password": "password123",
        "name": "Test User"
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=registration_data)
        print(f"Registration status: {response.status_code}")
        if response.status_code == 200:
            print("[SUCCESS] Registration successful")
            user_data = response.json()
            print(f"User created: {user_data.get('email', 'N/A')}")
        else:
            print(f"[ERROR] Registration failed: {response.text}")
    except Exception as e:
        print(f"[ERROR] Registration error: {e}")

    # Test login
    print("\n2. Testing user login...")
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }

    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login status: {response.status_code}")
        if response.status_code == 200:
            print("[SUCCESS] Login successful")
            token_data = response.json()
            print(f"Access token received: {'access_token' in token_data}")
            return token_data.get('access_token')
        else:
            print(f"[ERROR] Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"[ERROR] Login error: {e}")
        return None

    # Test getting user profile
    print("\n3. Testing user profile retrieval...")
    if token:
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Profile retrieval status: {response.status_code}")
            if response.status_code == 200:
                print("[SUCCESS] Profile retrieval successful")
                user_info = response.json()
                print(f"User info: {user_info.get('email', 'N/A')}")
            else:
                print(f"[ERROR] Profile retrieval failed: {response.text}")
        except Exception as e:
            print(f"[ERROR] Profile retrieval error: {e}")
    else:
        print("[WARNING] Skipping profile test - no token from login")

if __name__ == "__main__":
    test_api_endpoints()