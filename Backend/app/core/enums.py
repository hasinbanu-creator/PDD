from enum import Enum


class Roles(str, Enum):
    """User role definitions"""
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    DISTRICT_ADMIN = "DISTRICT_ADMIN"
    INSPECTOR = "INSPECTOR"
    WORKER = "WORKER"
    CITIZEN = "CITIZEN"


class ComplaintStatus(str, Enum):
    """Complaint lifecycle statuses"""
    OPEN = "OPEN"
    WORKING = "WORKING"
    APPROVAL = "APPROVAL"
    ASSIGNED = "ASSIGNED"
    ACCEPTED = "ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    FIELD_VISIT = "FIELD_VISIT"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"
    REJECTED = "REJECTED"
    PENDING = "PENDING"


class ComplaintType(str, Enum):
    """Types of complaints"""
    # Canonical new lowercase categories
    GARBAGE_WASTE = "garbage_waste"
    ROAD_DAMAGE = "road_damage"
    POTHOLE = "pothole"
    STREET_LIGHT = "street_light"
    DRAINAGE_ISSUE = "drainage_issue"
    ROAD_WATERLOGGING = "road_waterlogging"
    CONSTRUCTION_BLOCK = "construction_block"

    # Legacy categories for historical database compatibility
    GARBAGE = "GARBAGE"
    ROAD_DAMAGE_LEGACY = "ROAD_DAMAGE"
    POTHOLE_LEGACY = "POTHOLE"
    STREETLIGHT = "STREETLIGHT"
    WATER_SUPPLY = "WATER_SUPPLY"
    DRAINAGE = "DRAINAGE"
    SANITATION = "SANITATION"
    TREE_CUTTING = "TREE_CUTTING"
    CONSTRUCTION = "CONSTRUCTION"
    OTHER = "OTHER"

    # Lowercase legacy names
    water_supply = "water_supply"
    sanitation = "sanitation"
    tree_fallen_branch = "tree_fallen_branch"
    other_issue = "other_issue"


class Priority(str, Enum):
    """Complaint priority levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ComplaintHistoryAction(str, Enum):
    """Actions tracked in complaint history"""
    CREATED = "CREATED"
    ASSIGNED = "ASSIGNED"
    STATUS_CHANGED = "STATUS_CHANGED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"
    FEEDBACK_SUBMITTED = "FEEDBACK_SUBMITTED"
    IMAGE_ADDED = "IMAGE_ADDED"
    NOTE_ADDED = "NOTE_ADDED"