import { findOneByShortUrl, UpdateCountById } from "./src/resolvers/shortLink";
import { findOneByEmail } from "./src/resolvers/user";
import nodemailer from "nodemailer";
import { GenrateToken, ValidateToken } from "./src/resolvers/tempResetToken";
const loadAdditionalRoutes = (app) => {
    app.get("/api/:shortUrl", async (req, res) => {
        let response = await findOneByShortUrl(req.params.shortUrl).catch(
            (error) => {
                res.json({ error });
            }
        );
        if (response) {
            UpdateCountById(response._id);
            res.redirect(response.original_url);
        } else {
            res.json({ message: "oops, shortlink is not exist!" });
        }
    });
    app.post("/api/forgot_password/:email", async (req, res) => {
        let user = await findOneByEmail(req.params.email);
        if (user) {
            let response = await GenrateToken(req.params.email, "email").catch(
                (err) => {
                    res.status(403).send(
                        "Somthing went wrong in token generation"
                    );
                }
            );

            let mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PW,
                },
            });
            let mailDetails = {
                from: process.env.EMAIL,
                to: req.params.email,
                subject: "Password Reset ",
                text: "Shortlink password reset link",
                html: `<p>Shortlink password reset token is <strong>${response.token}<strong> </p>`,
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    res.send({ message: "Somthing went wrong" });
                } else {
                    res.send({
                        message:
                            "Password Rest token sent to your mail successfully.",
                        mail_id: data.messageId,
                    });
                }
            });
        } else {
            res.status(403).send({
                message: "Account with this email is not exist.",
            });
        }
    });
};
export { loadAdditionalRoutes };
