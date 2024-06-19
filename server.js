// Import required modules
// TODO: Import the Express framework for creating web applications and APIs
// TODO: Import the sqlite3 module to interact with SQLite databases

// TODO: Create an Express application

// TODO: Middleware to parse JSON request bodies

// TODO: Create SQLite database connection

// TODO: Create table if it doesn't exist with the following values
// Unique identifier for each record (auto-incremented)
// Domain name or hostname (required)
// IP address associated with the hostname (required)

// Function to check if hostname exists and store the record if not
const storeDNSRecord = (hostname, ipAddress, callback) => {
  // TODO: Query to check if hostname exists
  // TODO: // Query to insert a new record

  db.get(checkQuery, [hostname], (err, row) => {
    // TODO: If an error occurs during the check query, call the callback with the error

    if (row) {
      // TODO: If the hostname already exists, call the callback with a message
    } else {
      db.run(insertQuery, [hostname, ipAddress], (err) => {
        // TODO: If an error occurs during the insert query, call the callback with the error
        // TODO: If the record is stored successfully, call the callback with a success message
      });
    }
  });
};

// Function to get hostname by IP address
const getHostnameByIP = (ipAddress, callback) => {
  // TODO: Query to retrieve hostname based on IP address
  db.get(query, [ipAddress], (err, row) => {
    // TODO: If an error occurs during the query, call the callback with the error

    if (row) {
      // TODO: If a hostname is found, call the callback with the hostname
    } else {
      // TODO: If no hostname is found for the given IP address, call the callback with a message
    }
  });
};

// Function to get IP address by hostname
const getIPByHostname = (hostname, callback) => {
  // TODO: Query to retrieve IP address based on hostname
  db.get(query, [hostname], (err, row) => {
    // TODO: If an error occurs during the query, call the callback with the error

    if (row) {
      // TODO: If an IP address is found, call the callback with the IP address
    } else {
      // TODO: If no IP address is found for the given hostname, call the callback with a message
    }
  }); 
};

// Endpoint to store DNS records
app.post("/dns", (req, res) => {
  // TODO: Extract hostname and ipAddress from the request body

  if (!hostname || !ipAddress) {
    // TODO: If either hostname or ipAddress is missing, return a 400 Bad Request error
  }

  storeDNSRecord(hostname, ipAddress, (err, message) => {
    if (err) {
      // TODO: If an error occurs during the database operation, return a 500 Internal Server Error
    }

    // TODO: If the operation is successful, respond with the success message
  });
});

// Endpoint to get hostname by IP address
app.get("/dns/hostname", (req, res) => {
  // TODO: Extract ipAddress from the query parameters

  // TODO: If ipAddress is missing, return a 400 Bad Request error

  getHostnameByIP(ipAddress, (err, hostname) => {
    // TODO: If an error occurs during the database operation, return a 500 Internal Server Error
    // TODO: If the operation is successful, respond with the hostname
  });
});

// Endpoint to get IP address by hostname
app.get("/dns/ip", (req, res) => {
  // TODO: Extract hostname from the query parameters

  // TODO: If hostname is missing, return a 400 Bad Request error

  getIPByHostname(hostname, (err, ipAddress) => {
    // TODO: If an error occurs during the database operation, return a 500 Internal Server Error
    // TODO: If the operation is successful, respond with the IP address
  });
});

// Start the server
const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
