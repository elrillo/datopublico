import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env vars
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_table(table_name, select_query="*", expected_error=None):
    print(f"Checking table '{table_name}'...")
    try:
        supabase.table(table_name).select(select_query).limit(1).execute()
        print(f"✅ Table '{table_name}' exists and is accessible.")
        return True
    except Exception as e:
        # Supabase-py might raise an error if table doesn't exist
        # The error message usually contains "relation ... does not exist"
        msg = str(e)
        if "does not exist" in msg or "404" in msg:
            print(f"❌ Table '{table_name}' does NOT exist or is not accessible.")
        else:
            print(f"⚠️ Error checking '{table_name}': {msg}")
        return False

def check_column(table_name, column_name):
    print(f"Checking column '{column_name}' in '{table_name}'...")
    try:
        supabase.table(table_name).select(column_name).limit(1).execute()
        print(f"✅ Column '{column_name}' exists in '{table_name}'.")
        return True
    except Exception as e:
        print(f"❌ Column '{column_name}' does NOT exist in '{table_name}' (or table missing).")
        return False

def main():
    print("--- Verifying Admin Suite Setup ---")
    print(f"Targeting Supabase URL: {SUPABASE_URL[:20]}...")
    
    all_good = True
    
    # 1. Check site_settings
    if not check_table("site_settings"):
        all_good = False
        
    # 2. Check audit_logs
    if not check_table("audit_logs"):
        all_good = False
        
    # 3. Check membership_expires_at in profiles
    if not check_column("profiles", "membership_expires_at"):
        all_good = False
        
    print("-" * 30)
    if all_good:
        print("🎉 All checks passed! The database schema is ready.")
    else:
        print("⚠️ Some checks failed. Please run the SQL migration scripts in Supabase Dashboard.")
        print("Tip: If you just ran the SQL, try reloading the Schema Cache in Supabase Settings > API.")

if __name__ == "__main__":
    main()
