# World of Claudecraft game server — serves the built client, REST API and WebSocket
# world on one port. Pair with a postgres service (see docker-compose.yml).

FROM node:22-alpine AS build
WORKDIR /app

# 安装必要的工具（wget, tar, xz 用于下载和解压 ffmpeg）
RUN apk add --no-cache wget tar xz

# 手动下载并安装 ffmpeg
RUN wget -O /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz && \
    tar -xvJf /tmp/ffmpeg.tar.xz -C /tmp && \
    cp /tmp/ffmpeg-*-static/ffmpeg /usr/local/bin/ && \
    cp /tmp/ffmpeg-*-static/ffprobe /usr/local/bin/ && \
    chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe && \
    rm -rf /tmp/ffmpeg*

# 验证 ffmpeg 安装
RUN ffmpeg -version

# 设置 npm 镜像源为淘宝镜像
RUN npm config set registry https://registry.npmmirror.com && \
    npm config set fetch-timeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

COPY package.json package-lock.json ./

# 强制跳过 ffmpeg-static 下载
ENV FFMPEG_BINARIES_SKIP_DOWNLOAD=1
ENV FFMPEG_SKIP_DOWNLOAD=1

#RUN npm ci --no-audit --no-fund
# 使用 npm install 替代 npm ci（更宽容，会跳过某些问题）
RUN npm install --no-audit --no-fund --legacy-peer-deps --prefer-offline

# 如果上面的命令失败，尝试使用国内镜像直接安装
RUN if [ $? -ne 0 ]; then \
        npm cache clean --force && \
        npm install --no-audit --no-fund --legacy-peer-deps --registry=https://registry.npmmirror.com; \
    fi

COPY .browserslistrc tsconfig.json vite.config.ts svelte.config.js index.html admin.html play.html guide.html editor.html wallet-handoff.html ./
COPY src ./src
COPY server ./server
COPY bot ./bot
COPY headless ./headless
COPY scripts ./scripts
COPY public ./public
# Optional private extensions live under ./private. Public checkouts contain only
# a placeholder, so builds still fall back to public stubs; deploys can clone the
# private bot detector into private/bot_detector before this Docker build.
COPY private ./private
# Public client config is inlined into the bundle at build time (Vite reads
# VITE_* from the environment). Empty defaults keep Turnstile and external
# wallet handoff off; injected wallet UI stays enabled unless explicitly disabled.
# Passed through from compose build args.
ARG VITE_TURNSTILE_SITEKEY=""
ARG VITE_REOWN_PROJECT_ID=""
ARG VITE_WALLET_DISABLED=""
RUN VITE_TURNSTILE_SITEKEY="$VITE_TURNSTILE_SITEKEY" \
    VITE_REOWN_PROJECT_ID="$VITE_REOWN_PROJECT_ID" \
    VITE_WALLET_DISABLED="$VITE_WALLET_DISABLED" \
    NODE_OPTIONS="--max-old-space-size=2048" npm run build && cp -a dist/media ./media-build && rm -rf dist/media && NODE_OPTIONS="--max-old-space-size=2048" npm run build:server && NODE_OPTIONS="--max-old-space-size=2048" npm run build:bot

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# 在运行阶段也安装 ffmpeg
RUN apk add --no-cache wget tar xz && \
    wget -O /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz && \
    tar -xvJf /tmp/ffmpeg.tar.xz -C /tmp && \
    cp /tmp/ffmpeg-*-static/ffmpeg /usr/local/bin/ && \
    cp /tmp/ffmpeg-*-static/ffprobe /usr/local/bin/ && \
    chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe && \
    rm -rf /tmp/ffmpeg*

COPY --from=build /app/dist ./dist
COPY --from=build /app/media-build ./media-build
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/dist-bot ./dist-bot
COPY --from=build /app/scripts/prod_cpu_game_helper.mjs /app/ops/
COPY --from=build /app/scripts/prod_cpu_profile_client.mjs /app/ops/
RUN mkdir -p /app/dist/media && chown -R node:node /app/dist/media
EXPOSE 8787
USER node
CMD ["sh", "-c", "mkdir -p /app/dist/media && node -e \"require('fs').cpSync('/app/media-build', '/app/dist/media', { recursive: true, force: true })\" && node dist-server/server.cjs"]
