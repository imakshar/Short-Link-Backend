import { findOneByShortUrl, UpdateCountById } from "./src/resolvers/shortLink";

const loadAdditionalRoutes = (app) => {
    app.get("/api/shorturl/:shortUrl", async (req, res) => {
        let response = await findOneByShortUrl(req.params.shortUrl).catch(
            (error) => {
                res.json({ error });
            }
        );
        if (response) {
            UpdateCountById(response._id);
            res.redirect(response.original_url);
        } else {
            res.json({ message: "oops, shorlink is not exist!" });
        }
    });
};
export { loadAdditionalRoutes };
