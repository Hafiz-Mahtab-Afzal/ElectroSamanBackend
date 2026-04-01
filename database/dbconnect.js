import mongoose from 'mongoose'
// import { MONGODB_CLOUD_UI } from '../config/config.js'

const dbconnect = () => {
  mongoose
  .connect(process.env.MONGODB_CLOUD_UI)
  .then((err) => console.log(`db is connected ${err.connection.db.databaseName}`))
  .catch(() => console.log("db connection failed"))
}

export default dbconnect;