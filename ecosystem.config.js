module.exports = {
  apps: [
    {
      name: "cleartrip-cms",
      script: "npm",
      args: "run start:production",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "13.251.49.54",
      ref: "origin/development",
      repo: "git@github.com:svgiridharreddy/cleartrip-cms.git",
      path: "/var/www/cms_fe",
      key:
        "/Users/giridharr/Documents/projects/cleartrip/key_files/dynamic-flights-high-config.pem",
      ssh_options: ["ForwardAgent=yes"],
      "post-deploy": "npm install --production && npm run build"
    }
  }
};
