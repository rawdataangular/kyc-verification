from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KYC Analytics API")

# Setup CORS for frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the KYC Analytics backend!", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
