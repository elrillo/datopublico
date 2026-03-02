import os

# SEGURIDAD: La clave debe definirse en la variable de entorno
# NEXT_PUBLIC_LEGISLATIVO_ANON_KEY, nunca hardcodeada en codigo.
path = r"app/.env.local"
new_key = os.getenv("NEXT_PUBLIC_LEGISLATIVO_ANON_KEY")

if not new_key:
    raise ValueError("La variable de entorno NEXT_PUBLIC_LEGISLATIVO_ANON_KEY no esta definida.")

with open(path, "r") as f:
    lines = f.readlines()

with open(path, "w") as f:
    for line in lines:
        if "NEXT_PUBLIC_LEGISLATIVO_ANON_KEY=" in line:
            f.write(f"NEXT_PUBLIC_LEGISLATIVO_ANON_KEY={new_key}\n")
        else:
            f.write(line)

print("Actualizado.")
