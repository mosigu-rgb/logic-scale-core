import random

class ArgumentAnalyzer:
    """
    Spezialisierte Klasse für die logische Tiefenanalyse.
    Diese Komponente simuliert die Erkennung von Fehlschlüssen 
    und die Berechnung der Argumentationsgüte.
    """
    
    def __init__(self, precision_mode=True):
        self.precision_mode = precision_mode

    def calculate_logic_score(self, text):
        """Berechnet einen Score basierend auf der Komplexität des Inputs."""
        # Simulation: Längere Texte mit Fachbegriffen erhalten oft höhere Scores
        base_score = random.uniform(1.8, 3.8)
        
        # Ein kleiner Bonus für "komplexere" Argumente (simuliert durch Länge)
        if len(text) > 60:
            base_score += 0.7
            
        return round(min(base_score, 5.0), 1)

    def identify_fallacies(self):
        """Identifiziert zufällige logische Fehlschlüsse für die Demo."""
        fallacy_pool = [
            {"type": "Ad Hominem", "severity": "high"},
            {"type": "Slippery Slope", "severity": "medium"},
            {"type": "Strawman Argument", "severity": "critical"},
            {"type": "Circular Reasoning", "severity": "high"},
            {"type": "False Dilemma", "severity": "medium"}
        ]
        # Gibt 1 bis 2 zufällige Fehlschlüsse zurück
        return random.sample(fallacy_pool, random.randint(1, 2))

    def generate_synthetic_twin(self, text):
        """Erstellt eine optimierte, rein logische Version des Arguments."""
        # In der echten Version würde hier die Claude-API den Text umformulieren
        return f"LogicScale-Refinement: 'The empirical evidence suggests a more nuanced view than: {text[:30]}...'"
