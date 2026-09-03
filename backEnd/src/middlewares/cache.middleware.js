import crypto from 'crypto';

/**
 * ETag / HTTP cache middleware.
 *
 * This middleware:
 *
 * 1. Captures res.json()
 * 2. Generates an ETag from the response data
 * 3. Checks If-None-Match from the browser
 * 4. Returns 304 if the data hasn't changed
 * 5. Otherwise sends the normal JSON response
 *
 * This keeps caching concerns outside controllers.
 */
export function etagCache(options = {}) {

    const {
        cacheControl =
            'private, max-age=0, must-revalidate'
    } = options;

    return (req, res, next) => {

        
        const originalJson = res.json.bind(res);

        res.json = (body) => {

            try {

                /*
                 * Convert response body to JSON.
                 */
                const json = JSON.stringify(body);

                /*
                 * Generate a SHA-256 hash.
                 *
                 * Same response → same ETag.
                 *
                 * Changed response → different ETag.
                 */
                const etag = `"${crypto
                    .createHash('sha256')
                    .update(json)
                    .digest('hex')}"`;

                /*
                 * Tell browser how to cache/validate this response.
                 */
                res.setHeader(
                    'Cache-Control',
                    cacheControl
                );

                /*
                 * Send ETag.
                 */
                res.setHeader(
                    'ETag',
                    etag
                );

                /*
                 * Check whether the browser already
                 * has this exact version.
                 */
                const clientETag =
                    req.headers['if-none-match'];

                if (clientETag === etag) {

                    /*
                     * 304 = Not Modified.
                     *
                     * No JSON body is sent.
                     */
                    return res.status(304).end();
                }

                /*
                 * Data changed or browser has no copy.
                 */
                return originalJson(body);

            } catch (error) {

                /*
                 * If ETag generation somehow fails,
                 * don't break the API.
                 *
                 * Just send the normal response.
                 */
                return originalJson(body);
            }
        };

        next();
    };
}