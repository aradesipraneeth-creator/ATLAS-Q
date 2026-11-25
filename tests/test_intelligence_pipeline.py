"""
Automated verification tests for ATLAS-Q LNN, GNN, Flood, Copilot, Evaluation, and AP Pilot services.
"""

import unittest
from backend.services.ap_pilot_data import AP_DISTRICTS, AP_RIVER_EDGES, REGION_COVERAGE_METADATA
from backend.services.lnn_service import run_lnn_temporal_forecast
from backend.services.gnn_service import run_gnn_spatial_inference
from backend.services.flood_service import simulate_ap_flood_progression, scs_runoff_depth_mm
from backend.services.copilot_service import query_disaster_copilot
from backend.services.evaluation_service import get_model_evaluation_report

class TestAtlasQIntelligencePipeline(unittest.TestCase):
    def test_region_modes_and_ap_pilot(self):
        self.assertIn("india", REGION_COVERAGE_METADATA)
        self.assertIn("andhra_pradesh", REGION_COVERAGE_METADATA)
        self.assertEqual(len(AP_DISTRICTS), 16)
        self.assertGreaterEqual(len(AP_RIVER_EDGES), 8)

    def test_lnn_causal_rollout(self):
        res = run_lnn_temporal_forecast("Konaseema (AP-KNS)")
        self.assertEqual(res["model_id"], "atlasq-lnn-cfc-v1.0.0")
        self.assertEqual(len(res["forecast_outlook"]), 3)
        for item in res["forecast_outlook"]:
            self.assertGreaterEqual(item["lightning_probability"], 0.0)
            self.assertLessEqual(item["lightning_probability"], 1.0)

    def test_gnn_spatial_graph_inference(self):
        res = run_gnn_spatial_inference(cyclone_wind_boost=1.2, rain_multiplier=1.3)
        self.assertEqual(res["graph_stats"]["num_nodes"], 16)
        self.assertGreater(res["graph_stats"]["num_edges"], 16)
        self.assertEqual(len(res["district_predictions"]), 16)

    def test_hydrological_flood_simulation(self):
        self.assertGreater(scs_runoff_depth_mm(200.0, 84), 100.0)
        res = simulate_ap_flood_progression(rainfall_multiplier=1.4, storm_surge_m=2.0)
        self.assertEqual(len(res["basins"]), 3)
        for b in res["basins"]:
            self.assertGreater(b["peak_water_depth_m"], 0.0)
            self.assertEqual(len(b["progression"]), 6)

    def test_disaster_copilot_grounding(self):
        res = query_disaster_copilot("Which Andhra Pradesh districts intersect this cyclone scenario?")
        self.assertIn("Andhra Pradesh", res["answer"])
        self.assertGreater(len(res["evidence"]), 0)
        self.assertIn("DECISION-SUPPORT NOTICE", res["disclaimer"])

    def test_evaluation_report(self):
        res = get_model_evaluation_report()
        self.assertEqual(res["evaluation_status"], "PROTOTYPE_HISTORICAL_REPLAY_BENCHMARK")
        self.assertEqual(len(res["lightning_evaluation"]["windows"]), 3)

if __name__ == "__main__":
    unittest.main()
