import { User } from "../models";
import { UserInputError, ApolloError } from "apollo-server-express";
import mongoose from "mongoose";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { pubsub } from "../utils";
import { ValidateToken } from "./tempResetToken";
const findOneByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({ email }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};
export default {
    User: {
        message(parent) {
            return `Hello ${parent.name}!`;
        },
    },
    Query: {
        async users(parent, args, context) {
            return User.find({});
        },
        async auth_user(parent, args, context) {
            if (!mongoose.isValidObjectId(args.id)) {
                throw new UserInputError(`Invalid UserId provided!`);
            }
            return User.findById(context.auth.user.id);
        },
    },
    Mutation: {
        async signup(parent, args, context) {
            let count = await User.countDocuments({ email: args.email });
            if (count > 0) {
                throw new UserInputError(
                    "Another account already exist with this email ID."
                );
            }
            let user = await User.create(args);
            let welcomeMessage = `Welcome ${user.name}!`;
            pubsub.publish("WELCOME", { welcomeMessage });
            return user;
        },
        async signin(parent, { email, password }, context) {
            let user = await User.findOne({ email });
            if (user) {
                let isPasswordCorrect = await compare(password, user.password);
                if (!isPasswordCorrect) {
                    throw new UserInputError("Password is incorrect");
                }
                const { id, name, email } = user;
                const token = jwt.sign(
                    { id, name, email },
                    process.env.APP_SECRET
                );
                return { token };
            }
            throw new UserInputError("User with this email id not found.");
        },
        async remove_all_users(parent, args, context) {
            if (args.key === "sudo delete all") await User.deleteMany({});
            return true;
        },
        async reset_password(parent, args, context) {
            let { email, token, new_password } = args;
            let res = await ValidateToken(email, token).catch((err) => {
                throw new UserInputError(err);
            });
            if (res && res.isValid) {
                await User.findOne({ email }, async (err, data) => {
                    if (err) throw new ApolloError("Somthing went wrong");
                    if (data) {
                        data.password = new_password;
                        await data.save();
                    }
                });
                return true;
            } else {
                throw new UserInputError("Token expired");
            }
        },
    },
};

export { findOneByEmail };
