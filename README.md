# SUPBOOKING

# Postman API

Import supbooking.postman_collection.json and supbooking.postman_environment.json files in postman to test api
For production, you need to use API_GATEWAY_URL variable from environment variables

## Setup Project for development

### Step 1 : Run docker-compose.dev.yml file

### Step 2 : Install dependancies `npm install` for each folder (api)

### Step 3 : Move `.env.example` file to `.env` and update environment variables for each folder (api)

### Step 4 : Run server by running `npm run start` command in each folder (api)

### Step 5 : Enjoy !!!

## Setup Project for production

### Step 1 : Run docker-compose.prod.yml file

### Step 2 : Enjoy !!!

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the api in production mode.

### `npm run dev`

Runs the api in development mode.

## Notes

If you want use Twillo for sms notification, you need to create an account and update .env file with your credentials
