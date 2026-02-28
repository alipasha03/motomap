"""Routing utilities with toll-aware preferences."""

from __future__ import annotations

import re
from collections.abc import Hashable

import networkx as nx

TRAVEL_TIME_ATTR = "travel_time_s"
DEFAULT_SPEED_KMH = 50.0


class NoRouteFoundError(ValueError):
    """Raised when no route can be found for the selected preference."""


def _parse_speed_kmh(value, default: float = DEFAULT_SPEED_KMH) -> float:
    """Parse OSM maxspeed-like values into km/h."""
    if value is None:
        return default

    if isinstance(value, (int, float)):
        speed = float(value)
        return speed if speed > 0 else default

    if isinstance(value, list) and value:
        return _parse_speed_kmh(value[0], default=default)

    if isinstance(value, str):
        match = re.search(r"\d+(\.\d+)?", value)
        if match:
            speed = float(match.group(0))
            return speed if speed > 0 else default

    return default


def is_toll_edge(edge_data: dict) -> bool:
    """Return True when an edge is marked as toll."""
    value = edge_data.get("toll")
    if isinstance(value, list):
        return any(is_toll_edge({"toll": item}) for item in value)
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"yes", "true", "1"}
    return False


def add_travel_time_to_graph(
    graph: nx.MultiDiGraph,
    attr_name: str = TRAVEL_TIME_ATTR,
) -> nx.MultiDiGraph:
    """Add per-edge travel time in seconds."""
    for _, _, _, data in graph.edges(keys=True, data=True):
        length_m = float(data.get("length", 0.0) or 0.0)
        speed_kmh = _parse_speed_kmh(data.get("maxspeed"), default=DEFAULT_SPEED_KMH)
        speed_ms = max(1.0, speed_kmh / 3.6)
        data[attr_name] = length_m / speed_ms
    return graph


def _best_edge_data(
    graph: nx.MultiDiGraph,
    u: Hashable,
    v: Hashable,
    weight: str,
    allow_toll: bool,
) -> dict:
    candidates = []
    edges = graph.get_edge_data(u, v) or {}
    for data in edges.values():
        if not allow_toll and is_toll_edge(data):
            continue
        candidates.append(data)

    if not candidates:
        raise NoRouteFoundError("No matching edge found for route segment.")

    return min(candidates, key=lambda data: float(data.get(weight, float("inf"))))


def _shortest_path(
    graph: nx.MultiDiGraph,
    source: Hashable,
    target: Hashable,
    weight: str,
    allow_toll: bool,
) -> list[Hashable] | None:
    try:
        if allow_toll:
            return nx.shortest_path(graph, source, target, weight=weight)

        non_toll_edges = [
            (u, v, k)
            for u, v, k, data in graph.edges(keys=True, data=True)
            if not is_toll_edge(data)
        ]
        free_graph = graph.edge_subgraph(non_toll_edges).copy()
        if source not in free_graph or target not in free_graph:
            return None
        return nx.shortest_path(free_graph, source, target, weight=weight)
    except nx.NetworkXNoPath:
        return None


def _summarize_route(
    graph: nx.MultiDiGraph,
    nodes: list[Hashable],
    weight: str,
    allow_toll: bool,
) -> dict:
    total_time = 0.0
    total_length = 0.0
    includes_toll = False

    for idx in range(len(nodes) - 1):
        edge_data = _best_edge_data(
            graph,
            nodes[idx],
            nodes[idx + 1],
            weight=weight,
            allow_toll=allow_toll,
        )
        total_time += float(edge_data.get(weight, 0.0))
        total_length += float(edge_data.get("length", 0.0) or 0.0)
        includes_toll = includes_toll or is_toll_edge(edge_data)

    return {
        "nodes": nodes,
        "toplam_sure_s": total_time,
        "toplam_mesafe_m": total_length,
        "ucretli_yol_iceriyor": includes_toll,
    }


def ucret_opsiyonlu_rota_hesapla(
    graph: nx.MultiDiGraph,
    source: Hashable,
    target: Hashable,
    tercih: str = "ucretli_serbest",
    weight: str = TRAVEL_TIME_ATTR,
) -> dict:
    """Compute toll-aware route outputs and apply user preference.

    `tercih` values:
    - `ucretli_serbest`: allow toll roads, but still choose free route if faster.
    - `ucretsiz`: force non-toll route only.
    """
    if tercih not in {"ucretli_serbest", "ucretsiz"}:
        raise ValueError("tercih must be 'ucretli_serbest' or 'ucretsiz'")

    add_travel_time_to_graph(graph, attr_name=weight)

    serbest_nodes = _shortest_path(
        graph,
        source=source,
        target=target,
        weight=weight,
        allow_toll=True,
    )
    if serbest_nodes is None:
        raise NoRouteFoundError("No route found between source and target.")

    ucretsiz_nodes = _shortest_path(
        graph,
        source=source,
        target=target,
        weight=weight,
        allow_toll=False,
    )

    alternatifler = {
        "ucretli_serbest": _summarize_route(
            graph,
            serbest_nodes,
            weight=weight,
            allow_toll=True,
        ),
        "ucretsiz": (
            _summarize_route(
                graph,
                ucretsiz_nodes,
                weight=weight,
                allow_toll=False,
            )
            if ucretsiz_nodes is not None
            else None
        ),
    }

    if tercih == "ucretsiz":
        if alternatifler["ucretsiz"] is None:
            raise NoRouteFoundError("No non-toll route is available.")
        secilen = alternatifler["ucretsiz"]
    else:
        secilen = alternatifler["ucretli_serbest"]

    return {
        "tercih": tercih,
        "secilen_rota": secilen,
        "alternatifler": alternatifler,
    }
