from website.comparison_suite import (
    DEFAULT_CASE_DEFINITIONS,
    build_case_evidence,
    build_suite_summary,
)


def make_case_doc() -> dict:
    return {
        "case_id": "sample",
        "label": "Sample",
        "origin": {"lat": 40.0, "lng": 29.0},
        "destination": {"lat": 40.1, "lng": 29.1},
        "origin_label": "A",
        "destination_label": "B",
        "baseline_backend": "google",
        "baseline_route": [{"lat": 40.0, "lng": 29.0}, {"lat": 40.1, "lng": 29.1}],
        "baseline_stats": {"mesafe_m": 10000.0, "sure_s": 900.0},
        "modes": {
            "standart": {
                "coordinates": [{"lat": 40.0, "lng": 29.0}, {"lat": 40.1, "lng": 29.1}],
                "stats": {
                    "mesafe_m": 9800.0,
                    "sure_s": 870.0,
                    "viraj_fun": 4,
                    "viraj_tehlike": 1,
                    "yuksek_risk": 2,
                    "ortalama_egim": 0.03,
                    "ucretli": False,
                },
            },
            "viraj_keyfi": {
                "coordinates": [{"lat": 40.0, "lng": 29.0}, {"lat": 40.1, "lng": 29.1}],
                "stats": {
                    "mesafe_m": 10300.0,
                    "sure_s": 940.0,
                    "viraj_fun": 7,
                    "viraj_tehlike": 2,
                    "yuksek_risk": 3,
                    "ortalama_egim": 0.04,
                    "ucretli": False,
                },
            },
            "guvenli": {
                "coordinates": [{"lat": 40.0, "lng": 29.0}, {"lat": 40.1, "lng": 29.1}],
                "stats": {
                    "mesafe_m": 10100.0,
                    "sure_s": 920.0,
                    "viraj_fun": 3,
                    "viraj_tehlike": 1,
                    "yuksek_risk": 1,
                    "ortalama_egim": 0.02,
                    "ucretli": False,
                },
            },
        },
    }


def test_default_case_definitions_cover_three_routes():
    assert len(DEFAULT_CASE_DEFINITIONS) == 3
    assert len({item["case_id"] for item in DEFAULT_CASE_DEFINITIONS}) == 3


def test_build_case_evidence_marks_pass_and_computes_deltas():
    evidence = build_case_evidence(make_case_doc())

    assert evidence["verdict"] == "PASS"
    assert evidence["score"] == evidence["total"]
    assert evidence["mode_comparisons"]["standart"]["distance_ratio_vs_baseline"] == 0.98
    assert evidence["mode_comparisons"]["viraj_keyfi"]["fun_delta_vs_standard"] == 3
    assert evidence["mode_comparisons"]["guvenli"]["risk_delta_vs_standard"] == -1


def test_build_suite_summary_counts_cases_and_mode_routes():
    cases = [{"evidence": {"verdict": "PASS", "score": 6, "total": 6}} for _ in range(3)]

    summary = build_suite_summary(cases)

    assert summary["total_cases"] == 3
    assert summary["total_mode_routes"] == 9
    assert summary["passed_cases"] == 3
    assert summary["average_score_ratio"] == 1.0
