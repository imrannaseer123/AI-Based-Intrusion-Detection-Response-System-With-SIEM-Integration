import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Default to port 8001 to avoid conflict with Splunk (port 8000)
    if 'runserver' in sys.argv and not any(arg.startswith('0') or arg[0].isdigit() for arg in sys.argv[2:]):
        sys.argv.append('8001')

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
