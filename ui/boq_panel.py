from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QLabel, QWidget, QVBoxLayout


SECTION_COLORS = {
    "general": "#4CAF50",
    "structural": "#2196F3",
    "mechanical": "#FF9800",
    "electrical": "#9C27B0",
    "plumbing": "#00BCD4",
    "finishing": "#795548",
}


def _section_header(title: str, color: str | None = None) -> QLabel:
    """Create a styled section header label for the BOQ panel.

    On Windows with Qt6, stylesheet background colors on QLabel are not
    visible unless autoFillBackground is enabled. This function ensures
    the background color is always rendered.
    """
    if color is None:
        color = SECTION_COLORS.get(title.lower(), "#607D8B")

    label = QLabel(title)
    label.setAutoFillBackground(True)
    label.setStyleSheet(
        f"background-color: {color};"
        f"color: white;"
        f"padding: 6px 12px;"
        f"font-weight: bold;"
        f"font-size: 14px;"
        f"border-radius: 3px;"
    )
    label.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter)
    label.setFixedHeight(32)
    return label


class BOQPanel(QWidget):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self._layout = QVBoxLayout(self)
        self._layout.setContentsMargins(8, 8, 8, 8)
        self._layout.setSpacing(4)

    def add_section(self, title: str, color: str | None = None) -> QLabel:
        header = _section_header(title, color)
        self._layout.addWidget(header)
        return header
