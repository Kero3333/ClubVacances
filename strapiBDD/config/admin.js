module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '4b2c7634d7e26697e0be34bc5f7ae294'),
  },
});
