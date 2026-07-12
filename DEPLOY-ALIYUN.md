# Deploying World of Claudecraft on Aliyun ECS

This guide covers deploying World of Claudecraft on an Aliyun (Alibaba Cloud) ECS instance.

## Server Requirements

| Component | Recommended |
|-----------|-------------|
| OS | Ubuntu 22.04 LTS x86_64 |
| vCPU | 2 cores minimum |
| RAM | 2 GB minimum (swap added automatically) |
| Storage | 20 GB SSD minimum |
| Network | Fixed IP required |

Your server: **121.40.186.35** (Ubuntu 22.04, 2 vCPU, 2 GB)

## Quick Start

### Step 1: Configure Security Group

In Aliyun console, go to **ECS → Security Groups** and add inbound rules:

| Port | Protocol | Source | Description |
|------|----------|--------|-------------|
| 22 | TCP | Your IP only | SSH |
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |

### Step 2: Connect and Run Setup Script

SSH into your server:

```bash
ssh root@121.40.186.35
```

Download and run the setup script:

```bash
curl -fsSL https://raw.githubusercontent.com/levy-street/world-of-claudecraft/main/deploy/aliyun-setup.sh > setup.sh
chmod +x setup.sh
# Edit DOMAIN if you have one
./setup.sh
```

Or run directly from your local machine:

```bash
ssh root@121.40.186.35 'bash -s' < deploy/aliyun-setup.sh
```

First boot takes 5-10 minutes (Docker image build). Watch progress:

```bash
ssh root@121.40.186.35
tail -f /var/log/eastbrook-setup.log
```

### Step 3: Test the Game

Open your browser and visit:
- `http://121.40.186.35` (if no domain set)
- `https://your-domain.com` (if domain configured)

Create an account, then grant admin access:

```bash
docker exec eastbrook-db psql -U eastbrook eastbrook \
  -c "UPDATE accounts SET is_admin = TRUE WHERE username = 'YOUR_USERNAME';"
```

## Domain Configuration (Optional)

If you want HTTPS with a domain:

### 1. Purchase/Configure Domain

Add an **A record** pointing to your server IP:
- Record type: A
- Host: `play` (or any subdomain)
- Value: `121.40.186.35`

### 2. Update Caddy Config

```bash
ssh root@121.40.186.35
echo 'play.yourdomain.com {
	encode gzip
	handle /wiki* {
		reverse_proxy localhost:8080
	}
	handle {
		reverse_proxy localhost:8787
	}
}' | sudo tee /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy automatically fetches and renewes Let's Encrypt certificates.

### 3. Verify HTTPS

Visit `https://play.yourdomain.com` - the game should load with TLS.

## Updating the Game

```bash
ssh root@121.40.186.35
cd /opt/eastbrook
sudo git pull
sudo docker compose up -d --build
```

Players online during restart are disconnected briefly and can log back in immediately.

## Database Backups

Automatic nightly backups run at 03:15 UTC, kept for 14 days:

```bash
# List backups
ls /var/backups/eastbrook/

# Restore from backup
gunzip -c /var/backups/eastbrook/eastbrook-YYYY-MM-DD.sql.gz \
  | sudo docker exec -i eastbrook-db psql -U eastbrook eastbrook
```

For off-server backup, sync to OSS (Aliyun Object Storage):

```bash
# Install ossutil
wget https://gosspublic.alicdn.com/ossutil/1.7.18/ossutil-v1.7.18-linux-amd64.zip
unzip ossutil-v1.7.18-linux-amd64.zip
chmod +x ossutil-v1.7.18-linux-amd64
./ossutil-v1.7.18-linux-amd64 config

# Sync backups
./ossutil-v1.7.18-linux-amd64 cp -r /var/backups/eastbrook oss://your-bucket/backups/
```

## Email Configuration

The server needs email for account lifecycle (signup, password reset). Without configuration, emails are logged only.

### Aliyun DirectMail

1. Enable DirectMail service in Aliyun console
2. Create a sender domain and verify
3. Create a sender address
4. Configure in `/opt/eastbrook/.env`:

```bash
EMAIL_PROVIDER=api
EMAIL_API_URL=https://dm.aliyuncs.com
EMAIL_API_KEY=your-directmail-access-key
EMAIL_FROM="World of ClaudeCraft <noreply@yourdomain.com>"
EMAIL_BASE_URL=https://yourdomain.com
```

Restart: `docker compose up -d game`

## Monitoring

Check server logs:

```bash
docker compose -f /opt/eastbrook/docker-compose.yml logs -f game
```

Check container status:

```bash
docker ps
```

Check disk space:

```bash
df -h
```

## Troubleshooting

### Container won't start

```bash
docker compose logs game
docker compose logs postgres
```

### Port not accessible

Check Aliyun security group rules (must allow 80/443)

Check if Caddy is running:

```bash
systemctl status caddy
```

### Database connection failed

Verify PostgreSQL password in `.env`:

```bash
cat /opt/eastbrook/.env
```

### Build fails (out of memory)

The 2GB RAM + 2GB swap should handle builds. If still failing:

```bash
# Increase swap
sudo swapoff /swapfile
sudo fallocate -l 4G /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Security Notes

- **Never** set `ALLOW_DEV_COMMANDS=1` in production (enables cheats)
- Keep `.env` file secure (chmod 600)
- Limit SSH access to your IP in security group
- Enable Aliyun security products (Anti-DDoS, Web Application Firewall) if needed

## Architecture

The stack runs:
- **Game server** (Node.js) on port 8787 (loopback only)
- **PostgreSQL 16** on port 5433 (loopback only)
- **Caddy** on ports 80/443 (public, reverse proxy to game server)
- **MediaWiki** on port 8080 (loopback, proxied via /wiki)

All services run in Docker. Caddy is the only public entrance.