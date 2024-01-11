import random

def emotion_classifier(text, motions,expressions):
    motion = random.choice(motions) if motions else None
    expression = random.choice(expressions) if expressions else None
    emotion = text
    return emotion,motion,expression
