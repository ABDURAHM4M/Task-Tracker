import crypto from "crypto";

// Hash token before saving to DB
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export default hashToken;
