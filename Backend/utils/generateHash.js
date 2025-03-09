import argon2 from "argon2";

const generateHash = async () => {
  try {
    const password = "admin123";
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
    console.log("Generated hash for password:", hashedPassword);
  } catch (error) {
    console.error("Error generating hash:", error);
  }
};

generateHash();
