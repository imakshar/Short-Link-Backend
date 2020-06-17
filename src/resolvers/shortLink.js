import { ShortLink } from "../models";
import {
    UserInputError,
    ValidationError,
    ApolloError,
} from "apollo-server-express";
import dns, { resolve } from "dns";
import mongoose from "mongoose";
const testValidUrl = async (url) => {
    /* firstSlice -> ://www.gtu.ac.in/ */
    let firstSlice = url.match(/(:\/\/[a-z]+.+[a-z]+\/)/g);
    /* finalDomain -> www.gtu.ac.in */
    let finalDomain = firstSlice[0].match(/[^:\/\/]+/g);
    return new Promise((resolve, reject) => {
        dns.lookup(finalDomain[0], (err, address) => {
            if (err) return reject(err);
            resolve(address);
        });
    });
};
const findOneByOrginalUrl = async (url) => {
    return new Promise((resolve, reject) => {
        ShortLink.findOne({ original_url: url }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};
const findOneByShortUrl = async (short_url) => {
    return new Promise((resolve, reject) => {
        ShortLink.findOne({ short_url }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};
const ShortLinksByID = async (id) => {
    //TODO fing by id
    return new Promise((resolve, reject) => {
        ShortLink.find((err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

const UpdateCountById = async (id) => {
    ShortLink.findOne({ _id: id }, async (err, data) => {
        if (data) {
            data.clicks = data.clicks + 1;
            await data.save();
        }
    });
};
const generateRandomString = (length = 6) =>
    Math.random().toString(36).substring(6);

const createAndSaveUrl = async (url, short_url, title) => {
    let short_link = short_url || generateRandomString();
    let res = await findOneByShortUrl(short_link).catch((err) => {
        throw new ApolloError(
            "Somthing went wrong while checking short link in CreateAndSaveURl method"
        );
    });
    if (res) {
        createAndSaveUrl(url, title);
    } else {
        return new Promise((resolve, reject) => {
            new ShortLink({
                original_url: url,
                short_url: short_link,
                title,
            }).save((err, data) => {
                if (err) reject(err);
                resolve({
                    id: data.id,
                    title: data.title,
                    clicks: data.clicks,
                    original_url: data.original_url,
                    short_url: data.short_url,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                });
            });
        });
    }
};
export default {
    ShortLink: {},
    Query: {
        async shortLinks(parent, args, context) {
            let res = await ShortLinksByID(context.auth.user.id).catch(
                (err) => {
                    throw new ValidationError("Invalid Request");
                }
            );
            return res || [];
        },
    },
    Mutation: {
        async createShortLink(parent, args, context) {
            let url = args.original_url;

            let validUrl = await testValidUrl(url).catch((err) => {
                throw new UserInputError("Invalid Url");
            });
            if (validUrl) {
                let res = await findOneByOrginalUrl(url).catch((err) => {
                    throw new ValidationError("URL Not Found");
                });
                if (res) {
                    return res;
                } else {
                    if (args.short_url) {
                        let res = await findOneByShortUrl(args.short_url).catch(
                            (err) => {
                                throw new ApolloError(
                                    "Somthing went wrong while getting old Shortlink"
                                );
                            }
                        );
                        if (res) {
                            throw new UserInputError("ShortLink already exist");
                        }
                    }
                    let res = await createAndSaveUrl(
                        url,
                        args.short_url,
                        args.title
                    ).catch((err) => {
                        throw new ApolloError(
                            "Somthing went wrong while creating new ShortLink"
                        );
                    });
                    return res;
                }
            }
        },
    },
};
export { findOneByShortUrl, UpdateCountById };
