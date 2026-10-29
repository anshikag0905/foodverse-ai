import sys
# Prevent cross-project scratch leakage from .pth files
sys.path = [p for p in sys.path if "multimodal-attendance-agent" not in p]
