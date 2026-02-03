from backend.main import app

# For Hugging Face Spaces and other deployments
def get_app():
    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(get_app(), host="0.0.0.0", port=8000)