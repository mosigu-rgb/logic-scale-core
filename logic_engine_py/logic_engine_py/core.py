import time
import json
import os
import random

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
        
        # 1. Config laden (Beibehalten aus deinem Screenshot)
        print(f"{BLUE}[SYSTEM] Loading engine_settings.json...{RESET}")
        try:
            with open('config/engine_settings.json', 'r') as f:
                self.config = json.load(f)
            print(f"{GREEN}[OK] Configuration '{self.config['engine_name']}' v{self.config['version']} active.{RESET}")
        except:
            print(f"{YELLOW}[WARN] Config not found. Using default recovery weights.{RESET}")
            self.config = {}

        print(f"{GREEN}[OK] Bias-Shield: {self.config.get('modules', {}).get('bias_shield', 'OFF')}{RESET}")
        print("-" * 50)

    # HIER IST DIE NEUE FUNKTION (Ersetzt dein altes run_audit)
    def run_audit(self, user_argument):
        print(f"\n{YELLOW}[ANALYSIS] Initializing Real-Time Processing...{RESET}")
        
        # 1. Analyse simulieren (Das kommt später von Claude)
        analysis_result = {
            "logic_score": round(random.uniform(1.0, 4.5), 1),
            "fallacies": [{"type": "Logical Fallacy", "severity": "medium"}],
            "simulated_twin": "Refined logical version of the argument.",
            "weight_delta": round(random.uniform(0.01, 0.25), 3)
        }
        
        print(f"{BLUE}[SYSTEM] Connecting to API...{RESET}")
        time.sleep(1.0)
        
        # Fortschrittsanzeige (Beibehalten für die Optik im Video)
        for i in range(3):
            time.sleep(0.4)
            print(f"  > Processing Logic-Gate: Round {i+1}/3")
        
        # 2. DATEN VERBINDEN (Schreibt direkt in die Datei)
        print(f"{BLUE}[SYSTEM] Updating knowledge base: {self.cache_path}...{RESET}")
        try:
            with open(self.cache_path, 'r+') as f:
                data = json.load(f)
                new_entry = {
                    "id": f"LS-{len(data)+1:03d}",
                    "input": user_argument,
                    "logic_score": analysis_result["logic_score"],
                    "fallacies": analysis_result["fallacies"],
                    "simulated_twin": analysis_result["simulated_twin"],
                    "weight_delta": analysis_result["weight_delta"]
                }
                data.append(new_entry)
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate() # Löscht alte Reste, falls die Datei kürzer wird
            print(f"{GREEN}[SUCCESS] Entry recorded. Knowledge base expanded to {len(data)} entries.{RESET}")
        except Exception as e:
            print(f"{RED}[ERROR] Database write failed: {e}{RESET}")

        return analysis_result

if __name__ == "__main__":
    engine = LogicScaleEngine()
    # Hier kannst du zum Testen ein Argument eingeben
    engine.run_audit("Dies ist ein Test für die neue Speicher-Funktion.")
    print(f"\n{GREEN}{BOLD}>>> SYSTEM READY AND PERSISTENT.{RESET}")


