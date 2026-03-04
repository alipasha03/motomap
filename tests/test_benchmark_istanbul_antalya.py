import importlib.util
import json
import sys
from pathlib import Path

import networkx as nx


def _load_benchmark_module():
    module_path = Path(__file__).resolve().parents[1] / "website" / "benchmark_istanbul_antalya_10k.py"
    spec = importlib.util.spec_from_file_location("benchmark_istanbul_antalya_10k", module_path)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


bench = _load_benchmark_module()


def _build_region_graph() -> nx.MultiDiGraph:
    graph = nx.MultiDiGraph()
    # Istanbul-like nodes
    for idx, (lat, lng) in enumerate(
        [
            (41.05, 28.80),
            (41.10, 29.00),
            (40.95, 29.20),
            (41.20, 29.50),
        ],
        start=1,
    ):
        graph.add_node(f"i{idx}", y=lat, x=lng)

    # Antalya-like nodes
    for idx, (lat, lng) in enumerate(
        [
            (36.90, 30.70),
            (37.05, 30.90),
            (36.80, 30.40),
            (37.10, 30.60),
        ],
        start=1,
    ):
        graph.add_node(f"a{idx}", y=lat, x=lng)
    return graph


def test_haversine_istanbul_antalya_is_long_distance():
    # Taksim -> Antalya merkez yaklaşık birkaç yüz km olmalı.
    dist_m = bench.haversine_m(41.0370, 28.9850, 36.8841, 30.7056)
    assert 450_000 <= dist_m <= 650_000


def test_sample_pairs_are_region_valid_and_in_distance_range():
    graph = _build_region_graph()
    pairs = bench.sample_pairs(
        graph=graph,
        count=6,
        seed=123,
        min_crow_m=350_000.0,
        max_crow_m=900_000.0,
        existing=None,
    )

    assert len(pairs) == 6
    identities = {pair.identity for pair in pairs}
    assert len(identities) == len(pairs)

    for pair in pairs:
        assert bench._node_inside_region(pair.origin.lat, pair.origin.lng, bench.ISTANBUL_REGION)
        assert bench._node_inside_region(pair.destination.lat, pair.destination.lng, bench.ANTALYA_REGION)
        assert 350_000.0 <= pair.crow_m <= 900_000.0


def test_filter_pairs_by_crow_reindexes_and_counts_drop():
    pairs = [
        bench.ODPair(1, bench.Point(41.0, 29.0), bench.Point(36.9, 30.7), 520_000.0),
        bench.ODPair(2, bench.Point(41.0, 29.0), bench.Point(36.9, 30.7), 120_000.0),
        bench.ODPair(3, bench.Point(41.0, 29.0), bench.Point(36.9, 30.7), 530_000.0),
    ]
    filtered, dropped = bench.filter_pairs_by_crow(pairs, min_crow_m=300_000.0, max_crow_m=900_000.0)
    assert dropped == 1
    assert [p.case_id for p in filtered] == [1, 2]
    assert [p.crow_m for p in filtered] == [520_000.0, 530_000.0]


def test_load_existing_results_keeps_latest_case_and_counts_malformed(tmp_path: Path):
    path = tmp_path / "results.jsonl"
    lines = [
        json.dumps({"case_id": 1, "google": {"success": True}}),
        "not-json",
        json.dumps({"case_id": 1, "google": {"success": False}, "status": "LATEST"}),
        json.dumps({"case_id": 2, "google": {"success": True}}),
    ]
    path.write_text("\n".join(lines), encoding="utf-8")

    rows, malformed = bench.load_existing_results(path)
    assert malformed == 1
    assert set(rows.keys()) == {1, 2}
    assert rows[1]["status"] == "LATEST"


def test_evaluate_case_computes_ratios_and_ape(monkeypatch):
    pair = bench.ODPair(
        case_id=7,
        origin=bench.Point(41.05, 29.0),
        destination=bench.Point(36.9, 30.7),
        crow_m=520_000.0,
        origin_node=1,
        destination_node=2,
    )
    graph = nx.MultiDiGraph()

    monkeypatch.setattr(
        bench,
        "fetch_google_directions",
        lambda **_: bench.make_backend_result(
            enabled=True, success=True, status="OK", distance_m=600_000.0, duration_s=24_000.0
        ),
    )
    monkeypatch.setattr(
        bench,
        "fetch_valhalla_route",
        lambda **_: bench.make_backend_result(
            enabled=True, success=True, status="OK", distance_m=615_000.0, duration_s=25_200.0
        ),
    )
    monkeypatch.setattr(
        bench,
        "run_motomap_route",
        lambda **_: bench.make_backend_result(
            enabled=True, success=True, status="OK", distance_m=588_000.0, duration_s=22_800.0
        ),
    )

    result = bench.evaluate_case(
        graph=graph,
        pair=pair,
        enable_google=True,
        enable_valhalla=True,
        enable_motomap=True,
        google_session=object(),
        valhalla_session=object(),
        google_limiter=object(),
        valhalla_limiter=object(),
        google_api_key="dummy",
        valhalla_url="https://dummy",
        mode="standart",
        tercih="ucretli_serbest",
        motor_cc=150.0,
    )

    mm = result["comparisons"]["motomap_vs_google"]
    vh = result["comparisons"]["valhalla_vs_google"]
    assert round(mm["distance_ratio"], 4) == 0.98
    assert round(mm["duration_ratio"], 4) == 0.95
    assert round(mm["distance_ape_pct"], 4) == 2.0
    assert round(mm["duration_ape_pct"], 4) == 5.0
    assert round(vh["distance_ratio"], 4) == 1.025
    assert round(vh["duration_ratio"], 4) == 1.05


def test_summarize_comparator_and_backend_counts():
    rows = [
        {
            "google": {"enabled": True, "success": True},
            "valhalla": {"enabled": True, "success": True},
            "motomap": {"enabled": True, "success": False},
            "comparisons": {
                "motomap_vs_google": {
                    "distance_ratio": 0.98,
                    "duration_ratio": 0.95,
                    "distance_ape_pct": 2.0,
                    "duration_ape_pct": 5.0,
                },
                "valhalla_vs_google": {
                    "distance_ratio": 1.02,
                    "duration_ratio": 1.05,
                    "distance_ape_pct": 2.0,
                    "duration_ape_pct": 5.0,
                },
            },
        },
        {
            "google": {"enabled": True, "success": False},
            "valhalla": {"enabled": False, "success": False},
            "motomap": {"enabled": True, "success": True},
            "comparisons": {
                "motomap_vs_google": {
                    "distance_ratio": 1.00,
                    "duration_ratio": 1.01,
                    "distance_ape_pct": 0.0,
                    "duration_ape_pct": 1.0,
                },
                "valhalla_vs_google": {
                    "distance_ratio": None,
                    "duration_ratio": None,
                    "distance_ape_pct": None,
                    "duration_ape_pct": None,
                },
            },
        },
    ]

    mm_stats = bench.summarize_comparator(rows, "motomap_vs_google")
    assert mm_stats["distance_ratio"]["count"] == 2
    assert round(mm_stats["distance_ratio"]["mean"], 4) == 0.99
    assert round(mm_stats["duration_ape_pct"]["mean"], 4) == 3.0

    val_counts = bench.summarize_backend_counts(rows, "valhalla")
    assert val_counts["enabled_cases"] == 1
    assert val_counts["success"] == 1
    assert val_counts["failure"] == 0
    assert val_counts["skipped"] == 1
