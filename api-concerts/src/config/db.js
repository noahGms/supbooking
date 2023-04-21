import mongoose from "mongoose";

export async function setupDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
    });

    console.log('Database connected !');
  } catch (error) {
    console.log('Database connection error !');
    console.log(error);

    throw error;
  }
}