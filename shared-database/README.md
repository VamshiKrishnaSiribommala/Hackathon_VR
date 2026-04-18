# Shared Database Configuration

All three applications (Rider, Driver, Main Dashboard) connect to the same MongoDB Atlas cluster.

## Connection String
`mongodb+srv://<username>:<password>@cluster0.mongodb.net/ride-hailing?retryWrites=true&w=majority`

## Collections
- `users` (Riders, Drivers, Admins)
- `rides` (Status, Pickup, Destination, Matching)
- `wallets` (Transactions, Balances)
- `earnings` (Driver daily/monthly summaries)
