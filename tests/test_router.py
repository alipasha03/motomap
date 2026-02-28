import networkx as nx
import pytest

from motomap.router import (
    NoRouteFoundError,
    TRAVEL_TIME_ATTR,
    add_travel_time_to_graph,
    ucret_opsiyonlu_rota_hesapla,
)


def _build_graph_toll_is_faster():
    graph = nx.MultiDiGraph()
    # Toll route: 1 -> 2 -> 3 (faster)
    graph.add_edge(1, 2, 0, length=1000, maxspeed=90, toll="yes")
    graph.add_edge(2, 3, 0, length=1000, maxspeed=90, toll="yes")
    # Free route: 1 -> 4 -> 3 (slower)
    graph.add_edge(1, 4, 0, length=3000, maxspeed=60, toll="no")
    graph.add_edge(4, 3, 0, length=3000, maxspeed=60, toll="no")
    return graph


def _build_graph_free_is_faster():
    graph = nx.MultiDiGraph()
    # Toll route (slower)
    graph.add_edge(1, 2, 0, length=5000, maxspeed=50, toll="yes")
    graph.add_edge(2, 3, 0, length=5000, maxspeed=50, toll="yes")
    # Free route (faster)
    graph.add_edge(1, 4, 0, length=2000, maxspeed=60, toll="no")
    graph.add_edge(4, 3, 0, length=2000, maxspeed=60, toll="no")
    return graph


def test_add_travel_time_to_graph_sets_edge_attribute():
    graph = _build_graph_toll_is_faster()
    add_travel_time_to_graph(graph)
    data = graph.edges[1, 2, 0]
    assert TRAVEL_TIME_ATTR in data
    assert data[TRAVEL_TIME_ATTR] > 0


def test_ucretli_serbest_selects_toll_when_toll_is_faster():
    graph = _build_graph_toll_is_faster()
    result = ucret_opsiyonlu_rota_hesapla(graph, 1, 3, tercih="ucretli_serbest")

    assert result["secilen_rota"]["nodes"] == [1, 2, 3]
    assert result["secilen_rota"]["ucretli_yol_iceriyor"] is True
    assert result["alternatifler"]["ucretsiz"]["nodes"] == [1, 4, 3]


def test_ucretli_serbest_can_still_choose_free_route_when_faster():
    graph = _build_graph_free_is_faster()
    result = ucret_opsiyonlu_rota_hesapla(graph, 1, 3, tercih="ucretli_serbest")

    assert result["secilen_rota"]["nodes"] == [1, 4, 3]
    assert result["secilen_rota"]["ucretli_yol_iceriyor"] is False


def test_ucretsiz_preference_forces_non_toll_route():
    graph = _build_graph_toll_is_faster()
    result = ucret_opsiyonlu_rota_hesapla(graph, 1, 3, tercih="ucretsiz")

    assert result["secilen_rota"]["nodes"] == [1, 4, 3]
    assert result["secilen_rota"]["ucretli_yol_iceriyor"] is False


def test_ucretsiz_raises_when_no_non_toll_route_exists():
    graph = nx.MultiDiGraph()
    graph.add_edge(1, 2, 0, length=1000, maxspeed=60, toll="yes")
    graph.add_edge(2, 3, 0, length=1000, maxspeed=60, toll="yes")

    with pytest.raises(NoRouteFoundError):
        ucret_opsiyonlu_rota_hesapla(graph, 1, 3, tercih="ucretsiz")
