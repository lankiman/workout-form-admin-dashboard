import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    statics: {
      async signup(email: string, password: string, role: string) {
        //validation

        if (!email || !password) {
          throw new Error("All Feilds Must be Filled");
        }

        if (!validator.isEmail(email)) {
          throw Error("Email is not Valid");
        }
        if (!validator.isStrongPassword(password)) {
          throw Error(" Password not Strong enough");
        }

        const exists = await this.findOne({ email });

        if (exists) {
          throw new Error("Email already in Use");
        }

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(password, salt);

        const user = await this.create({ email, password: hash, role });

        return user;
      },
      async login(email: string, password: string) {
        if (!email || !password) {
          throw new Error("All Feilds Must be Filled");
        }
        const user = await this.findOne({ email });
        if (!user) {
          throw new Error("Incorrect Email");
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          throw new Error(" Incorrect Password");
        }
        return user;
      }
    }
  }
);
export default mongoose.model("User", userSchema);
