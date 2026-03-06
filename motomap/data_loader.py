import logging

import networkx as nx
import osmnx as ox

from motomap.config import NETWORK_TYPE

FERRY_CUSTOM_FILTER = '["route"="ferry"]'
logger = logging.getLogger(__name__)


def load_graph(place: str, include_ferries: bool = True):
    """Load a place graph from OpenStreetMap and optionally compose ferries."""
    road_graph = ox.graph_from_place(place, network_type=NETWORK_TYPE)
    if not include_ferries:
        return road_graph

    try:
        ferry_graph = ox.graph_from_place(place, custom_filter=FERRY_CUSTOM_FILTER)
    except Exception as exc:  # pragma: no cover - best-effort enrichment
        logger.warning("Ferry graph load failed for %s: %s", place, exc)
        return road_graph

    if ferry_graph.number_of_edges() == 0:
        return road_graph
    return nx.compose(road_graph, ferry_graph)
