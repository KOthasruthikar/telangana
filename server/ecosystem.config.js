// PM2 Ecosystem Configuration for Production
module.exports = {
  apps: [{
    name: 'telangana-tourism-api',
    script: './index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Auto restart
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    
    // Health monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // Advanced features
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
