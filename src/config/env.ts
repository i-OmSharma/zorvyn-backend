import {z} from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("3000"),

    //DB
    DATABASE_URL: z.string().min(1, "DB URL is required"),

    //JWT
    JWT_ACCESS_SECRET: z.string().min(1, "JWT SECRET is required"),
    JWT_REFRESH_SECRET: z.string().min(1, "JWT SECRET is required"),
    JWT_ACCESS_EXPIRES_IN: z.string().min(1, "JWT ACCESS EXPIRES IN is required"),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1, "JWT REFRESH EXPIRES IN is required"),
    

    //BCRYPT
    BCRYPT_ROUNDS: z.string().default("12")
    
});


const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error("Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = {
    NODE_ENV: parsed.data.NODE_ENV,

    PORT: parseInt(parsed.data.PORT.toString(), 10),

    DATABASE_URL: parsed.data.DATABASE_URL,
    
    JWT_ACCESS_SECRET: parsed.data.JWT_ACCESS_SECRET,  
    JWT_REFRESH_SECRET: parsed.data.JWT_REFRESH_SECRET,   
    JWT_ACCESS_EXPIRES_IN: parsed.data.JWT_ACCESS_EXPIRES_IN,   
    JWT_REFRESH_EXPIRES_IN: parsed.data.JWT_REFRESH_EXPIRES_IN,
    BCRYPT_ROUNDS: parseInt(parsed.data.BCRYPT_ROUNDS.toString(), 10),
};
