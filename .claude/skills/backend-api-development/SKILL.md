---
name: backend-api-development
description: Build backend APIs by generating routes, handling requests and responses, and connecting to databases.
---
@app.post("/tasks")
def create_task(task: TaskCreate):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    return {"id": db_task.id, "status": "created"}
