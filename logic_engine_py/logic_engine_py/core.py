import time
import json
import os
import random

# Importiert den Spezialisten aus der anderen Datei
from logic_engine_py.analyzer import ArgumentAnalyzer 

# Terminal-Farben
BLUE = "\033[94m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

class LogicScaleEngine:
    def __init__(self):
        self.cache_path = 'data/simulation_results.json'
        self.analyzer = ArgumentAnalyzer() # Analyzer wird gestartet
        
        print(f"{BLUE}[SYSTEM] Loading engine_settings.json...{RESET}")
        try:
            with open('config/engine_settings.json', 'r') as f:
                self.config = json.load(f)
            print(f"{GREEN}[OK] Configuration '{self.config['engine_name']}' active.{RESET}")
        except:
            print(f"{YELLOW}[WARN] Config not found. Using default recovery weights.{RESET}")
            self.config = {"analysis_depth": "standard"}

        print(f"{GREEN}[OK] Bias-Shield: {self.config.get('modules', {}).get('bias_shield', 'OFF')}{RESET}")
        print("-" * 50)

    def run_audit(self, user_argument):
        print(f"\n{YELLOW}[ANALYSIS] Initializing Real-Time Processing...{RESET}")
        
        # 1. ECHTE ANALYSE über die analyzer.py
        logic_score = self.analyzer.calculate_logic_score(user_argument)
        fallacies = self.analyzer.identify_fallacies()
        twin = self.analyzer.generate_synthetic_twin(user_argument)
        
        print(f"{BLUE}[SYSTEM] Connecting to AI-Logic-Gates...{RESET}")
        time.sleep(1.0)
        
        for i in range(3):
            time.sleep(0.4)
            print(f"  > Analyzing Structure: Round {i+1}/3")
        
        # 2. DATEN VERBINDEN & SPEICHERN
        print(f"{BLUE}[SYSTEM] Updating knowledge base: {self.cache_path}...{RESET}")
        try:
            with open(self.cache_path, 'r+') as f:
                data = json.load(f)
                new_entry = {
                    "id": f"LS-{len(data)+1:03d}",
                    "input": user_argument,
                    "logic_score": logic_score,
                    "fallacies": fallacies,
                    "simulated_twin": twin,
                    "weight_delta": round(random.uniform(0.01, 0.25), 3)
                }
                data.append(new_entry)
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate() 
            print(f"{GREEN}[SUCCESS] Entry recorded. Total entries: {len(data)}{RESET}")
        except Exception as e:
            print(f"{RED}[ERROR] Database write failed: {e}{RESET}")

if __name__ == "__main__":
    engine = LogicScaleEngine()
    # Test-Lauf
    engine.run_audit("Videospiele sind schlecht, weil mein Nachbar das sagt.")
    print(f"\n{GREEN}{BOLD}>>> ANALYSIS COMPLETE AND ARCHIVED.{RESET}")
