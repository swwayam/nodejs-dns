// Import required modules
const express = require('express'); // Import the Express framework for creating web applications and APIs
const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 module to interact with SQLite databases

// Create an Express application
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Create SQLite database connection
const db = new sqlite3.Database('dnsdb.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err); // Log any errors that occur during database connection
        return;
    }
    console.log('Connected to SQLite database.'); // Log a success message upon successful connection
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS dns_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT, // Unique identifier for each record (auto-incremented)
    hostname TEXT NOT NULL, // Domain name or hostname (required)
    ip_address TEXT NOT NULL // IP address associated with the hostname (required)
)`);

// Function to check if hostname exists and store the record if not
const storeDNSRecord = (hostname, ipAddress, callback) => {
    const checkQuery = 'SELECT * FROM dns_records WHERE hostname = ?'; // Query to check if hostname exists
    const insertQuery = 'INSERT INTO dns_records (hostname, ip_address) VALUES (?, ?)'; // Query to insert a new record

    db.get(checkQuery, [hostname], (err, row) => {
        if (err) return callback(err); // If an error occurs during the check query, call the callback with the error

        if (row) {
            callback(null, 'Hostname already exists.'); // If the hostname already exists, call the callback with a message
        } else {
            db.run(insertQuery, [hostname, ipAddress], (err) => {
                if (err) return callback(err); // If an error occurs during the insert query, call the callback with the error

                callback(null, 'Record stored successfully.'); // If the record is stored successfully, call the callback with a success message
            });
        }
    });
};

// Function to get hostname by IP address
const getHostnameByIP = (ipAddress, callback) => {
    const query = 'SELECT hostname FROM dns_records WHERE ip_address = ?'; // Query to retrieve hostname based on IP address
    db.get(query, [ipAddress], (err, row) => {
        if (err) return callback(err); // If an error occurs during the query, call the callback with the error

        if (row) {
            callback(null, row.hostname); // If a hostname is found, call the callback with the hostname
        } else {
            callback(null, 'IP address not found.'); // If no hostname is found for the given IP address, call the callback with a message
        }
    });
};

// Function to get IP address by hostname
const getIPByHostname = (hostname, callback) => {
    const query = 'SELECT ip_address FROM dns_records WHERE hostname = ?'; // Query to retrieve IP address based on hostname
    db.get(query, [hostname], (err, row) => {
        if (err) return callback(err); // If an error occurs during the query, call the callback with the error

        if (row) {
            callback(null, row.ip_address); // If an IP address is found, call the callback with the IP address
        } else {
            callback(null, 'Hostname not found.'); // If no IP address is found for the given hostname, call the callback with a message
        }
    });
};

// Endpoint to store DNS records
app.post('/dns', (req, res) => {
    const { hostname, ipAddress } = req.body; // Extract hostname and ipAddress from the request body

    if (!hostname || !ipAddress) {
        return res.status(400).json({ error: 'Hostname and IP address are required.' }); // If either hostname or ipAddress is missing, return a 400 Bad Request error
    }

    storeDNSRecord(hostname, ipAddress, (err, message) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' }); // If an error occurs during the database operation, return a 500 Internal Server Error
        }

        res.json({ message }); // If the operation is successful, respond with the success message
    });
});

// Endpoint to get hostname by IP address
app.get('/dns/hostname', (req, res) => {
    const { ipAddress } = req.query; // Extract ipAddress from the query parameters

    if (!ipAddress) {
        return res.status(400).json({ error: 'IP address is required.' }); // If ipAddress is missing, return a 400 Bad Request error
    }

    getHostnameByIP(ipAddress, (err, hostname) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' }); // If an error occurs during the database operation, return a 500 Internal Server Error
        }

        res.json({ hostname }); // If the operation is successful, respond with the hostname
    });
});

// Endpoint to get IP address by hostname
app.get('/dns/ip', (req, res) => {
    const { hostname } = req.query; // Extract hostname from the query parameters

    if (!hostname) {
        return res.status(400).json({ error: 'Hostname is required.' }); // If hostname is missing, return a 400 Bad Request error
    }

    getIPByHostname(hostname, (err, ipAddress) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' }); // If an error occurs during the database operation, return a 500 Internal Server Error
        }

        res.json({ ipAddress }); // If the operation is successful, respond with the IP address
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log a message to indicate that the server is running
});