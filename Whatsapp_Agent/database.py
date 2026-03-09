import sqlite3

def init_db():
    conn = sqlite3.connect('invoices.db')
    cursor = conn.cursor()

    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number TEXT UNIQUE,
            client_name TEXT,
            amount REAL,
            status TEXT,
            due_date TEXT
        )
    ''')

    # Optional: Clear existing data for fresh seed
    cursor.execute('DELETE FROM invoices')

    # Seed data
    invoices = [
        ('INV-001', 'Acme Corp', 1500.00, 'paid', '2023-10-01'),
        ('INV-002', 'Globex Inc', 2500.50, 'pending', '2023-10-15'),
        ('INV-003', 'Soylent Corp', 300.00, 'overdue', '2023-09-10'),
        ('INV-004', 'Initech', 4200.00, 'pending', '2023-11-01'),
        ('INV-005', 'Umbrella Corp', 8900.00, 'paid', '2023-08-20'),
        ('INV-006', 'Stark Industries', 12500.00, 'pending', '2023-10-30')
    ]

    cursor.executemany('''
        INSERT INTO invoices (invoice_number, client_name, amount, status, due_date)
        VALUES (?, ?, ?, ?, ?)
    ''', invoices)

    conn.commit()
    conn.close()
    print("Database initialized and populated with mock invoices.")

if __name__ == '__main__':
    init_db()
