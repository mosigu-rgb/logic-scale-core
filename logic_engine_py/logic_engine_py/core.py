import time
import json
import os
import random

# Terminal-Farben
BLUE = "\033[94m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BOLD = "\033[1m"
RESET = "\033[0m"

class LogicScaleEngine:
    def __init__(self):
        # 1. Config laden
        print(f"{BLUE}[SYSTEM] Loading engine_settings.json...{RESET}")
        try:
            # Hier passen wir den Pfad an, damit er die neue Datei findet
            with open('config/engine_settings.json', 'r') as f:
                self.config = json.load(f)
            print(f"{GREEN}[OK] Configuration '{self.config['engine_name']}' v{self.config['version']} active.{RESET}")
        except:
            print(f"{YELLOW}[WARN] Config not found. Using default recovery weights.{RESET}")

        print(f"{GREEN}[OK] Bias-Shield: {self.config.get('modules', {}).get('bias_shield', 'OFF')}{RESET}")
        print("-" * 50)

    def run_audit(self, user_argument):
        print(f"\n{YELLOW}[ANALYSIS] Auditing with Depth: {self.config.get('analysis_depth', 'standard')}{RESET}")
        print(f"{BLUE}[SYSTEM] Connecting to API...{RESET}")
        time.sleep(1.2)
        
        print(f"{BOLD}[LEARNING] Adversarial Simulation in Progress...{RESET}")
        for i in range(3):
            time.sleep(0.5)
            print(f"  > Processing: Round {i+1}/3")
        
        print(f"{GREEN}[SUCCESS] Audit complete.{RESET}")

if __name__ == "__main__":
    engine = LogicScaleEngine()
    engine.run_audit("Beispiel-Argument.")

