from fastapi import APIRouter, Query
from backend.services.optimization_service import run_optimization_benchmarks

router = APIRouter(prefix="/api/optimization", tags=["Quantum-Inspired Optimization"])

@router.get("/benchmark")
def get_optimization_benchmarks(
    iterations: int = Query(80, ge=20, le=200),
    seed: int = Query(42)
):
    """
    Executes real-time mathematical benchmarking of Quantum-Inspired Simulated Annealing (QSA)
    against Random Search, Greedy Local Search, and Classical Simulated Annealing (SA) on server CPU.
    """
    benchmark_results = run_optimization_benchmarks(iterations=iterations, seed=seed)
    return benchmark_results
