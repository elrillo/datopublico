
import os

path = r"app/.env.local"
new_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibml1Y2tweHh6cGh0dXJ3bmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzQ1MDEsImV4cCI6MjA4MDExMDUwMX0.34UkJSs0urfSPyg8PckRQ_OB0pwos0PGj2LvOd2D-R4"

with open(path, "r") as f:
    lines = f.readlines()

with open(path, "w") as f:
    for line in lines:
        if "NEXT_PUBLIC_LEGISLATIVO_ANON_KEY=" in line:
            f.write(f"NEXT_PUBLIC_LEGISLATIVO_ANON_KEY={new_key}\n")
        else:
            f.write(line)
            
print("Actualizado.")
