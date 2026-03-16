"""
Teach Me This — standalone entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from tools.teach_me_this.router import router as teach_router

app = FastAPI(title="Teach Me This", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teach_router, prefix="/api")
app.mount("/", StaticFiles(directory="frontend/out", html=True), name="frontend")
