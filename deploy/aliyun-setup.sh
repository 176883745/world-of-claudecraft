#!/bin/bash
# World of Claudecraft - Aliyun ECS first-boot setup
#
# Target: Ubuntu 22.04 LTS x86_64 (2 vCPU, 2GB RAM)
# Usage: ssh root@121.40.186.35 'bash -s' < this_script.sh
# Or: paste into Aliyun "User Data" field when creating instance
#
# What it does:
# - Installs Docker + Docker Compose + Caddy
# - Clones the repo
# - Generates PostgreSQL password
# - Starts the game stack
# - Configures Caddy reverse proxy (auto-TLS if DOMAIN is set)
# - Adds swap (2GB) and nightly backup

# ---------------------------------------------------------------------------
# REQUIRED CONFIG - Edit these before running
# ---------------------------------------------------------------------------
# Your game domain with A record pointing to 121.40.186.35
# Leave empty to test by IP first (http://121.40.186.35)
DOMAIN=""

# Admin dashboard domain (optional)
ADMIN_DOMAIN=""

# ---------------------------------------------------------------------------
REPO="https://github.com/levy-street/world-of-claudecraft.git"
APP_DIR="/opt/eastbrook"
BACKUP_DIR="/var/backups/eastbrook"

set -euo pipefail
exec > >(tee -a /var/log/eastbrook-setup.log) 2>&1
echo "=== World of Claudecraft setup started: $(date -u) ==="

# --- swap: 2GB instance needs headroom for builds -------------------------
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# --- packages: docker, compose v2, git, caddy -----------------------------
export DEBIAN_FRONTEND=noninteractive

# Update system
apt-get update
apt-get upgrade -y

# Install Docker (Aliyun mirror for faster download)
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
systemctl enable --now docker

# Install Docker Compose V2
apt-get install -y docker-compose-v2 git curl

# Install Caddy (for Ubuntu 22.04)
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update
apt-get install -y caddy

# --- clone + secrets -------------------------------------------------------
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

# Generate .env with PostgreSQL password
if [ ! -f .env ]; then
  echo "POSTGRES_PASSWORD=$(openssl rand -hex 24)" > .env
  chmod 600 .env
fi

# --- build + run the stack -------------------------------------------------
docker compose up -d --build

# --- caddy: TLS reverse proxy ----------------------------------------------
if [ -n "$DOMAIN" ]; then
  SITE="$DOMAIN"
else
  # Serve by IP on port 80 (no TLS)
  SITE=":80"
fi

cat > /etc/caddy/Caddyfile <<CADDY
$SITE {
	encode gzip
	handle /wiki* {
		reverse_proxy localhost:8080
	}
	handle {
		reverse_proxy localhost:8787
	}
}
CADDY

if [ -n "$ADMIN_DOMAIN" ]; then
  cat >> /etc/caddy/Caddyfile <<CADDY

$ADMIN_DOMAIN {
	encode gzip
	reverse_proxy localhost:8787
}
CADDY
fi

systemctl enable caddy
systemctl restart caddy

# --- nightly DB backup (03:15 UTC, keeps 14 days) ---------------------------
cat > /usr/local/bin/eastbrook-backup <<'BACKUP'
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/var/backups/eastbrook"
mkdir -p "$BACKUP_DIR"
docker exec eastbrook-db pg_dump -U eastbrook eastbrook \
  | gzip > "$BACKUP_DIR/eastbrook-$(date +%F).sql.gz"
find "$BACKUP_DIR" -name '*.sql.gz' -mtime +14 -delete
BACKUP
chmod +x /usr/local/bin/eastbrook-backup
echo "15 3 * * * root /usr/local/bin/eastbrook-backup" > /etc/cron.d/eastbrook-backup

echo "=== World of Claudecraft setup finished: $(date -u) ==="
echo ""
echo "Server IP: 121.40.186.35"
echo "Game URL:  http://121.40.186.35 (or https://$DOMAIN if set)"
echo ""
echo "To check logs:"
echo "  docker compose -f $APP_DIR/docker-compose.yml logs -f game"
echo ""
echo "To grant admin access:"
echo "  docker exec eastbrook-db psql -U eastbrook eastbrook -c \"UPDATE accounts SET is_admin = TRUE WHERE username = 'YOUR_USERNAME';\""